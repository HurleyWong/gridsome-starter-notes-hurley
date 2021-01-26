---
title: 论文阅读：A Manifesto for Future Generation Cloud Computing--Research Directions for the Next Decade
date: 2020-04-13T21:00:00+08:00
published: true
slug: future-generation-cloud-computing
tags:
- cloud computing
- paper
cover_image: "./images/future-generation-cloud-computing.png"
canonical_url: false
description: 未来一代云计算的宣言，于 2018 年 7 月发表在 ACM Computing Surverys。
---

:::note 🍗 Main Contribution
Provide an overview of the existing solutions addressing problems related to the secure and private management of data and computations in the Cloud along with some observations on their limitations and challenges that still need to be addressed.
:::

### Abstract

> The Cloud computing paradigm has revolutionized the computer science horizon during the past decade and has enabled the emergence of computing as the fifth utility.

**它的作用**：

1. 缩短了初创企业的建立时间
2. 创建了可拓展的全球企业应用程序
3. 更好的科技和高性能计算应用程序的成本价值关联性
4. 普适性和无处不在的应用程序的直接调用/执行模型

当然，云计算也面临着一些挑战：**可伸缩性**、**弹性**、**可靠性**、**安全性**、**可持续性**和**应用模型**等问题。

<!-- more -->

### Section1: Introduction

引言部分介绍了云计算带来的好处，引出了三种主要的服务模型——**SaaS**、**PaaS**、**IaaS**。

> As can be observed from the emerging trends and proposed future research directions, there will be significant developments across all the service models (IaaS, PaaS and IaaS) of Cloud computing.

