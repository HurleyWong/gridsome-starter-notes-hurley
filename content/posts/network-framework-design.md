---
title: CustomNet：一个简单网络框架的设计与实现
date: 2020-11-12T21:00:00+08:00
published: true
slug: network-framework-design
tags:
- Android
cover_image: "./images/network-framework-design.png"
canonical_url: false
description: 借鉴 Volley 的实现思路，设计与实现一个简单的 HTTP 网络请求库。
---

CustomeNet 的基本架构主要分为 4 个部分：

* 最上面的部分是**`Request`**，包括了各种请求类型。比如：返回 JSON 数据格式的 JsonRequest ，返回字符串格式的 StringRequest 扥等
* 第二个部分是**消息队列**，维护了提交给网络框架的请求列表，并且根据相应的规则进行排序。默认情况下，消息队列会按照**优先级**和**进入队列的顺序**来执行，使用到的是线程安全的**`PriorityBlockingQueue<E>`**，因为他们的队列会被并发执行，需要保证队列访问的原子性。
* 第三部分是**`NetworkExecutor`**，也就是网络的执行部分。该`Executor`是继承至`Thread`，在`run()`方法中会循环访问请求队列，从请求队列中获取并执行`HTTP`请求，请求完成之后再将结果传递给UI线程，实际上是一个线程类。
* 第四部分是**`Response`以及其传递类**。因为第三部分的网络执行部分`Executor`实际上是一个线程类，但是 Android 中并不能在该线程中更新 UI。所以我们需要通过一种方式将请求结果传递给 UI 线程。**`ResponseDelivery`**封装了`Response`的投递，保证了`Response`执行在UI线程。

如下图所示：

<img width="80%" src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F94fe1ae7-bbc9-4ba0-8f21-9684bfb214c5%2FUntitled.png?table=block&id=06c7b795-0945-4be6-8bd2-dc6ee221ef26&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3070&userId=&cache=v2"></img>

## Request 部分

首先，我们定义网络请求的方式。我们知道，常见的网络请求方式有`GET`、`POST`、`PUT`、`DELETE`等。那么，我们就设置这四种最简单的网络请求方式。

我们可以通过设置枚举类的方式来定义网络请求方式：

```java
public enum HttpMethod {
    GET("GET"),
    POST("POST"),
    PUT("PUT"),
    DELETE("DELETE");

    private String mHttpMethod = "";

    private HttpMethod(String method) {
        mHttpMethod = method;
    }

    @Override
    public String toString() {
        return mHttpMethod;
    }
}
```

除此之外，我们上面提到过消息队列会具有优先级顺序来执行，而优先级其实是指请求Request的优先级。所以我们定义四种优先级：

```java
public static enum Priority {
    LOW,
    NORMAL,
    HIGH,
    IMMEDIATE
}
```

因为对于网络请求来说，实际上返回的请求结果的格式是不确定的，有可能是 JSON 的数据格式，有可能是 XML 数据格式，有的甚至直接是字符串。所以需要让 Request 是抽象部分，而不是具体。一种方式是让 Request 作为**泛型类**，即`Request<?>`，那么如果返回的是字符串类型，就是`Request<String>`。以下就是 Request 类的核心代码：

