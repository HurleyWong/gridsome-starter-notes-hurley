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

:::note ℹ️ Module Objectives

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

* Software as a Service(SaaS): This is an alternative to locally run applications. Software packages run remotely, e.g. Google Apps
* Platform as a Service(PaaS): This is a alternative to locally run applications. Software stack facilitating the deployment of applications, e.g. MicroSoft Azure
* Infrastructure as a Service(IaaS): Through virtualization, infrastructure providers are able to split, assign and dynamically manage service Providers, that will deploy on these systems the software stacks that run their services Virtualised resource manager.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/iaas-paas-saas-comparison-1024x759.jpg)

### Open Nebula

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/opennebula.png)

可以利用Open Nebula轻松地创建私有云、混合云和公有云。

Some features:

* Multi-site resource pooling via Cloud plugins
* Hypervisor agnostic
* Extensive adoption of cloud interfaces
* Simple user management
* Flexible modular design
* Mature

### Openstack

OpenStack是一个开源的云计算管理平台项目，是一系列开源项目的组合。OpenStack为私有云和公有云提供可拓展的弹性的云计算服务，项目目标是提供实施简单、可大规模扩展、标准统一的云计算管理平台。

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/openstack.png)

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

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/IMG_0274.jpg)

## 3. Virtualisation

> The Virtualisation layer is the middleware between the underlying hardware and virtual machines represented in the system.

### Hypervisor-based Virtualisation

Hypervisor-based virtualisation techniques can be divided into three categories:

* Full virtualisation
* Para-virtualisation
* Hardware-assisted virtualisation

#### Full Virtualisation

* 全虚拟化是硬件虚拟化的一种，允许未经过修改的guest-os隔离运行。
* 虚拟机监控程序完全模拟或者仿真基础硬件。
* 关键指令由软件使用二进制翻译来模拟。
* 会降低性能。

#### Para-Virtualisation

A portion of the virtualization management task is transferred from the hypervisor towards the Guest OS.

因此，不可虚拟化的指令会被直接与之通信的超级调用所取代。与完全虚拟机相比，减少了虚拟机管理程序的开销，但维护成本很高。

#### Hardware-assisted virtualisation

硬件辅助虚拟化，也叫加速虚拟化。

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

### Microservices Architecture

* Decomposed into small pieces  分解成小块
* Loosely coupled   松耦合
* Easy to scale development 易扩展
* Improved fault isolation  故障隔离
* Each service can be developed and deployed independently
* Eliminates any long-term commitment to a technology stack

### Docker

> Docker is an open-source project that automates the deployment of applications inside software containers, by providing an additional layer of abstraction and automation of operating system level virtualization on Linux.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/docker.jpg)

**The concepts of Docker**:

* **Docker Engine**: is the layer on which Docker runs. It is a lightweight runtime and tooling that manages containers, images, builds, ...
* **Docker Client**: what the end-user of Docker, communicates with user interface, and communicates end-user's instructions to the Docker Daemon
* **Docker Daemon**: what actually executes commands sent to the Docker Client.
  * Building, running, and distributing containers
  * Runs on the host machine
* **Docker File**: is where the end-user writes the instructions to build a Docker Image
* **Docker Images**: are read-only templates that the end-user builds from a set of instructions written in the Docker file

A Docker container wraps an application's software into an invisible box with everything the application needs to run.

## 5. Cloud Resource Management and Scheduling

There are serval policies of cloud resource management:

* **Admission control**: prevent the system from accepting workload in violation of high-level system policies
* **Capacity allocation**: allocate resources for individual activations of a service
* **Load balancing**: distribute the workload evenly among the servers
* **Energy optimization**: minimization of energy consumption
* **Quality of service(QoS) guarantees**: ability to satisfy timing or other conditions specified by a Service Level Agreement

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

具体的例子可以参考这篇之前的文章：

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

OpenStack为云计算服务，是一套IaaS软件。主要功能包括：

* 实例生命周期管理
* 计算资源管理
* 向外提供REST风格的API

### Components

OpenStack的主要组件包括：