![三种主要服务模型](https://i.loli.net/2021/01/07/E3hRYwKsLtify1l.png)

#### SaaS

软件即服务，代表了云计算市场中企业最常用的选项。SaaS 利用互联网向其用户提供应用程序，这些应用程序由第三方供应商管理。大多数的 SaaS 应用程序可以直接通过 Web 服务器来运行，无需安装客户端。

SaaS 的优势是大大减少了安装、管理和升级软件等繁琐任务所花费的时间和金钱。它的特点是：

* 在统一的地方管理
* 托管在远程服务器上
* 可通过互联网访问
* 用户不负责硬件或者软件的更新

#### PaaS

平台即服务，是通过平台为软件提供云组件，这些组件则主要运用于应用程序。PaaS 为开发人员提供了一个框架，使得他们可以基于此创建自定义的应用程序。所有服务器、存储和网络都可以由企业或者第三方供应商进行管理，而开发人员可以负责应用程序的管理。

PaaS 有很多优势：

* 使应用程序的开发和部署变得简单并且经济高效
* 可扩展
* 高度可用
* 使得开发人员能够创建自定义的应用程序，而无须维护软件
* 大大地减少了代码量
* 自动化业务策略
* 允许轻松迁移到混合模型

关于 PaaS，其实就可以接近定义为云服务。它的特征包括了：

* 它基于虚拟化技术，意味着随着业务的变化，资源可以轻松扩展或者缩小
* 提供各种服务以协助开发、测试和部署应用程序
* 许多用户可以访问相同的开发应用程序

#### IaaS

基础架构即服务，由高度可扩展和自动化的计算资源组成。IaaS 是完全自助服务，用于访问和监控计算、网络、存储和其它服务等内容。它允许企业按照需求购买资源，而不必购买全部的硬件。

IaaS 通过虚拟化技术为组织提供云计算基础架构，包括服务器、网络、操作系统和存储等，但是无须对其进行物理上的维护和管理。

所以，IaaS 的优势是：

* 是最灵活的云计算模型
* 轻松实现存储、网络、服务器和处理能力的自动部署
* 可以根据消耗量购买硬件
* 使用户能够完全控制其基础架构
* 可以根据需要购买资源
* 高度可扩展

#### Motivation and Goals of the Manifesto

在云计算的发展过程中，云计算的应用越来越广泛，不仅出现的先进的新的模型，而且基于云计算范式的技术（例如**虚拟化**）也在不断进步。另一个明显的趋势就是云计算在地理上作用得越来越多。根据 IDC 的报告指出，云计算的开销一直在增长。

因此，这个 Manifesto 汇总了云计算的这些发展，并提出了实现下一代云计算需要解决的公开挑战。**首先讨论了云计算的主要挑战，研究了它们最先进的解决方案，并指出了它们的局限性，然后讨论了新兴的趋势和影响领域，进一步推动了这些云计算的挑战**。

最后介绍了本文的其余部分的主要讨论内容：

* **Section 2**: discusses the state-of-the-art of the challenges in Cloud computing and identifies open issues.
* **Section 3**: discusses the emerging trends and impact areas related to the Cloud computing horizon.
* **Section 4**: provides a detailed discussion about the future research directions to addresses the open challenges of Cloud computing and mentions how the respective future research directions will be guided and influenced by the emerging trends.
* **Section 5**: provides a conclusion for the manifesto.

### Section2: Challenges: State-of-the-Art and Open Issues

云计算面临的一些挑战，例如可持续性、可伸缩性、安全性和数据管理等。

#### Scalability and Elasticit

首先介绍了背景。很多早期的云计算都使用了几乎无限的计算资源，这样做的好处有：

1. 计算需求的意外造成的高峰不会打破 service level agreements (SLAs)，因为不断变化的计算基础设施是无法提供用户期望的服务质量的；
2. 云计算用户不需要对基础设施进行预花费，只需要为需要的资源支付费用

与可伸缩服务相关的研究挑战主要分为：**hardware** (multi-core, clusters, accelerators such as GPUs, etc.), **middleware** (programming models and abstractions), and **application levels** (new generic algorithms).

总之，云计算的**可伸缩性**受到其组件（计算、存储和互连）的可伸缩性的闲置。而在**弹性**方面遇到的挑战则是如何在不同资源分配下准确预测应用程序的计算需求和性能的能力。

#### Resource Management and Scheduling

CDCs 是一种资源管理和调度的策略，它的规模一直在增长。资源管理的策略主要有：

1. **自动调整技术**：根据当前和预测的工作负载动态调整资源
2. **资源节流方法**：用于处理工作负载突变、趋势、平滑自动调整等；
3. **接纳控制方法**：用于处理**高价值**客户的峰值负载和优先级工作负载；
4. **服务编排和工作调度**，组合和编排工作负载；
5. **多云负载平衡器**：将应用程序的负载分散到多个 CDCs；

#### Reliability

介绍了可靠性有关的威胁与故障。

#### Sustainability

可持续发展是本世纪发展最大的挑战。现在主要在研究如何降低云计算的能源数量，因为云计算在某些领域有着巨大的节能潜力。目前的云系统都主要是通过整合虚拟机，从而最小化服务器的能量消耗。除此之外，还有一些新颖的技术，例如神经网络深度学习和定量供应能源，它们都有着好处和坏处，但目的都是提供在线的具有自主意识的方法去全面地管理云系统的服务质量和能量消耗。

#### Heterogeneity

存在三个不同的具有异构性的内在异构云：

1. **VM**：以多种方式组织同类资源
2. **供应商层面**：使用了来自多个云供应商的资源，每个都有不同的管理程序和软件；
3. **硬件体系结构层**：因为使用了 CPU 和硬件加速器，例如 GPU 等

异构性造成的挑战主要在两个方面：

1. 资源与工作负载管理
2. 开发兼容异构资源的应用软件

#### Interconnected Clouds

首先介绍了 Federated Cloud computing 的作用。然后介绍了不同的 Cloud federation types，并且承认尽管 interconnection of Clouds 是云计算最早期研究的问题之一，但是 Cloud interoperation 仍然是一个没有解决的问题。

除此之外，interoperability and portability have different components in the architecture of Cloud computing and data centres.

#### Empowering Resource-Constrained Devices

云服务是与资源受限的设备及应用程序有关的。这些限制可以通过利用外部云资源来解决，这也导致了**移动云模式**的出现。

移动云在过去几年的研究主要集中在两个方面：**任务代理**和**移动代码的接入**。

最后又说明了云计算为物理网带来的好处和面临的挑战。

#### Security and Privacy

现有的解决隐私和安全的方案仍然具有一定的局限性。现有的解决方案通常是将数据存储到外部云提供之前就对其进行加密。精确的索引能够执行用户的查询，但可能会导致密钥信息的不正确暴露。另一种解决方案就是使用加密函数。

虽然上述所有的解决方案都成功地体用了对外包数据的电子客户和选择性访问，但它们也面临着利用频繁访问来侵犯数据和用户隐私的攻击。在**完整性**和**可用性**方面，都有一定的优势，也都面临着一定的问题。

#### Economics of Cloud Computing

近年来，云经济学的研究主要在这些方面：

1. 云服务的定价
2. 允许用户在预定预算范围内，动态搜索与特定功能相匹配的云服务的机制
3. 监控以确定用户需求是否得到满足

云经济学的另一个方面是了解组织如何将当前的基础设施迁移到云供应商。除此之外，许可证也是面临的另一个挑战。还有就是如何选择正确的云供应商，这些都是云经济学面临的挑战。

#### Application Development and Delivery

这里最重要的有两个特性，一个是**资源可编程性**，一个是**平台可编程性**。资源可编程性的一个关键效益是开发和操作之间的松散边界，这就会导致加速生产环境变更交付的能力。而在平台可编程性方面，关注点的分离帮助解决了云计算软件开发的复杂性和加速交付。

在资源和平台层面都面临的一个共同问题就是开发新的方法来处理云平台日益增长的异构性。

#### Data Management

云计算的一个关键卖点就是可用性、可靠性和弹性存储，这种存储与基础设施搭配在一起，就形成了一个多样化的存储服务套件，可以满足最常见的企业需求。

虽然在过年十年间，数据的可用性出现了爆炸性的增长，同时云存储和处理数据的能力也有所提高，但仍然存在着许多的挑战。例如，用于数据存储的服务没有得到用于管理元数据的服务的充分支持，而数据安全和隐私仍然是一个值得担忧的问题。除此之外，在数据中心内部，对延迟敏感的流处理和带宽敏感的批处理平台都进入了瓶颈期。所以人们也意识到，一个可以同时处理静止数据和动态数据的 lambda 架构是不可或缺的。

#### Networking

网络是将通信的所有组件连接在一起。CDCs 面临的一个主要问题就是它们的高能耗，而另一个挑战就是如何提供有保证的服务质量。除此之外，CDC 的高度虚拟化环境也是网络中一直存在的问题。

#### Usability

在可用性方面，一个显而易见的领域就是**高性能计算** (**HPC**)。而另一个相关的方向就是 **DevOps**。

### Section3: Emerging Trends and Impact Areas

随着云计算相关研究的日益成熟，它促进了一些基础技术的进步，例如 **container** 等。而容器化等的发展又导致了云计算的一些新兴趋势，如 **Fog computing**、**Serverless** 等。

#### Containers

随着 **Docker** 的诞生，容器化引起了越来越多的关注。作为一种新兴的**虚拟化**技术，容器提供了两个关键特性：首先，容器的启动速度非常快；其次，容器占用的内存很少，消耗的资源也很少。与虚拟机相比，使用容器不仅提高了应用程序的性能，而且允许主机同时支持更多的实例。

虽然容器化技术提供了许多好处，但仍然面临着很多的挑战：

1. 由于内核的共享，容器的隔离性和安全性比虚拟机要弱。当然，这可以利用新的硬件特性或者 Unikernel（一种库操作系统）来解决；
2. 如何优化容器的性能也是一个重要的问题；
3. 基于用户 QoS 需求的容器集群管理也引起了人们的广泛关注；

#### Fog Computing

Fog computing 是对传统云计算模型的拓展，它主要想实现三个方面的愿景：首先，对移动基站、网关和路由器等传输路由节点进行通用计算；其次，为传输路由节点增加计算能力；第三，将前两者结合使用。

边缘计算和雾计算通常可以互换使用，但它们也有着不同。在边缘计算中，物理网本身就具有处理能力；而在雾计算中，计算节点（如 Dockers 和 VMs）会被放置在非常靠近数据源的位置。

雾计算会提供全套的 IaaS、PaaS 和 SaaS 资源。它的优势包括跨不同计算层次的应用程序的垂直扩展。而包括智能城市和快速增长的物联网应用都是因雾计算而受益的对象。

#### Big Data

#### Serverless Computing

Serverless 是一种新兴的体系结构模式。在传统的三层云应用程序中，应用程序逻辑和数据库服务器都在云端，而在 Serverless 中，业务逻辑被移动到了客户端；在请求期间，业务逻辑可以嵌入到移动应用程序中，或者在临时提供的资源上运行。这就意味着客户机不需要租用资源，减少了开发人员需要编写的后端代码量，也减少了对云资源的管理。它主要以两种方式出现：**Backend as a Service** (**BaaS**) and **Functions as a Service** (**FaaS**)。

#### Software-defined Cloud Computing

Software-defined Cloud Computing 是一种通过将虚拟化的概念扩展到包括计算、存储和网络在内的数据中心的所有资源，从而实现信息处理和物理资源抽象的优化和自动化的方法。包括了 Software-defined networking (SDN) 和 Network functions virtualization (NFV)。

SDN是一个新兴的网络范例，它旨在克服传统网络的局限性。NFV 是网络的另外一个趋势，主要目的是传输网络功能等。

除了网络方面的挑战，SDN 和 NFV 还可以作为下一代 Clouds 的组成部分，帮助解决可持续性、相互连接的 Clouds 和安全性等方面的挑战。

#### Blockchain

云计算对区块链来说是必不可少的，因为它不仅可以容纳区块链节点，而且还可以利用这种基础设施的服务。云科技将区块链服务封装在 PaaS 和 SaaS 中，以方便其使用。

#### Machine and Deep Learning

一方面，云计算可以从机器学习和深度学习中受益，从而实现更优化的资源管理；另一方面，云计算是托管机器学习和深度学习服务的必要平台。

### Section4: Future Research Directions

本文的第二部分讨论了这 13 个面临的挑战，这一部分主要讨论这 13 个未来研究的领域。

#### Scalability and Elasticity

未来十年的可扩展性和弹性的研究可以分为**硬件、中间件和应用程序**三个层面。

在硬件层面，一个值得研究的方向是专门用于特殊功能的云。在云计算中间件层面，则需要对如何进一步提高现有基础设施的重用，提高部署速度，并为大规模部署提供硬件和网络进行研究。在云计算应用层方面，则需要进一步研究雾计算、边缘计算、InterClouds 和物联网所需的自适应弹性移动分布式应用程序编程模型。

#### Resource Management and Scheduling

雾计算提出了许多可管理性的问题，所以需要首先更好地理解现有的管理技术。在 Serverless 中，FaaS 用户希望功能能够在特定的时间内执行，并且考虑到每次访问的成本，这将需要新的方法和资源管理的度量。

#### Reliability

云计算最具挑战性的领域之一就是可靠性，因为它对服务质量以及服务供应商的长期声誉有很大的影响。这一领域的未来研究将集中在创新的云服务上，这些云服务提供可靠性和弹性，并保证服务性能，即所谓的**服务可靠性** (**RaaS**)。而应用机器学习和深度学习进行故障预测就是 RaaS 未来的发展方向之一。

可靠性方面的另一个研究方向是云存储系统。因为云存储系统的故障是不可避免的，所以提高云存储系统对大数据应用的容错能力也是一个非常重要的挑战。

#### Sustainability

为了解决可持续性问题，已经提出了一些算法，这些算法依赖于数据中心的地理分布式数据协调、资源供应以及能源意识等。当然，高性能和更多的数据处理总是伴随着更大的能源消耗。雾计算也可以大幅度地增加能源消耗，因为更小和高度多样化的系统的电子能源管理也更加复杂。总之，当前的可持续性方法主要侧重于虚拟机的整合。

#### Heterogeneity

主要有两个方面影响了异构性在云上的充分利用。第一个差距是统一管理平台与异构性之间的差距。第二个差距是抽象和异构之间的差距。

#### Interconnected Clouds

对于 Interconnected Clouds 的一个挑战是如何促进云互联，同时又不强制服务之间采用最低限度的通用功能。而另一个未来的重要的研究方向是如何使在用户级操作的中间件在没有云供应商支持的情况下识别组合的候选服务。最后，SDN 的出现有可能在云互操作的实际研究中发挥作用。

#### Empowering Resouce-Constrained Devices

为了解决资源受限设备的成本等问题，未来该领域的研究应该主要集中在移动云应用中更好的多租户模型上，以便在多个移动用户之间分担成本，因此，采用激励机制，鼓励移动用户参与并获得适当的回报。这种激励机制同样适用于物联网和雾计算。容器化也为这一个挑战带来了一些机遇。

#### Security and Privacy

在使用客户端加密保护数据时，需要可扩展的、性能良好的技术。所以考虑到数据的完整性问题，一个值得研究的方向是设计解决方案，证明数据的完整性，可能分布和存储在多个云供应商上。

因为数据的爆炸式增长及其多样性，使得扩展数据保护解决方案的设计和实施成为一个具有挑战性的问题。此外，有选择性地与不同用户共享信息的解决方案也提出了一些挑战。今后的研究也还应该着重于计算完整性的研究。

#### Economics of Cloud Computing

云计算经济学提出了几个有趣的研究方向。这其中一些商业模式包括：

1. Dynamic MDC discovery
2. Pre-agreed MDC contracts
3. MDC federation
4. MDC-Cloud data centre exchange

#### Application Development and Delivery

敏捷、持续的交付模式往往以在设计时减少对质量方面的严格把关为代价，这就有可能出现例如采用错误架构的风险。这些风险会给云应用的设计和质量带来大量的挑战。为了解决这些挑战，需要进一步研究限制因素，例如扩展 DevOps 方法和新的抽象化编程，即**开发新的架构风格和云本地设计模式**。

#### Data Management

云计算的数据管理是未来的主要研究方向。分布式数据中心的一个关键效益就是数据和计算的集中配置和管理，即规模化经济。

#### Networking

SDN 的全局网络视图、可编程性和开放性为基于 SDN 的交换工程机制在 CDC 网络内部和跨 CDC 网络的应用提供了一个很好的方向。

#### Usability

有一些方法可以提高云环境中的可用性。例如，用更好的评估工具，例如新的可视化技术就可以在云环境的不同层次上进一步探索，以更好地理解基础设施和应用行为。此外，用户仍然能够被可用于运行其应用程序的资源和服务类型重载。

#### Discussion

从以上提出的许多未来的研究方向中可以看出，云计算的所有的服务模型 (IaaS、PaaS 和 SaaS) 都会有很大的发展。

在 IaaS 中，可以使用不同的硬件，例如 GPU 和 TPU，也可以使用 HPC 和深度学习等。而 PaaS 则提出了支持可扩展弹性计算和异构资源无缝使用的编程抽象、模型等需求，从而实现能源电子化、成本最小化、可移植性更好的水平。SaaS 则应该主要关注于应用程序开发和交付的进步，以及云服务的可用性。

总之，未来的研究应该从投资回报率 (ROI) 和满 SLA 两个方面，为所有的参与者（包括供应商、用户和中介机构）探索包含不确定关系的云架构和市场模型，并提供持续的双赢的解决方案。

### Section5: Summary and Conclusions

在过去的十年里，云计算范式已经彻底改变了计算机科学，它给现代社会带来了很多的便利和好处。

然而，在下一个十年，也面临着很多新的需求。例如，从大规模的异构物联网和传感器网络产生非常大的数据流来存储、管理和分析，到能源和成本的个性化计算服务，这些服务都必须适应大量的硬件设备，同时优化多个标准。

本文汇总了目前云计算所取得的进展，并提出了在实现未来一代云计算方面仍然有很多待解决的挑战。本文还讨论了能够进一步推动云计算挑战的新兴趋势和影响领域。最后，本文为下一个十年的云计算领域提出了全面的未来的研究方向。

### Reference

[1] Buyya, Rajkumar, et al. "A manifesto for future generation cloud computing: Research directions for the next decade." *ACM computing surveys (CSUR)* 51.5 (2018): 1-38.

