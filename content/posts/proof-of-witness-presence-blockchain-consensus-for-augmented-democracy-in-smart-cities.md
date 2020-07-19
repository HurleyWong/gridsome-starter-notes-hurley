---
title: 论文阅读：Proof of Witness Presence -- Blockchain Consensus for Augmented Democracy in Smart Cities
date: 2020-02-16T21:00:00+08:00
published: true
slug: witness-presence-blockchain-consensus
tags:
- Blockchain
- paper
cover_image: "./images/witness-presence-blockchain-consensus.png"
canonical_url: false
description: Dr. Pournaras的一篇论文，通过智慧城市中，增强民主的区块链共识来见证存在的证明。
---

:::note 📚 Background

因为参与了Dr. Evangelos Pournaras的毕设项目，选题也是跟区块链融入智慧城市有关的课题，所以有必要阅读他这篇有关区块链共识、proof of witness presence的论文。实际上，毕业设计即是他论文中的一部分。这一篇论文的标题的中文意思是**见证存在的证明：智慧城市中增强民主的区块链共识**。
:::

### Abstract

摘要部分主要介绍了本文的核心内容。

This paper introduces **a new paradigm of augmented democracy** that promises actively engaging citizens in a more informed decision-making augmented to public urban space. The **core contribution of the proposed paradigm** is **the concept of proving witness presence**. 

This paper shows:

1. how proofs of witness presence can be made using blockchain consensus to empower citizens' trust and overcome security vulnerabilities of GPS localization.
2. how complex crowd-sensing decision-making processes can be designed with the Smart Agora platform.
3. how real-time collective measurements can be performed in a fully decentralized and privacy-preserving way.

<!-- more -->

### Introduction

Introduction部分主要是介绍了智慧城市以及面临的挑战，然后应对这些挑战而引入的数字化民主范式，以及解决办法的三个支柱：

1. participatory crowd-sensing
2. proof of witness presence
3. Real-time collective measurements

这个引入的扩大民主范式与之前的相关举措有以下的不同：

1. It dose not rely on trusted third parties.
2. It addresses real-time requirements and is not limited to long-term decision-making.
3. It encourages a more informed and responsible decision-making by better integrating into the citizens' daily life and public space.

本篇论文的主要贡献在于：

* A new three-tier paradigm of augmented democracy in Smart Cities.
* The Smart Agora crowd-sensing platform for modeling complex crowd-sensing scenarios of augmented decision-making.
* The concept of 'proof of witness presence' for blockchain consensus.
* A review of  related initiatives on digital democracy as well as blockchain-based approaches for proof of location.
* The concept of encapsulation in collective measurements that filters out geolocated data and determines the point of interest from which data are aggregated.
* A first working prototype of the augmented democracy paradigm meeting minimal requirements set for a proof of concept.
* A use case scenario on cycling safety demonstrating the capactiy of citizen's witness presence to match accurate information from official public authorities. 

然后介绍了这篇论文各个部分主要是陈述了什么。

### II. THEORETICAL UNDERPINNING AND RELATED WORK

主要是找到一些理论基础，并且列举出了目前一些有关的应用或平台。例如：

* **WeCollect** is a Swiss independent non-profit platform that moderates networking of citizens.
* **Zurich Political Participation**
* **CONSUL** is an open-source citizens' participation software that supports open, transparent and democratic governance.

* **Decidim**
* **DemocracyOS**
* **Crossiety** is a startup with a mobile app implementing social networking functionality to connect local communities and villages.
* **Airesis** is an online deliberation tool that manages citizens' shared proposals and debates.
* **Deliberatorium** is designed to support crowds to deliberate and have productive discussions about complex problems.
* **Place Pulse** is a platform for mapping and measuring quantitatively urban qualities in cities as perceived by citizens.
* **CrowdWater** that is designed to collect data about the water level, soil moisture and temporary streams to predict floods and water flows.
* **Agora**
* **Follow My Vote**

### III. AUGMENTED DEMOCRACY: VISION AND CHALLENGES

这一部分提出了一个设想——古雅典Agora的数字复兴，一个公共的网络物理论述的舞台。

Individual citizens, regional communities or policy makers actively assemble, deliberate and engage in informed collective decision-making about a wide range of complex public matters.

This means that a citizen with a community mandate to participate in a collective decision-making process uses a smart phone and navigates in the urban environment to visit or discover points of interests with  augmented information.

但是如果直接使用数据密集型信息系统去实现增强民主会有几个破坏性风险：

1. Existing centrally managed online social media, along with traditional media, are often carriers of unaccountable and uncredible information that is a result of nudging and spreading of fake news.
2. The GPS, is centrally controlled, it has several security and privacy vulnerabilities, it is not accurate enough and has restricted coverage.
3. Collective measurements and awareness via Big Data analytics rely on trusted third parties that are single point of failure.

Therefore, this paper claims that in principle any digital democracy paradigm cannot remain viable in the long term unless the management of information systems is democratized.