```java
public abstract class Request<T> implements Comparable<Request<T>> {

    /**
     * 默认的编码方式是 UTF-8
     */
    public static final String DEFAULT_PARAMS_ENCODING = "UTF-8";
    /**
     * 请求头类型
     */
    public static final String HEADER_CONTENT_TYPE = "";
    /**
     * 请求的序列号，默认从 0 开始
     */
    protected int mSerialNum = 0;
    /**
     * 优先级默认设置为 NORMAL
     */
    protected Priority mPriority = Priority.NORMAL;
    /**
     * 是否取消该请求，默认为 false
     */
    protected boolean isCancel = false;
    /**
     * 是否应该缓存
     */
    private boolean mShouldCache = true;
    /**
     * 请求 Listener
     */
    protected RequestListener<T> mRequestListener;
    /**
     * 请求的 URL
     */
    private String mUrl = "";
    /**
     * 请求方法，默认 GET，可更改
     */
    HttpMethod mHttpMethod = HttpMethod.GET;
    /**
     * 请求 header
     */
    private Map<String, String> mHeaders = new HashMap<>();
    /**
     * 请求参数
     */
    private Map<String, String> mBodyParams = new HashMap<>();

    /**
     * 携带请求方式、URL、回调接口的参数
     *
     * @param method
     * @param url
     * @param listener
     */
    public Request(HttpMethod method, String url, RequestListener<T> listener) {
        mHttpMethod = method;
        mUrl = url;
        mRequestListener = listener;
    }

    /**
     * 从原生的网络请求中解析结果，子类必须重写该抽象方法
     *
     * @param response
     * @return
     */
    public abstract T parseResponse(Response response);

    /**
     * 处理得到的结果 Response，该方法需要运行在 UI 主线程中
     */
    public final void deliveryResponse(Response response) {
        // 解析结果
        T result = parseResponse(response);
        if (mRequestListener != null) {
            int stCode = response != null ? response.getStatusCode() : -1;
            String msg = response != null ? response.getMessage() : "unknown error";
            // 调用 onComplete 回调接口
            mRequestListener.onComplete(stCode, result, msg);
        }
    }

    /**
     * 获得编码的方式
     *
     * @return
     */
    protected String getParamsEncoding() {
        return DEFAULT_PARAMS_ENCODING;
    }

    /**
     * 获得 Body 的内容类型
     * 格式为：application/x-www-form-urlencoded; charset=UTF-8
     *
     * @return
     */
    public String getBodyContentType() {
        return "application/x-www-form-urlencoded; charset=" + getParamsEncoding();
    }

    /**
     * 返回 POST 或者 PUT 请求时的 Body 参数字节数组
     *
     * @return
     */
    public byte[] getBody() {
        Map<String, String> params = getParams();
        if (params != null && params.size() > 0) {
            return encodeParameters(params, getParamsEncoding());
        }
        return null;
    }

    /**
     * 获得请求头
     *
     * @return
     */
    public Map<String, String> getHeaders() {
        return mHeaders;
    }

    /**
     * 获得请求的参数
     *
     * @return
     */
    public Map<String, String> getParams() {
        return mBodyParams;
    }

    /**
     * 获得请求的 URL 链接
     *
     * @return
     */
    public String getUrl() {
        return mUrl;
    }

    /**
     * 获得请求方式
     *
     * @return
     */
    public HttpMethod getHttpMethod() {
        return mHttpMethod;
    }

    /**
     * 将参数转换为 URL 编码的参数串，格式为 key1=value&key2=value2
     *
     * @param params
     * @param paramsEncoding
     * @return
     */
    private byte[] encodeParameters(Map<String, String> params, String paramsEncoding) {
        StringBuilder encodedParams = new StringBuilder();
        try {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                // key 值
                encodedParams.append(URLEncoder.encode(entry.getKey(), paramsEncoding));
                encodedParams.append("=");
                // value 值
                encodedParams.append(URLEncoder.encode(entry.getValue(), paramsEncoding));
                encodedParams.append("&");
            }
            return encodedParams.toString().getBytes(paramsEncoding);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Encoding not supported: " + paramsEncoding);
        }
    }

    /**
     * 用于对请求的排序处理，根据优先级和加入到队列的序号进行排序
     * 之所以要实现 Comparable 的接口，就是为了重写 CompareTo 方法，以实现优先级的比较
     *
     * @param another
     * @return
     */
    @Override
    public int compareTo(Request<T> another) {
        Priority myPriority = this.getPriority();
        Priority anotherPriority = another.getPriority();
        // 如果优先级相等，那么按照添加到队列的序列号顺序来执行
        return myPriority.equals(another) ? this.getSerialNumber() - another.getSerialNumber() :
                myPriority.ordinal() - anotherPriority.ordinal();
    }

    /**
     * 获得优先级
     *
     * @return
     */
    public Priority getPriority() {
        return mPriority;
    }

    /**
     * 获得序列号
     *
     * @return
     */
    public int getSerialNumber() {
        return mSerialNum;
    }

    /**
     * 设置序列号
     *
     * @param serialNumber
     */
    public void setSerialNumber(int number) {
        this.mSerialNum = serialNumber;
    }

    /**
     * 网络请求 Listener 会被执行在 UI 线程
     *
     * @param <T>
     */
    public static interface RequestListener<T> {
        /**
         * 请求完成的回调
         *
         * @param stCode
         * @param response
         * @param errMsg
         */
        public void onComplete(int stCode, T response, String errMsg);
    }
}
```

