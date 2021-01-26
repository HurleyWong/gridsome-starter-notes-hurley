---
title: 基于 WanAndroid 开放 API 编写的安卓应用 CodeHub 源码分析
date: 2020-11-07T21:00:00+08:00
published: true
slug: codehub-code-analysis
tags:
- Android
cover_image: "./images/codehub-code-analysis.png"
canonical_url: false
description: 基于 WanAndroid 开放 API 编写的安卓应用 Codehub 的源码进行解读与分析，理清架构。
---

:::note 📱 Description

CodeHub 是一款使用 WanAndroid 开放 API 开发的技术阅读类的开源项目。项目技术栈使用到了 Material Design + MVP + RxJava + Retrofit + Dagger2 + Glide 等框架，由本人一人开发。项目开源链接位于：https://github.com/HurleyJames/CodeHub

:::

## 目录结构

* **api**：存放与网络请求相关的 URL 地址
* **app**：存放 Application 类、缓存类、常量等等
* **base**：存放 Activity、Fragment 以及 Presenter 的基类
* **bean**：存放数据模型实体类
* **dao**：存放与数据库有关的类
* **di**：存放与依赖注入相关的类，主要是 Dagger2
* **helper**：存放辅助类（与工具类有区别）
* **module**：各个模块的类
* **net**：网络类
* **util**：工具类
* **widget**：与 View 相关的类

## 1. api 包

主要用来存放网络请求的地址。因为 Retrofit 使用的是基于 RESTFUL 风格的 api 地址，所以通过使用注解的方式，可以进行网络请求。

例如，下面是一个登陆的请求，使用`@POST`的注解，携带用户名和密码的字段。

```java
/**
 * 登录
 * http://www.wanandroid.com/user/login
 *
 * @param username 用户名
 * @param password 密码
 *                 🔥用@FormUrlEncoded注解来标明这是一个表单请求
 *                 🔥用@Field注解来标识所对应的某个类型数据的键，从而组成一组键值对进行传递
 * @return
 */
@POST(WanAndroidUrlContainer.LOGIN)
@FormUrlEncoded
Observable<BaseBean<UserBean>> login(@Field("username") String username,
                                        @Field("password") String password);
```

## 2. app 包

### 2.1 App 类

继承至`Application`类，主要存放一些全局应用配置的方法，例如初始化全局 Dialog、初始化 ARouter、Litepal 等等。

因为本项目使用到的第三方框架特别多，所以可能导致代码量很多，所以 App 类继承的是`MultiDexApplication`类，而`MultiDexApplication`类继承的又是`Application`类。

### 2.2 Constants 类

存放静态常量。这样当需要修改时，就可以直接在该类中修改，而不需要到具体的代码位置修改（因为使用到的地方可能很多）。

## 3. base 包

### 3.1 BaseActivity 类

这是一个抽象类，继承至`RxAppCompatActivity`类，而`RxAppCompatActivity`类又是继承至`AppCompatActivity`类。这里主要存放一些 Activity 通用的方法。例如：

* 沉浸式状态栏

```java
ImmersionBar.with(this)
        // 与导航栏同色
        .statusBarColor(R.color.colorPrimary)
        // 解决状态栏和布局重叠问题
        .fitsSystemWindows(true)
        // 初始化
        .init();
```

* 夜间模式
* 返回按钮 / 右上角设置选项
* 显示 Toast
* 使用 ButterKnife 绑定控件

### 3.2 BaseContract 类

我们都知道 MVP 模式需要一个契约类 Contract 来作为桥梁，连接 Model 和 View，所以需要编写一个 Contract 的基类。