The **positioning** of this paper is that **decentralized information systems**, particularly **distributed ledgers**, **consensus mechanisms** and **crypto-economic models**.

智慧城市的增强型民主模式由三个支柱组成：

1. Crowd-sensing is performed within participatory witness presence scenarios of augmented reality in public spaces.
2. Proof of witness presence is performed by securely verifying the location and the situation awareness of citizens without revealing privacy-sensitive information.
3. Real-time and privacy-preserving collective measurements are performed, subject of witness presence.

本篇论文的其余的部分就是分别阐述了拟议的增强民主框架中的三个支柱。

### IV. PARTICIPATORY CROWD-SENSING

通过使用获奖的Smart Agora平台，市民可以

1. visually design and crowd-source complex decision-making processes augmented in the urban environment.
2. make more informed decisions by witnessing the urban environment for which decisions are made.

然后定义了一个兴趣点的概念，在兴趣点回答问题都可以通过加密货币的方式获得奖励。其实兴趣点（point of interest）指的是：

> 电子地图上的某个地标、景点等处所。

There are a number of points of interest are determined in an interactive map.

Each point of interest hosts a number of questions that citizens can answer on their smart phone if and only if they are localized nearby the point of interest.

Each question as well as their possible answers can be incentivized with **rewards** in the form of different crypto-currencies.

一个决策过程可以设计为三种导航模式：

1. **Arbitrary**: the points of interests can be arbitrary visited by citizens. Questions are always triggered whenever citizens visit a new point of interest.
2. **Sequential**: A sequence is determined for visiting the points of interests.
3. **Interactive**: The next point of interest is determined by the answer of the citizen in the current point of interest. The latter modality can serve more complex decision-making processes as well as gamification scenarios.

### V. PROOF OF WITNESS PRESENCE

证人的存在为参与性决策提供了一个附加价值，见证智能城市的公共事件和复杂的城市环境，可以增强城市的活跃公民的能力，通过干预和证明，而不是其他人决定的现实的被动观察者，直接影响现实世界。

#### A review on proof of location

The core of witness presence lies **proof of location** that is the secure verification of a citizen's location. 

证明证人证词所需的位置证明可以通过以下一个或多个基础设施来实现：

1. GPS
2. mobile celluar network
3. low power wide area network (LPWAN)
4. peer-to-peer ad hoc (opportunistic) networks consisting of several different Internet of Things devices

**关于四者的对比**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/%E5%9B%9B%E8%80%85.png)

**GPS的好处**：

GPS is a free service with planetary converage and as such it can be easily used by the Smart Agora application for outdoor localization.

**GPS的坏处**：

GPS is a single point of failure, it is highly susceptible to fraud, spoofing, jamming and cyber-attacks, it does not provide any proof of origin or authentication and therefore it is unreliable by itself to prove claims of locations.

Moreover, GPS cannot provide indoor localization, it underperforms in high density urban environments.

**Mobile cellular network**:

A geofence can be used by a local community to self-regulate its 

1. decision-making territory. It determines the validation territory of witness presence claims.
2. crypto-economic activity resulting from the incentivized participation in decision-making. It determines the geographic areas in which transactions are permitted with collected tokens. 

But, localization via mobile cellular networks can only though take place within the covered area of the mobile operator and global converage requires special roaming service and collaboration between different mobile network operators.

**LPWAN**:

LPWAN can allow access to an unlicenced radio spectrum. LPWAN provide the following alternative trade-offs: **long range, low power operation at the expense of low data and high latency**. It is capable to engage in a Byzantine fault-tolerant clock synchronization protocol.

#### Situation awareness and proving witnessing

A few blockchain approaches combine network-based with social-based proof of location. There algorithms can validate location information based on the following three security pillars:

1. sensor fusion
2. behavior over time
3. peer-to-peer witnessing

For instance, assume a crowd-sensing collective movement for a spatio-temporal safety assessment of bike riding in a city.

从而引出了后文有关自行车道路风险的例子。

具体的验证方式还有：

Contextual QR codes, challenge questions, puzzles and CAPTCHA-like tests, whose solutions re-quire information mined at the point of interests. In addition, collaborative social challenges between citizens are means to introduce social proofs based on social psychol-ogy as well as community trust for protection against social engineering attacks. Moreover, communities can also institutionalize their own digital witnesses based on privacy-preserving forensic techniques introduced in the context of blockchain.

### VI. REAL-TIME COLLECTIVE MEASUREMENTS

Real-time collective measurements are the aggregation of citizens' crowd-sensing data.

In summary, collective measurements provide a live pulse of a crowd, whose localization at points of interest is verified for witness presence.

A possible feasible decentralized approach to realize this ambitious concept is the use of **DIAS**, the Dynamic Intelligent Aggregation Service. DIAS is a network of interconnected agents deployed in citizens' personal devices or in computational resources of regional communities around points of interest. 

DIAS聚合网络和一个兴趣点的关系可以是**一对多**和**一对一**。

**In the one-to-many encapsulation**：