上述代码就是`Request<T>`的抽象类的实现，`T`是该请求Response的数据格式。因为不同场景会有不同的需求，返回的数据格式也是不一样的。

每个 Request 会有一个序列号，该序列号由请求队列生成，标识该请求在队列中的序号，该序号和优先级决定了该请求在队列中的排序，即它在请求队列的执行顺序。

在上面这个抽象类中，封装了通用的方法，即`parseResponse`这个方法。继承`Request`的子类只需要重写这个方法，对对应的数据格式进行解析即可。例如，解析 JSON 数据，就可以通过`JsonRequest`里重写这个方法进行解析；解析 Bitmap 数据，就可以创建一个`ImageRequest`对图片进行转化，将 Response 的数据转化为 Bitmap 即可。

## 消息队列部分

网络请求队列就是在内部封装了一个优先级队列，让网络请求器`NetworkExecutor`从请求队列中获取、执行请求。这样就可以保证优先级高的请求得到尽快的处理；如果优先级一致，就按照 FIFO 的策略执行；

### RequestQueue

```java
public final class RequestQueue {

    /**
     * 线程安全的优先级请求队列
     */
    private PriorityBlockingQueue<Request<?>> mRequestQueue = new PriorityBlockingQueue<Request<?>>();
    /**
     * 请求的序列化生成器
     */
    private AtomicInteger mSerialNumGenerator = new AtomicInteger(0);
    /**
     * 默认的核心数为 CPU 数加 1
     */
    public static int DEFAULT_CORE_NUMS = Runtime.getRuntime().availableProcessors() + 1;
    /**
     * CPU 核心数 + 1 个分发线程数
     */
    private int mDispatcherNums = DEFAULT_CORE_NUMS;
    /**
     * 执行网络请求的线程
     */
    private NetworkExecutor[] mDispatchers = null;
    /**
     * Http 请求的真正执行者
     */
    private HttpStack mHttpStack;

    protected RequestQueue(int coreNums, HttpStack httpStack) {
        mDispatcherNums = coreNums;
        mHttpStack = httpStack != null ? httpStack : HttpStackFactory.createHttpStack();
    }

    /**
     * 启动网络执行器
     */
    private final void startNetworkExecutor() {
        mDispatchers = new NetworkExecutor[mDispatcherNums];
        for (int i = 0; i < mDispatcherNums; i++) {
            mDispatchers[i] = new NetworkExecutor(mRequestQueue, mHttpStack);
            mDispatchers[i].start();
        }
    }

    /**
     * 启动网络请求的线程
     */
    public void start() {
        // 先停止已经启动的线程
        stop();
        startNetworkExecutor();
    }

    /**
     * 停止已经启动的线程
     */
    public void stop() {
        if (mDispatchers != null && mDispatchers.length > 0) {
            for (int i = 0; i < mDispatchers.length; i++) {
                mDispatchers[i].quit();
            }
        }
    }

    /**
     * 往消息队列中添加请求
     *
     * @param request
     */
    public void addRequest(Request<?> request) {
        if (!mRequestQueue.contains(request)) {
            // 为请求设置序列号
            request.setSerialNumber(this.generateSerialNumber());
            mRequestQueue.add(request);
        } else {
            Log.d("", "请求队列中已经含有");
        }
    }

    /**
     * 生成序列号
     *
     * @return
     */
    private int generateSerialNumber() {
        return mSerialNumGenerator.incrementAndGet();
    }
}
```

