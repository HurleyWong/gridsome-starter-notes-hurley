---
title: COMP3211 Distributed Systems
date: 2020-01-15T21:00:00+08:00
published: true
slug: module-distributed-systems
tags:
- distributed systems
cover_image: "./images/module-distributed-systems.png"
canonical_url: false
description: 对「分布式系统」这门课程学习过的知识进行总结。
---

:::note 🖥 Module Introduction

A **distributed system** is:

* A collection of autonomous computing elements that appears to its users as a single coherent system.

* A system in which components located at networked computers communicate and coordinate their actions only by passing messages.

:::

## 1. Introduction to Distributed Systems

### Transparency

透明性被定义为对用户和应用程序员屏蔽分布式系统的组件的分离性，使系统被认为是一个整体，而不是独立组件的集合。

| Transparency | Description |
| ---- | ---- |
| Access | Hide differences in data representation and how an object is accessed |
| Location | Hide where an object is located |
| Migration | Hide that an object may move to another location |
| Relocation | Hide that an object may move to another location while in use |
| Replication | Hide that an object is replicated |
| Concurrency | Hide that an object may be shared by several competitive users |
| Failure | Hide the failure and recovery of an object |

* **访问透明性**是指不同数据表示形式以及资源访问方式的隐藏
* **位置透明性**是指用户无法判别资源在系统中的物理位置
* **迁移透明性**是指分布式系统中的资源移动不会影响该资源的访问方式
* **重定位透明性**是指资源可以在接受访问的同时进行重新定位
* **复制透明性**是指对同一个资源存在多个副本这个事实的隐藏
* **并发透明性**指必须确保对共享资源的并发访问不会破坏资源的一致性，让任何一个用户都不会感受到他人正在使用自己正在使用的资源
* **故障透明性**意味着用户不会注意到某个资源出现故障，无法正常工作，同时也不会注意到之后的恢复工作

### Scalability

We need to consider whether a DS scales in

* **Size**: number of users and/or processes
* **Geographically**: maximum distance between nodes
* **Administratively**: number of administrative domains

#### Scaling Techniques

* **Hiding Communication latencies**: 对于地域拓展比较适用。尽量避免等待远程服务对请求的响应（异步通信）
* **Distribution**: 分布技术把某个组件分隔成多个部分，然后再将它们分散到系统中去。例如，DNS 名字空间是由域 (domain) 组成的分层树状结构，域又被划分为互不重叠的区 (zone)
* **Replication**: Replicate components across a DS

### Centralised vs. Decentralised Systems

| Centralised | Decentralised |
| ---- | ---- |
| One component with non-autonomous parts | Multiple autonomous components |
| Component shared by users all the time | Components are not shared by all users |
| All resources accessible | Resources may not be accessible |
| Software runs in a single process | Software runs in concurrent processes on different processors |
| Single point of control | Multiple points of control |
| Single point of failure | Multiple points of failure |

## 2. Types of Distributed Systems

### High Performance Distributed Computing Systems

* started with parallel computing
* multi-processor and multi-core vs. multi-computer

#### Cluster Computing 集群计算

集群计算本质上是一组通过局域网连接的系统。计算机群组将**一组松散集成的计算机软件或者硬件连接起来，高度紧密地协作完成计算工作**。所以在某种意义上，它们可以被看做是一台计算机，集群系统中的每台计算机通常被称为是节点。

#### Grid Computing 网格计算

网格计算系统是分布式计算的一种，具有高度异构性。网格计算通过大量异构计算机的未用资源（CPU 周期和磁盘存储）等，将其作为嵌入在分布式基础设施中的一个虚拟的计算机集群，为解决大规模的计算问题提供一个模型。

Layered Grid Architecture 具有 4 层：

* **Application**: 该层负责处理对多个资源的访问，通常由资源分派、把任务分配、调度到多个资源等服务组成
  * **Collective**
  * **Resource**: 负责管理单个资源使用连接层提供的功能，直接调用光纤层可用的接口
