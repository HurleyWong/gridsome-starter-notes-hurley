---
title: 如何制作一张尺寸合理、图片精美的博客封面图
date: 2020-10-09T21:00:00+08:00
published: true
slug: make-blog-cover
tags:
- blog
cover_image: "./images/blog-cover.png"
canonical_url: false
description: How to make a blog cover with suitable size and awesome image?
---

:::note 🖼 Background

在逛他人的博客时，会发现每篇 post 都会有精美的封面图，那么这些图片是如何制作的呢？作为一个一点不会 PS 的小白，我将尽最大的努力寻求一个制作精美博客封面图的步骤。

:::

<!-- more -->

## 矢量插画网站

在这里，我就收集了很多功能强大、种类繁多的可免费可商用的插画素材网站，支持主流的图片格式，有些图片可以免费运用到自己的项目中，而且没有版权限制。

### freepik

众所周知，并不是每一位博主都是设计师，这些插画图也并不都是自己完成的，绝大部分还是来源于网络，freepik 给了大家一个便捷的使用矢量图的通道。

[freepik](https://www.freepik.com/) 这个网站是寻找「矢量图」的一个便捷的网站。即使不是会员，也能够下载很多精美的矢量图片（非会员每天会有下载数量限制），当前，前提是使用英文去进行搜索，但我相信这对大家并不是一个难题。

![freepik](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe7b3036c-78a7-4b17-98c7-495e76b34317%2FUntitled.png?table=block&id=abe077c9-231b-4486-84f9-ddf3f9e5a4b1&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5760&userId=&cache=v2)

### Delesign

![Delesign](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F1623aa12-da0e-4b1f-8cf2-1f30839e4c82%2FUntitled.png?table=block&id=19213ff0-1fe9-4034-b6ab-3613142a4db4&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5750&userId=&cache=v2)

如上图所示，打开网站就可以看到默认显示的插画素材，输入 Email 就可以订阅此网站并且免费下载图片，插画的种类也是应有尽有。

## Canva

Canva 是一个设计网站，可以设计例如 Post、Presentation、Video、Logo 等等。首先，可以创建一个设计集，根据 Blog 封面图的大小去设置长宽大小（可以通过 F12 在浏览器中查看）。

然后，通过上传图片，添加文字、背景等功能，就能设计出一个基本满意的博客封面图片啦！

例如下图：

![](./images/mice-chase-beast.png)

## 背景透明化

然而，细心的读者也许发现了，上面的图片也许效果尚可，但很大程度是所选取的矢量图「猫捉老鼠」的功劳。实际上，其左侧的图片与右侧的文字有着明显的「**割裂感**」。这其实是因为**图片背景不透明化**造成的。

那么，如何将图片背景透明化，并与文字融入一体呢？

除了有些下载下来的格式为`.svg`的图片是自带透明化的，除此之外，例如从 freepik 下载下来的图片解压缩后，一般仅有 3 种格式：`.jpg`、`.eps`、`.ai`，且都是非透明化的。那么，这时候就需要网络上的一些透明化图片工具了。下面这三个工具：**RemoveBg**、**Slazzer**、**UnScreen** 可以帮助到我们。

我本人之前使用的是 [bgremover](http://www.aigei.com/bgremover) 这个网站，即使这个网站的样式十分的简陋，但实测功能还算不错，基本能满足个人的需求。

### RemoveBg

![RemoveBg](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4953130b-f585-4bcb-9b07-53884f2aa3a0%2FUntitled.png?table=block&id=44f0b970-f5b8-4528-86ac-032fdd759210&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5760&userId=&cache=v2)

RemoveBg 是一个基于 AI 技术，以训练好的模型快速分辨招聘前景和背景，将主题分离后成为透明背景的网站（除免费次数之外，需要收费）。

### Slazzer

![Slazzer](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F3ecfe1f6-1a6a-44ff-923b-5732eff5e6c3%2FUntitled.png?table=block&id=3d2faa92-4037-4ff2-a131-ae174c69567f&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5700&userId=&cache=v2)

Slazzer 是基于 AI 技术实现的在短短几秒内自动删除图像背景，只需要 5 秒就可以实现一键抠图去除背景。

## Unscreen

![Unscreen](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F8a941ab8-5077-4ca0-be76-57aed9c7ec3b%2FUntitled.png?table=block&id=bdff8002-e8c0-441d-a084-68d5a7285adb&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5740&userId=&cache=v2)

Unscreen 同样是一个在线免费的**扣视频神器**，支持 mp4、gif、mov 等格式，可以上传视频或者 GIF，自动去除背景，保留视频主体。

### vtracer

vtracer，可快速将 jpg、png 等格式的图片快速转换为 svg 矢量图，并支持过滤斑点、色彩精度等多种参数配置。

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fafbbf72f-687b-402c-83e3-7a64268b6227%2FUntitled.png?table=block&id=01efdac5-149c-40cc-a1ef-a81721026d6d&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=6020&userId=&cache=v2)

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F89fc53b5-59f9-4c06-a0bf-070769c4dce1%2FUntitled.png?table=block&id=f923405d-680f-4710-833c-a3e6beeae183&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3490&userId=&cache=v2)


---

当去除图片背景色之后，本篇 Post 的封面图也就应运而生啦！

![本篇文章的Blog封面图](./images/blog-cover.png)

尽管仍然不是特别满意的效果（毕竟我不懂设计），但基本能发现本是两张不同背景的图片最终融合在了一个图片里，且底色一样，就姑且认为成功了吧～

:::tip 📚 Conclusion

尽管以上步骤已经能达到一个初步的博客封面图的效果，但这仍然是针对我这种毫无 PS 技巧的用户人群。抛开速度而言，这里仍然推荐使用 PS 等工具，包括很火热的 Figma 等设计网站进行较为专业的处理。相信你我都可以有一双发现并产生美的手「污～」

:::