在`RequestQueue`中的两个核心是请求队列和网络执行器。消息队列是负责管理请求，网络请求器负责在后台执行。NetworkExecutor 实际上是通过`HttpStack`接口，接口中定义了执行网络请求的对象。

### HttpStack

这是一个接口，里面定义了发起请求的方法`performRequest`。我们知道，原生库中发起网络请求的方式有`HttpClient`和`HttpURLConnection`的方法，所以我们可以定义不同的子类继承`HttpStack`，分别对应的是`HttpClientStack`和`HttpUrlConnStack`类。

以`HttpUrlConnStack`类举例，其中应该包括 HTTP 请求，构建请求、设置 header、设置请求参数、解析 Response 等操作。其实`HttpClientStack`也是这个逻辑操作，但是实现的模式不同。

```java
public class HttpUrlConnStack implements HttpStack {

    @Override
    public Response performRequest(Request<?> request) {
        HttpURLConnection urlConnection = null;
        try {
            // 构建 HttpURLConnection
            urlConnection = createUrlConnection(request.getUrl());
            // 设置 headers
            setRequestHeaders(urlConnection, request);
            // 设置 body 参数
            setRequestParams(urlConnection, request);
            return fetchResponse(urlConnection);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (urlConnection != null) {
                // 结束之前一定要关闭连接
                urlConnection.disconnect();
            }
        }
        return null;
    }

    private HttpURLConnection createUrlConnection(String url) throws IOException {
        URL newURL = new URL(url);
        URLConnection urlConnection = newURL.openConnection();
        urlConnection.setConnectTimeout(mConfig.connTimeOut);
        urlConnection.setReadTimeout(mConfig.soTimeOut);
        urlConnection.setDoInput(true);
        urlConnection.setUseCaches(false);
        return (HttpURLConnection) urlConnection;
    }

    private void setRequestHeaders(HttpURLConnection connection, Request<?> request) {
        Set<String> headerKeys = request.getHeaders().keySet();
        for (String headerName : headerKeys) {
            connection.addRequestProperty(headerName, request.getHeaders().get(headerName));
        }
    }

    protected void setRequestParams(HttpURLConnection connection, Request<?> request) throws ProtocolException, IOException {
        HttpMethod method = request.getHttpMethod();
        connection.setRequestMethod(method.toString());
        // 添加参数
        byte[] body = request.getBody();
        if (body != null) {
            connection.setDoOutput(true);
            // 设置内容类型
            connection.addRequestProperty(Request.HEADER_CONTENT_TYPE, request.getBodyContentType());
            DataOutputStream dataOutputStream = new DataOutputStream(connection.getOutputStream());
            dataOutputStream.write(body);
            dataOutputStream.close();
        }
    }

    /**
     * 解析 response
     *
     * @param connection
     * @return
     * @throws IOException
     */
    private Response fetchResponse(HttpURLConnection connection) throws IOException {
        ProtocolVersion protocolVersion = new ProtocolVersion("HTTP", 1, 1);
        int responseCode = connection.getResponseCode();
        if (responseCode == 1) {
            throw new IOException("Could not retrieve response code from HttpUrlConnection.");
        }
        // 状态行数据
        StatusLine responseStatus = new BasicStatusLine(protocolVersion, connection.getResponseCode(),
                connection.getResponseMessage());
        // 构建 response
        Response response = new Response(responseStatus);
        // 设置 response 数据
        response.setEntity(entityFromURLConnection(connection));
        addHeadersToResponse(response, connection);
        return response;
    }

    /**
     * 执行 HTTP 请求之后获取到其数据流，即返回请求结果的流
     *
     * @param connection
     * @return
     */
    private HttpEntity entityFromURLConnection(HttpURLConnection connection) {
        BasicHttpEntity entity = new BasicHttpEntity();
        InputStream inputStream = null;
        try {
            inputStream = connection.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
            inputStream = connection.getErrorStream();
        }
        // TODO: GZIP
        entity.setContent(inputStream);
        entity.setContentLength(connection.getContentLength());
        entity.setContentEncoding(connection.getContentEncoding());
        entity.setContentType(connection.getContentType());
        return entity;
    }

    /**
     * 添加 header 到 response 中
     *
     * @param response
     * @param connection
     */
    private void addHeadersToResponse(BasicHttpResponse response, HttpURLConnection connection) {
        for (Map.Entry<String, List<String>> header : connection.getHeaderFields().entrySet()) {
            // 将 header 依次加入 response 中
            if (header.getKey() != null) {
                Header h = new BasicHeader(header.getKey(), header.getValue().get(0));
                response.addHeader(h);
            }
        }
    }
}
```