* **Transport**
  * **Connectivity**: 由通信协议组成，用于支持网络事务处理，延伸到多个资源的使用
* **Internet**
* **Link**
  * **Fabric**: 在特定站点提供对局部资源的接口

**网格计算与集群计算的不同**：

* 网格通常比集群支持更多不同类型的计算机集合
* 网格本质上是动态的，集群包含的处理器和资源的数量通常都是静态的
* 网格是在本地网、城域网或广域网上分布的，即网格可以分布在任何地方，而集群是指物理上在一个地方，通过局域网互连
* 集群仅仅是通过增加服务器来满足增长的需求，但是这样是有限的，而网格不受规模的限制

#### Cloud Computing

> Cloud computing is an information technology infrastructure in which computing resources are virtualised and accessed as a service.

### Distributed Information Systems

* Context: Integrating applications
* Situation: organisations confronted with many networked applications, but achieving interoperability was painful.

### Distributed Pervasive Systems 分布式普适系统

#### Ubiquitous Computing Systems

* **Distribution**: Devices are networked, distributed, and accessible in a transparent manner
* **Interaction**: Interaction between users and devices is highly unobstrusive
* **Context awareness**: The system is aware of a user's context in order to optimize interaction
* **Autonomy**: Devices operate autonomously without human intervention, and are thus highly self-managed
* **Intelligence**: The system as a whole can handle a wide range of dynamic actions and interactions

#### Mobile Computing Systems

A myriad of different mobile devices(smartphones, tablets, GPS devices, remote controls). Mobile implies that a device's location is expected to change over time.

#### Sensor Networks

由成千上万个相对较小的节点组成，每个节点配备一个感应设备

## 3. Architecture

### Layered Architecture

Many client-server applications are constructed logically from **three** different layers of software:

* **Presentation layer**: contains everything required to interface with user of the system 涉及处理用户交互和修改呈现给用户的应用视图
* **Application layer**: is a processing layer, containing core functionality of the system 涉及与应用相关的详细的应用特定处理
* **Data layer**: is responsible for persistent storage of the data on which application layer operates 涉及应用的持久化存储，通常在一个数据库管理系统中

### Object-based architectures

松散的组织结构，每个对象都对应一个组件，这些组件是通过**远程调用**机制来连接的

### Resource-based architectures

| Operation | Description |
| ---- | ---- |
| **PUT** | Create a new resource |
| **GET** | Retrieve the state of a resource in some representation |
| **DELETE** | Delete a resource |
| **POST** | Modify a resource by transferring new state |

### Event-based architectures   事件驱动架构

进程发布事件，然后中间件将确保那些订阅了这些事件的进程才能接受它们（进程松散耦合）

## 4. System Architecture

### Centralised Organisations

#### Base Client-Server Model

* There are processes offering services (<font color="red">servers</font>)
* There are processes that use services (<font color="red">clients</font>)
* Clients and servers can be on different machines
* Clients follow request/reply model with respect to using services

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe6ea7fab-4714-447f-9683-1adf12653bc2%2FUntitled.png?table=block&id=46b8f5fc-3448-4fb1-81ed-229fdb3308d3&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=2320&userId=&cache=v2)

#### 2-Tiered Architecture

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ffd2f12ee-3f4e-4c3a-93fb-904db3c33993%2FUntitled.png?table=block&id=7769aec2-00fb-4c14-9f18-e818fdba95e1&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=2950&userId=&cache=v2)

#### 3-Tiered Architecture

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F97d83226-2946-453f-9041-30da4d65397e%2FUntitled.png?table=block&id=e204e07d-ff52-4b72-9874-73a6d13d3136&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3020&userId=&cache=v2)

### Decentralised Organisations

#### Structured P2P

* Processes are all equal: the functions that need to be carried out are represented by every process
* Each process will act as a client and a server at the same time

### Hybrid Architectures

Edge-server systems 就是一个典型的混合型架构。其部署在因特网中，服务器放置在网络的边界中。这条边界是由企业网络和实际的因特网之间的分界线形成的。