```java
public interface BaseContract {

    interface BasePresenter<T extends BaseContract.BaseView> {

        void attachView(T view);

        void detachView();
    }


    interface BaseView {

        /**
         * 显示进度
         */
        void showLoading();

        /**
         * 隐藏进度
         */
        void hideLoading();

        /**
         * 显示请求成功
         * @param message
         */
        void showSuccess(String message);

        /**
         * 失败重试
         * @param message
         */
        void showFailed(String message);

        /**
         * 显示当前网络不可用
         */
        void showNoNet();

        /**
         * 重试
         */
        void onRetry();

        /**
         * 设置夜间模式
         * @param isNight
         */
        void useNightMode(boolean isNight);

        /**
         * 绑定生命周期
         * @param <T>
         * @return
         */
        <T> LifecycleTransformer<T> bindToLife();

    }
}
```

### 3.3 BaseFragment 类

同样继承至`RxFragment`类，然后`RxFragment`类继承制`Fragment`类，主要存放 Fragment 通用的方法。

### 3.4 BaseFragmentPageAdapter 类

该类继承至`FragmentPageAdapter`类，因为该项目使用到的模式是单 Activity 搭配多个 Fragment 的方式，例如首页，所以必然要使用到`FragmentPageAdapter`类。

### 3.5 BasePresent 类

主要是实现了绑定 View`attachView()`和解绑 View`detachView()`的方法。

## 4. helper 包

该包里主要存放了与数据库、Preference 以及 Http 网络请求相关的辅助类。

### 4.1 PreferenceHelper 类

该类是一个接口。主要定义了以下方法，可以通过 Preference 来存储：

* 登录状态
* Cookie
* 当前项目浏览到的页码
* 是否自动缓存
* 是否开启夜间模式

## 5. net 包

### 5.1 RxSchedulers 类

这是通用的 Rx 线程转换类，主要是使用 RxJava 的方法来切换线程。通过`subscribeOn`操作符来判断`Observabe`自身在哪个线程上运行，如果需要进行耗时的操作，那么就开启一个子线程来运行。

```java
static final ObservableTransformer schedulersTransformer = upstream -> {
    // I/O 操作（读写文件、读写数据库、网络信息交互等）所使用的 Scheduler。
    // 🔥行为模式和 newThread() 差不多，区别在于 io() 的内部实现是用一个无数量上限的线程池，可以重用空闲的线程。
    // 因此，多数情况下 io() 比 newThread() 更有效率。
    return (upstream).subscribeOn(Schedulers.io())
            // 表示运行在主线程
            .observeOn(AndroidSchedulers.mainThread());
};
```

### 5.2 RxBus 类

该类是一个自定义的事件总线类，主要用来代替 EventBus 框架等等。该类的作用就是用来发送和接收事件，从而进行相应的操作。实际上还是用 RxJava 相关的操作符来实现的。

```java
/**
 * 发送事件
 *
 * @param o
 */
public void post(Object o) {
    mBus.onNext(o);
}

/**
 * 接受事件
 * 根据传递的 eventType 类型返回特定类型 (eventType) 的 被观察者
 *
 * @param eventType
 * @param <T>
 * @return
 */
public <T> Flowable<T> toFlowable(Class<T> eventType) {
    return mBus.ofType(eventType);
}
```

### 5.3 LoadCookieInterceptor 类和 SaveCookieInterceptor 类

这是两个自定义的有关 Cookie 加载和储存的拦截器类。

```java
public class LoadCookieInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        // 创建实例
        Request.Builder builder = chain.request().newBuilder();
        // 获得 Cookie
        String mCookieStr = (String) SharedPreferencesUtils.get(chain.request().url().host(), "");
        if (!TextUtils.isEmpty(mCookieStr)) {
            // 长度减 1 为了去除最后的逗号
            builder.addHeader("Cookie", mCookieStr.substring(0, mCookieStr.length() - 1));
        }
        return chain.proceed(builder.build());
    }
}

public class SaveCookieInterceptor implements Interceptor {

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();
        Response response = chain.proceed(request);
        List<String> mCookieList = response.headers("Set-Cookie");
        // 保存 Cookie
        if (!mCookieList.isEmpty() && request.url().toString().endsWith(WanAndroidUrlContainer.LOGIN)) {
            StringBuilder sb = new StringBuilder();
            for (String cookie : mCookieList) {
                // 注意 Cookie 请求头字段中的每个 Cookie 之间用逗号或分号分隔
                sb.append(cookie).append(",");
            }
            SharedPreferencesUtils.put(response.request().url().host(), sb.toString());
            Log.e(SaveCookieInterceptor.class.getSimpleName(), "intercept: url : " + request.url());
        }
        return response;
    }
}
```