以上操作就是通过构建`HttpURLConnection`，通过其对象设置请求 Header 参数，发起请求，请求完成之后再解析结果，最后返回给`Response`。

除此之外，因为我们知道，在 Android 6.0 之后的版本中，`HttpClient`已废弃，都推荐使用`HttpUrlConnection`的方式发起网络请求，因此我们创建`HttpFactory`工具类，可以根据 Android API 的版本，来判断调用哪种方式来发起请求。

```java
public final class HttpStackFactory {
    /**
     * 定义 Android 版本
     */
    private static final int GINGERBREAD_SDK_NUM = 9;

    public static HttpStack createHttpStack() {
        int runtimeSDKApi = Build.VERSION.SDK_INT;
        // 如果版本号大于这个版本
        if (runtimeSDKApi >= GINGERBREAD_SDK_NUM) {
            // 使用 HttpURLConnection() 来创建连接
            return new HttpUrlConnStack();
        }
        // 使用 HttpClient() 来创建连接
        return new HttpClientStack();
    }
}
```
## NetworkExecutor 网络执行部分

之前提到过，NetworkExecutor 网络执行器实际上是一个继承至`Thread`的线程类。用户需要创建并启动一个请求队列之后，指定个数的`NetworkExecutor`来随之启动。多个`Executor`共享一个消息队列，然后每个启动器中的`run()`方法会循环地提取请求队列中的请求，拿到请求之后就交给`HttpStack`的具体实现子类来真正地执行请求。它的核心类代码如下：

```java
public final class NetworkExecutor extends Thread {

    /**
     * 网络请求队列
     */
    private BlockingQueue<Request<?>> mRequestQueue;
    /**
     * 网络请求栈
     */
    private HttpStack mHttpStack;
    /**
     * 结果分发器，将结果投递到主线程
     */
    private static ResponseDelivery mResponseDelivery = new ResponseDelivery();
    /**
     * 请求缓存
     */
    private static Cache<String, Response> mReqCache = new LruMemCache();

    /**
     * 是否停止
     */
    private boolean isStop = false;

    public NetworkExecutor(BlockingQueue<Request<?>> queue, HttpStack httpStack) {
        mRequestQueue = queue;
        mHttpStack = httpStack;
    }

    @Override
    public void run() {
        try {
            while (!isStop) {
                final Request<?> request = mRequestQueue.take();
                if (request.isCanceled()) {
                    Log.d("###", "取消执行了");
                    continue;
                }
                Response response = null;
                if (isUseCache(request)) {
                    // 从缓存中去读
                    response = mReqCache.get(request.getUrl());
                } else {
                    response = mHttpStack.performRequest(request);
                    if (request.shouldCache() && isSuccess(response)) {
                        mReqCache.put(request.getUrl(), response);
                    }
                }

                // 分发请求结果
                mResponseDelivery.deliveryResponse(request, response);
            }
        } catch (InterruptedException e) {
            Log.i("", "请求分发器退出");
        }
    }

    /**
     * 执行是否成功
     *
     * @param response
     * @return
     */
    private boolean isSuccess(Response response) {
        return response != null && response.getStatusCode() == 200;
    }

    /**
     * 是否从缓存中读取
     *
     * @param request
     * @return
     */
    private boolean isUseCache(Request<?> request) {
        return request.shouldCache() && mReqCache.get(request.getUrl()) != null;
    }

    public void quit() {
        isStop = true;
        interrupt();
    }
}
```

