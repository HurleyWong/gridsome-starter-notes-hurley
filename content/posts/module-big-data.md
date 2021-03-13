---
title: COMP5111M Big Data Systems
date: 2020-06-04T21:00:00+08:00
published: true
slug: module-big-data
tags:
- big data
cover_image: "./images/module-big-data.png"
canonical_url: false
description: 对「大数据」这门课程学习过的知识进行总结。
---

:::note 📦 Module Introduction

**Big Data** is the name of one of the largest and most profound movements in modern computing and business. It refers to the huge volumes of data being generated in modern life, and the challenges, risks, and rewards of storing and extracting meaningful information from this data.

:::

## 1. Definitions

Doug Laney first defined 3 characteristics of Big Data (Three V's) in 2001.

![Three V's](https://i.loli.net/2021/01/07/2SrqzOnRk98ZvV7.png)

* **Volume** means that many different factors can contribute to the increase in data volume.
* **Data velocity** is both the speed at which data streams in, and the timely manner in which data must be dealt with to maintain time based relevance.
* **Variety**: Data comes in all kinds of formats, but can be grouped into two types: **structured** and **unstructured**.
  * **Structured data** is the numeric data in traditional databases. Created from line-of-business and pre-formatted data collected over time.
  * **Unstructured data** is the relational and seemingly unrelated data that comes from unstructured sources (social media, text documents, etc.).

Although the three V's have traditionally been used to define Big Data, increasingly extra Vs have been proposed. However, these typically describe characteristics rather than being deinitional.

![The rest two V's](https://i.loli.net/2021/01/07/Ri5qSWl4Hd2AzYh.png)

Therefore, The Five V's:

* Volume    容量
* Velocity  速率
* Variety   多样性
* Veracity  准确性
* Value 值

## 2. MapReduce

MapReduce is

* Programming model for expressing distributed computation in massive-scale systems.
* Execution framework for organizaing and performing computation.
* Originally developed by Google.
* Open-source implementation called Hadoop.

GFS(Google File System) for Google's MapReduce, and HDFS(Hadoop Distributed File System) for Hadoop.

### Process

1. 遍历大量的记录
2. 提取感兴趣的东西
3. 随机排序和整理实时的结果
4. 将中间结果汇总为可用的内容
5. 生成最终的输出

其最重要的两个步骤就是一个是`parition`，一个是`combine`，即「分离」和「联合」。

Counting the number of occurrences of each word in a large collection of documents.

The **map** function emits each word *w* plus an associated count of occurrences.

```
map(String key, String value):
    // key: document name
    // value: document contents
    for each word w in value:
        EmitIntermediate(w, "1");
```

The **reduce** function sums together all counts emitted for a particular word.

```
reduce(String key, Iterator values):
    // key: a word
    // values: a list of counts
    int result = 0;
    for each v in values:
        result += ParseInt(v);
    Emit(AsString(result));
```

### MapReduce in Hadoop

客户端提交 MapReduce 到 Job Tracker，Job Tracker 查询 NameNode，哪些 DataNodes 有文件夹。Job Tracker 让 Task Tracker 运行在这些节点之上，代码在本地数据上执行 Map 运算。Task Tracker 启动 Map 服务，并监视进度。

Job Tracker 会始终尝试为 Map 任务选择具有本地数据的节点，NameNode 指示节点会从相关的 DataNode 复制数据。最后，Job Tracker 会执行 Reduce Task。

所以，一个完整的执行步骤就是：

$$Input \rightarrow Splitting \rightarrow Mapping \rightarrow Shuffling \rightarrow Reducing \rightarrow Final Result$$

![MapReduce 执行步骤](https://i.loli.net/2021/01/07/9janJXCMkwuEoWc.png)

## 3. Hadoop

Hadoop 的第一个核心版本就是 HDFS 和 MapReduce，HDFS 是 Hadoop 的第一层面，MapReduce 是 Hadoop 的第二层面。

### HDFS

HDFS was inspired by the GFS(Google File System), published in 2003. It has a **master / slave** architecture.

![](https://i.loli.net/2021/01/07/DvUSRMtZpfme9gQ.png)

An HDFS cluster consists of **a single NameNode**, additionally, there are a number of **DataNodes**.

也几乎是说，一个 NameNode 会有很多个 DataNode，在内部，一个文件会被分成一个或者很多个块，这些块会被存储进 DataNode 集合中。这样的好处就是，一个 DataNode 的损坏不要紧，其它的 DataNodes 仍然能够自动保存数据。

### YARN

Hadoop 2 moves from a restricted batch-oriented model to **more interactive and specialized processing models**. The biggest changes in Hadoop 2 are **HDFS Federation**, **YARN**, a highly available **NameNode**, and the concept of **Containers**.

![](https://i.loli.net/2021/01/07/YMBH4lzwkZeGyUc.png)

The fundamental idea of YARN is to **Split Hadoop resource management and job scheduling into separate processes (daemons)**.   将 Hadoop 资源管理和作业调度划分为单独的流程。

**ResourceManager** is the authority that arbitrates resources among all applications. Replaces the **JobTracker**. ResourceManger 决定哪个应用会获得下一个集群资源。

**NodeManager** is a per-machine framework responsible for **containers**, monitoring resource usage, and reporting to the **ResourceManager**. Each machine in a cluster is a NodeManager and a DataNode.

**ApplicationMaster** is tasked with negotiating resources from the **ResourceManager** and working with **NodeManagers** to execute & monitor tasks.

The ResourceManager, **NodeManager**, and **Container** are not connected about the type of task or application they are to run. Any application can run as long as an appropriate ApplicationMaster is implemented for it.

## 4. Database Intro

There are several main types that fit into 2 broad categories:

* Relational
* Non-relational

### NoSQL

NoSQL doesn't mean there is literally no SQL! For some, it means "Not Only SQL". Generally, NoSQL isn't relational, has no fixed schema, and no joins.

NoSQL databases can be categorised into four types:

* **Key-value stores**
* **Column-oriented databases**
* **Document databases**
* **Graph databases**

![NoSQL Database](https://i.loli.net/2021/01/07/2wlzIPZqc3msDOi.png)

#### Key-value Stores

K-V 键值对是 NoSQL 最简单的类型，易于实现。

It good at:

* storing session information
* user profiles
* preferences

Bad at:

* query by data
* have relationships between the data being stored
* operating on multiple keys at the same time

#### Column-oriented Databases

基于列的数据库对于大型数据库执行聚合十分有效，可以轻易地分区。

#### Document-oriented Databases

Document-oriented databases are similar to key-value, except that the key links to a document of standard format/encoding (XML, JSON, etc.)

面向文档的数据库的查询更加有效，能够直接查询和更新。

#### Graph / Tree Databases

Graph databases use a flexible graph model, which can scale across multiple machines. It consists of two elements: a **node** and a **relationship**. Each node represents an entity and each relationship represents how two entites are related.

即每个 node 都代表一个实体，而 relationship 代表两个节点之间的关系。

It good at:

Problem spaces with connected data:

* social networks
* spatial data
* routing information for goods and money
* recommedation engines

## 5. Data Warehousing

> A data warehouse is a subject-oriented, integrated, time-variant and non-volatile collection of data in support of management's decision-making process.

数据仓库，是为企业所有级别的决策制定过程提供所有类型数据支持的战略集合。

![](https://i.loli.net/2021/01/07/1hHbDMrynxTCg3w.png)

![](https://i.loli.net/2021/01/07/LIfwcQFpOh6G2n4.png)

* Subject-oriented: 着重于将资料按照其意义归类至相同的主题区
* Integrated: 资料来自于企业的各个系统，在数据仓库中是集成并且一致的
* Time-variant: 时间差异性是指资料的变动，在数据仓库中是能够被记录并且追踪变化的，有助于反应出随着时间变化的资料轨迹
* Non-volatile: 不变动性是指资料一旦确认写入后，是不会被取代或者删除的

## 6. Data Deduplication

现在流行的重复数据删除主要采用三种级别：

* File-level: 以特定文件为基础，整合数据并且删除重复（速度快，但是去重性能一般）
* Block-level: 以磁盘 block 为单位来删除整合数据（能去除更多的重复，但是 CPU、IO 操作要求高）
* Byte-level: 字节级重复数据的删除（基于字节，对 CPU 要求更高）

### Source / Target - Based Deduplication

## 7. BigTable (HBase)

Google BigTable is one of the first major NoSQL databases, published in 2006. It is designed to reliably scale to petabytes of data across thousands of machines.

In NoSQL classification, **BigTable is a column-oriented database**. It is highly distributed, has no joins available, and assumes write-once-read-many.

BigTable is a simple concept - map two arbitrary string values (a row key and a column key) together with a timestamp and place in into an associated arbitrary byte array:

```
(row:string, column:string, time:int64) -> string
```

上文翻译一下就是：BigTable 会把数据存储在若干个 Table 表中，Table 中的每个 Cell（数据单元）的格式就如上公式所示。Cell 内的数据由字符串（string）构成，使用行、列和时间戳三个维度进行定位。

具体的 BigTable 的实现原理可以参考阅读该篇论文————《[Bigtable: A Distributed Storage System for Structured Data](https://static.usenix.org/events/osdi06/tech/chang/chang_html/?em_x=22)》

![](https://i.loli.net/2021/01/07/EJYP7AzyiRkmq3I.png)

### HBase

HBase 是建立在 Hadoop 文件系统之上的分布式 column-oriented 的数据库，是建立在 HDFS 之上的。它是一个开源项目，是横向拓展的。HBase 的表一般有以下特点：

* 大：一个表可以有上亿行，上百万列
* 面向列：面向列的存储和权限控制，列独立检索
* 稀疏：对于空（null）的列，并不占用存储空间，所以表可以设计得十分稀疏

之所以将 HBase 放在 BigTable中，是因为最初 HBase 的实现是完全参考了 BigTable 的论文。它们在技术栈上的组成是类似的：

* GFS/Colossus <-> HDFS
* Chubby <-> ZooKeeper

## 8. Neo4j

> Neo4j is an ACID-compliant transactional database with native graph storage and processing.

Neo4j has Java integration through both a native API and the Cypher API. Cypher API is a Java API that allows us to execute CQL commands directly.

It is designed to find patterns, it can scans the database and quickly finds nodes and relationships that match the pattern asked for.

一个图数据库的最大不同就是它将结构化数据存储在图中而不是在表中。在这个图中，包含两种基本的数据类型：Nodes（节点）和 Relationships（关系）。Nodes 和 Relationships 包括 key/value 形式的属性，Nodes 通过 Relationships 定义的关系相连。

它的应用场景通常包括：

* 金融行业（例如洗钱网络）
* 社交网络图谱（例如追踪 COVID-19 密切接触人群）
* 企业关系图谱（例如天眼查的企业关系控股等）

## 9. Spark

MapReduce on Hadoop has a number of limitations, like difficulty and performance. The result is that MapReduce dose not compose well for large applications. This has led to the development of a very popular system that tries to combine all of this.

Apache Spark is a general-purpose data processing engine. The features of Spark: In memory computation engine, almost 10x faster than Hadoop MapReduce using computations with Disk IO, almost 100x faster than Hadoop MapReduce with in-memory computations. 总而言之就是，Spark 比 Hadoop MapReduce 快很多。

不同于 MapReduce 仅支持 Map 和 Reduce 两个编程算子，Spark 有 80 多种不同的 Transformation 和 Action 的算子，如 map、reduce、filter、foreach 等。

Spark 能够和很多开源项目框架搭配使用。例如，Spark 能够使用 Hadoop 的 YARN 和 Apache Mesos 作为它的资源管理和调度器，Spark 还可以读取多种数据源，如 HDFS、HBase、MySQL 等。

![Spark 搭配使用的框架](https://i.loli.net/2021/01/07/XCYlJNtzMe9rDTB.png)

### Spark 基本概念

* **RDD**：是**弹性分布式数据集**（Resilient Distributed Dataset）的简称，是分布式内存的一个抽象概念，提供了一种高度受限的共享内存模型。
* **DAG**：是指**有向无环图**，反应了 RDD 之间的依赖关系。
* **Driver Program**：控制程序，负责为 Application 构建 DAG 图。
* **Cluster Manager**：集群资源管理中心，负责分配计算资源。
* **Worker Node**：工作节点，负责具体的计算工作。
* **Executor**：是运行在工作节点上的一个进程，负责运行 Task，并为应用程序存储数据。
* **Application**：是用户编写的 Spark 应用程序。一个 Application 包含多个 Job。
* **Job**：作业。一个 Job 包含了多个 RDD 以及作用于相应 RDD 上的各种操作。
* **Stage**：阶段，是指 **Job 的基本调度单位**。一个作业会分为多组任务，每组任务都被称为阶段。
* **Task**：任务，是运行在 Executor 上的工作单元，是 Executor 的一个线程。

上面的有些名词可能看起来有些晕了，实际上是一种包含的关系，即：

:::important 🔍 包含关系

Application >> Job >> Stage >> Task

:::

![](https://i.loli.net/2021/03/12/T1HzeBdnNaXGA2m.jpg)

### Spark Streaming

As a traditional stream processing system(an example is Apache Storm), there are some issues:

* Failures and straggling tasks
* Load balancing
* Unification of streaming, batch and interactive workloads
* Advanced analytics

To address these issues, the Spark Streaming component uses a new architecture called discretized streams that directly leverages the libraries and fault-tolerance of the Spack engine. Instead of reading a single data record at a time, Spark Streaming receivers discretize the streaming of data into tiny, sub-second micro-batches.

Each of these batches of data is an RDD. This allows the streaming data to be processed using any Spark code or library.

![](https://i.loli.net/2021/01/07/sUWL4bY71ZwKlmG.png)

Spark Streaming 其实一个 Spark Core API 的一种扩展，它可以用于进行大规模、高吞吐量、容错的实时数据流的处理。它支持从多种数据源中读取数据，比如 Kafka、Flume等。处理后的数据可以被保存到文件系统、数据库、Dashboard 中。

Spark Streaming 的基本工作原理是：

> 接收实时输入数据里，然后将数据拆分成多个 batch，比如每收集 1 秒的数据就封装为一个 batch，然后将每个 batch 交给 Spark 的计算引擎进行处理，最后能生产出一个结果的数据流。其中的数据，也是由一个一个 batch 所组成的。

让我们来理解一下上面英文所提到的概念吧：

* **离散流（discretized stream）**或者 **DStream**：这就是我们处理的一个实时数据流（是对内部持续的实时数据流的抽象描述）。
* **批数据（batch data）**：这是将实时流数据以**时间片*为单位进行分批处理，将流处理转化为时间片数据的批处理。它的处理结果就是对饮的批数据。
* **时间片**或者**批处理时间间隔（batch interval）**：人为对流数据进行处理，以时间片作为拆分流数据的依据。一个时间片的数据对应一个 RDD 实例。
* **窗口长度（window length）**：一个窗口覆盖的流数据的时间长度，必须是批处理时间间隔的倍数。

## 10. Storm

> Apache Storm is a distributed real-time computation system for processing large volumes of high-velocity data.

It is extremely fast, and can process over one million records per second per node.

![](https://i.loli.net/2021/01/07/24Ayoh7g5HSTIP1.png)

The core abstraction in Storm is the **Stream**. A stream is data in the form of an unbounded sequence of tuples.

On a Storm cluster there are two types of nodes: a master node and workder nodes.

在 Spark Steaming 中我们提到过它的出现正是为了解决 Storm 中面临的一些问题，那么两者之间究竟有何不同呢？

|  对比点 | Storm | Spark Streaming |
|  :----:  | :----:  | :---------------: |
| 实时计算模型  | 纯实时，来一条数据处理一条 | 准实时，收集一个时间段内的数据之后再处理 |
| 实时计算延迟度  | 毫秒级 | 秒级 |
| 吞吐量 | 低 | 高 |
| 事务机制 | 支持完善 | 支持但不够完善 |
| 健壮性/容错性 | ZooKeeper，非常强 | Checkpoint，一般 |
| 动态调整并行度 | 支持 | 不支持 |

### Storm 基本组件

* **Nimbus**：就是 Storm 的 Master，负责资源分配和任务调度。一个 Storm 的集群只有一个 Master。
* **Supervisor**：即 Storm 的 Slave，负责接收 Nimbus 分配的任务，管理所有的 Worker，一个 Supervisor 节点包含了多个 Worker 进程。
* **Worker**：工作进程，每个工作进程都多个 Task。
* **Task**：指工作中的每一个任务，在 Storm 集群中的 Spout 和 Bolt 都由若干个 Task 来执行。每个 Task 都有对应的执行线程。
* **Topology**：计算拓扑，是对实时计算应用逻辑的封装。它是一个由 Soputs 和 Bolts 通过 Stream 连接起来的有向无环图。
* **Stream**：数据流是 Storm 中最核心的抽象概念。一个数据流指的是在分布式环境中并行创建、处理的一组 Tuple 的无界序列。
* **Spout**：是数据流的来源。一般 Spout 会从一个外部的数据源读取元组，然后将它们发送到拓扑中。
* **Bolt**：拓扑中所有的数据处理均是由 Bolt 完成的，是流数据的处理单元。包括数据过滤（filtering）、函数处理（functions）、聚合（aggregations）、联结（joins）等功能，Bolt 几乎可以完成任何一种数据处理需求。
* **Stream groupings**：当 Spouts 和 Bolts 在集群上执行任务时，因为是多个 Task 并行执行，那么具体该发送给哪个 Task 来执行呢？这就是由 Stream groupings 来执行的。

![Storm 架构](https://i.loli.net/2021/03/13/NwWPmoHA5VQxhiq.jpg)

## 11. ZooKeeper

> Zookeeper was originally a Hadoop sub-project but is now a full Apache project. ZooKeeper is a centralized service for distributed configuration, synchronization services, and naming registry for distributed systems. It allows distributed processes to coordinate with each other through a shared hierarchical namespace of data registers.

![ZooKeeper Logo](https://i.loli.net/2021/01/07/dAxBoaNCmUv72tF.png)

ZooKeeper 是一个针对大型应用提供高可用的数据管理、应用程序协调服务的分布式服务框架，基于对 Paxos 算法的实现，使该框架保证了分布式环境中数据的强一致性，提供的功能包括：配合维护、统一命名服务、状态同步服务、集群管理等。

ZooKeeper 是一个顺序一致性的分布式数据库，由多个节点共同组成一个分布式集群，挂掉任意一个节点，数据库仍然可以正常工作，客户端无感知故障。客户端向任意一个节点写入数据，其它节点就可以立即看到更新后的数据。

### 角色管理

在 ZooKeeper 中没有用传统的 Master/Slave 的概念，而是引入了 Leader、Follower 和 Observer 三种角色。所有机器通过选举来选定一个 Leader 的机器，Leader 可以提供读写操作，Follower 和 Observer 只能提供读的服务。Observer 相比 Follower 就是不参与 Leader 的选举过程，也不参与写操作的“过半写成功”的策略。

![](https://i.loli.net/2021/03/13/4v76cnruzymHEMk.jpg)

### 集群管理

为了保证高可用，最好以集群的形态来部署 ZooKeeper，这样只要集群中的大部分机器都是可用的（可容忍一定的机器故障），那么 ZooKeeper 本身仍然是可用的。

![](https://i.loli.net/2021/03/13/ghsIXik4HtNDBnd.jpg)

上图中的每一个 Server 都代表一个安装 ZooKeeper 服务的服务器。这些服务器会选举出一个 Leader 服务器，并且每台服务器之间都会互相保持着通信。集群间通过 Zab（ZooKeeper Atomic Broadcast） 协议来保持数据的一致性。

## 12. Kafka

> Apache Kafka is an open-source distributed event streaming platform for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.

Apache Kafka 是一个快速、可扩展的、高吞吐、可容错的**分布式发布-订阅**消息系统，具有高吞吐量、内置分区、支持数据副本和容错的特性，适合在大规模消息处理的场景中使用。它可以作为消息系统、存储系统、流处理。

在发布-订阅消息系统中，消息被持久化到一个 topic 中，消费者可以订阅一个或者多个 topic，消费者可以消费该 topic 中所有的数据，同一条数据也可以被多个消费者消费。消费的生产者被定义为发布者，消费者被定义为订阅者。

![Kafka 系统架构图](https://i.loli.net/2021/01/07/gCb5TRKqV7tEHZY.png)

:::tip 💡 Tips

由上图中的 ZooKeeper 我们可以发现，Kafka 要正常运行，必须配置 ZooKeeper，否则无论是 Kafka 集群还是客户端的生存者和消费者都是无法正常工作的。所以必须要配置启动 ZooKeeper 服务。

:::

### 核心 API

* Producer API（生产者 API）：允许应用程序发布记录流至一个或多个 Kafka 的 Topics。
* Consumer API（消费者 API）：允许应用程序订阅一个或多个 Topics，并且处理所产生的对它们记录的数据流。
* Streams API（流 API）：允许应用程序充当流处理器，从一个或者多个 Topics 消耗的输入流，并产生一个输出流至一个或多个输出的 Topics，有效地变换所述输入流，以输出流。
* Connector API（连接器 API）：允许构建和运行 Kafka Topics，连接到现有的应用程序或者数据系统中重用生产者或者消费者。

### Topics 主题和 partitions 分区

一个 Topic 可以被认为是一类信息，每个 Topic 将分成多个 partitions（区）。主题是发布记录的类别或者订阅源名称。Kafka 的主题总是多用户，一个主题可以有零个，一个或多个消费者订阅写入它的数据。

对于每个主题，Kafka 集群都维护一个如下所示的分区日志：

![](https://i.loli.net/2021/03/12/KpYV2zb16BmUCqw.jpg)

每个分区都有一个有序的、不可变的记录序列，不断地附加到结构化的提交日志中。分区中的记录每个都分配了一个称为偏移的顺序 ID 号，它是唯一地标识分区中的每个记录。

### Distribution

一个 Topic 的多个 partitions，被分布在 Kafka 集群中的多个 server 上；每个 server 负责 partitions 中消息的读写操作；每个 partitions 都会被备份到多台机器上，提高可用性。

从集群的整体考虑，有多少个 partitions 就意味着有多少个 leader。leader 负责所以的读写操作，如果 leader 失效，就会有其它的 follower 来接管成为新的 leader，所以作为 leader 的 server 承载了全部的请求压力。

### Producers 和 Consumers

Producers 可以将数据发布到指定的 topics，同时 Producer 也能决定将此消息归属到哪个 partition。

每个 consumer 属于一个 consumer group，也就是每个 consumer group 可以有多个 consumer。消息只会被订阅此 Topic 的每个 group中的一个 consumer 消费。

![](https://i.loli.net/2021/03/12/jZSCOiDqN84eHgW.jpg)