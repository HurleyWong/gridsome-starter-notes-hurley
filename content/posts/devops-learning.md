---
title: DevOps初学者的入门指南
date: 2020-12-23T21:00:00+08:00
published: true
slug: devops-learning
tags:
- DevOps
cover_image: "./images/devops-learning.png"
canonical_url: false
description: 到底什么是DevOps？流程和管理？运维和自动化？架构和服务？
---

:::note ℹ️ Introduction

随着软件发布迭代的频率越来越高，传统的「瀑布型」（开发-测试-发布）模式已经不能够满足快速交付的需求。2009年DevOps应运而生，就是更好的优化开发（DEV）、测试（QA）、运维（OPS）的流程。这样就通过开发运维一体化，通过高度自动化工具与流程来使得软件构建、测试、发布更加快捷、频繁和可靠。

:::

## 区别

### DevOps与传统的运维有什么不同？

下面我们就拿传统的瀑布式开发与DevOps进行一个对比：

|  瀑布式开发   | DevOps  |
|  ----  | ----  |
| 订购新的服务器后，开发团队需要进行测试。运维团队需要根据需求文档开始部署基础设施  | 订购新的服务器后，开发和运维团队根据需求文档共同调试部署新的服务器。这样开发人员也可以了解服务的基础机构 |
| 开发人员无法对故障转移、冗余策略、数据中心的位置和存储要求提供任何的协助  | 由于有开发人员的加入，有关故障转移、冗余策略、灾难恢复等的规划会非常的准确 |
| 运维团队对于开发团队的进展也是一无所知，只能根据运维团队的理解来指定监控的计划 | 在DevOps中，运维团队完全了解开发人员的进展。他们还可以使用应用程序性能监视的工具以优化应用 |

传统的运维人员把将近一半的时间都放在了与部署有关的工作中：

* 执行实际的部署工作
* 修复与部署工作有关的问题

为了改变这种状况，就必须实现两个关键的需求：

* 通过自动化部署将目前这种手动、人工的任务所需时间减少
* 通过产业化措施，将需要处理的这些与部署有关的问题减少

### DevOps与敏捷开发有什么不同？

|  敏捷开发   | DevOps  |
|  ----  | ----  |
| 强调的是打破开发人员和管理层之间的障碍  | DevOps主要是关于开发团队和运维团队的 |
| 解决了客户需求和开发团队之间的距离 | 解决了开发和运维团队之间的距离 |
| 敏捷开发管理“Sprint”，时间更短 | DevOps主要是争取主要版本的稳定和可靠，而不是频繁地发布新的小版本 |

DevOps就像一颗神奇的子弹，将敏捷开发扩展至了生产端。DevOps的共存实现了扩展敏捷开发实践，进一步完善软件变更在**构建**、**验证**、**部署**、**交付**等阶段中的流动。它鼓励软件开发人员和IT运维人员之间进行沟通、协作、集成和自动化。

> DevOps实际上是向着大规模敏捷（Scaling Agility）迈出的另一步！

## 优势

DevOps允许敏捷开发团队实施持续集成和持续交付。

* **可预测性**：DevOps可以显著地降低新版本的故障率
* **自愈性**：可以随时将应用回滚到较早的版本
* **可维护性**：在新版本崩溃和当前系统不可用的情况下，可以进行恢复
* **上线时间**：通过简化交付流程可以缩短上线时间
* **更高的质量**：提供开发应用程序的质量
* **降低风险**：在软件交付的生命周期中包含安全检查，有助于减少整个软件生命周期中的安全风险
* **弹性**：软件系统的运行状态更加稳定，更加安全
* **将大的代码库分隔成小块**：是基于敏捷编程方法的，所以允许将大的代码块分解为更小且易于管理的块

## 生命周期

1. **开发**：在此阶段，整个开发过程分为最小的开发周期，这有利于DevOps团队加快软件开发和交付过程。
2. **测试**：QA团队通过自动化测试工具来识别和修复新代码中的错误。
3. **集成**：在此阶段，新功能与主分支代码继承，并进行测试，只有持续集成和测试才能实现持续交付。
4. **部署**：在此阶段，部署过程持续进行，它的执行方式是任何时候在代码中进行的任何更改都不应该影响流量网站的运行。
5. **监测**：在此阶段，运维团队将负责处理不合适的系统行为或者生产中发现的错误。

