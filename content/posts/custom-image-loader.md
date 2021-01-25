---
title: 着手实现一个优秀的ImageLoader
date: 2020-11-17T21:00:00+08:00
published: true
slug: custom-image-loader
tags:
- Android
cover_image: "./images/custom-image-loader.png"
canonical_url: false
description: 通过Bitmap的高效加载模式，借助LruCache以及DiskLruCache，实现一个有三级缓存机制的ImageLoader。
---

:::note ℹ️ Introduction

Generally speaking, a perfect ImageLoader should have serval functions as following:

* 图片的同步加载
* 图片的异步加载
* 图片压缩
* 三级缓存机制
  * 内存缓存
  * 磁盘缓存
  * 网络请求

所以，搭配Bitmap，使用LruCache以及DiskLruCache的三级缓存机制，就可以实现一个简单的、优秀的ImageLoader。

:::

## 压缩功能

图片压缩的作用毋庸置疑，是降低OOM的有效手段之一，一个ImageLoader必须合理地处理图片压缩问题。

```java
public class ImageResizer {

    private static final String TAG = "ImageResizer";

    public ImageResizer() {

    }

    /**
     * 从resource中进行decode
     *
     * @param res
     * @param resId
     * @param reqWidth
     * @param reqHeight
     * @return
     */
    public Bitmap decodeSampleBitmapFromResource(Resources res, int resId, int reqWidth, int reqHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        // 检查尺寸
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeResource(res, resId, options);

        // 计算大小
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // decode
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeResource(res, resId, options);
    }

    /**
     * 从FileDescriptor中进行decode
     *
     * @param fd
     * @param reqWidth
     * @param reqHeight
     * @return
     */
    public Bitmap decodeSampleBitmapFromFileDescriptor(FileDescriptor fd, int reqWidth, int reqHeight) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFileDescriptor(fd, null, options);

        // 计算大小
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        // decode
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFileDescriptor(fd, null, options);
    }

    /**
     * 计算尺寸
     *
     * @param options
     * @param reqWidth     需要压缩到的尺寸宽度
     * @param reqHeight    需要压缩到的尺寸高度
     * @return
     */
    public int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        if (reqWidth == 0 || reqHeight == 0) {
            return 1;
        }

        // 原生尺寸大小
        final int height = options.outHeight;
        final int width = options.outWidth;
        Log.d(TAG, "origin, w=" + width + " h=" + height);
        int inSampleSize = 1;

        // 如果原生尺寸比目标尺寸大
        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }

        Log.d(TAG, "sampleSize:" + inSampleSize);
        return inSampleSize;
    }
}
```

## 图片同步加载

同步加载就是在主线程中加载图片。加载机制仍然是遵循**三级缓存机制**，首先是内存缓存，然后是磁盘缓存，最后是从网络获取图片。

```java
public Bitmap loadBitmap(String uri, int reqWidth, int reqHeight) {
    // 先尝试从内存缓存中读取图片
    Bitmap bitmap = loadBitmapFromMemCache(uri);
    if (bitmap != null) {
        Log.d(TAG, "loadBitmapFromMemCache, url:" + uri);
        return bitmap;
    }

    try {
        // 再尝试从磁盘缓存中读取图片
        bitmap = loadBitmapFromDiskCache(uri, reqWidth, reqHeight);
        if (bitmap != null) {
            Log.d(TAG, "loadBitmapFromDisk, url:" + uri);
            return bitmap;
        }
        // 最后从网络中获取图片，因为网络请求是异步加载的，所以使用封装好的方法
        bitmap = loadBitmapFromHttp(uri, reqWidth, reqHeight);
        Log.d(TAG, "loadBitmapFromHttp, url:" + uri);
    } catch (IOException e) {
        e.printStackTrace();
    }

    // 如果bitmap仍然为空，并且磁盘缓存未创建
    if (bitmap == null && !mIsDiskLruCacheCreated) {
        Log.w(TAG, "encounter error, DiskLruCache is not created.");
        // 根据提供的uri下载图片
        bitmap = downloadBitmapFromUrl(uri);
    }
    return bitmap;
}
```