### 5.4 RetrofitManager 类

这是一个至关重要的网络封装类，它封装了有关的 OkHttp 与 Retrofit 类，之后在相应的 Present 类中发起网络请求，就可以直接使用该类来操作。

下面是添加相应的拦截器。

```java
/**
 * 云端响应头拦截器，用来配置缓存策略
 * Dangerous interceptor that rewrites the server's cache-control header.
 */
private static final Interceptor mRewriteCacheControlInterceptor = chain -> {
    Request request = chain.request();
    if (!NetworkUtils.isConnected()) {
        request = request.newBuilder()
                .cacheControl(CacheControl.FORCE_CACHE)
                .build();
    }
    Response originalResponse = chain.proceed(request);
    if (NetworkUtils.isConnected()) {
        // 有网的时候读接口上的 @Headers 里的配置，可以在这里进行统一的设置
        String cacheControl = request.cacheControl().toString();
        return originalResponse.newBuilder()
                .header("Cache-Control", cacheControl)
                .removeHeader("Pragma")
                .build();
    } else {
        return originalResponse.newBuilder()
                .header("Cache-Control", "public, only-if-cached, max-stale=" + CACHE_CONTROL_CACHE)
                .removeHeader("Pragma")
                .build();
    }
};

/**
 * 日志拦截器
 */
private static final Interceptor mLoggingInterceptor = chain -> {
    Request request = chain.request();
    Response response = chain.proceed(request);
    return response;
};

/**
 * 添加Header拦截器
 */
private static final Interceptor mHeaderInterceptor = chain -> {
    Request request = chain.request()
            .newBuilder()
            .addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            .addHeader("Accept-Encoding", "gzip, deflate")
            .addHeader("Connection", "keep-alive")
            .addHeader("Accept", "*/*")
            .build();
    return chain.proceed(request);
};
```

然后对 OkHttp 与 Retrofit 进行配置：

```java
/**
 * 对 OkHttpClient 进行配置
 *
 * @return
 */
private static OkHttpClient getOkHttpClient() {
    if (mOkHttpClient == null) {
        synchronized (RetrofitManager.class) {
            ClearableCookieJar cookieJar = new PersistentCookieJar(new SetCookieCache(), new SharedPrefsCookiePersistor(App.getAppContext()));
            Cache cache = new Cache(new File(App.getAppContext().getCacheDir(), "HttpCache"), 1024 * 1024 * 100);
            if (mOkHttpClient == null) {
                mOkHttpClient = new OkHttpClient.Builder()
                        .cache(cache)
                        // 链接超时
                        .connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
                        // 读取超时
                        .readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)
                        .writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
                        .addInterceptor(mRewriteCacheControlInterceptor)
                        .addInterceptor(mLoggingInterceptor)
                        // 添加 Cookie 拦截器
                        // .addInterceptor(new SaveCookieInterceptor())
                        // .addInterceptor(new LoadCookieInterceptor())
                        .cookieJar(cookieJar)
                        .build();
            }
        }
    }
    return mOkHttpClient;
}

/**
 * 创建WanAndroid的Retrofit
 *
 * @param clazz
 * @param <T>
 * @return
 */
public static <T> T create(Class<T> clazz) {
    // 指定baseUrl
    Retrofit retrofit = new Retrofit.Builder().baseUrl(WanAndroidUrlContainer.baseUrl)
            .client(getOkHttpClient())
            // 存储转化数据对象，设置返回的数据支持转换为 Gson 对象
            .addConverterFactory(GsonConverterFactory.create())
            .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
            .build();
    return retrofit.create(clazz);
}
```

### 6. widget包

