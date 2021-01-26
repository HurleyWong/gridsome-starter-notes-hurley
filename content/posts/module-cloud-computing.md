---
title: COMP5850M Cloud Computing
date: 2020-06-06T21:00:00+08:00
published: true
slug: module-cloud-computing
tags:
- cloud computing
cover_image: "./images/module-cloud-computing.png"
canonical_url: false
description: 对「云计算」这门课程学习过的知识进行总结。
---

:::note ☁️ Module Objectives

* **Demonstrate** an understanding of cloud computing techniques and technologies;
* **Identify** the paradigms that determine the requirements, capabilities and performance of Cloud systems;
* **Design** a high-level framework of a Cloud architecture;
* **Use** a range of middleware tools to implement a cloud application;
* **Reason** about the significance of the new directions that Cloud computing is taking.

:::

## 1. Introduction to Cloud Computing: Enabling Technologies and Distributed System Models

### Distributed Computing Paradigms

* First
  * linked all machines together
  * Internet, TCP/IP
* Second
  * linked all documents together
  * WWW, HTTP, HTML, XML
* Third
  * linked all applications together
  * Web services, SOAP, WSDL, UDDI, REST
* Now
  * linking everything else together
    * Grid - decentralised infrastructures
    * Cloud - centralised infrastructures

### Taxonomy of Cloud Systems

* Software as a Service (SaaS): This is an alternative to locally run applications. Software packages run remotely, e.g. Google Apps
* Platform as a Service (PaaS): This is a alternative to locally run applications. Software stack facilitating the deployment of applications, e.g. MicroSoft Azure
* Infrastructure as a Service (IaaS): Through virtualization, infrastructure providers are able to split, assign and dynamically manage service Providers, that will deploy on these systems the software stacks that run their services Virtualised resource manager.