网络执行器的部分就是指定数量的`NetworkExecutor`，构造执行器时将请求队列以及`HttpStack`注入。让`run()`函数的循环中不断从请求队列中取出请求，并且交给`HttpStack`执行，期间需要判断是否需要缓存、是否已经有缓存等等。如果使用缓存，并且已经含有缓存，就使用缓存的结果。

## Response回调部分

### Response类

每个 Request 都对应一个 Response，存储了请求的状态码、请求结果等内容。但框架中不应该使用太具体的内容，而是能够让开发者能够自由地、简单地扩展内容。因为我们知道，HTTP 基于 TCP 协议，TCP 协议基于 Socket，Socket 实际上操作的是输入输出流。输出流是向服务器写数据，输入流是从服务器读取数据。所以在 Response 类中，我们应该使用`InputStream`存储结果或者用字节数组来存储结果。

```java
public class Response extends BasicHttpResponse {

    /**
     * 原始的 Response 主体数据
     */
    public byte[] rawData = new byte[0];

    public Response(StatusLine statusline, ReasonPhraseCatalog catalog, Locale locale) {
        super(statusline, catalog, locale);
    }

    public Response(StatusLine statusline) {
        super(statusline);
    }

    public Response(ProtocolVersion ver, int code, String reason) {
        super(ver, code, reason);
    }

    @Override
    public void setEntity(HttpEntity entity) {
        super.setEntity(entity);
        rawData = entityToBytes(getEntity());
    }

    public int getStatusCode() {

    }

    @Override
    public void setStatusCode(int code) {

    }

    public String getMessage() {

    }

    public void setMessage(String msg) {

    }

    /**
     * 获得原始的数据
     *
     * @return
     */
    public byte[] getRawData() {
        return rawData;
    }

    /**
     * 将 entity 转化为 bytes
     *
     * @param entity
     * @return
     */
    private byte[] entityToBytes(HttpEntity entity) {
        try {
            return EntityUtils.toByteArray(entity);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new byte[0];
    }
}
```

### ResponseDelivery 类

这个类的作用是将请求的回调执行到 UI 线程，以便用户可以更新 UI 等操作。

```java
public class ResponseDelivery implements Executor {

    /**
     * 关联主线程消息队列的 Handler
     */
    Handler mResponseHandler = new Handler(Looper.getMainLooper());

    /**
     * 处理请求结果，在 UI 主线程中执行
     *
     * @param request
     * @param response
     */
    public void deliveryResponse(final Request<?> request, final Response response) {
        Runnable respRunnable = new Runnable() {
            @Override
            public void run() {
                request.deliveryResponse(response);
            }
        };

        execute(respRunnable);
    }


    @Override
    public void execute(Runnable command) {
        mResponseHandler.post(command);
    }
}
```

我们也可以看到，ResponseDelivery 类内部其实也是封装了关联UI线程消息队列的 Handler，在`deliveryResponse`函数中将`request`执行在UI线程中，然后在子线程中再执行`request`的`deliveryResponse`方法，这个方法里会解析数据，并且将结果通过回调的方式传递给了 UI 线程。

## 使用

通过以上步骤，一个~~精彩~~简陋的网络框架就搭建好了。我们就可以直接建立请求如下：

```java

// 创建请求队列，使用默认的请求核心数，并根据 Android 版本判断使用何种网络连接方式
RequestQueue mQueue = new RequestQueue(RequestQueue mQueue = new RequestQueue(Runtime.getRuntime().availableProcessors() + 1, HttpStackFactory.createHttpStack());

// 例如，如下是一个返回字符串的请求
StringRequest request = new StringRequest(HttpMethod.GET, "http://www.baidu.com", new RequestListener<String>() {
    @Override
    public void onComplete(int stCode, String response, String errMsg) {
        // 处理结果，例如将 response 显示在界面中
        mTv.setText(response);
    }
});

// 将这个请求 request 添加到请求队列中去
mQueue.addRequest(request);
```