* End-users connect to the Internet by means of an edge server
* Edge servers serve content; a collection of edge servers can be used to optimise content and application distribution.

## 5. Communication

Interprocess communication is at the heart of all distributed systems. It is important to examine the ways that processes on different machines can exchange information.

Communication in distributed systems is always based on low level message passing as offered by the underlying network. Some widely used models for communication:

* **Remote Procedure Call (RPC)**
* **Remote Method Invocation**
* **Message Oriented Çommunication**

### Remote Procedure Call (RPC)

允许程序调用另一个地址空间的过程或函数，而不是显式编码这个远程调用的细节。

在异步 RPC 中，服务器在接收到 RPC 请求后立即向客户端送回应答，之后再调用客户端请求的过程。客户接收到服务器的确认信息之后，不会阻塞而是继续向下执行。

例如，两台服务器 A、B，一个应用部署在 A 服务器上，想要调用 B 服务器上的应用提供的函数。但是因为不在同一个内存空间，不能直接调用，需要通过网路来表达调用的语义和传递调用的数据。

那么：

* 首先，要解决通讯的问题，主要通过在客户端和服务器之间建立 TCP 连接，RPC 所有的数据交换都是在这个连接里传输的。
* 第二，解决寻址的问题。A 服务器上的应用如何告诉底层的 RPC 框架，如何连接到服务器以及特定的端口，其方法的名称又是什么。
* 当 A 服务器上的应用发起 RPC 时，方法的参数需要通过底层的网络协议如 TCP 传递到 B 服务器，由于网络协议的是基于二进制的，所以内存中的参数的值需要序列化为二进制的形式，即进行 Serialize（序列化）或者编组（marshal），通过寻址和传输的方式将序列化的二进制发送给 B 服务器。
* B服务器收到请求后，需要进行反序列化（序列化的逆操作），恢复为内存中的表达方式，然后找到对应的方法（寻址的一部分）进行本地调用，然后得到返回值。
* 返回值也是通过序列化的方式发送回 A 服务器上的应用，服务器 A 收到后，再进行反序列化，恢复为内存中的表达方式，交个 A 服务器上的应用

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fbacb5355-df5e-4a80-a2f7-3ae6e8e1d81d%2FUntitled.png?table=block&id=fc6dbe7f-60c4-4e58-939f-283bb47748bf&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=1000&userId=&cache=v2)

目前，比较流行的开源 RPC 框架有：

* Dubbo：由阿里巴巴开发并开源，仅支持 Java
* Spring Cloud：仅支持 Java 语言
* Thrift：最初由 Facebook 开发，之后贡献给 Apache，支持多种语言

---

远程方法调用 (Remote Method Invocation) 和 RPC 有着紧密的联系，只是RMI被扩展到了分布式对象的范畴。

* **RMI**：访问对象能够调用位于潜在的远程对象上的方法
* **RPC**：底层细节被隐藏了

**共同点**：

* 它们都支持接口编程
* 它们都是典型的基于请求——应答协议构造的，并能提供一系列如最少一次、最多一次的调用语义
* 提供相似程度的透明性，本地调用和远程调用，采用相同的语法

### The Message-Passing Interface (MPI)

MPI 是一个跨语言的通讯协议，用于编写并行计算机，支持**点对点**和**广播**。MPI是为了并行应用程序设计的，因而是为瞬时通信打造的，直接使用底层网络。其目标是高性能，大规模性，和可移植性。

### Message Oriented Persistent Communication: Message-Queueing Model

消息队列模型的基本思想是应用程序可以通过在特定队列中插入消息来进行通信。

AMQP 是一个提供统一消息服务的应用层标准高级消息队列协议，为面向消息的中间层设计。

## 6. Service Oriented Architectures (SOA)