Aggregation functions receive the input data of citizens, who prove witness presence in one out of several possible points of interest. A logical disjunction (OR) requires the proof of witness presence at one possible point of interest as the required condition to participate in the collective measurements. 

**In the one-to-one encapsulation**:

Aggregation functions receive citizens' input data by proving witness presence at a certain point of interest.

### VII. EVALUATION METHODOLOGY AND RESULTS

这一部分主要评估所阐述的整个增强民主范式的端到端的综合功能。这个详细的评估过程并不在本篇论文的范围和目标。但是本文仍然设计了一个简单但充实的实验性测试网方案，具有以下要求：

1. A realistic Smart City use case for participatory crowd-sensing.
2. Proof of witness presence in two points of interest based on GPS.
3. Real-time collective measurements in one-to-many encapsulation over a small crowd of test users with different realistic mobility patterns.

然后给出了这个具体的方案，即研究了苏黎世自行车安全的应用场景。

#### Experimental Testnet Scenario

The goal of the testnet scenario is to assess the preferred transport mean with which citizens visit a place they witness.

这个用例假设了一个线性模型的可持续性的六种交通工具：小车、巴士、火车、有轨电车、自行车、步行。这个线性模型规定小车的可持续性值为最小的0，步行的可持续性值为最大的5。这样设计以满足**第一个需求**。

**第二个需求**是通过在Smart Agora中为测试网场景设计决策过程来满足。The test users make a choice via a likert scale question that pops up in the Smart Agora app when they are localized at a point of interest.

为了满足**第三个需求**：each crowd-sensing asset is designed in the sequential navigational modality with two points of interest traversed in reversed order among the two groups to assess the one-to-many encapsulation of the DIAS collective measurements, i.e. choices of test users are aggregated in real-time from different remote points of interest.

具体通过了四个图片来形象地说明：

1. 市民们带着智能手机到处走动，增加了他们的兴趣点。
2. 每个利益点都有经核实的公民证明他们的证人在场。
3. 公民在一个分散的通信网络中相互连接，在这个网络上可以进行集体测量，即数据的汇总。
4. 只有在有证据证明证人在场的情况下，公民才进行集体测量。

这里注意为了限制同步效果，每个用户都有一个半径不同的定位圆：50米、100米或150米。

通过统计每个测试用户在每个兴趣点选择的交通工具，可以的得到在该地点最受欢迎的交通工具，同时得到平均可持续性。

#### Witness Presence for Cycling Safety

这一部分主要是统计了苏黎世四个经典组成的路线的骑行事故的风险，用风险值作为比较的基准。

这里用到了**皮尔逊相关系数**，即两个值序列之间的最大值为1就表示一个完美的线性关系。

最终能得出的结论是：

The high matching of the two cycling risk estimations in all presented measures suggests that the empirical evidence of cycling accidents matched well with the risk that citizens witness. Therefore, a crowd-based witness presence has a strong potential to verify the status of an urban space and as a result reason about public space more evidently.

### VIII. DISCUSSION

这一部分讨论了证明机智存在的动态共识，以及自我治理和人工智能在增强民主范式中的作用。

#### Dynamic Consensus and Self-governance

#### The role of artificial intelligence

### IX. CONCLUSION AND FUTURE WORK

This paper concludes that the proposed augmented democracy paradigm is a promising endeavor for building sustainable and participatory Smart Cities.

There are three three pillars:

* participatory and crowd-sensing
* proof of witness presence
* real-time collective measurements

This paper shows how blockchain consensus and crypto-economic design can realize such a grand vision by validating location proofs and incentivizing physical presence. 

### 个人总结

这篇论文是关于智慧城市中增强民主的区块链共识的存在证明。

最开始是介绍了智慧城市以及所面临的挑战，然后引出解决办法的三个关键因素。

为了使论证更有依据，找到了一些理论基础，列举了目前的一些有关的应用或平台；然后由此提出了一个设想——古雅典Agora的数字复兴。

然后开始主要介绍这三个支柱：

1. Participatory crowd-sensing
2. Proof of witness presence
3. Real-time collective measurements

总结来说，就是地图上有很多兴趣点，当每个公民位于兴趣点附近时，都能通过智能手机去回答问题，而回答问题后都可以通过加密货币的方式获得奖励。

为了证明公民在兴趣点附近，我们需要一些基础设施去实现位置证明，例如GPS或者mobile celluar network等。当不能使用位置证明时，就需要用到社会证明，例如一些实体能够证明公民出现在此兴趣点附近，证人也可以。除此之外，还要进行一个集体实时测量。

为了使这三个论证更有说服力，这里研究了一个苏黎世自行车安全的应用场景。通过比较可持续性值和骑行事故的风险值，得出结论是

> a crowd-based witness presence has a strong potential to verify the status of an urban space and as a result reason about public space more evidently.

最终总的得出结论以及未来的展望。

### Reference

[Proof of Witness Presence--Blockchain Consensus for Augmented Democracy in Smart Cities](https://arxiv.org/pdf/1907.00498.pdf)