---
title: Iris Flowers Dataset with Keras
date: 2019-11-01T21:00:00+08:00
published: true
slug: iris-keras
tags:
- Keras
- iris
cover_image: "./images/iris-keras.png"
canonical_url: false
description: Build and use neural networks for the Iris classification task via Keras.
---

:::note 📕 Motto

“现今程序员的情况好多了，只要有一台便宜的二手电脑，一张Linux光盘和一个互联网帐户，你就已经拥有了把自己提升到任何级别的编程水平所需的全部工具。”
“在信息时代，进入编程领域的壁垒完全不存在了。即使有也是自我强加的。如果你想着手去开发一些全新的东西，你不需要数百万美元的资本。你只需要足够的比萨和健怡可乐存在你的冰箱里，有一台便宜的PC用于工作，以及让你坚持下来的奉献精神。**我们睡在地板上。我们跋山涉水**。”

—— 约翰·卡马克
:::

![](https://i.loli.net/2021/01/07/XR892ceDVO5h1fZ.png)

约翰·卡马克的最后一句话，通俗易懂。又不禁让我想起了那段台词：

> 这是最好的时代，这是最坏的时代。我们一无所有，我们巍然矗立。

:::note ℹ️ Introduction

We will build and use a neural network for the Iris classification task. We will use Keras as a high-level library for managing neural networks.

:::

<!-- more -->

## Analysis Code

```python
import numpy as np

import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris  # import load_iris function from datasets module

from keras.models import Sequential, Input, Model
from keras.utils import to_categorical
from keras.layers import Dense, Dropout, Flatten
from keras import optimizers

# -- Load Iris dataset using sklearn (save "bunch" object containing iris dataset and its attributes) -- ##
# 导入Iris数据集
# Iris数据集是sklearn中自带的
# Iris数据集有3个种类，4个属性，每个属性有50个样例
iris = load_iris()
# x代表iris数据集的数据
X = iris.data
# y代表着着iris的目标属性，即花的类型
y = iris.target

# -- Change the labels from categorical to one-hot encoding -- ##
# The output neurons of the NN will be trained to match the one_hot encoded array
# Example: category label 0 out of 3 labels becomes [1 0 0];
# Example: category label 1 out of 3 labels becomes [0 1 0];
# HINT: use: "to_categorical" to redifine the one hot encoded target y_one_hot using the original y.
# for i in range(len(y)):
#     if y[i] == 0:
#         y[i] = 1
#     else:
#         y[i] = 0
y_one_hot = to_categorical(y)
print(X.shape)
print(y_one_hot.shape)
# y_one_hot = np.reshape(y, (-1, 1))

# -- Split the dataset for training, validation, and test -- ##

# x是被划分的样本特征集
# y_one_hot是被划分的样本标签
# 如果是浮点数，就在0~1之间，表示样本所占比例；如果是整数，就是样本的数量
train_and_valid_X, test_X, train_and_valid_y, test_y = train_test_split(X, y_one_hot, test_size=0.1)
train_X, valid_X, train_y, valid_y = train_test_split(train_and_valid_X, train_and_valid_y, test_size=0.2)


# define the neural network
def baseline_model():
    nb_nurons = 8
    # nb_Classes = 1  # HINT:  <---- look here
    nb_Classes = 3
    input_dimensions = 4
    learning_rate = 0.002
    # create model
    # keras.models.Sequential是神经网络模型的封装容器。它会提供常见的函数
    model = Sequential()
    # 第一层级 - 添加有 input_dimensions = 4个节点的输入层
    # 激活函数使用ReLU运算
    model.add(Dense(nb_nurons, input_dim=input_dimensions, activation='relu'))
    # HINT: a 'softmax' activation will output a probability distribution over the output dimensions
    # 激活函数使用softmax函数
    model.add(Dense(nb_Classes,
                    activation='softmax'))
    # Compile model
    # 实例化一个优化器对象，这里采用RMSprop优化器
    opt = optimizers.RMSprop(lr=learning_rate)
    # HINT: a 'binary_crossentropy' is only useful for at most 2 labels, look for another suitable loss function in Keras
    # compile用于配置训练模型，loss是字符串或目标函数名，optimizer是优化器名或优化器实例，metrics是在训练和测试期间的模型评估标准
    # binary_crossentropy是交叉熵损失函数，一般用于二分类
    # 因为这里要实现3中分类即多分类，所以使用categorical_crossentropy
    model.compile(loss='categorical_crossentropy', optimizer=opt, metrics=['accuracy'])
    return model


def find_correct_and_incorrect_labels(model, test_X, test_y):
    # Computes for every input in the test dataset a probability distribution over the categories
    # predict是为输入样本生成输出预测，计算是分批进行的
    predicted_classes = model.predict(test_X)
    # argmax是找到样本以最大概率所属的类别作为样本的预测标签
    # HINT: choose the prediction with the highest probability, np.argmax( ..... , axis=1 )
    # np.round是取返回四舍五入后的值，可指定精度，与np.around等效
    predicted_classes = np.argmax(predicted_classes, axis=1)
    # np.where(conditions)满足conditions的条件即输出数组的下标
    correctIndex = np.where(predicted_classes == np.argmax(test_y))[0]  # HINT: replace test_y by np.argmax(test_y,axis=1)
    incorrectIndex = np.where(predicted_classes != np.argmax(test_y))[0]  # HINT: replace test_y by np.argmax(test_y,axis=1)
    print("Found %d correct labels using the model" % len(correctIndex))
    print("Found %d incorrect labels using the model" % len(incorrectIndex))


def plot_train_performance(trained_model):
  	# history函数会每轮训练收集损失和准确率，如果有测试集也会收集测试集的数据
    print(trained_model.history.keys())
    accuracy = trained_model.history['accuracy']
    val_accuracy = trained_model.history['val_accuracy']
    loss = trained_model.history['loss']
    val_loss = trained_model.history['val_loss']
    # epoch表示完成了1遍训练集中的所有样本
    epochs = range(len(accuracy))
    # 创建一个画板，1为画板的编号，可以不填
    f1 = plt.figure(1)
    # 一个figure对象包含了多个子图，可以使用subplot()函数来绘制子图
    plt.subplot(1, 2, 1)
    # axis设置坐标轴
    plt.axis((0, len(epochs), 0, 1.2))
    plt.plot(epochs, accuracy, 'bo', label='Training accuracy')
    plt.plot(epochs, val_accuracy, 'b', label='valid accuracy')
    plt.title('Training and valid accuracy')
    plt.legend()
    plt.subplot(1, 2, 2)
    plt.axis((0, len(epochs), 0, 1.2))
    plt.plot(epochs, loss, 'bo', label='Training loss')
    plt.plot(epochs, val_loss, 'b', label='valid loss')
    plt.title('Training and valid loss')
    # 展示出每个数据对应的图像名称，更好辨认
    plt.legend()
    plt.show()
    plt.pause(0.001)


# -- Initialize model -- ##
model = baseline_model()

# -- Test the performmance of the untrained model over the test dataset -- ##
find_correct_and_incorrect_labels(model, test_X, test_y)

# -- Train the model -- ##
print('\nTraining started ...')
trained_model = model.fit(train_X, train_y, batch_size=10, epochs=150, verbose=0, validation_data=(valid_X, valid_y))
print('Training finished. \n')

# -- Test the performmance of the trained model over the test dataset -- ##
find_correct_and_incorrect_labels(model, test_X, test_y)

# -- Plot performance over training episodes -- ##
plot_train_performance(trained_model)
```

## Result

![](https://i.loli.net/2021/01/07/2flu4zmsqdJ1FLR.png)

## Error

在按照提示修改代码后，会一直提示以下这个错误，即实际输出的数组形状为与预期数据的形状不同。

:::warning

`ValueError: Error when checking target: expected dense_2 to have shape (1,) but got array with shape (3,)`

:::

最终通过Stack Overflow上的[一篇帖子](https://stackoverflow.com/questions/51456613/valueerror-error-when-checking-target-expected-dense-3-to-have-shape-1-but)找到了问题所在。

the following line is wrong:

```python
nb_Classes = 1
```

change it to:

```python
nb_Classes = 3
```

Because final layer is of 3 dimension. Beacuse I used `categorical_crossentropy` and also the terminal shows that actually there are three layers.