SOA 是一种分布式运算的软件设计方法，软件的调用者可以通过网络上的通用协议调用另一个应用软件组件运行，让调用者获得服务。它的精髓是严格的松散耦合，不允许直接访问其它服务的数据，所有人都按照一个标准来进行通信交流。

它的优点有：

* **松耦合**：通过接口访问数据，这样就不会破坏封装性，不会让某些地方的变动影响到其它业务的执行
* **组件化**：通过形成组件库，当下载或者拉取之后，就能通过很简单的东西实现某一功能
* **可复用**：通过封装一个服务，当扩展一个功能且存在相应的接口时，直接调用即可
* **跨平台、跨语言**：服务层是可以通过任何语言来实现的，不管服务层如何实现，应用层只复杂调用接口即可

## Web Services

What are Web Services?

* Platform and implementation independent software component that can be:
  * Described using a service description language
  * Published to a registry of services
  * Discovered through a standard mechanism (at runtime or design time)
  * Invoked through a declared API, usually over a network
  * Composed with other services

最普遍的一种说法是：**Web Service = SOAP + HTTP + WSDL**。其中，SOAP 协议是 Web Service 的主体部分，它通过 HTTP 等应用层协议进行通讯，自身使用 XML 文件来描述程序的函数方法和参数信息，从而完成不同主机的异构系统间的计算服务处理。WSDL 也是一个 XML 文档，它通过 HTTP 向公众发布，公告客户端程序关于某个具体的 Web Service 服务的 URL 信息，方法的命令，参数，返回值等信息。

### SOAP: Simple Object Access Protocol

* Standardises the packaging of information for transport over HTTP, SMTP, FTP, etc.
* Supports synchronous (RPC-style) and asynchronous (document transfer) modes of communication
* Provides an interoperability abstraction of conventional RPC/RMI

对于应用程序开发来说，使程序之间进行因特网通信是很重要的。目前的应用程序可以通过 RPC 来进行通信，但是 RPC 会产生兼容性以及安全的问题，防火墙或者代理服务器通常会阻止此类流量。所以，通过 HTTP 在应用程序间通信是更好的方法，因为 HTTP 得到了所有的因特网浏览器以及服务器的支持，SOAP 就是设计出来，基于XML的简单协议，可以使应用程序在 HTTP 之上进行信息交换。

### WSDL: Web Services Description Language

WSDL 是来描述 web 服务的，描述如何访问到 web 服务，所以也可以说 WSDL 是用来描述 SOAP 的，它也是一个 XML 文件。

* Describes the <font color="red">interface</font> of a web service in a standard way, in XML
* Allows disparate clients to understand automatically how they may interact with a Web Service
* Fulfils a function comparable to that of IDL(Interface Description Language)
* Adds considerably to the complexity of Web Services

### UUDI: Universal Discovery, Description and Integration

* Organisation wishing to expose web servies creates a <font color="red">UDDI business registration</font> in XML and publishes it.
* Business registrations are held in a database, the UDDI business registry, replicated at <font color="red">UDDI operator sites.</font>

UUDI 是一个统一描述、发现和集成的，基于 XML 的跨平台的描述规范，可以使世界范围内的企业在互联网上发布自己所提供的服务。

## 7. Representational State Transfer (REST)

> REST is an architectural style for distributed hypermedia systems.

通俗的说法就是，URL 定位资源，用 HTTP 动词 (GET | POST | DELETE | PUT) 等描述操作。

SOAP and REST are essentially the same in what they do, but different in how they work. There are some differences:

| Criteria | SOAP | REST |
| ---- | ---- | ---- |
| Find target resource | Look inside envelope | URI and HTTP method |
| Caching | No | Yes |
| Semantic Web Vision | Tools must be customised on a per-application basis | Consistent with the vision, every resource has a logical URI and generic interface |

## 8. Naming

A <font color="red">naming system (service)</font> manages set of bindings between names and attributes of entities in the system.

### Distributed Hash Tables: Principle

### LDAP: Lightweight Directory Access Protocol

LDAP, implemented directly on top of TCP, provides a simple protocol for accessing services over the Internet.

