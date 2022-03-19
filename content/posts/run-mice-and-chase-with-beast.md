---
title: Run Mice and Chase demo with BEAST
date: 2020-04-01T21:00:00+08:00
published: false
slug: mice-chase-beast
tags:
- bio-inspired
- genetic algorithm
- BEAST
cover_image: "./images/mice-chase-beast.png"
canonical_url: false
description: 运行 BEAST 中的 Mice 和 Chase 的 demo，根据现象分析遗传算法。
---

### 遗传算法

> 遗传算法 (genetic algorithm, GA) 是计算数学中用于解决最优化的搜索算法，是进化算法的一种。进化算法最初是借鉴了进化生物学中的一些现象而发展起来的，这些现象保罗遗传、突变、自然选择以及杂交等。

#### 算法

> * 选择初始生命种群
> * 循环
>     * 评价种群中的**个体适应度**
>     * 以比例原则（分数高的挑中几率也较高）选择产生下一个种群（轮盘法 (roulette wheel selection)、竞争法 (tournament selection) 以等级轮盘法 (Rank Based Wheel Selection)）。不仅仅挑分数最高的原因是这么做可能收敛到局部的最佳点，而非整体的
>     * 改变该种群（交叉和变异）
> * 直到停止循环的条件满足

#### GA参数

> * 种群规模 (P, population size)：即种群中染色体个体的数目；
> * 字符串长度 (I, string length) ：个体中染色体的长度；
> * 交配概率 (pc, probability or performing crossover) ：控制着交配算子的使用频率。交配操作可以加快收敛，使解达到最有希望的最佳解区域，因此一般取较大的交配概率，但交配概率太高也可能导致过早收敛，则称为早熟。
> * 突变概率 (pm, probability of mutation)：控制着突变算法的使用概率。
> * 中止条件 (termination criteria)

### C++ (.cc)

C++ 是一种被广泛使用的计算机程序设计语言，一般其后缀文件名是`.cpp`，但是`.cc`其实也是 C Plus Plus 文件的一种。

C++ 有很多新的特性，例如[虚函数](https://zh.wikipedia.org/wiki/虚函数) (virtual function)、[运算符重载](https://zh.wikipedia.org/wiki/运算符重载) (operator overloading)、[多继承](https://zh.wikipedia.org/wiki/多重继承) (multiple inheritance)、[标准模板库](https://zh.wikipedia.org/wiki/标准模板库) (standard template library, STL)、[异常处理](https://zh.wikipedia.org/wiki/异常处理) (exception)、[运行时类型](https://zh.wikipedia.org/wiki/RTTI)信息 (Runtime type information)、[名字空间](https://zh.wikipedia.org/wiki/命名空间) (namespace) 等概念。

### Mice

在`mouse.cc`代码中，主要有两个实体类对象：`Cheese`继承至`WorldObject`，`Mouse`继承至`Animat`，`NeuralMouse`继承至`Mouse`，`EvoMouse`继承至 `EvoFFNAnimat`，`MouseSimulation`继承至`Simulation`。

**Cheese 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F6af280ab-4e56-48db-a007-881a12e8a5d1%2FUntitled.png?table=block&id=155a3b4d-07a7-4a1f-9420-6237578e6834&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3260&userId=&cache=v2)

定义 Cheese 类。半径为 2.5f，颜色为黄色，位置随机初始化。

`virtual ~Cheese()`为虚函数，`Eaten()`函数表示当 Cheese 被吃掉后，就会重新出现在一个随机的位置。

**Mouse 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F96603171-4563-45f3-a664-a78392020998%2FUntitled.png?table=block&id=863e90b8-013e-44c3-9c71-c4b4f2590893&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3060&userId=&cache=v2)

定义 Mouse 类。定义其使用`NearestAngleSensor<Cheese>()`最近角度传感器检测 Cheese，并且随机初始化。一个简单的`Control()`方法定义 Mouse 的左右移动。定义虚函数`OnCollision()`即当 Mouse 与 Cheese 发生碰撞时，就会调用 Cheese 的`Eaten()`方法，即 Cheese 被吃。

