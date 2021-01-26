---
title: 某社交Android应用源码分析
date: 2020-11-06T21:00:00+08:00
published: true
slug: yuwan-code-analysis
tags:
- Android
cover_image: "./images/yuwan-code-analysis.png"
canonical_url: false
description: 对某社交安卓应用的源码进行解读与分析，理清架构。
---

## 目录结构

该项目工程的包结构主要还是根据功能来分包。

* **base**：存放项目的基类
  * **data**：数据 Model 层
  * **job**
  * **view**：View 层
  * **presenter**：Presenter 层
* **media**：媒体包
* **module**：主要是根据功能版块进行分类
  * **app**
  * **bean**
  * **card**
  * **comment**
  * **fragmentcontainer**
  * **invite**
  * **main**
  * **message**
  * **profile**
  * **repository**
  * **setting**
  * **share**
  * **splash**
  * **vip**
* **network**
  * **entity**
  * **service**
* **persistence**：持久层，存放不大且暂时储存的数据
* **qiniu**：有关七牛云的工具类
* **util**：工具类
* **widget**：与界面 View 相关的类
  * **adapter**：适配器类
  * **comm**：通用类
  * **dialog**：dialog 相关类
  * **header**：顶部 View 类
  * **recyclerview**
* **wxapi**：与调用微信相关的类

## 1. Network 包

### 1.1 ErrorCode 类

主要是用来存放各种错误的**状态码**。

### 1.2 CacheInterceptor 类与 GlobalInterceptor 类

因为 OkHttp 都支持自定义拦截器类，所以这两个就是自定义的缓存拦截器类与全局拦截器类。

自定义拦截器的方法都是`implements Interceptor`，然后重写`public Response intercept(Chain chain)`方法，然后创建`Builder`实例，使用`addHeader()`方法添加。

### 1.3 HttpClient 类

该类主要是使用 Retrofit 与 OkHttp 搭配封装网络类，创建实例。

```java
protected Retrofit retrofit;
protected OkHttpClient okHttpClient;

public HttpClient(String url) {

    // 定义缓存路径
    File cacheFile = new File(YuwanApplication.getApplication().getCacheDir().getAbsolutePath(), "HttpCache");
    LogUtil.e(TAG, "cacheFile " + cacheFile.toString());
    // 定义缓存文件的大小为 10MB
    Cache cache = new Cache(cacheFile, 1024 * 1024 * 10);
    if (Config.DEBUG) {
        // 创建 OkHttpClient 实例
        okHttpClient = new OkHttpClient
                .Builder()
                // 添加自定义拦截器
//                    .addNetworkInterceptor(getNetWorkInterceptor())
//                    .addInterceptor(getInterceptor())
                .addInterceptor(new GlobalInterceptor())
                // 因为是 Debug，所以添加日志拦截器
                .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
                .cache(cache)
                .build();
    } else {
        okHttpClient = new OkHttpClient
                .Builder()
//                    .addNetworkInterceptor(getNetWorkInterceptor())
//                    .addInterceptor(getInterceptor())
                .addInterceptor(new GlobalInterceptor())
                .cache(cache)
                .build();
    }

    LogUtil.e("url " + url);
    // 创建 Retrofit 实例
    retrofit = new Retrofit
            .Builder()
            .baseUrl(url)
            .callFactory(okHttpClient)
            // ConvertFactory 转化成数据 Model
            .addConverterFactory(GsonConverterFactory.create(new Gson()))
            // RxJava 搭配 Retrofit
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .build();
}

public void subscribe(Flowable observable, Subscriber subscriber) {
    if (!NetWorkUtils.checkNetWork(YuwanApplication.getApplication())) {
        ToastUtil.showToast(YuwanApplication.getApplication(), ERROR_MSG);
    }
    // 使用 RxJava 的观察订阅模式，切换线程
    observable.subscribeOn(Schedulers.io())
            .unsubscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(subscriber);
}
```

### 1.4 RxManager 类

## 2. Widget 包

该包中的类基本都是自定义 View。

### 2.1 CommViewPager 类

这就是一个典型的自定义 View 类，即通过继承`ViewPager`类，然后重写`onInterceptTouchEvent`方法，`onTouchEvent`方法等。

## 3. Base 包

### 3.1 BaseActivity 类和 BaseFragment 类

是一个 MVC 结构的抽象的 Activity 或者 Fragment 基类，主要可以存放一些通用的方法，例如`showDialog()`等等。当该类逻辑并不复杂时，就没有必要使用 MVP 的模式增加不必要的代码量，就可以直接使用 MVC 的方式去编写。

### 3.2 MVPBaseActivity 类和 MVPBaseFragment 类

这两个类作用是与上面两个类的作用一样的，不同之处就是使用 MVP 模式的时候才会用到，那么就会多出一些与 Presenter 层交互的方法。

### 3.3 MvpBaseRefreshFragment 类

该类继承至 MVPBaseFragment 类，当又多添加了有关刷新的方法，例如下拉刷新界面与数据、上拉加载更多等等。从以上写法也可以看出，基本上是定义一个抽象的基类，然后在基类的基础上，创建一些子类，重写其中的部分方法并添加属于子类特性的方法。

### 3.4 MVPBasePresent 类和 MVPActivityPresenter 类和 MVPFragmentPresent 类

原理与之前都是一样，定义 Present 的基类，并且编写相应的子类以对应不同的使用场景。

Present 类中主要就有处理逻辑的相关方法，例如`netRequest()`请求网络，`postDelayJob()`发送延时任务等等。

## 4. Module 包

### 4.1 app 包

#### 4.1.1 CommThreadPool 类

```java
public class CommThreadPool {
    private static volatile Executor sPool;
    private static volatile Handler sHandler;
    // 使用到了 Handler
    private static Handler sUiHandler = new Handler(Looper.getMainLooper());

    public static final Executor getExecutor() {
        if (sPool != null) {
            return sPool;
        }

        synchronized (CommThreadPool.class) {
            if (sPool == null) {
                // 这里注意，其实手动创建线程池，效果会更好，所以并不推荐下面的写法
                sPool = Executors.newCachedThreadPool();
            }
        }

        return sPool;
    }

    public static final Handler getSerialHandler() {
        if (sHandler != null) {
            return sHandler;
        }

        synchronized (CommThreadPool.class) {
            if (sHandler == null) {
                HandlerThread thread = new HandlerThread("serial-looper");
                thread.start();
                sHandler = new Handler(thread.getLooper());
            }
        }

        return sHandler;
    }

    /**
     * 一般使用这个，在子线程中执行
     * @param runnable
     */
    public static void poolExecute(Runnable runnable) {
        getExecutor().execute(runnable);
    }

    public static void serialExecute(Runnable runnable) {
        getSerialHandler().post(runnable);
    }

    public static void runOnUiThread(Runnable runnable) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            runnable.run();
        }

        sUiHandler.post(runnable);
    }
}
```

#### 4.1.2 Config 类

主要是定义生产环境与测试环境的相关配置。