* <font color="red">Directory Information Base</font>: collection of all directory entries in an LDAP service.
* Each record is uniquely named as a sequence of naming attributes (called <font color="red">Relative Distinguished Name</font>), so that it can be looked up.
* <font color="red">Directory Information Tree</font>: the naming graph of an LDAP directory service; each node represents a directory entry.

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4328e71f-2c31-470b-ab05-d0ce6d70cb60%2FUntitled.png?table=block&id=20d672d8-1d16-4157-8f84-5ecf16092ba1&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=2570&userId=&cache=v2)

## 9. Timing and Synchronisation

**The Eight Fallacies of Distributed Computing**:

1. The network is reliable
2. Latency is zero
3. Bandwidth is infinite
4. The network is secure
5. Topology doesn't change
6. There is one administrator
7. Transport cost is zero
8. The network is homogeneous
9. <font color="red">All clocks are synchronized</font>

最后一个是新增的一个悖论，所以现在也叫「九大悖论」。
### Time in a DS

Time unambiguous(but may be inaccurate) in a centralised system. In a DS, there is <font color="red">no global agreement on time</font>. So, is there any way of synchronising all the blocks in a DS? 即在缺少全局统一时间的情况下，是否有可能对分布式系统中的所有时钟进行同步？

There are two types of clock synchronisation algorithms:

* One machine with a UTC receiver:
  * Goal is to synchronise other machines with it. For example, <font color="red">Cristian's algorithm</font>
* No machines have UTC receivers:
  * Goal is simply to minimise clock skew. For example, <font color="red">Berkeley algorithm</font>

#### Cristian's Algorithm

Cristian's Algorithm 的应用场景是一个进程 P 向一个服务器 S 请求时间（**一个客户端向一个服务器请求正确的时间**）：

1. P 发送一个请求包到服务器 S 去请求时间
2. 服务器 S 收到请求包之后，在包上面再加上当前 S 的时间，发送回去
3. P 收到数据包之后，把当前的时间设置为 $T + RTT / 2$

RTT 是 Round Trip Time，即 P 从 发送到它接收到数据包的时间。


这个算法存在一个 time daemon，即时间守护程序。所以其原理就是：

* 时间守护程序向所有其他的机器询问时钟值
* 其他机器做出应答
* 时间守护程序通知每台机器如何调整时钟

#### Berkeley Algorithm

Berkeley 算法的使用场景和 Cristian 算法是有所不同的。Berkeley 算法是**几个客户端之间去同步时钟的算法，并且是主动地去询问**。

1. 时间守护程序去询问其他机器的时钟值
2. 其他机器作出应答
3. 时间守护程序告诉每台机器应该如何调整时钟

注意，Berkeley 算法并没有采用 UTC 全局时钟。

### Election Algorithms

分布式选举的算法有 Bully 算法、Raft算法、ZAB 算法等。下面主要分析 Bully 算法的原理。

#### Bully Algorithm

Bully 算法的选举原则是：**在所有存活的节点中，选取节点 ID 最大或者最小的节点作为主节点**。

它的消息类型包括：

* Election 消息，表示向节点发起要选举的消息
* Alive 消息，表示节点对 Election 消息的应答
* Victory 消息，即竞选成功的节点向普通的节点发送其竞选成功的消息

它的选举过程是这样的：

1. 集群中，每个活着的节点都查找比自己 ID 大的节点，如果不存在，那么就向其他的节点发送 Victory 的消息；
2. 如果存在比自己 ID 更大的节点，就向这些节点发送 Election 要选举的消息，并且等待响应；
3. 如果在给定的时间内，没有收到这些节点回复的消息，那么自己就暂时作为主节点，并且向比自己 ID 小的节点发送 Victory 的消息；
4. 节点如果收到比自己 ID 小的节点发来的 Election 消息，就回复 Alive 消息。

