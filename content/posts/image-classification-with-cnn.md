---
title: Image Classification with Convolutional Neural Networks
date: 2020-03-20T21:00:00+08:00
published: true
slug: image-classification-cnn
tags:
- CNN
- image classification
- PyTorch
cover_image: "./images/image-classification-cnn.png"
canonical_url: false
description: Build the CNN network and improve performance, do filter and feature maps visualisation.
---

### Requirements

#### Building the network

The first part of the assignment is to build a CNN and train it on ImageNet10. Start by building a CNN with the following depth and parameters:

| Input_channels | Output_channels |                 | Kernel_size |
| :------------: | :-------------: | :-------------: | :---------: |
|       3        |       16        |   convolution   |    3 x 3    |
|       16       |       24        |   convolution   |    4 x 4    |
|       24       |       32        |   convolution   |    4 x 4    |
|       *        |       512       | fully-connected |     N/A     |
|      512       |       10        | fully-connected |     N/A     |

(*) Calculate the input size, which is the flattened previous layer.

Follow each convolutional layer by ReLU and a max-pool operation with kernel size 2 x 2.

After each sequence of convolution, ReLU and max-pool, add a dropout operation with p=0.3. Dropout is a regularisation technique where layer outputs are randomly (with likelihood of p) dropped out, or ignored. This helps the neural network to avoid overfitting to noise in the training data.

Use a learning rate of 0.001, momentum 0.9, and stochastic gradient descent to train the network. Training for 10 epochs should give you an accuracy in the 40th percentile on the test set. Remember that for ten classes, random performance is 10%.

#### Experiments

Now, run two experiments testing various network architectures:

1. How does the number of layers affect the training process and test performance? Try between 2 and 5 layers.
2. Choose one more architectural element to test (filter size, max-pool kernel size, number / dimensions of fully-connected layers, etc.).

Generate and display the confusion matrices for the various experiments.

#### Filter visualisation

Now, choose the best-performing network architecture and visualise the filters from the first layer of the network. Compare the filters before training (random weight initialisation), halfway during training, and after training is completed. Normalise the filters before displaying as an image. The filters are 3D, but are easier to visualise when displayed in grayscale. You can do this using matplotlib.pyplot’s colour map argument: `plt.imshow(filter, cmap="gray")`

#### Feature map visualisation

Feature maps are the filters applied to the layer input; i.e., they are the activations of the convolutional layers. Visualise some of the feature maps (four from each layer) from the fullytrained network, by passing images forward through the network. As with the filters, display them in grayscale.

Choose two input images of different classes and compare the resulting feature maps, commenting on how they change with the depth of the network.

:::tip ⚡️ Tips

When visualising a PyTorch tensor object, you will want to first move the tensor to CPU (if using a GPU), detach it from the gradients, make a copy, and convert to a NumPy array.
:::

You can do this as follows:

`tensor_name.cpu().detach().clone().numpy()`

The most intuitive way to get layer activations is to directly access them in the network.

`conv1_activs = model.conv_layer1.forward(input_image)`

The layer activations for the subsequent layer can then be obtained by passing in the previous layer activations: `conv2_activs = model.conv_layer2.forward(conv1_activs) `

Alternately, for a more elegant solution, you may choose to save layer activations by registering a hook into your network. Look for documentation on the `model.register_forward_hook()` function to see how to use it.

#### Improving network performance

Consider and implement at least two adjustments which you anticipate will improve the model’s ability to generalise on unseen data. While you may completely change the network architecture, please do not use any additional data to train your model other than the ImageNet10 training data provided. Changes related to data loading, transforms, and the training process and parameters are also valid adjustments as long as you justify your choices and provide some form of validation.

### Solution

