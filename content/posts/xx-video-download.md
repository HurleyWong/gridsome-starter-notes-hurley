---
title: XXX视频下载折腾总结
date: 2021-01-05T21:00:00+08:00
published: true
slug: xx-video-download
tags:
- shell
- Chrome extension
- media
cover_image: "./images/xx-video-download.png"
canonical_url: false
description: 不怕XX耍流氓，就怕XX有文化
---

:::note ⚡️ Why Do This

随着马上就要成为一名社畜，也意味着马上就会拥有一个自己的小家（租的）。因此，折腾狂的我不禁就想把一切能想到的配置都给配上。虽然暂时没钱配群辉 NAS，但是作为一名司机，如何离线的、流畅地观看视频也是一项必备技能！在国外时，我最常访问的视频网站，除了 Netflix 就是 XX 了。然而，国内网络环境的限制，导致即使你有了梯子，速度也不尽如人意，总不能动手的同时，眼睛却得盯着进度条转圈圈吧？赶紧动手下载下来！

:::

## 前提

### 科学上网

这个我相信大家能有自己的办法解决，请相信，我们一切所做的都是合理、合法的行为。

### XX网站

作为成年人，我相信大家都会有自己的选择。很多网站在全球都是浏览量排名前 10 的网站了，那么，你又有什么理由不能去知道并访问呢？

## 工具

作为一个非常喜欢收集工具的人，我接触过很多下载类的工具，目前电脑里还留存的有：