![选举过程](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0de4b1a7-2143-49f3-9b9e-47c2443aa452%2FUntitled.png?table=block&id=3c3ddc8b-8728-4609-8506-fdd8f67511a2&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=2400&userId=&cache=v2)

#### NTP: Network Time Protocol

* Enables clients across Internet to be synchronised to UTC
* Provides a reliable service that can survive losses of connectivity

The structure of NTP:

* Servers from a logical hierarchy called a <font color="red">synchronisation subnet</font>. 即时钟为第 0 层
* <font color="red">Primary servers</font>, in <font color="red">stratum 1</font>, are connected directly to a time source such as a radio clock receiving UTC. 主服务器在第 1 层
* <font color="red">Secondary servers</font>, in <font color="red">stratum 2</font>, synchronise directly with primary servers; <font color="red">stratum 3</font> servers synchronise with stratum 2 servers, etc...
* Leaf servers execute in users' workstations.

## 10. Fault Tolerance

### Terminology

| Term | Description | Example |
| ---- | ---- | ---- |
| **Failure** | A component is not living up to its specifications | Crashed program |
| **Error** | Part of a component that can lead to a failure | Programming bug |
| **Fault** | Cause of an error | Sloppy programmer |

Hence, how to handle faults?

| Term | Description | Example |
| ---- | ---- | ---- |
| **Fault prevention** | Prevent the occurrence of a fault | Don't hire sloppy programmers |
| **Fault tolerance** | Build a component such that it can mask the occurrence of a fault | Build each component by two independent programmers |
| **Fault removal** | Reduce the presence, number, or seriousness of a fault | Get rid of sloppy programmers |
| **Fault forecasting** | Estimate current presence, future incidence, and consequences of faults | Estimate how a recruiter is doing when it comes to hiring sloppy programmers |

### Failure Models

**Types of Redundancy of Failure Masking**:

| Term | Description of Server's Behaviour |
| ---- | ---- |
| **Crash failure** | Halts, but is working correctly util it halts |
| **Omission failure** | Fails to respond to incoming requests |
| **Timing failure** | Response lies outside a specified time interval |
| **Response failure** | Response is incorrect |
| **Arbitrary (or Byzantine) failure** | May produce arbitrary responses |

Question: Which failure type is worst?

### Consensus

> In fault-tolerant process group, each nonfaulty process executes the same commands, and in the same order, as every other nonfaulty process.
>
> Nonfaulty group members need to reach consensus on which command to execute next.

### The Byzantine Generals Problem

> Several divisions of the Byzantine army are camped outside an enemy city, each division commanded by its own general. The generals can communicate with one another only by messenger. After observing the enemy, they must decide upon a common plan of action.
>
> The generals must only decide whether to <font color="blue">attack</font> or <font color="blue">retreat</font>. Some generals may prefer to attack, while others prefer to retreat. The important thing is that every general agrees on a <font color="blue">common decision</font>, for a half hearted attack by a few generals would be worse than a coordinated attack or a coordinated retreat.
>
> Since it is impossible to know which generals are <font color="blue">traitors</font> trying to prevent to loyal generals from reaching agreement, the generals must have algorithm to guarantee that
>
> 1. all loyal generals decide upon the same plan of action, and
>
> 2. a small number of traitors cannot cause the loyal generals to adopt a bad plan

听起来神秘的拜占庭将军问题，实际上是在分布式系统中的一个共识问题。即，一个多主机的系统如何处理一个或者多个组件失效的问题。那么，将这个共识问题转化为将军发起进攻，就更容易理解了。

拜占庭帝国想要进攻一个城市，为此派出了 10 个将军率领 10 支军队，这个城市足以抵御 5 支常规拜占庭军队的同时袭击。这 10 支军队不能集合在一起单点突破，必须在分开的包围状态下同时攻击，至少 6 支军队同时袭击才能攻下敌国。10 支军队分散在敌国的四周，依靠通信兵相互通信来协商进攻意向及进攻时间。这里的问题是，对应于有的主机坏掉了，将军中可能会有叛徒，忠诚的将军希望达成命令的一致（比如约定某个时间一起进攻），但背叛的将军会通过发送错误的消息阻挠忠诚的将军达成命令上的一致。在这种状态下，拜占庭将军们能否找到一种分布式的协议来让他们能够远程协商，从而赢取战斗？

