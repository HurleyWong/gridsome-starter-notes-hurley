---
title: Run Mice and Chase demo with BEAST
date: 2020-04-01T21:00:00+08:00
published: true
slug: mice-chase-beast
tags:
- bio-inspired
- genetic algorithm
- BEAST
cover_image: "./images/mice-chase-beast.png"
canonical_url: false
description: 运行BEAST中的Mice和Chase的demo，根据现象分析遗传算法。
---

### 遗传算法

>遗传算法（genetic algorithm, GA）是计算数学中用于解决最优化的搜索算法，是进化算法的一种。进化算法最初是借鉴了进化生物学中的一些现象而发展起来的，这些现象保罗遗传、突变、自然选择以及杂交等。

#### 算法

> * 选择初始生命种群
> * 循环
>     * 评价种群中的**个体适应度**
>     * 以比例原则（分数高的挑中几率也较高）选择产生下一个种群（轮盘法（roulette wheel selection）、竞争法（tournament selection）以等级轮盘法（Rank Based Wheel Selection））。不仅仅挑分数最高的原因是这么做可能收敛到局部的最佳点，而非整体的
>     * 改变该种群（交叉和变异）
> * 直到停止循环的条件满足

<!-- more -->

#### GA参数

> * 种群规模（P, population size）：即种群中染色体个体的数目；
> * 字符串长度（I, string length）：个体中染色体的长度；
> * 交配概率（pc, probability or performing crossover）：控制着交配算子的使用频率。交配操作可以加快收敛，使解达到最有希望的最佳解区域，因此一般取较大的交配概率，但交配概率太高也可能导致过早收敛，则称为早熟。
> * 突变概率（pm, probability of mutation）：控制着突变算法的使用概率。
> * 中止条件（termination criteria）

### C++(.cc)

C++是一种被广泛使用的计算机程序设计语言，一般其后缀文件名是`.cpp`，但是`.cc`其实也是C Plus Plus文件的一种。

C++有很多新的特性，例如[虚函数](https://zh.wikipedia.org/wiki/虚函数)（virtual function）、[运算符重载](https://zh.wikipedia.org/wiki/运算符重载)（operator overloading）、[多继承](https://zh.wikipedia.org/wiki/多重继承)（multiple inheritance）、[标准模板库](https://zh.wikipedia.org/wiki/标准模板库)（standard template library, STL）、[异常处理](https://zh.wikipedia.org/wiki/异常处理)（exception）、[运行时类型](https://zh.wikipedia.org/wiki/RTTI)信息（Runtime type information）、[名字空间](https://zh.wikipedia.org/wiki/命名空间)（namespace）等概念。

### Mice

在`mouse.cc`代码中，主要有两个实体类对象：`Cheese`继承至`WorldObject`，`Mouse`继承至`Animat`，`NeuralMouse`继承至`Mouse`，`EvoMouse`继承至 `EvoFFNAnimat`，`MouseSimulation`继承至`Simulation`。

**Cheese类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093326240.png)

定义Cheese类。半径为2.5f，颜色为黄色，位置随机初始化。

`virtual ~Cheese()`为虚函数，`Eaten()`函数表示当Cheese被吃掉后，就会重新出现在一个随机的位置。

**Mouse类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093415951.png)

定义Mouse类。定义其使用`NearestAngleSensor<Cheese>()`最近角度传感器检测Cheese，并且随机初始化。一个简单的`Control()`方法定义Mouse的左右移动。定义虚函数`OnCollision()`即当Mouse与Cheese发生碰撞时，就会调用Cheese的`Eaten()`方法，即Cheese被吃。

**NeuralMouse类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093457276.png)

拥有神经网络的Mouse会使用传感器去探测最近的Cheese。目前还没有遗传算法或者其它的学习算法。上述代码中主要两层hidden layer，使用到了神经网络是`FeedForwardNet`。

**EvoMouse类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093558251.png)

对于EvoMouse类，其初始化代码的`OnCollision()`方法几乎都与Mouse类一样，但是增加了遗传算法和FFN。

在`OnCollision()`代码中，增加了记录吃掉的Cheese的功能。

新增`getFitness()`方法，是用`cheeseFound / DistanceTravelled`或者`cheeseFound / PowerUsed`。

**MouseSimulation类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093629147.png)

这个类是最终将Simulation在BEAST中启动

```c++
GeneticAlgorithm<EvoMouse> theGA;
Population<EvoMouse> theMice;
Group<Cheese> theCheese;
```

这三行是将之前定义的类实例化。

后面使用到一个rank selection method。这是遗传算法必须要的步骤。因为遗传的算法是物竞天择。物竞即是适应度函数（fitness function），天择即是选择函数（selection）。通过设定具体的因素作为适应度评分，最后返回的值就作为适应度的考察因素。通过使用轮盘法等不同的方法选择个体（通常来讲，适应度越高的个体被选中的概率越大）。

### Chase

在`chase.cc`代码中，主要定义了捕猎者和猎物以及最后的模拟器三个类。`Prey`猎物类继承至`EvoFFNAnimat`类，`Predator`捕食者同样继承至`EvoFFNAnimat`类，`ChaseSimulation`类继承`Simulation`类。

**Prey类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093716674.png)

这里定义了Prey的具体实现。其拥有最大速度，最小速度，使用了两个`ProximitySensor<Predator>`传感器进行探测从而躲避捕食者的追捕，其适应度函数`GetFitness`为`1.0f / static_cast<float>(timeEaten)`，即`timeEaten`越小，其适应度越高，越难被捕捉。

**Predator类**：

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/image-20200402093744558.png)

捕食者Predator同样使用了两个`Proximity<Prey>`传感器，但是范围比Prey的要大。速度和Prey的一样，但是增加半径`Radius`因素。它的`GetFitness`直接返回`preyEaten`，这样就代表其捕捉的猎物越高适应度越高。

最后的模拟器类为两者都添加遗传算法，数值和压力等都一样。不同的是Predator的TeamSize只有5，而Prey的TeamSize有30，这意味着猎物远比捕食者多，这也比较符号现实中的大自然规律。

**结果**：

![chase100_pred](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/chase100_pred.png)

上面两张图片是运行了100 generation后的图片，可以看到，无论是average fitness还是best fitness，两张图片都呈**互补**关系。即当Prey上升到时候，Predator下降；反之，Prey下降则是因为Predator上升了。

当运行了几千代（4000 generation）时，图片仍然呈现以上规律，则代表两者出现了**共同进化（co-evolution）**。