**NeuralMouse 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fb9e19a37-0774-44b9-a563-7ee69a1f5db9%2FUntitled.png?table=block&id=0ddd2fbe-c4b8-44a8-8fc4-51423478aa45&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3230&userId=&cache=v2)

拥有神经网络的 Mouse 会使用传感器去探测最近的 Cheese。目前还没有遗传算法或者其它的学习算法。上述代码中主要两层 hidden layer，使用到了神经网络是`FeedForwardNet`。

**EvoMouse 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F118f7b9a-4c3c-4d0b-a170-64e729c48cd2%2FUntitled.png?table=block&id=a149db23-7b97-481a-83a0-8ad70823833f&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=4100&userId=&cache=v2)

对于 EvoMouse 类，其初始化代码的`OnCollision()`方法几乎都与 Mouse 类一样，但是增加了遗传算法和 FFN。

在`OnCollision()`代码中，增加了记录吃掉的 Cheese 的功能。

新增`getFitness()`方法，是用`cheeseFound / DistanceTravelled`或者`cheeseFound / PowerUsed`。

**MouseSimulation 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc0f22ba2-25ff-4657-8038-ca16f89807af%2FUntitled.png?table=block&id=2133a9b9-cce9-4a55-9f63-e043f891a4d2&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3470&userId=&cache=v2)

这个类是最终将 Simulation 在 BEAST 中启动

```c++
GeneticAlgorithm<EvoMouse> theGA;
Population<EvoMouse> theMice;
Group<Cheese> theCheese;
```

这三行是将之前定义的类实例化。

后面使用到一个 rank selection method。这是遗传算法必须要的步骤。因为遗传的算法是物竞天择。物竞即是适应度函数 (fitness function），天择即是选择函数 (selection)。通过设定具体的因素作为适应度评分，最后返回的值就作为适应度的考察因素。通过使用轮盘法等不同的方法选择个体（通常来讲，适应度越高的个体被选中的概率越大）。

### Chase

在`chase.cc`代码中，主要定义了捕猎者和猎物以及最后的模拟器三个类。`Prey`猎物类继承至`EvoFFNAnimat`类，`Predator`捕食者同样继承至`EvoFFNAnimat`类，`ChaseSimulation`类继承`Simulation`类。

**Prey 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4e395d29-901a-4429-823c-bb7ef1c7b2f5%2FUntitled.png?table=block&id=c4f27731-6fa4-4d50-959e-307894c0ad69&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3470&userId=&cache=v2)

这里定义了 Prey 的具体实现。其拥有最大速度，最小速度，使用了两个`ProximitySensor<Predator>`传感器进行探测从而躲避捕食者的追捕，其适应度函数`GetFitness`为`1.0f / static_cast<float>(timeEaten)`，即`timeEaten`越小，其适应度越高，越难被捕捉。

**Predator 类**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F83a03d2e-4a40-41c0-8989-bdb1c03a2bfc%2FUntitled.png?table=block&id=d7ad6a45-f332-458b-9b29-1d7562e102e9&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3360&userId=&cache=v2)

捕食者 Predator 同样使用了两个`Proximity<Prey>`传感器，但是范围比 Prey 的要大。速度和 Prey 的一样，但是增加半径`Radius`因素。它的`GetFitness`直接返回`preyEaten`，这样就代表其捕捉的猎物越高适应度越高。

最后的模拟器类为两者都添加遗传算法，数值和压力等都一样。不同的是 Predator 的 TeamSize 只有 5，而 Prey 的 TeamSize 有 30，这意味着猎物远比捕食者多，这也比较符号现实中的大自然规律。

**结果**：

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fda6311a6-9466-4da1-9227-0d7db45e8ade%2FUntitled.png?table=block&id=82a0dc68-2739-4da9-a5b5-0bfa0da80412&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=1280&userId=&cache=v2)

上面两张图片是运行了 100 generation 后的图片，可以看到，无论是 average fitness 还是 best fitness，两张图片都呈**互补**关系。即当 Prey 上升到时候，Predator 下降；反之，Prey下降则是因为 Predator 上升了。

当运行了几千代 (4000 generation) 时，图片仍然呈现以上规律，则代表两者出现了**共同进化 (co-evolution)**。