* **nova-compute**: manages individual hypervisors and compute nodes
* **nova-scheduler**: nova-scheduler allocates virtual resources to physical hardware
* **nova-api**: supports multiple API implementations and is the entry point into the cloud
* **Neutron**: Network automates management of networks and attachments(network connectivity as a service)
* **Cinder**: manages block-based storage, enables presistent storage
* **Keystone**: Identity service offers unified, project-wide identity, token, service catalog, and policy service designed to integrate with existing systems
* **Glance**: Image service providers basic discovery, registration, and delivery services for virtual disk images
* **Horizon**: Dashboard enables administrators and users to access and provision cloud-based resources through a self-service portal（UI服务）

### AMQP：Advanced Message Queueing Protocol

AMQP provides a platform-agnostic method for ensuring information is safely transported between applications, among organizations, within mobile infrastructures, and across the Cloud.

Example of AMQP Support:

* RabbitMQ
* Qpid
* ActiveMQ

## 8. Kubernetes

> Kubernetes is a declarative language for launching containers, a highly collaborative open source project originally conceived by Google. Sometimes called k8s.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/kubernetes.png)

### Kubernetes Role

* Improves reliability
  * Continuously monitors and manages your containers
  * Will scale your application to handle changes in load
* Better user of infrastructure resources
  * Helps reduce infrastructure requirements by gracefully scaling up and down your entire platform 通过适度扩展规模来帮助整个平台降低基础架构需求
* Coordinates what containers run where and when across your system
* Easily coordinate deployments of your system

## Definitions

Kubernetes中有两个重要的概念，一个是Cluster，一个是Pod。

* Cluster: Kubernetes coordinates a highly available cluster of computers that are connected to work as a single unit. Consists of:
  * The Master coordinates the cluster
  * The Nodes are the workers that run applications
* Pod: is smallest deployable unit of compute, consists of one or more containers that are always co-located, co-scheduled & run in a shared context

Master负责调度资源和为客户端提供API，Node就是相对于Master的工作主机，可以是物理主机，也可以是虚拟机。

Master有三个组件：API Server、Scheduler、Controller Manager。

API Server提供了友好易用的API外部调用，比如用一些工具kubectl等能封装大量的API调用。当API Server收到部署的请求后，Scheduler会根据所需资源，判断各个节点资源的占用情况来分配合适的Node给容器。而Controller负责整个集群的整体协调和健康，保证每个组件以正确的方式进行。

## 9. Cloud Middleware

> What's middleware? The software layer that lies between the operating system and applications on each side of a distributed computing system in a network.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/middleware.png)

Middleware的作用：

* Middleware provides a link between separate software components often referred to as plumbing.
* Is a software layer between OS and distributed applications.
* Hides complexity and heterogeneity of a distributed system
* Bridges gap between low-level OS communications and programming language abstractions.
* Facilitate use of resource services
* Connects the application to the infrastructure

## 10. Cloud Programming Landscape

Cloud Service Construction makes abstraction of the programming language, like C, C++, Java, Python, etc.

The Message-Passing Interface(MPI) is designed for parallel applications. It makes use of underlying network, assumes that communication takes place within a known group of processes.

### Parallel Programming on Amazon Web Service(AWS)

Some Amazon Platforms and Service Offerings:

* AWS Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity, designed to make web-scale cloud computing easy for developers.
* AWS Simple Storage Service (S3) provides users with secure, durable, highly-scalable object storage. It is a simple web service interface to store and retrieve any amount of data from anywhere on the Web

## 11. Trends

### Fog Computing & Edge Computing

Many in industry use the terms fog computing and edge computing interchangeably. Both fog computing and edge computing involve pushing intelligence and processing capabilities down closer to where the data originates from pumps, motors, sensors, relays ...

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/edgefog.png)

Key difference between the two architectures is exactly where that intelligence and computing power is placed:

* Fog: pushes intelligence down to the local area network level of network architecture, processing data in a fog node or IoT gateway.
* Edge: pushes the intelligence, processing power and communication capabilities of an edge gateway or appliance directly into devices like programming automation controllers.

## 12. Serverless

Serverless computing simply means that you, the developer, do not have to deal with the server. It refers to a model where the existence of servers is simply hidden from developers.

A serverless computing platform like AWS Lambda allows you to build your code and deploy it without ever needing to configure or manage underlying servers. Your unit of deployment is your code; not the container that hosts the code, or the server that runs the code, but simply the code itself.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/serverless.png)

### Benefits

* No servers to manage
* Continuous scaling (scalability)
* Dynamic allocation of resources
* Avoid overallocation of resources
* Never pay for Idle: pay-per-usage (financial advantage)