![下载工具](https://i.loli.net/2021/01/07/4gPhZtC3NKywQTc.png)

### 迅雷

迅雷自然不必多言，可能已经陪伴了我们十多年。许多年前，装机工具有必备的软件肯定有它。它也的确是下载磁力链接的很好的选择。然而，随着非 VIP 用户的限速，它的下载速度在今天这个随便某个视频大小都过 GB 的今天，实在是令人难以满意。

如果您是一个小白用户，我认为迅雷仍然是最适合您的选择。只不过，对于 XX 网站，迅雷显然是帮不上一点忙的。

:::note 💡 Tips

Mac 端的迅雷应用应该相比 Windows 端的广告要少很多，Windows 端的迅雷广告内容低劣，令人不堪其扰。

:::

### 百度网盘

曾今，它的名字还叫「百度云」。或许是为了给更加繁荣的百度云计算让位，它改名成了如今的百度网盘。一同更改的，还有它那非 SVip 用户的限速机制。

曾今，我经常是通过百度贴吧里搜索关键字，加入相关的百度云群组，根据群组中「好心人」分享的内容，保存进自己的网盘，然后下载观看。但这个方法在多年后的今天早已失效。且不说百度网盘严格的封禁机制（即使存储正常的学习内容，仍然有被乱封的风险）以及十几 kb/s 的普通用户下载速度，就连百度贴吧也早已风头不如当年，沦为一个广告遍地的社区。没有了核心的用户、有价值的内容，即使有着数百 M 的光纤，又有何用？

:::note 🤔 Thinking

其实我是认同百度网盘会员能够正常速度甚至加快速度下载文件的策略的。毕竟网盘不是免费的，如果人人都能够无限大容量的云存储空间以及满血的下载速度，那么其耗费以及占用带宽都是巨大的。最近， Google Drive 也开始了付费空间，就说明这其实是市场正常化的趋势。「人是不可能一直薅羊毛的。」

:::

### FDM

Free Download Manager，简称 FDM。它是一款免费的软件，界面十分简洁易用，更没有任何广告捆绑。它支持直接的链接下载、磁力链接、BT 文件。除此之外，它还可以下载 YouTube 视频，并选择视频的分辨率。

![Free Download Manager](https://i.loli.net/2021/01/07/xzCSi48dGsrk6XY.png)

然而，它并不支持下载 XX 网站中的视频。

### Motrix

Motrix 是一款开源免费的全功能下载器，支持 HTTP、FTP、BT、Magnet（磁力链接）以及百度网络和迅雷下载协议。这个开源部分是调用了 Aria2，并且是支持全平台的 (Windows、macOS、Linux)。

![Motrix](https://i.loli.net/2021/01/07/LuzUcnZkG7VyAwY.png)

### Downie

Downie 是一款 macOS 下的在线视频下载工具，它的功能非常强大，支持 1000+ 视频网站，常见的如 YouTube、优酷、腾讯视频、B站、爱奇艺等都支持，还支持字幕下载、格式转换等等。除此之外，据我查询得知，它还支持 m3u8 (HLS) 下载，这个对我们很有帮助，后文会提到 m3u8 的相关信息。

亲测这款软件可以下载市面上主流的视频网站，例如 Youtube 等，但是对于 XX 网站的视频，它仍然是束手无策。这究竟是为什么呢？这不禁让我们想到了是否是**视频格式**的问题。

## 视频格式

尽管有了上面那些著名的下载软件，但是 XX 网站既然不提供下载按钮，就说明是不会轻易地让用户下载视频的。所以，我们并不能简单地通过视频播放的地址来下载。除此之外，通过查询资料才发现，XX 网站的视频格式并不是我们日常常用的 .mp4 或者 .avi 等格式，而是 **HLS**。

### HLS

HLS (Http Live Streaming)，是由 Apple 公司定义的用于实时流传输的协议。它的工作原理是把整个流分隔成一个个小的基于 HTTP 的文件来下载，每次只下载一部分。当媒体流正在播放的时候，客户端可以选择从许多不同的备用源中以不同的速率下载同样的资源，允许流媒体会话适应不同的数据速率。HLS 只请求基本的HTTP报文，可以穿过任何允许 HTTP 数据通过的防火墙或者是代理服务器。

简而言之，HLS 是新一代流媒体传输协议，其基本实现原理是将一个大的媒体文件进行分片，将该分片文件资源路径记录在 m3u8 文件中（即 playlist），除此之外会附带一些额外的描述用于提供给客户端。客户端根据该 m3u8 文件即可获取到对应的媒体资源。

所以，其传输内容包括两部分：

* m3u8 描述文件
* ts 媒体文件

#### m3u8

m3u8 用文本方式对媒体文件进行描述，由一系列标签组成。例如，其格式如下：

```
#EXTM3U
#EXT-X-TARGETDURATION:5
#EXTINF:5,
./0.ts
#EXTINF:5,
./1.ts
```

稍微解释一下这个文本格式的意思。`#EXTM3U`这个是每个 m3u8 文件的第一行，必须是这个 tag。`#EXT-X-TARGETDURATION`就很明显了，duration 指定最大的媒体段时间长度（秒）。`#EXTINF`中指定的时间长度必须小于或者等于这个最大值。`#EXTINF`是描述单个媒体文件的长度，后面跟着的就是媒体文件。

#### ts

ts 文件是传输流文件，视频编码格式主要是 h264/mpeg4，音频格式为 acc/MP3。

ts 文件分为三层：

* ts (Transport Stream) 层：在 pes 层上，加入了数据流的识别和传输必须的信息
* pes (Packet Elemental Stream) 层：在音视频数据上加了时间戳等对数据帧的说明信息
* es (Elementray Stream) 层：音视频数据

![ts 三层结构](https://i.loli.net/2021/01/07/A1ht7gXpu6ywWrl.png)

### 获得 m3u8 和 ts

我们已经了解到 XX 网站是通过 m3u8 文件和 ts 文件来播放视频的。m3u8 实际上是一个可以用文本打开的文件，前面提到，它包含了和视频相关的标签，通过这些标签，可以获取到要下载的 ts 片段。下载下来的 ts 片段都是可以单独播放的，所以，我们最后将所有的 ts 片段合并成 mp4 文件就可以了。

理顺了整个实现思路，现在我们就需要找到 XX 网站的 m3u8 文件和 ts 文件。通过搜索引擎查询，我们发现可以使用浏览器就能完成。

1. 打开浏览器，打开要播放视频的网址；
2. 右键 -> 检查（或者按 **F12** 或者 **fn+F12**）-> 点击 **Network**
3. 点击播放视频
4. 点击滤斗的图标，即 Filter，输入 **m3u8**，即可找出 m3u8 文件
5. 除此之外，还可以看到很多 ts 文件

不幸的是，XX 网站不愧是视频网站的「大牛」。我们通过如上的方法，只能看到一堆堆 ts 文件不断冒出来，然后 m3u8 文件是如何也搜不到。没有 m3u8 文件，也就拿不到 ts 文件下载的 list。怎么解决呢？

## 下载

我们决定从 Github 中找找相关的办法。通过搜索「XX」关键字，我们发现第一个出现的开源项目就有解决办法。它提供了一个叫做「**chrome-xx-helper**」的 Chrome 插件，可以通过安装插件的方式来下载 m3u8 文件。

### 插件

这个插件的开源项目有两个主要分支，目前最新的分支是`3.x.x`，另外一个分支就是`master`。最开始，我认为应该使用`master`分支更为稳定，结果按照 README.md 的使用说明操作后，发现的确是将视频的 m3u8 文件下载下来了。然而不幸的是，它的格式并不与我们上面介绍的 m3u8 的格式一样。它的格式如下：

![](https://i.loli.net/2021/01/07/C2tGTmh6pxYKBzP.png)

可以发现，这应该是 Base64 解密后的文本。通过复制后进行 Base64 加密，我们发现仍然是一大串的文本，仍然不是传统的 m3u8 格式。

通过查询发现，现在大部分网站都会对 ts 片段加密，所以还需要一个 ts 密钥，然后才能进行下载。

那么，如果换成`3.x.x`分支再使用插件，下载下来的是一个`video-name.sh`的脚本文件，通过执行脚本文件，我们就可以调用 aria2 来多线程地下载视频。

#### Install & Usage

1. use `git` to clone the repository into your local computer
2. install Chrome extension
   1. navigate to `chrome://extensions` in Chrome browser
   2. check `Developer mode` on, then click `Load Unpacked Extension`
   3. choose the folder `extension` under this project / this repo
3. install download and merge scripts
   1. for Most Linux / Unix Systems / WSL: `./install.sh /usr/local/bin/` or `./install.sh ~/bin`
   2. for Windows User(Git Bash / Cygwin): `./install.sh`
4. Download video follow command on the online player page by script `XXDownloader`
5. Combine video files by script `XX`

亲测，当使用分支`master`（稳定版本）时，需要按照顺序执行以上的步骤，但是问题仍然如之前说过的那样，下载下来的 m3u8 文件被加密，可能是 XX 网站最近已经做出了更改。当切换到`3.x.x`分支时，亲测第 3 步似乎无法成功执行，但是也无需执行，便可以下载下来一个可执行脚本`xxx-video-name.sh`，在命令行中运行该脚本，调动 aria2 多线程下载即可。

这个脚本内容写得非常好，不仅解析了 m3u8 文件，生成 ts 文件的列表，调用 aria2 下载，最终还使用 ffmpeg 来将下载下来的 ts 文件合并成 mp4 文件。

![](https://i.loli.net/2021/01/07/njqDwlkahJBZ8PN.png)

### 分析

通过查看这个插件的执行脚本，我们可以简单分析一下其中的代码和原理。

既然是脚本，就经常会有让用户输入选项进行操作的时候，下面的代码就是这个作用。

```shell
function isYes() { [[ "$1" == y* ]] || [[ "$1" == Y* ]]; }
function isNo() { [[ "$1" == n* ]] || [[ "$1" == N* ]]; }
function beginAsk() { echo -e "\n${BLUE_BOLD}>> ${BLUE}${1}"; }
function endAsk() { printf "${RESET}"; }

# usage confirm "question" "pre-chosen value"
function confirm() {
	if isYes "$2"; then return 0; fi
	if isNo "$2"; then return 1; fi

	local yn;
	beginAsk "$1";
	while read -p "Confirm (y/n) > " yn; do
		if isYes "$yn"; then endAsk; return 0; fi
		if isNo "$yn"; then endAsk; return 1; fi
	done
}
```

对于网路请求的方法，首先我们要规范化 URL 链接。

```shell
function normalizeURL() {
	echo "$1" | gawk '{
		gsub(/^[ \t\r\n]+/, "", $0);
		gsub(/[ \t\r\n]+$/, "", $0);
		if(length($0) > 0 && index($0, ".") > 0) {
			if(match($0, /^[a-zA-Z]+:\/\//)) printf("%s", $0);
			else printf("http://%s", $0);
		}
	}';
}
```

然后，我们肯定要设置动态代理，不然长时间请求下载某个视频网站，肯定会被检测到并封禁。

```shell
function setupProxy() {
	[[ -z "$CFG_PROXY" ]] && return;

	local proxyURL="$(normalizeURL "$CFG_PROXY")";
	[[ -z "$proxyURL" ]] && fatal "invalid proxy url: ${CFG_PROXY}";

	export http_proxy="$proxyURL";
	export https_proxy="$proxyURL";
	logInfo 'export `http_proxy` and `https_proxy` as '"$proxyURL";
}
```

对于下载的方法，这个插件提供了普通的 wget 的下载方式：

```shell
function _download() {
	# declare `referer` as a local variable, because it should be reset after
	#    "with_referer" to "no_referer"
	local referer ref1 ref2 out1 out2 exitCode;
	if [[ "$DOWNLOADER_TYPE" == aria2c ]]; then
		cleanDownloadLogOnce;
		[[ "$1" == with_referer ]] && referer="--referer=$HTTP_REFERER";

		# default console log level: notice
		beginDim;
		generateDownloadListForAria2FromStdin "$3" <<< "$2" |
			"$ARIA2C_BIN" "$referer" --user-agent="$CFG_USER_AGENT" \
				--console-log-level=warn --log-level=debug \
				--max-download-result="${CFG_MAX_CONCURRENT_DL}" \
				--keep-unfinished-download-result=true \
				--enable-color=false \
				--summary-interval=120 \
				--show-files --continue=true --input-file=- "$ARIA2C_OPT_J" \
				--log="$DOWNLOAD_LOG" --log-level=info;
		exitCode=$?;
		endDim;
		return $exitCode;
	fi
	# wget
	if [[ "$1" == with_referer ]]; then ref1="--header"; ref2="Referer: $HTTP_REFERER"; fi
	if [[ -n "$3" ]]; then  out1="-O"; out2="$3"; fi

	beginDim;
	"$WGET_BIN" "$ref1" "$ref2" --header "User-Agent: $CFG_USER_AGENT" "$out1" "$out2" $2;
	exitCode=$?;
	endDim;
	return $exitCode;
}
```

以及速度更快、支持多线程同步、断点续传的 aria2 的下载方式：

```shell
# Usage: betterDownloader <description> <urlArray> [targetFile]
# Example:
#   betterDownloader "download m3u8 file" "https://xxx.xx/xx.m3u8" "xxx.m3u8"
#   betterDownloader "download 1..100" "https://xxx.xx/xx-1.ts https://xxx.xx/xx-2.ts ..."
function betterDownloader() {
	local download_ok=true;
	if [[ $ENABLE_REFERER == true ]]; then
		_download with_referer "$2" "$3" || download_ok=false;

		if [[ $download_ok != true ]]; then
			isLastDownload410 && downloadFailed "$1" "Reason: link is expired!";
			if [[ -f "$DOWNLOAD_LOG" ]]; then
				# If download log was generated, but there no traces of 403. then just exit script
				isLastDownload403 || downloadFailed "$1";
			fi
			logWarn "download with 'Referer' header failed! (trying to download again without 'Referer' header)";
			ENABLE_REFERER=false;
			_download no_referer "$2" "$3" || downloadFailed "$1";
		fi
	else
		_download no_referer "$2" "$3" || downloadFailed "$1";
	fi
}
```

通过以上的下载方式，将所有的 ts 片段文件下载到一个临时的隐藏文件夹中保存，然后通过`ffmpeg`的命令去将这些 ts 文件合并成一个 mp4 文件，并且询问是否删除储存 ts 片段的临时文件夹，并且是否删除该脚本等。

所以，该脚本总的流程图大致如下所示：

```graph
graph TD;
    显示 Banner 图-->设置动态代理
    设置动态代理-->加载相关依赖
    加载相关依赖-->显示该视频的相关信息，包括视频名称和 ts 片段数量;
    显示该视频的相关信息,包括视频名称和 ts 片段数量等-->解析文件内容
    解析文件内容-->生成下载队列
    生成下载队列-->调用 aria2 下载，储存进临时文件夹
    调用 aria2 下载，储存进临时文件夹-->调用 ffmpeg 合成 mp4 视频文件
```

### Bug

然而，这个插件仍然存在不少的 bug。首先是会莫名的终止程序。尽管 aria2 是支持断点续传的，但是总是终止程序就需要我们时刻守在身边，当出现问题就重新运行脚本。通过定位位置，我更改了脚本，在出现了这个问题后，就会重新执行该脚本。结果，又出现了第二个问题：某些 ts 片段提示我们缺少`Referer`头文件，然而尽管查找了该仓库的 issue 问题，仍然无法解决这个问题。

我为此编写了一个脚本，即复制某些下载好的脚本，将其改名并复制成那些出现`Referer`问题的脚本。然而，这种「掩耳盗铃」的方式显然不是一种最佳的解决办法。

所以，这个插件的稳定性仍然有待考察。但我们的确实现了下载视频的目的。

## 脚本

尽管这个过程不太容易，但我不仅了解到了 m3u8 和 ts 这两种视频方式，aria2 这种下载工具，还编写了一些基础的脚本，为此我也对用`js`、`python`、`shell`等语言来编写脚本产生了巨大的兴趣！希望可以用`AppleScript`来实现更多提高效率的 Workflow！

在这里，我放上一些在这个下载过程中临时编写出的「救急」脚本：

**复制文件并且批量改名**的脚本`copyAndRename.sh`：

```shell
#!/bin/bash

# 要复制的文件名
cp FileName=seg-900-v1-a1.ts
# 复制的起始文件名的 index
firstNum=901
# 复制的最终文件名的 index
lastNum=968
# 中间的拼接字段
str1=seg-
# 最后的拼接字段，包括文件后缀名
str2=-v1-a1.ts

while [ $firstNum -le $lastNum ]; do
	# cp 批量复制文件并改成有顺序的文件名
	cp -vf $cpFileName $str1$firstNum$str2
	# 循环加 1，改名
	let i+=1
done
```

因为在`3.x.x`分支，除了可以下载下来一个可执行脚本之外，还可以下载下来一个`.txt`文件，其中包含了所有的下载 ts 片段的链接，所以，其实拿到这个文本，我们就可以提取出所有的 ts 片段链接进行下载。下面这个脚本`getUrlsFromFile.py`就是从 .txt 文件中提取所有的链接：

```python
#!/usr/bin/env python3

import urllib
import os
import sys

def _get_file_urls(file_url_txt):
	filepath = []
	file = open(file_url_txt, 'r')
	for line in file.readlines():
    	# strip() 用于移除字符串头尾指定的字符（只能开头或者结尾），默认删除空格或者换行符
		line = line.strip()
		filepath.append(line)

	file.close()
	return filepath

if __name__ == '__main__':
	file_url_txt = '/Users/hurley/Downloads/list-avgle-I0VmbmTHymz.txt'
	save_dir = 'save_dir/'
	filepath = _get_file_urls(file_url_txt)
	print(filepath)

```

在 Github 上查找项目解决办法的时候，我同样发现一个项目，描述的是通过复制 m3u8 的 url 链接进去，就可以自动解析进行下载，但是我并没有办法获得XX网站的 m3u8 的 url，只有之前通过插件下载得到的 m3u8 文件，那么，如何将 m3u8 文件地址转化为 url 呢？

我们可以通过该维基百科的说明来进行更改：[File_URI_scheme](https://en.wikipedia.org/wiki/File_URI_scheme)，但我们也可以通过编写脚本`path2url.js`来完成：

```js
// 前提需要安装好 node.js
// 前提需要通过以下命令安装好 file-url
// npm install --save file-url
var fileUrl = require('file-url');

console.log(fileUrl('/path/of/your/m3u8/in/your/computer.m3u8'))
```

---

:::note 🤫 New Site

后来发现了一个更好的网站，不仅支持更多的种类、搜索，也提供下载功能，下次争取编写一个脚本实现自动化！

:::