## 图片异步加载

```java
public void bindBitmap(final String uri, final ImageView imageView, final int reqWidth, final int reqHeight) {
    imageView.setTag(TAG_KEY_URI, uri);
    // 从内存中加载图片
    Bitmap bitmap = loadBitmapFromMemCache(uri);
    if (bitmap != null) {
        // 如果有，就直接返回结果
        imageView.setImageBitmap(bitmap);
        return;
    }

    // 开启一个线程
    Runnable loadBitmapTask = new Runnable() {
        @Override
        public void run() {
            // 请求加载图片
            Bitmap bitmap = loadBitmap(uri, reqWidth, reqHeight);
            if (bitmap != null) {
                // 将ImageView、URI、Bitmap封装成一个LoaderResult对象
                LoaderResult result = new LoaderResult(imageView, uri, bitmap);
                // 通过Handler向主线程中发送一个消息
                mMainHandler.obtainMessage(MESSAGE_POST_RESULT, result).sendToTarget();
            }
        }
    };
    // 在线程池中调用loadBitmapTask线程
    THREAD_POOL_EXECUTOR.execute(loadBitmapTask);
}
```

`bindBitmap()`方法是在线程池中调用`loadBitmap`方法加载，加载成功后将图片、图片的地址以及imageView封装成一个对象，通过Handler向主线程发送一个消息，主线程就可以给imageView设置图片。

那么，线程池是如何实现的呢？

```java
private static final ThreadFactory sThreadFactory = new ThreadFactory() {

    private final AtomicInteger mCount = new AtomicInteger(1);

    @Override
    public Thread newThread(Runnable r) {
        return new Thread(r, "ImageLoader#" + mCount.getAndIncrement());
    }
};

/**
 * 定义了一个线程池
 */
public static final Executor THREAD_POOL_EXECUTOR = new ThreadPoolExecutor(
        CORE_POOL_SIZE, MAXIMUM_POOL_SIZE, KEEP_ALIVE, TimeUnit.SECONDS,
        new LinkedBlockingQueue<Runnable>(), sThreadFactory
);

/**
 * 构建Handler
 */
private Handler mMainHandler = new Handler(Looper.getMainLooper()) {
    @Override
    public void handleMessage(Message msg) {
        LoaderResult result = (LoaderResult) msg.obj;
        ImageView imageView = result.imageView;
        imageView.setImageBitmap(result.bitmap);
        String url = (String) imageView.getTag(TAG_KEY_URI);
        if (url.equals(result.url)) {
            imageView.setImageBitmap(result.bitmap);
        } else {
            Log.w(TAG, "set image bitmap, but url has changed, ignored!");
        }
    }
};
```

通过线程池，可以避免产生大量的线程去加载图片，从而不利于整体效率的提升。所以，这里选择线程池和Handler来提供ImageLoader的并发能力。因为AysncTask的底层也是通过线程池和Handler实现的，所以也可以使用AsyncTask。

## 其余方法

除上述描述之外，还有一些基本的方法，例如将图片添加进缓存，从网络下载图片的方法等。

