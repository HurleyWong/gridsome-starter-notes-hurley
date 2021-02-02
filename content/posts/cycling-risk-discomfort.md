---
title: 论文阅读：On Cycling Risk and Discomfort -- Urban Safety Mapping and Bike Route Recommendations
date: 2021-02-02T21:00:00+08:00
published: true
slug: cycling-risk-discomfort
tags:
- cycling
- smart cities
cover_image: "./images/cycling-risk-discomfort.png"
canonical_url: false
description: A data-driven estimation of cycling risk and discomfort to map safety in the smart cities.
---

:::note 🚴‍♂️ Abstract

This paper studies cycling risk and discomfort using a diverse spectrum of data sources about geolocated bike accidents and their severity. Empirical continuous spatial risk estimations are calculated via kernel density contours that map safety in a case study of Zurich city, including the role of weather, time, accident type and severity.

:::

## Outline

This paper is organized as follows:

* Section 1 is the introduction of the whole paper | 整篇论文的整体简要介绍
* Section 2 and 3 introduce the spatial risk and route discomfort estimation models respectively | 介绍了空间风险和路线舒适度的估计模型
* Section 4 introduces the concept of personalized route recommendations that balance safety and comfort | 介绍了关于个性化路线能够平衡安全和舒适的提议
* Section 5 illustrates the experimental methodology for the evaluation of the risk estimation model as well as a software artifact for data collection and bike route recommendations | 介绍了用于评估风险估计模型的实验方法，以及用于收集数据和建议自行车路线的软件方法
* Section 6 illustrates the findings of the performed data analysis | 说明了执行数据分析后的结果
* Section 7 concludes this paper and outlines future work | 对本文进行总结，对未来进行展望

## Introduction

前两段介绍了研究本论文的背景。目前，在智慧城市中，自行车的使用已经成为了可持续城市发展的重要因素。它提供了很多健康的生活方式，下面这两句是论文的原文，和写雅思作文差不多哦~

> Cycling provides tremendous opportunties for a more healthy lifestyle, lower energy consumption and carbon emissions as well as reduction of traffic jams.
>
> Cycling supports a more healthy lifestyle, it can decrease energy consumption and carbon emissions in urban centers, reduce traffic jams, limit the need to extensive car parking infrastructures and instead unfold opportunties for building parks, greenery and recreation areas.

但是，随着骑自行车人数的增加，出现意外事故的数量也急剧上升，这里引出了一些相关数据。那么如何解决呢？

本文介绍了一种基于数据驱动的自行车运动风险和不适感评估方法。这个估计模型是基于核密度等值线，可以对交通网路的风险进行连续性地估计。除此之外，对于事故的严重性、原因、天气、季节性等作用以及事故发生的日期和时间都进行了研究。

当然只是提出方法还不行，还要进行对比。早期，自行车安全的工作研究环境和人口因素是研究自行车安全的关键，例如年龄、性别、日光条件等。其它的一些工作，则集中在风险度量的设计。例如，有个在柏林评估的自行车路线的安全性，通过计算热点和危险路口的数量来进行核密度估计。

本文有何不一样呢？本文的主要贡献如下：

* 提出一个**连续**空间和路径舒适度的评价模型，用于绘制自行车骑行者的城市安全状况
* 实现一个平衡骑车的风险和舒适度的个性化路线推荐系统
* 设计了一种新颖的数据分析方式，用于绘制循环风险图
* 统计该智能城市（瑞士苏黎世）地区的交通意外、严重程度、成因、气候印象等数据
* 实现一个自行车路线数据的交互式收集以及个性化路线推荐的开源软件
* 将所有数据做成一个开放的数据集

## Spatial Risk Estimation Model

本节是介绍了一个通用的数据驱动模型，从而对交通运输风险进行空间上的估计。$A$ 代表的是交通事故，$T$ 代表的是使用的特定的运输方式。所以，它的条件概率密度 $A|T$ 如下所示：

$$
f_{A \mid T}(\mathbf{x})=\frac{f_{A, T}(\mathbf{x})}{f_{T}(\mathbf{x})}
$$

上述使用到的核密度估计是一个同质的，即**线性**的影响地理位置的事故数据和估计风险。除此之外，还可以通过利用其它的信息来完成。例如，对于造成死亡的交通事故，相比轻微伤害的事故而言，就要引起更高的重视。所以，我们可以创建一个子集 $A_s$ 来标记代表了事故严重性的元信息。

## Route Discomfort Estimation Model

关于路线的舒适度评估，可以通过对于街道网络的各个边缘进行重新估计来实现。具体而言，舒适度是根据自行车穿越的路线而所需的体力来决定的。例如，路线的长度和坡度。长度越长，消耗体力越多；坡度越多，消耗体力同样也越多。这时候，引入了一个 IBP 指数。它是通过分析山地中的自行车路线难度的算法来生成的。总之，舒适度最终的表达公式如下所示：