研究的结论是：**如果叛徒的数量大于或者等于 1/3，那么拜占庭问题就无法解决了**。

我们举一个 4 个将军的例子。4 个将军，分别是 A、B、C、D。假设 4 个将军中最多只有 1 个背叛者。如果超过一半的将军，也即 3 个将军去进攻，也能取得胜利。

1. 假设 A 将军分别告诉 B、C、D 将军，下午 1 点发起进攻。假设 B、C、D 中有一人是叛徒。那么，到了下午 1 点，将有 3 个将军发起进攻，同时他们能发现发现没有参与进攻的将军是叛徒。在这种情况中，对任务执行没有影响。

2. 假设如果 A 是背叛的，A 分别告诉 B、C、D 将军在下午 1 点、2 点、3 点发起进攻。于是，到了下午，B、C、D 三个将军分别去进攻，都失败了。这种情况下，对任务就是毁灭性的打击。

所以为了上述的 2 情况出现，对于忠诚的将军来说，它不能直接去相信接收到的命令，而是必须要对命令做出判断。

所以在 1999 年，出现了著名的 PBFT 算法（Practical Byzantine Fault Tolerance），即**实用拜占庭容错算法**。这个算法的核心思想是：对于每一个接收到命令的将军，都要去询问其他的人，它们收到的命令是什么。

所以，这样的情况下，只要叛徒数量不超过 1/3，那么，三个人就能判断出哪个究竟是叛徒。如果超过了 1/3，那么就无法判断出，拜占庭问题也就无法解决了。

#### Two Generals' Problem

这里由拜占庭问题再引出一个**两军问题**。在期末考试中的开放题型中，我们也考察过。当时就觉得这个问题非常奇怪，然而国人的固有思维还是觉得考试一般都是有解的，认为这问题是可以解决、可以实现的。然而，两军问题是第一个被证明是无解的计算机通信问题。

那么，什么是两军问题？

两个将军 A1 和 A2 决定攻打同一个敌人 B ，任一方都没有敌人强大，所以只有共同进攻才有胜算。敌军正好位于两个将军之间，意味着信使可能会被敌军抓住。两军问题指的就是在这样的条件下两个将军如何就是否进攻达成共识。

![两军问题](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F88f0146f-3370-42c6-80a4-84f507672e38%2FUntitled.png?table=block&id=a1f008b1-6a72-4203-92cb-d75731dbfc15&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5760&userId=&cache=v2)

蓝军（B）驻扎在山谷之中，红军分两部分驻扎在山谷两旁（A1, A2）。A1 和 A2 需要同时进攻才能击败蓝军。为了约定共同进攻的时间，A1 派出通信兵将攻击时间传达给 A2，但通信兵需要穿过山谷才能将攻击时间传达给 A2。而这个过程中，通信兵极有可能被蓝军截获从而导致 A2 不知道 A1 的进攻时间，于是 A1 不能确定进攻时间。

如果 A2 收到了进攻时间，为了和 A1 确定，A2 在收到 A1 的信息之后也派出通信兵将自己受到的消息传给 A1。然而，A2 的通信兵同样可能被拦截。于是 A2 也也不确定 A1 是否知道自己的进攻时间。

A1 收到 A2 的消息，可以发出第三条消息，对 A2 做确认或者发现消息被篡改。但是，这又开始新的不确定过程。从而形成了无限循环，双方始终不能对进攻时间达成一致。

这个问题其实和拜占庭将军问题的本质是不一样的。拜占庭问题描述的是**可靠信道上**的多主体共识问题，而两军问题则是**不可靠信息上**的共识问题。它有些类似于 TCP 的三次握手，然而第三次的消息是否能够成功送达同样是未知的。