```java
// 将图片添加进内存缓存中
private void addBitmapToMemoryCache(String key, Bitmap bitmap) {
    if (getBitmapFromMemCache(key) == null) {
        mMemoryCache.put(key, bitmap);
    }
}

// 从内存缓存中获取图片
private Bitmap getBitmapFromMemCache(String key) {
    return mMemoryCache.get(key);
}

// 从内存缓存中加载图片
private Bitmap loadBitmapFromMemCache(String url) {
    final String key = hashKeyFormUrl(url);
    Bitmap bitmap = getBitmapFromMemCache(key);
    return bitmap;
}

// 从磁盘缓存中加载图片
private Bitmap loadBitmapFromDiskCache(String url, int reqWidth, int reqHeight) throws IOException {
    if (Looper.myLooper() == Looper.getMainLooper()) {
        Log.w(TAG, "load bitmap from UI Thread, it's not recommended!");
    }
    if (mDiskLruCache == null) {
        return null;
    }

    Bitmap bitmap = null;
    String key = hashKeyFormUrl(url);
    // 磁盘缓存的读取需要通过Snapshot来完成，通过Snapshot可以得到磁盘缓存对象对应的FileInputStream
    DiskLruCache.Snapshot snapshot = mDiskLruCache.get(key);
    if (snapshot != null) {
        FileInputStream fileInputStream = (FileInputStream) snapshot.getInputStream(DISK_CACHE_INDEX);
        // 因为FileInputStream无法便捷地进行压缩，通过FileDescriptor来加载压缩后的图片
        FileDescriptor fileDescriptor = fileInputStream.getFD();
        bitmap = mImageResizer.decodeSampleBitmapFromFileDescriptor(fileDescriptor, reqWidth, reqHeight);
        if (bitmap != null) {
            // 将加载过后的Bitmap添加到内存缓存中
            addBitmapToMemoryCache(key, bitmap);
        }
    }
    return bitmap;
}
```

关于从磁盘缓存中加载图片，又涉及到文件的读写，同时需要导入一个Android SDK中没有的DiskLruCache类。

接下来是从三级缓存机制中的最后一个，从网络中拉取图片。

```java
// 从网络中拉取图片
private Bitmap loadBitmapFromHttp(String url, int reqWidth, int reqHeight) throws IOException {
    // 因为耗时复杂的请求不能在主线程中调用，所以需要检查是否为主线程
    // 通过检查当前线程的Looper是否为主线程的Looper来判断
    if (Looper.myLooper() == Looper.getMainLooper()) {
        throw new RuntimeException("can not visit network from UI Thread.");
    }
    if (mDiskLruCache == null) {
        return null;
    }

    String key = hashKeyFormUrl(url);
    // 磁盘缓存的添加需要通过Editor来完成
    // Editor提供了commit和abort方法来提交和撤销对文件系统的写操作
    DiskLruCache.Editor editor = mDiskLruCache.edit(key);
    if (editor != null) {
        OutputStream outputStream = editor.newOutputStream(DISK_CACHE_INDEX);
        if (downloadUrlToStream(url, outputStream)) {
            // 提交
            editor.commit();
        } else {
            // 撤销
            editor.abort();
        }
        mDiskLruCache.flush();
    }
    return loadBitmapFromDiskCache(url, reqWidth, reqHeight);
}
```

```java
// 根据url连接，以输出流的方式下载
public boolean downloadUrlToStream(String urlString, OutputStream outputStream) {
    HttpURLConnection connection = null;
    BufferedOutputStream out = null;
    BufferedInputStream in = null;
    try {
        final URL url = new URL(urlString);
        connection = (HttpURLConnection) url.openConnection();
        in = new BufferedInputStream(connection.getInputStream(), IO_BUFFER_SIZE);
        out = new BufferedOutputStream(outputStream, IO_BUFFER_SIZE);

        int b;
        while ((b = in.read()) != -1) {
            out.write(b);
        }
        return true;
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (connection != null) {
            connection.disconnect();
        }
    }
    return false;
}
```

最后的方法就是假如三级缓存中并未找到该图片，那么需要重新从网络中，根据提供的uri下载图片，使用的是原生的`HttpURLConnection`。

```java
private Bitmap downloadBitmapFromUrl(String urlString) {
    Bitmap bitmap = null;
    HttpURLConnection urlConnection = null;
    BufferedInputStream in = null;

    try {
        final URL url = new URL(urlString);
        urlConnection = (HttpURLConnection) url.openConnection();
        in = new BufferedInputStream(urlConnection.getInputStream(), IO_BUFFER_SIZE);
        bitmap = BitmapFactory.decodeStream(in);
    } catch (final IOException e) {
        Log.e(TAG, "Error in downloadBitmap: " + e);
    } finally {
        if (urlConnection != null) {
            urlConnection.disconnect();
        }
    }
    return bitmap;
}
```