![](https://i.loli.net/2021/01/07/E3hRYwKsLtify1l.png)

### Open Nebula

![](https://i.loli.net/2021/01/07/WetbXC7ZUB85oz4.png)

可以利用 Open Nebula 轻松地创建私有云、混合云和公有云。

Some features:

* Multi-site resource pooling via Cloud plugins
* Hypervisor agnostic
* Extensive adoption of cloud interfaces
* Simple user management
* Flexible modular design
* Mature

### Openstack

OpenStack 是一个开源的云计算管理平台项目，是一系列开源项目的组合。OpenStack 为私有云和公有云提供可拓展的弹性的云计算服务，项目目标是提供实施简单、可大规模扩展、标准统一的云计算管理平台。

![](https://i.loli.net/2021/01/07/MQhNS8UD79HeJCG.png)

## 2. Cloud Platform Architecture over Virtualized Datacenters

### Public cloud

* Built over the Internet
* Can be accessed by any user who has paid for the service
* Owned by Service Providers
* Accessible through a subscription

### Private cloud

* Built within the domain of an intranet owned by a single organization
* Client owned and managed
* Access is limited to the owning clients and their partners
* May impact cloud standardization, while retaining greater customization and organizational control

### Hybrid cloud

* Built with both public and private clouds

  For example, IBM Research Compute Cloud(RC2) has serval features as followings:

* Private cloud built by IBM
* Interconnects the computing and IT resources at 8 IBM research centres scattered throughout the US, Europe and Asia
* A Hybrid cloud providers access to clients, the partner network, and third parties

### Data Centre Networks

**load-balancer: application-layer routing**:

* receives external client requests
* directs workload within data centre
* returns results to external client (hiding data centre internals from client)

![](https://i.loli.net/2021/01/07/AdbFw3gLhlkuxGM.png)

负载均衡是高可用网络架构的关键组件，通常用于将工作负载分布到多个服务器来提高网站应用、数据库或者其它服务的性能和可靠性。

如何理解呢？一个没有负载均衡的 web 服务架构如下所示：

![](https://i.loli.net/2021/01/07/Syb2QfHjzBai7e4.png)

我们可以看出用户是直连到 web 服务器的，所以如果服务器宕机了，那么用户也就自然无法访问了。或者如果是同时很多用户试图访问服务器，超过了其它处理的极限，就会出现加载速度变慢或者根本连接不上的情况。

那么，可以在后端引入一个「负载均衡器」和至少一个额外的 web 服务器，就可以解决这个故障。如下图所示，用户首先访问负载均衡器，再由负载均衡器将请求转发给后端的服务器。

![](https://i.loli.net/2021/01/07/G5igm94wdzDBpKt.png)

但上面这个情况还有一个缺点，如果单点故障是出现在了负载均衡器上，那么在负载均衡器这里就无法转发给 web 服务器了，所以我们仍然需要引入第二个负载均衡器来缓解。

![](https://i.loli.net/2021/01/07/Yx39AtgP4J6asCb.png)

当主负载均衡器发生了故障，就需要将用户请求转到第二个负载均衡器，因为 DNS 更改通常会较长的时间才会生效，因此需要解决 IP 地址重新映射的方法。所以，需要使用一个浮动 IP 的负载均衡架构示意图：

![](https://i.loli.net/2021/01/07/eE8jBaNVQKdoWUZ.gif)


#### 负载均衡算法

负载均衡器如何选择要转发到哪个后端服务器？负载均衡器一般根据两个因素来决定。首先，要确保所选择的服务器能够对请求做出相应，然后再根据预先配置的原则从健康服务器池 (healthy pool) 中进行选择。

负载均衡算法决定了后端的哪些健康服务器会被选中，几个常用的算法是：

* Round Robin（轮询）：为第一个请求选择列表中的第一个服务器，然后按顺序向下移动列表直到结尾，并且循环
* Least Connections（最小连接）：优先选择连接数最少的服务器，这种情况推荐在普遍会话时间较长的情况下使用
* Source：根据请求源IP的哈希值 (hash) 来选择要转发到哪个服务器，这种方式可以确保用户能够连接到相同的服务器

## 3. Virtualisation

> The Virtualisation layer is the middleware between the underlying hardware and virtual machines represented in the system.

### Hypervisor-based Virtualisation

Hypervisor-based virtualisation techniques can be divided into three categories:

* Full virtualisation
* Para-virtualisation
* Hardware-assisted virtualisation

#### Full Virtualisation

* 全虚拟化是硬件虚拟化的一种，允许未经过修改的 guest-os 隔离运行。
* 虚拟机监控程序完全模拟或者仿真基础硬件。
* 关键指令由软件使用二进制翻译来模拟。
* 会降低性能。

#### Para-Virtualisation

A portion of the virtualization management task is transferred from the hypervisor towards the Guest OS.

因此，不可虚拟化的指令会被直接与之通信的超级调用所取代。与完全虚拟机相比，减少了虚拟机管理程序的开销，但维护成本很高。

#### Hardware-assisted virtualisation

硬件辅助虚拟化，也叫加速虚拟化。

### 虚拟化技术

虚拟化技术指的是软件层面上实现的虚拟化技术，整体上分为开源虚拟化和商业虚拟化两个类。典型的代表有：Xen，KVM，WMware，Docker 容器等。

## 4. Containers

Compare to the conventional virtual machines, containers have serval advantages as below:

* Container virtualises the OS rather than the hardware
* It uses a single kernel ton run multiple instances of an operating system
  * Each instance runs in a completely isolated environment
  * Is secure
* It can offer greater efficiency and performance than a conventional hypervisor

The difference between containers and VMs:

* Containers lighter and better performance:
  * **Portability**: VMs are constraint to Hypervisor and hardware-emulation
  * **Performance**: Containers can boot and restart in seconds, compared to minutes for virtual machiens
  * **Management Cost**: Each VM requires a full functional operating system, and then extra management
* Clear advantage to use containers in:
  * DevOps
  * Batch computing
  * Microservices

传统的虚拟化技术，创建环境和部署应用都很麻烦，应用的移植性也很繁琐，例如把 VMware 里的虚拟机迁移到 KVM 里就很繁琐。它极其轻量，且是秒级部署，易于移植，一次构建，随处部署。它不再依赖于独立的操作系统运行。除此之外，容器管理平台有着非常强大的弹性管理能力。

### Microservices Architecture

微服务架构 (Microservice Architecture) 是一种架构概念，旨在通过将功能分解到各个离散的服务中以实现对解决方案的解耦。

微服务是一种架构风格，一个大型复杂软件应用由一个或者多个微服务组成。系统中的各个微服务可以被独立部署，各个微服务之间是松耦合的。

* Decomposed into small pieces  分解成小块
* Loosely coupled   松耦合
* Easy to scale development 易扩展
* Improved fault isolation  故障隔离
* Each service can be developed and deployed independently
* Eliminates any long-term commitment to a technology stack

#### 单体架构

单体应用是指将所有的业务场景的表示层、业务逻辑层和数据访问层都放在一个工作中，最终通过编译、打包、部署在一台服务器上。

![单体架构](https://i.loli.net/2021/01/07/qDz7l4UCGaMmSHh.png)

在应用的初始阶段，单体架构无论是在开发速度和运维速度上，都有着显著的优势。但是随着应用业务的发展和复杂度的提高，这种架构明显存在以下不足：

* 开发都在同一个项目改代码，相互等待，产生冲突，开发难度加大，代码的可读性、可维护性和可扩展性都下降
* 部署启动时间较长，模块间相互影响较多，测试难度也增大
* 性能容量有限，无法满足高并发下的业务需求，有性能瓶颈

#### 集群架构

随着业务的发展，大多数公司都会将单体应用进行集群部署，增加负载均衡服务器（例如 Nginx），以应对用户量的增加而带来的高并发访问量。

![集群架构](https://i.loli.net/2021/01/07/G3I7AN6X8H5gtCJ.png)

其**优化策略**为：

* **负载均衡**，通过分发服务器，将用户的访问分派到不同的应用服务器
* **添加缓存**，使用缓存服务器来缓解数据库的数据以及数据库读取数据的压力
* **读写分离**，当有大量的读写操作时，可以将数据库进行读写分离。例如 MySQL 的主从热备份，通过相关配置将主数据库的服务器同步到从数据库服务器，实现数据库的读写分离，读写分离能够改善数据库的负载能力
* **分区分库分表**，将数据量较大的表水平或者垂直切分，分散到不同的库或者主机上，分散数据库的压力，提高性能
* **应用拆分**，将较重要或者访问量较大的功能拆分出来作为新应用单独开发，通过接口调用等方式与新应用交互

然而，仍然存在一些**缺点**：

* 并发容量虽然有所提高，但是有限。随着服务拆分越来越多，开发、运维、管理难度仍然较大
* 持续交付能力较差，修改代码和添加代码的难度较大，对于新人熟悉代码的时间成本也较高
* 子应用之间的依赖仍然耦合较紧，会重复建设功能、重复代码

#### 微服务架构

![微服务架构](https://i.loli.net/2021/01/07/YXZaLGQUHmKqJ3x.png)

微服务架构的**特性**包括：

* 每个服务为独立的业务开发，单独部署
* 自动化测试、部署、运维
* 快速演化、快速迭代
* 高度容错性、高可用、高并发

微服务架构具有的**能力**有：

* **注册中心**：应用启动会自动注册
* **配置中心**：多环境配置管理，支持在线管理配置信息，支持版本管理、回滚等
* **消息中心**：服务间异步通信的总线
* **负载均衡**：服务调用服务会采用一定的分发策略
* **服务间通信**：使用 Http 或者 RPC 协议进行服务调用
* **服务降低、熔断、重试**：如果服务出现异常时，会有保底数据；若依赖服务多次失效，则断开。重试熔断后，定期探测依赖服务可用性，若恢复了再恢复调用
* **服务发布与回滚**：支持红绿部署、灰度测试、AB 测试等
* **服务伸缩性、容器化**：根据服务的负载情况，可以快速手动地或者自动地增加、减少节点
* **服务监控与警告**：服务定期健康检查
* **请求缓存与合并**：如果服务间调用相同的请求缓存，会类似请求合并成批量请求，减少服务间通信，提高性能
* **服务网关**：用户请求过载时，就会进行限流、排队，过载保护，黑白名单、异常用户拦截等操作
* **服务依赖、版本管理**：自动生成接口文档，让接口版本化管理
* **日志收集、追踪、分析**：集中收集各服务的日志汇总，方便排查故障，对应用日志进行分析等
* **性能监测 APM**：对各服务性能进行监测与分析，为服务优化提供数据支持

然而，微服务同时也存在挑战：

* 随着服务规模大，其管理难度也增大
* 服务间调用关系复杂，调用链路长，排除故障的难度较大
* 服务间通信成本变高
* 依赖较多，系统集成的难度变大
* 大规模分布式，使得数据一致性有挑战
* 对基础架构要求大大提高

### Docker

> Docker is an open-source project that automates the deployment of applications inside software containers, by providing an additional layer of abstraction and automation of operating system level virtualization on Linux.

![](https://i.loli.net/2021/01/07/9dCsO4A3KhQcuHq.png)

**The concepts of Docker**:

* **Docker Engine**: is the layer on which Docker runs. It is a lightweight runtime and tooling that manages containers, images, builds, ...
* **Docker Client**: what the end-user of Docker, communicates with user interface, and communicates end-user's instructions to the Docker Daemon
* **Docker Daemon**: what actually executes commands sent to the Docker Client.
  * Building, running, and distributing containers
  * Runs on the host machine
* **Dockerfile**: is where the end-user writes the instructions to build a Docker Image
* **Docker Images**: are read-only templates that the end-user builds from a set of instructions written in the Dockerfile

A Docker container wraps an application's software into an invisible box with everything the application needs to run.

## 5. Cloud Resource Management and Scheduling

There are serval policies of cloud resource management:

* **Admission control**: prevent the system from accepting workload in violation of high-level system policies
* **Capacity allocation**: allocate resources for individual activations of a service
* **Load balancing**: distribute the workload evenly among the servers
* **Energy optimization**: minimization of energy consumption
* **Quality of service (QoS) guarantees**: ability to satisfy timing or other conditions specified by a Service Level Agreement

### VM Migration

* Transfer executing VMs between physical hosts without disconnecting the client or application
* Memory, storage and network connectivity of the VM are transferred from the original host to the destination
* Key operation in cloud resource provisioning

There are some problems that should be considering:

* **When** to migrate VMs?
  * Host overload detection algorithms
  * Host underload detection algorithms
* **Which** VMs to migrate?
  * VM selection algorithm
* **Where** to migrate VMs?
  * VM placement algorithms

具体的例子可以参考这篇之前的文章：[OpenNebula and Java OpenNebula Cloud API (OCA)](https://tech.hurley.fun/2020/03/opennebula-and-oca/)

## 6. OpenNebula

What is OpenNebula? It is an open-source toolkit to build IaaS Cloud.

### Benefits

* For the Infrastructure **Manager**
  * Centralized management of VM workload and distributed infrastructures
  * Support for VM placement policies: balance of workload, server consolidation
  * Dynamic resizing of the infrastructure
  * Dynamic partition and isolation of clusters
  * Dynamic scaling of private infrastructure to meet fluctuating demands
  * Lower infrastructure expenses combining local and remote Cloud resources
* For the Infrastructure **User**
  * Faster delivery and scalability of services
  * Support for heterogeneous execution environments
  * Full control of the lifecycle of virtualized services management
* Supports interoperability from the perspective of
  * the cloud consumer
  * the cloud provider

## 7. OpenStack

OpenStack 为云计算服务，是一套 IaaS 软件。主要功能包括：

* 实例生命周期管理
* 计算资源管理
* 向外提供 REST 风格的 API

### Components

OpenStack 的组件非常多：

| 组件名称 | 服务类型 |
| ---- | ---- |
| Horizon | Dashborad，web 前端服务 |
| Nova | Compute，计算服务 |
| Neutron | Networking，网络服务 |
| Swift | Object Storage，对象存储服务 |
| Cinder | Block Storage，块存储服务 |
| Keystone | Identity Service，认证服务 |
| Glance | Image Service，镜像服务 |
| Ceilometer | Telemetry，监控服务 |
| Heat | Orchestration，集群服务 |
| Trove | Database Service，数据库服务 |

主要组件包括：

* **nova-compute**: manages individual hypervisors and compute nodes
* **nova-scheduler**: nova-scheduler allocates virtual resources to physical hardware
* **nova-api**: supports multiple API implementations and is the entry point into the cloud
* **Neutron**: Network automates management of networks and attachments(network connectivity as a service)
* **Cinder**: manages block-based storage, enables presistent storage
* **Keystone**: Identity service offers unified, project-wide identity, token, service catalog, and policy service designed to integrate with existing systems
* **Glance**: Image service providers basic discovery, registration, and delivery services for virtual disk images
* **Horizon**: Dashboard enables administrators and users to access and provision cloud-based resources through a self-service portal (UI 服务)

### AMQP：Advanced Message Queueing Protocol

AMQP provides a platform-agnostic method for ensuring information is safely transported between applications, among organizations, within mobile infrastructures, and across the Cloud.

Example of AMQP Support:

* RabbitMQ
* Qpid
* ActiveMQ

## 8. Kubernetes

> Kubernetes is a declarative language for launching containers, a highly collaborative open source project originally conceived by Google. Sometimes called k8s.

![](https://i.loli.net/2021/01/07/oTBOcm9EsrMheUg.png)

当容器实例越来越多的时候，容器管理对于我们来说是灾难的，这时候就需要 Kubernetes 登场了！它是一款优秀的开源容器管理软件，能够帮助我们对容器进行部署发布编排等一系列操作。

### Kubernetes Role

* Improves reliability
  * Continuously monitors and manages your containers
  * Will scale your application to handle changes in load
* Better user of infrastructure resources
  * Helps reduce infrastructure requirements by gracefully scaling up and down your entire platform 通过适度扩展规模来帮助整个平台降低基础架构需求
* Coordinates what containers run where and when across your system
* Easily coordinate deployments of your system

## Definitions

Kubernetes 中有两个重要的概念，一个是 Cluster，一个是 Pod。

* Cluster: Kubernetes coordinates a highly available cluster of computers that are connected to work as a single unit. Consists of:
  * The Master coordinates the cluster
  * The Nodes are the workers that run applications
* Pod: is smallest deployable unit of compute, consists of one or more containers that are always co-located, co-scheduled & run in a shared context

Master 负责调度资源和为客户端提供 API，Node 就是相对于 Master 的工作主机，可以是物理主机，也可以是虚拟机。

Master 有三个组件：API Server、Scheduler、Controller Manager。

API Server 提供了友好易用的 API 外部调用，比如用一些工具 kubectl 等能封装大量的API调用。当 API Server 收到部署的请求后，Scheduler 会根据所需资源，判断各个节点资源的占用情况来分配合适的 Node 给容器。而 Controller 负责整个集群的整体协调和健康，保证每个组件以正确的方式进行。

## 9. Cloud Middleware

> What's middleware? The software layer that lies between the operating system and applications on each side of a distributed computing system in a network.

![中间件](https://i.loli.net/2021/01/07/Fwg78CNjEuchsGa.png)

Middleware 的作用：

* Middleware provides a link between separate software components often referred to as plumbing.
* Is a software layer between OS and distributed applications.
* Hides complexity and heterogeneity of a distributed system
* Bridges gap between low-level OS communications and programming language abstractions.
* Facilitate use of resource services
* Connects the application to the infrastructure

常用的中间件服务器就有 Tomcat、WebLogic、jboss 等。

## 10. Cloud Programming Landscape

Cloud Service Construction makes abstraction of the programming language, like C, C++, Java, Python, etc.

The Message-Passing Interface (MPI) is designed for parallel applications. It makes use of underlying network, assumes that communication takes place within a known group of processes.

### Parallel Programming on Amazon Web Service(AWS)

Some Amazon Platforms and Service Offerings:

* AWS Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity, designed to make web-scale cloud computing easy for developers.
* AWS Simple Storage Service (S3) provides users with secure, durable, highly-scalable object storage. It is a simple web service interface to store and retrieve any amount of data from anywhere on the Web.

## 11. Trends

Many in industry use the terms fog computing and edge computing interchangeably. Both fog computing and edge computing involve pushing intelligence and processing capabilities down closer to where the data originates from pumps, motors, sensors, relays ...

![](https://i.loli.net/2021/01/07/5znSY6VMrONGJpc.png)

Key difference between the two architectures is exactly where that intelligence and computing power is placed:

* **Fog**: pushes intelligence down to the local area network level of network architecture, processing data in a fog node or IoT gateway.
* **Edge**: pushes the intelligence, processing power and communication capabilities of an edge gateway or appliance directly into devices like programming automation controllers.

### Fog computing

因为将数据从云端导入和导出实际上比人们想象的更为复杂，由于接入设备越来越多，在传输数据、获取信息时，带宽就不够用了，所以这时候雾计算就比云计算提供了更多的作用。

雾计算并非是些性能强大的服务器，而是由性能较弱、更为分散的各种功能的计算机组成的，渗入到平时生活中的各种物品。雾计算是介于云计算和个人计算之间的，是半虚拟化的服务计算架构模型，强调数量，并不在乎单个节点微弱的性能。

雾计算的实现是使用雾计算软件、软件包计算程序或者其它的工具在网络边缘为雾节点编写或者移植 IoT 程序。靠近边缘的节点或者边缘设备本身会接收数据，然后将它们接收的任何数据定向到最佳的位置进行分析。

与云计算相比，雾计算所采用的架构更呈分布式，更接近网络边缘。**雾计算将数据、数据处理和应用程序集中在网络边缘的设备中，而不像云计算几乎是全部保存在云中**。数据的存储及处理更依赖本地设备，而非云端的服务器。所以，云计算是新一代的**集中式计算**，而雾计算是新一代的**分布式计算**，符合互联网目前的「去中心化」特征。

除此之外，还有一个「霾计算」。霾计算可以理解是比较垃圾的云计算或者雾计算。因为云计算或者雾计算都有一些缺点。

1. 隐私数据很容易泄漏
2. 网络延迟或者中断。如果网络中断了，无论是雾计算还是云计算，服务都无法访问。
3. 带宽会耗费运算

### Edge computing

边缘计算是指在靠近物体或者数据源头的网络边缘侧，融合网络、计算、存储、应用核心能力的开放平台，就近提供边缘智能服务。从这里看，边缘计算似乎和雾计算有些类似。

它们两者之间的区别在于，**雾计算更具有层次性和平坦的架构，其中几个层次之间就会形成网络，而边缘计算是依赖于不构成网络的单独节点。雾计算在节点之间更具有广泛的对等互连的能力，而边缘计算是在“孤岛”中运行其节点**。

边缘计算和云计算之间的区别则在于数据不用再上传到遥远的云端，在边缘侧就可以解决，能更实时地数据分析和智能化处理，更加高效和安全。

## 12. Serverless

Serverless computing simply means that you, the developer, do not have to deal with the server. It refers to a model where the existence of servers is simply hidden from developers.

A serverless computing platform like AWS Lambda allows you to build your code and deploy it without ever needing to configure or manage underlying servers. Your unit of deployment is your code; not the container that hosts the code, or the server that runs the code, but simply the code itself.

![](https://i.loli.net/2021/01/07/nTehWr91tQ6HNaE.png)

### Benefits

* No servers to manage
* Continuous scaling (scalability)
* Dynamic allocation of resources
* Avoid overallocation of resources
* Never pay for Idle: pay-per-usage (financial advantage)