![](https://i.loli.net/2021/01/07/RyhPSe7tqpr925T.png)

### CI

CI(Continuous Integration)，持续集成。即开发人员在工作时不断地集成工作分支到主分支（一天内，频繁地将代码集成到主干）。这样不仅可以提高开发效率，还可以自动测试和构建工作，快速迭代的时候还可以及时地发现错误。同时，也防止分支大幅地偏离主干。因为如果不是经常集成的话，主干又在不断地更新，那么以后集成的难度也会增大，甚至难以集成。

### CD

CD(Continuous Deployment)，持续交付。即频繁地将集成的产品交付给质量团队或者用户进行下一步的评审，通过了才会部署到生产阶段。

CD可以看成是CI的下一步。它强调的是，不管怎么更新，代码都是可以随时随地地交付的。

### Continuous Deployment

**持续交付$\neq$持续部署**。持续部署是持续交付的下一步，指的是当代码通过评审后，可以自动部署到生产环境中。

持续部署的目标是「代码在任何是时刻都是可部署的，可以进入生产阶段」。

---

CI/CD是DevOps中的核心流程，但是在团队实际运用中（比如严选团队）仍然会存在以下几个问题：

* 分支管理策略的不一致：大部分是主干发布方式，但是也会存在分支发布方式。在主干发布策略中，分支命令方式也存在差异，分支合并的策略也存在差异
* CI/CD工具的统一性：有些团队会使用比如gitlab-ci，有些则可能会使用Jenkins。gitlab-ci可以和代码工程自然结合，可以省略在Jenkins上配置，易用性好；而用Jenkins，则可以更好的管理必须的CI任务，并且可以使用到Jenkins中丰富的插件；
* 自动化测试覆盖率不足：能够真正达到比较高自动化程度的模块较少，很多情况下还是需要人工来触发，或者人工执行校验。

下面这个是严选团队的DevOps工具链建设的架构图：

![](https://i.loli.net/2021/01/07/EYyDuk1RFeBq96T.png)

## 技术栈与工具链

DevOps有很多技术栈与工具的运用，如下所示：

* 版本控制：Github | GitLab | BitBucket | Coding
* 自动化构建和测试：Apache Ant | Maven | Gradle
* 持续集成和交付：Jenkins | Fabric | Gump | TinderBox
* 容器平台：Docker | AWS | 阿里云
* 配置管理：Chef | Bash | Powershell
* 微服务平台：Kubernetes | Cloud Foundry
* 服务开通：Puppet | Powershell | OpenStack
* 日志管理：Logstash | CollectD
* 监控和警告： Nagios | Zabbix

但实际上，DevOps并不是与Chef或者Docker容器的等工具的熟练运用划等号。它的范畴远远超过Puppet或者Docker等工具。

### Jenkins

> Jenkins是一个自动化服务器，是比较成熟的CI工具能够实现自动化集成发布。在建立好流水线之后，可以无需专业运维人员介入，开发人员也可以参与部署。

**部分应用场景**：

* 集成svn/git客户端实现源代码的下载检出
* 集成maven/ant/gradle/npm等构建工具实现源代码的编译打包测试等
* 集成sonarqube对源代码进行质量检查
* 集成SaltStack/Ansible实现自动化部署发布
* 集成Jmeter/Soar/Kubernetes等
* 自定义插件或者脚本，通过Jenkins传参运行

### GitLab CI/CD

Github CI/CD是GitLab内置的强大工具，允许将所有连续方法（持续集成，交付和部署）应用于软件，而无须集成或者使用其他第三方应用程序。

![](https://i.loli.net/2021/01/07/XsBuU4qNxDWfTcj.png)

那么，一个常见的基于GitLab CI/CD的开发工作流程是这样的。开发者已经在一个问题中讨论过代码的实现，并在本地处理了提出的更改。将提交推送到GitLab远程存储库中的feature分支后，就会触发GitLab的CI/CD流水线运行。这时候会：

* 运行自动脚本
  * 构建并测试应用
  * 预览各个合并请求的更改

如果对于代码的实施感到满意，那么就会

* 让代码提交审核并等待被批准
* 将feature分支合并到default分支
  * GitLab CI/CD会自动将更改部署到生产环境中
* 最后，如果有问题，可以轻松地回滚

![](https://i.loli.net/2021/01/07/LM2jlUyk7eviTdn.png)

### Maven

> Apache Maven is a software project management and comprehension tool. Based on the concept of a project object model(POM), Maven can manage a project's build, reporting and documentation from a central piece of information.

![](https://i.loli.net/2021/01/07/NOxXEeobRzvmTdK.png)

我们在日常开发中使用到Maven最多的地方就是管理第三方库的依赖等。实际上，

* Maven是一个站点和文档工具
* Maven扩展Ant，让你下载依赖关系
* Maven是一组可重用的Ant脚本

### Gradle

Gradle是一个基于Apache Ant和Apache Maven概念的**项目自动化构建**开源工具。它使用一种基于Groovy的语言来声明项目配置，抛弃了基于XML的各种繁琐的配置，主要是面向以Java项目为主。

![](https://i.loli.net/2021/01/07/gcKUn21yZ9EvDlm.png)

* gradle对多工程的构建支持很出色
* 支持局部构建
* 支持多方式依赖管理
* 轻松迁移
* 免费开源
* 是一种以语言为导向的，而非一个严格死板的框架

### SonarQube

SonarQube empowers all developers to write cleaner and safer code.

![](https://i.loli.net/2021/01/07/g2IhUjPOKC98xzd.png)

### Chef

> Automation for Web-Scale IT. Chef delivers fast, scalable, flexible IT automation.

简单来说，Chef就是IT自动化服务器配置管理工具，它把服务器的环境（软件、依赖库、网络等）进行抽象，以特有的配置语法（Ruby语言）进行管理，可以自动地进行服务器环境的初始化操作。

![](https://i.loli.net/2021/01/07/6YuxzocPnpdwT14.png)

例如，刚入职一家新公司做开发时，首先要做的一件事就是**配置环境**，那么，如果只是每个人手动地安装，就很容易缺少了某个库或者某个包没有安装。即使有完整的文档说明描述，手动的安装也是不合理的。

环境管理可能是一个不太引起开发者重视的事情，然后如果生产环境发生了变更，开发环境却没有及时变更，就会带来不必要的麻烦了。所以环境管理和代码的版本控制其实一样重要。Chef最主要做的事情就是：

> **以自动化的方式进行服务器初始化或者变更工作**

**组件**：

Chef由三大组件组成：

* Chef Server：是核心服务器，维护了一套配置脚本（Cookbook），与每个被管节点（Chef Node）交互并且给出配置的指令。
* Chef Workstation：提供了与Chef Server交互的接口，在Workstation上创建定义Cookbook，并将Cookbook上传到Chef Server上以保证Chef Node能从Chef Server上获得最新的配置指令。
* Chef Node是安装了Chef Client并注册了的被管理的节点，可以是物理机或者虚拟机或者其它对象。Chef Node每次运行Chef Client都会从Chef Server端取得最新的配置指令（Cookbook），并按照指令配置自己。

一套环境里包含一个Chef Server，至少一个Chef Workstation，以及多个Chef Node。

### Puppet

Puppet是一个IT基础设施自动化管理工具，它能够帮助系统管理员管理基础设施的整个生命周期，包括**供应（provisioning）**、**配置（configuration）**、**联动（orchestration）**以及**报告（reporting）**。

![](https://i.loli.net/2021/01/10/ghHc6mluEAsLxSk.png)

基于Puppet，就可以实现自动化重复任务、快速部署关键性应用以及在本地或者云端完成主动管理变更和快速扩展架构规模等。

**工作模型**：

* 定义：通过puppet的声明性配置语言，定义基础设置配置的目标状态
* 模拟：强制应用改变的配置之前，先进行模拟性应用
* 强制：自动、强制部署达成目标状态，纠正任何偏离的配置
* 报告：报告当下状态以及目标状态的不同，以及达成目标状态所进行的任何强制性的改变

### Zabbix

Zabbix是一个高度集成的网络监控解决方案，基于web界面，可以提供企业级的开源分布式监控解决方案。它能监控各种网络参数，保证服务器系统的安全运营，并提供灵活的通知机制让系统管理员快速定位、解决存在的各种问题。Zabbix主要由zabbix server和zabbix agent，以及可选组建zabbix proxy。

![](https://i.loli.net/2021/01/07/qFb6JX2s735riRa.png)

**优点**：

* 开源
* Server对设备性能要求较低
* 支持设备多，自带多种监控模板
* 支持分布式集中管理，有自动发现的功能，可以实现自动化监控
* 开放式接口，扩展性强，容易编写插件
* 支持API，方便与其他系统结合

**缺点**：

需要在监控主机上安装agent，所有的数据都存储在数据库中，产生的数据源很大。

## 结论

DevOps是一次革命，主要是是为了消除拥有大规模IT部门的大型企业中，开发团队和运维团队之间由于历史原因而产生的隔阂与孤立所造成的混乱现状。

例如，开发人员会说：

> 我无法帮助你解决问题，因为在我的 Tomcat 上工作很正常，而且我完全不懂你所用的 Websphere。

运维人员则会说：

> 我们不能从生产数据库中给你提取这张表，里面包含了与客户有关的机密数据。

所以，企业通过应用DevOps原则和实践，例如自动化部署、持续交付等，都能够获益匪浅。

![](https://i.loli.net/2021/01/10/Sz5HryPIpqgTUxk.png)

