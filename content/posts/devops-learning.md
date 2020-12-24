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

### DevOps与敏捷开发有什么不同？

|  敏捷开发   | DevOps  |
|  ----  | ----  |
| 强调的是打破开发人员和管理层之间的障碍  | DevOps主要是关于开发团队和运维团队的 |
| 解决了客户需求和开发团队之间的距离 | 解决了开发和运维团队之间的距离 |
| 敏捷开发管理“Sprint”，时间更短 | DevOps主要是争取主要版本的稳定和可靠，而不是频繁地发布新的小版本 |

## 优势

DevOps允许敏捷开发团队实施持续集成和持续交付。

* 可预测性：DevOps可以显著地降低新版本的故障率
* 自愈性：可以随时将应用回滚到较早的版本
* 可维护性：在新版本崩溃和当前系统不可用的情况下，可以进行恢复
* 上线时间：通过简化交付流程可以缩短上线时间
* 更高的质量：提供开发应用程序的质量
* 降低风险：在软件交付的生命周期中包含安全检查，有助于减少整个软件生命周期中的安全风险
* 弹性：软件系统的运行状态更加稳定，更加安全
* 将大的代码库分隔成小块：是基于敏捷编程方法的，所以允许将大的代码块分解为更小且易于管理的块

## 生命周期

1. 开发：在此阶段，整个开发过程分为最小的开发周期，这有利于DevOps团队加快软件开发和交付过程。
2. 测试：QA团队通过自动化测试工具来识别和修复新代码中的错误。
3. 集成：在此阶段，新功能与主分支代码继承，并进行测试，只有持续集成和测试才能实现持续交付。
4. 部署：在此阶段，部署过程持续进行，它的执行方式是任何时候在代码中进行的任何更改都不应该影响流量网站的运行。
5. 监测：在此阶段，运维团队将负责处理不合适的系统行为或者生产中发现的错误。

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/devops.png)

### CI

CI(Continuous Integration)，持续集成。即开发人员在工作时不断地集成工作分支到主分支。这样不仅可以提高开发效率，还可以自动测试和构建工作，快速迭代的时候还可以及时地发现错误。

### CD

CD(Continuous Deployment)，持续交付。即频繁地将集成的产品交付给质量团队或者用户进行下一步的评审，通过了才会部署到生产阶段。

## 技术栈与工具链

* 版本控制：Github | GitLab | BitBucket | Coding
* 自动化构建和测试：Apache Ant | Maven | Gradle
* 持续集成和交付：Jenkins | Fabric | Gump | TinderBox
* 容器平台：Docker | AWS | 阿里云
* 配置管理：Chef | Bash | Powershell
* 微服务平台：Kubernetes | Cloud Foundry
* 服务开通：Puppet | Powershell | OpenStack
* 日志管理：Logstash | CollectD
* 监控和警告： Nagios | zabbix

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

即在GitLab上集成了CI/CD系统。

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/cicd.png)

### SonarQube

SonarQube empowers all developers to write cleaner and safer code.

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/sonar.png)