具体代码见[Image_Classification_with_Convolutional_Neural_Networks_ImageNet10.ipynb](https://github.com/HurleyWong/NNs/blob/master/Image_Classification_with_Convolutional_Neural_Networks_ImageNet10.ipynb)。

#### Building the network

第一步的**构建网络**意味着我们要根据已经给定的输入层和输出层通道的大小，以及卷积层卷积核（过滤器）的大小，计算出 * 对应的值的大小。同时按照要求，设置使用的激活函数，池化层卷积核的大小，学习率，动量和 Dropout 的大小等，训练次数 epoch 为 10 次。根据以上固定数据和计算出的数据，就可以将该网络的模型搭建好。

#### Experiments

这一部分主要有两个步骤需要完成。

1. 选取 2-5 层卷积层，判断究竟几层的性能是最好的；
2. 选择最少一个因素（卷积核大小，池化层卷积核大小，全连接层个数等）进行改变以提高性能表现。

对于第一个步骤，则要分别搭建 2-5 层卷积层的网络模型。针对不同层数的网络模型，其 * 都要重新计算。

##### 网络模型

**2 层**：

```python
class ConvNet2(nn.Module):

    def __init__(self, num_classes=10):
        super(ConvNet2, self).__init__()

        self.conv1 = nn.Conv2d(3, 16, 3)
        self.conv2 = nn.Conv2d(16, 24, 4)

        self.fc1 = nn.Linear(24*62*62, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.pool1 = nn.MaxPool2d(2)
        self.pool2 = nn.MaxPool2d(2)
        self.dropout1 = nn.Dropout2d(0.3)
        self.dropout2 = nn.Dropout2d(0.3)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.dropout1(x)

        x = self.pool2(F.relu(self.conv2(x)))
        x = self.dropout2(x)

        x = x.view(-1, 24*62*62)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        return x

model2 = ConvNet2()
print(model2)
```

2 层卷积层时，全连接层的输入大小为 $24*62*62$。

**3 层**：

```python
class ConvNet3(nn.Module):

    def __init__(self, num_classes=10):
        super(ConvNet3, self).__init__()

        self.conv1 = nn.Conv2d(3, 16, 3)
        self.conv2 = nn.Conv2d(16, 24, 4)
        self.conv3 = nn.Conv2d(24, 32, 4)

        self.fc1 = nn.Linear(32*29*29, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.pool1 = nn.MaxPool2d(2)
        self.pool2 = nn.MaxPool2d(2)
        self.pool3 = nn.MaxPool2d(2)
        self.dropout1 = nn.Dropout2d(0.3)
        self.dropout2 = nn.Dropout2d(0.3)
        self.dropout3 = nn.Dropout2d(0.3)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.dropout1(x)

        x = self.pool2(F.relu(self.conv2(x)))
        x = self.dropout2(x)

        x = self.pool3(F.relu(self.conv3(x)))
        x = self.dropout3(x)

        x = x.view(-1, 32*29*29)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        return x

model3 = ConvNet3()
print(model3)
```

3 层卷积层时，全连接层的输入大小为 $32*29*29$。

**4 层**：

```python
class ConvNet4(nn.Module):

    def __init__(self, num_classes=10):
        super(ConvNet4, self).__init__()

        self.conv1 = nn.Conv2d(3, 16, 3)
        self.conv2 = nn.Conv2d(16, 24, 4)
        self.conv3 = nn.Conv2d(24, 32, 4)
        self.conv4 = nn.Conv2d(32, 40, 4)

        self.fc1 = nn.Linear(40*13*13, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.pool1 = nn.MaxPool2d(2)
        self.pool2 = nn.MaxPool2d(2)
        self.pool3 = nn.MaxPool2d(2)
        self.pool4 = nn.MaxPool2d(2)
        self.dropout1 = nn.Dropout2d(0.3)
        self.dropout2 = nn.Dropout2d(0.3)
        self.dropout3 = nn.Dropout2d(0.3)
        self.dropout4 = nn.Dropout2d(0.3)

    def forward(self, x):

        x = self.pool1(F.relu(self.conv1(x)))
        x = self.dropout1(x)

        x = self.pool2(F.relu(self.conv2(x)))
        x = self.dropout2(x)

        x = self.pool3(F.relu(self.conv3(x)))
        x = self.dropout3(x)

        x = self.pool4(F.relu(self.conv4(x)))
        x = self.dropout4(x)

        x = x.view(-1, 40*13*13)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        return x

model4 = ConvNet4()
print(model4)
```

4 层卷积层时，全连接层的输入大小为 $40*13*13$。

**5 层**：

```python
class ConvNet5(nn.Module):

    def __init__(self, num_classes=10):
        super(ConvNet5, self).__init__()

        self.conv1 = nn.Conv2d(3, 16, 3)
        self.conv2 = nn.Conv2d(16, 24, 4)
        self.conv3 = nn.Conv2d(24, 32, 4)
        self.conv4 = nn.Conv2d(32, 40, 4)
        self.conv5 = nn.Conv2d(40, 48, 4)

        self.fc1 = nn.Linear(48*5*5, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.pool1 = nn.MaxPool2d(2)
        self.pool2 = nn.MaxPool2d(2)
        self.pool3 = nn.MaxPool2d(2)
        self.pool4 = nn.MaxPool2d(2)
        self.pool5 = nn.MaxPool2d(2)
        self.dropout1 = nn.Dropout2d(0.3)
        self.dropout2 = nn.Dropout2d(0.3)
        self.dropout3 = nn.Dropout2d(0.3)
        self.dropout4 = nn.Dropout2d(0.3)
        self.dropout5 = nn.Dropout2d(0.3)


    def forward(self, x):

        x = self.pool1(F.relu(self.conv1(x)))
        x = self.dropout1(x)

        x = self.pool2(F.relu(self.conv2(x)))
        x = self.dropout2(x)

        x = self.pool3(F.relu(self.conv3(x)))
        x = self.dropout3(x)

        x = self.pool4(F.relu(self.conv4(x)))
        x = self.dropout4(x)

        x = self.pool5(F.relu(self.conv5(x)))
        x = self.dropout5(x)

        x = x.view(-1, 48*5*5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        return x

model5 = ConvNet5()
print(model5)
```

5 层卷积层时，全连接层的输入大小为 $48*5*5$。

由于 Requirements 中只给出了 3 层卷积层的数值大小，所以当添加到 4-5 层时，新增的大小可以自己设置，这里我仍然设置为以 8 为间隔。

##### 判断性能

在搭建完网络，定义损失函数和优化器之后，需要通过训练和验证来判断性能的优劣。这里需要注意的是，判断性能并不是意味着是训练模型之后去跑测试集来根据准确率的高低去判断，而是要根据训练集与验证集的损失率或者准确率的曲线是否收敛来判断，否则如果有很明显的过拟合或者欠拟合，都不是好的性能。

```python
def train_and_valid(num_epochs, model, optimizer, flag):
    for epoch in range(num_epochs):
        correct = 0
        total = 0 # loop over the dataset multiple times

        running_loss = 0.0
        total_val_loss =0.0

        if (epoch ==5 and flag ==1):
            filter_visual()
        for i, data in enumerate(train_loader, 0):
            # get the inputs; data is a list of [inputs, labels]
            inputs, labels = data
            inputs = inputs.to(device)
            labels = labels.to(device)

            # zero the parameter gradients
            optimizer.zero_grad()

            # forward + backward + optimize
            outputs = model(inputs)
            loss = loss_fn(outputs, labels)
            loss.backward()
            optimizer.step()

            # Print our loss
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        print('Epoch %d - Loss : %.3f' % (epoch+1,running_loss/len(train_loader)))
        print('The accuracy of training set is %.3f %%' % (correct/total*100))
        loss_lst.append(running_loss/len(train_loader))
        acc_lst.append(correct/total*100)

        with torch.no_grad():
            val_correct = 0
            val_total = 0
            for inputs, labels in valid_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                val_outputs = model(inputs)
                val_loss = loss_fn(val_outputs, labels)
                total_val_loss += val_loss.item()
                _,prediction = torch.max(val_outputs.data,1)
                val_total += labels.size(0)
                val_correct += (prediction == labels).sum().item()
        print("Validation loss = {:.2f}".format(total_val_loss / len(valid_loader)))
        print('The accuracy of Validation set is %.3f %%' %(val_correct/val_total*100))

        val_loss_lst.append(total_val_loss / len(valid_loader))
        val_acc_lst.append(val_correct/val_total*100)

    print('Finished')
```

这里需要注意的是，在进行训练和验证时，要同步进行，而不是说在训练集训练完模型再去跑验证集。

2 层的损失率：

![2 层的损失率](https://i.loli.net/2021/01/07/UKkgazHCnT9WM6E.png)

2 层的准确率：

![2 层的准确率](https://i.loli.net/2021/01/07/UfHelP9g7Ty1uwR.png)

可以看见图像仍然没完全收敛，存在欠拟合现象。

最终发现 4 层的相对来说收敛效果最好（5 层虽然收敛很好，但是准确率已经明显低于 40%，不满足要求）。

4 层的损失率：

![4 层的损失率](https://i.loli.net/2021/01/07/Qh79pqrGmLutKEZ.png)

##### 改变参数

因为 4 层的收敛效果很好，所以可以适当的考虑降低 Dropout 的值，所以我这里仅仅改变了 Dropout 的值，由 0.3 变成 0.1。

```python
class ReConvNet(nn.Module):

    def __init__(self, num_classes=10):
        super(ReConvNet, self).__init__()

        self.conv1 = nn.Conv2d(3, 16, 3)
        self.conv2 = nn.Conv2d(16, 24, 4)
        self.conv3 = nn.Conv2d(24, 32, 4)
        self.conv4 = nn.Conv2d(32, 40, 4)

        self.fc1 = nn.Linear(40*13*13, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.pool1 = nn.MaxPool2d(2)
        self.pool2 = nn.MaxPool2d(2)
        self.pool3 = nn.MaxPool2d(2)
        self.pool4 = nn.MaxPool2d(2)
        self.dropout1 = nn.Dropout2d(0.1)
        self.dropout2 = nn.Dropout2d(0.1)
        self.dropout3 = nn.Dropout2d(0.1)
        self.dropout4 = nn.Dropout2d(0.1)

    def forward(self, x):

        x = self.pool1(F.relu(self.conv1(x)))
        x = self.dropout1(x)

        x = self.pool2(F.relu(self.conv2(x)))
        x = self.dropout2(x)

        x = self.pool3(F.relu(self.conv3(x)))
        x = self.dropout3(x)

        x = self.pool4(F.relu(self.conv4(x)))
        x = self.dropout4(x)

        x = x.view(-1, 40*13*13)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))

        return x

    def retrieve_features(self, x):
        feature_map1 = F.relu(self.conv1(x))
        x = self.pool1(feature_map1)
        x = F.dropout2d(x, 0.1)

        feature_map2 = F.relu(self.conv2(x))
        x = self.pool2(feature_map2)
        x = F.dropout2d(x, 0.1)

        feature_map3 = F.relu(self.conv3(x))
        x = self.pool3(feature_map3)
        x = F.dropout2d(x, 0.1)

        feature_map4 = F.relu(self.conv4(x))
        x = self.pool4(feature_map4)
        x = F.dropout2d(x, 0.1)

        return (feature_map1, feature_map2, feature_map3, feature_map4)

model = ReConvNet()
print(model)
```

因为后面还有一个 Feature map visualisation 即特征图可视化，所以这里新添了一个方法`retrieve_features(self, x)`的方法，记录每一层的特征图。

通过对该模型进行训练，最终拿测试集去跑，得到的准确率如下：

```
correct: 714
total: 1800
Accuracy of the network on the images: 39 %
Accuracy of baboon: 42 %
Accuracy of banana: 52 %
Accuracy of canoe: 41 %
Accuracy of   cat: 54 %
Accuracy of  desk: 14 %
Accuracy of drill: 44 %
Accuracy of dumbbell: 18 %
Accuracy of football: 34 %
Accuracy of   mug: 41 %
Accuracy of orange: 80 %
```

```
Normalized confusion matrix
[[ 82   2  15  50   8   5   3   4   5   2]
 [  5  90   9  12   4   3   2   8  10  43]
 [ 16  11  86  26   8   6   5  11  12   3]
 [ 35  11   7  78   6   4   8  10  15   1]
 [ 20   8  21  17  38  12  21  13  18   6]
 [ 14  12  10  15  13  65  14   3  25   6]
 [ 31   7  12  21  14  25  45   8  23   9]
 [ 18  16  10  37   8   8  11  40  16   3]
 [ 25  21  11  14   9  11  16  10  61  19]
 [  1  25   1   4   2   0   1   1   5 129]]
```

![混淆矩阵](https://i.loli.net/2021/01/07/xOh8PFrzBKqdZH2.png)

#### Filter visualisation

卷积核（过滤器）可视化，主要是因为卷积核会随着网络训练而发生自我调整。因为第一层的输出是 16，而该图片集又是 RGB 三通道的图片，所以第一层总共会输出 $16*3=48$ 张卷积核的图片。

```python
def filter_visual():
  figure = plt.figure(figsize = (15, 15))
  k = 0

  for i in range(16):

    filter_mix = np.zeros(shape = [3,3])
    for j in range(3):
      k = k + 1
      figure.add_subplot(8, 6, k)
      filter_mix += model.conv1.weight.data.cpu().numpy()[ i, j, :, :]
      plt.imshow(filter_mix, cmap = "gray")
  plt.show()
```

因为 Requirements 的要求在训练前、中、后分别进行卷积核可视化来观察变化。所以在`model.train()`之前就要调用`filter_visual()`。总共10轮，因此在中间即第 6 轮时再调用一次`filter_visual()`，然后在训练结束之后，再次调用`filter_visual()`。这样就能得到训练前、中、后三次的卷积核可视化。

**训练前**：

![训练前的卷积核](https://i.loli.net/2021/01/07/wJc6iKuYrWyPEbD.png)

**训练中**：

![训练中的卷积核](https://i.loli.net/2021/01/07/hSjB4NXfOmGRAF8.png)

**训练后**：

![训练后的卷积核](https://i.loli.net/2021/01/07/uVjPcpHQeRmTF61.png)

#### Feature map visualisation

对特征图进行可视化。可以从数据集中随机选择图片，因此之前已经设置了`shuffle=True`，即随机打乱顺序，所以这里只要设置索引即可。

**第一层**：

```python
idx = 1000
idy = 500

input_x = ins_dataset_test[idx][0].unsqueeze(0)
input_y = ins_dataset_test[idy][0].unsqueeze(0)
feature_maps_x = model.retrieve_features(input_x.to(device))
feature_maps_y = model.retrieve_features(input_y.to(device))

plt.figure(figsize=(20, 14))
for i in range(4):
    plt.subplot(1, 4, i + 1)
    plt.axis('off')
    plt.imshow(feature_maps_x[0][0, i, ...].data.cpu().numpy(), cmap='gray')
```

![](https://i.loli.net/2021/01/07/yaHFVB1tZ4h6plo.png)

**第二层**：

```python
plt.figure(figsize = (20, 14))
for i in range(4):
    plt.subplot(2 ,4 ,i + 1)
    plt.axis('off')
    plt.imshow(feature_maps_x[1][0, i,...].data.cpu().numpy(), cmap='gray')
```

![](https://i.loli.net/2021/01/07/WyjNrPRLVQ5BZU1.png)

**第三层**：

```python
plt.figure(figsize = (20, 14))
for i in range(4):
    plt.subplot(4 ,4 ,i + 1)
    plt.axis('off')
    plt.imshow(feature_maps_x[3][0, i,...].data.cpu().numpy(), cmap='gray')
```

![](https://i.loli.net/2021/01/07/i32LDheCuvUZfIz.png)

可以看见，随着层次的增加，图片越来越模糊，特征越来越不明显。

#### Improving network performance

这步规定可以使用 PyTorch 内置的模型（不过不能是预训练好的，即`pretrained = False`），所以我这里采用的是 ResNet18 模型。

```python
from torchvision import models

final_model = models.resnet18(pretrained = False)

for param in final_model.parameters():
    param.require_grad = False
```

同时改变优化器和损失函数：

```python
loss_fn = nn.CrossEntropyLoss()
final_optimizer = optim.Adam(final_model.parameters(), lr = 0.001)
```

训练集和验证集的损失率：

![](https://i.loli.net/2021/01/07/5ADsNBhtLITmnbj.png)

训练集和验证集的准确率：

![](https://i.loli.net/2021/01/07/XDrMy2zSl6TA8pv.png)

**测试集的准确率**：

```
correct: 1162
total: 1800
Accuracy of the network on the images: 64 %
Accuracy of baboon: 91 %
Accuracy of banana: 43 %
Accuracy of canoe: 78 %
Accuracy of   cat: 58 %
Accuracy of  desk: 76 %
Accuracy of drill: 41 %
Accuracy of dumbbell: 65 %
Accuracy of football: 48 %
Accuracy of   mug: 49 %
Accuracy of orange: 85 %
```

**混淆矩阵**：

```
Normalized confusion matrix
[[153   2   2  14   0   0   4   1   0   0]
 [  6  93   6   9   7   1   5   3   6  50]
 [ 22   2 128   2  11   4   5   8   2   0]
 [ 33   1   2 114   5   1  10   3   4   2]
 [  0   1   1   1 140   4  13   6   8   0]
 [  3   1   5   4  23  78  46  10   5   2]
 [ 11   5   1   4  13  13 127   7  11   3]
 [ 15  11   4   8   3   8  24  77  13   4]
 [  3   6   1   7  28   2  17  11 111  11]
 [  2   5   4   1   8   1   1   0   6 141]]
```

![混淆矩阵](https://i.loli.net/2021/01/07/P5rNXj7Qgu8kanF.png)

可以发现自带的性能的确比我们自己搭建的模型要好的多，同理也可以使用其它 PyTorch 中自带的网络模型，例如 VGG16 等。