$$
f(d, x)=\left\{\begin{array}{ll}
d \cdot(2 \exp (15 x)-1) & \text { if } x \geq-0.025 \\
f(d,-0.025) & \text { otherwise }
\end{array}\right.
$$

其中，公式中的参数 $d$ 是街道或者说是路线的长度，$x$ 是平均的等级：1x1。

## Personalized Route Recommendation Based on Risk and Discomfort

关于起点和终点的个性化路线推荐，实际上与地图应用的路线推荐是一样的，只不过没有那么复杂。其原理同样是采用分配指定权重的广度优先计算（BFS）的算法来实现的。那么权重如何指定呢？这取决于自行车骑行车的风险和舒适度的组合公式：

$$
w=\alpha w_{\mathrm{r}}+(1-\alpha) w_{\mathrm{d}}
$$

## Data Science and Experimental Methodology

这一部分介绍了如何实现一个风险估计模型。当然了，论文的作者也为此实现了软件来推荐自行车路线。这个数据科学的 Pipeline 如下所示：

1. 从瑞士的 Swiss GeoAdmin API 中获得 $\left\{\mathbf{x}_{i}\right\}_{i=1, \ldots, n}=\left\{A_{s}\right\}_{s=1, \ldots, S·}$
2. 从开发街道的地图 API 提取和处理 GPS 出行的轨迹
3. 从瑞士的 Swiss GeoAdmin API 中提取和处理瑞士苏黎世的街道网络
4. 通过之前的核密度公式来估计计算 traces and labeled accidents
5. 根据方程式来计算 $\hat{f}_{A_{s} \mid T}(\mathbf{x}) \forall s$
6. application of insurance recompensation data from the Swiss Federal Office of Justice to obtain $f_R(x)$ from $\hat{f}_{A_{s}} \mid T(\mathbf{x})$
7. 将 $f_R(x)$ 插入到处理的街道网络中去

![An overview of the data science pipeline for bike riding risk assessment](https://s3.ax1x.com/2021/02/02/yuch6I.png)

### Stage 1: accident data extraction

The Swiss Confederation web portal 有一张瑞士的**交互式**地图，包含了公共可用数据的空间层。其中一个层面就包括了 2011 年至 2017 年间的涉及到自行车的交通事故，其中，日期和时间、严重性、原因和街道类型等详细信息都十分齐全。通过分析 API，它可以返回最多 200 个元素的列表，所以本研究中使用由水平和垂直区域的 bounding box。然后我们将数据提取包含 200 个或者更少的元素出来放入网格中。

### Stage 2: trip data extraction

可以从用户的 GPS 轨迹中获得 XML 格式的数据并下载下来作为样本处理。这一部分的缺陷是，可在本文范围内使用的开放数据十分有限，例如很多数据缺乏分辨率，不能用于核密度的估计。

### Stage 3: street network data extraction

所需的苏黎世街道网络是从第一阶段提到的瑞士的网站中提取出的。它是由沿着城市街道和连接这些点的街道的部分坐标（经度、纬度、高度）来存储的。经过数据提取和预处理，提取出来的数据会被建模成为一个图状的结构。每个街道网络点都会被分配一个节点。

### Stage 4-7: risk estimation

自行车事故的密度是根据每个事故的严重程度级别来计算出来的。「这部分的算法相对复杂，我还暂时没有搞明白」。

### A software artifact for personalized bike route recommendations

这个软件主要是用来实现个性化推荐路线算法的，主要是基于 Python 实现，执行 BFT 算法，匹配通过节点与节点之间的距离最小化来实现的。该软件的 GUI 界面是通过 Python 的 Python tkinter 库来实现的，带有交互式设计。它需要获取用户的输入，以生成个性化推荐路线，即重量、出发点和目的点。用户可以通过点击地图来确定这些点，同时中间点也可以确定。最终生成的个性化路线会显示出来，并且包含总风险、舒适度和途径的地点等等。

## Experimental Evaluation

### Accident analysis

关于事故分析，主要是根据获取到的数据来分析一些因素。例如，事故严重程度、天气、交叉路口、事故发生时间、发生意外的类别等。

### Bike route recommendations: safety vs. discomfort

关于推荐的自行车路线，如何看待安全性与舒适度？哪个更重要？

这其实可以取决于用户的偏好设置。例如，对于谷歌地图来说，就会尽可能地使用额外信息，例如街道的基础设施、骑行者的路线偏好以及有关安全因素的交通信号灯等各种因素。

通过分析 24 条推荐路线的风险和舒适度的改善情况，最终认为安全性和舒适性之间会有一个明确的平衡值，其最佳值大概位于 0.2~0.4之间。

## Conclusion and Future Work

本文的结论就是本文提出的基于数据驱动的方式模型来映射复杂变化的城市自行车路线和风险当然是提供了真知灼见的。本文的研究结果至少对以下方面是有一定影响的：

* 自行车骑行者的风险意识和安全改进
* 制订政策来改善交通基础设施，并且鼓励现有的城市居民或者游客等，进一步使用自行车等有利于环境的交通工具

## Reference

[1] https://link.springer.com/content/pdf/10.1007/s00607-019-00771-y.pdf