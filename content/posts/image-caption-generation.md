---
title: Image Caption Generation with BLEU
date: 2020-04-08T21:00:00+08:00
published: true
slug: image-caption-generation
tags:
- RNN
- LSTM
- PyTorch
- BLEU
cover_image: "./images/image-caption-generation.png"
canonical_url: false
description: Do text pre-processing and text embeddings with an image to text model, compare the performance and usage of RNNs versus LSTMs as sequence generators.
---

:::note ℹ️ Introduction

This project is using RNN and LSTM to generate captions separately according to the images in the Flick8k data set, then compare the BLEU scores for captions.
:::

### Dataset download

The zip files containing the image data and text data can be downloaded here [Flickr8k](https://github.com/jbrownlee/Datasets/releases/tag/Flickr8k).

This dataset is very larger, so if you would like to work on Google Colab, it is recommeded to download the zip files, upzip them, and then upload all the files to your own Google Drive. This initial upload may take a while, but from then on you will only need to mount your Google Drive every time you start a new Colab session and the data will be immediately accessible. Mounting only takes a few seconds. Remeber to replace the path of Google Drive in code to your own path.

**Mount Google Drive**:

```python
from google.colab import drive
drive.mount('/content/drive', force_remount=True)
```

```python
# remember replace the path of your own
root = "drive/My Drive/Flickr8k/" 
caption_dir = root + "captions/"                       
image_dir = root + "images/"                           

token_file = "Flickr8k.token.txt"
```

<!-- more -->

### Text preparation

Build a vocabulary. The vocabulary consists of all the possible words which can be used - both as input into the model, and as an output prediction. To build the vocabulary, there are serval steps:

1. Parse the lines variable in the starter code, splitting the image ID from the caption text.
2. Split caption text into words and trim any trailing whitespaces.
3. Convert all words into lowercase by calling word.lower().
4. Remove any punctuation (periods, commas, etc.).
5. Since the vocabulary size affects the embedding layer dimensions, it is better to remove the very infrequently used words from the vocabulary. Remove any words which appear 3 times or less; this should leave you with a vocabulary size of roughly 3400.
6. Add all the remaining words to an instance of the `Vocabulary()` object provided. Note that `vocab.add_word()` deals with duplicates already.

**Create `Vocabulary` class**:

```python
class Vocabulary(object):
    """Simple vocabulary wrapper which maps every unique word to an integer ID. """
    def __init__(self):
        # Intially, set both the IDs and words to empty dictionaries.
        self.word2idx = {}
        self.idx2word = {}
        self.idx = 0

    def add_word(self, word):
        # If the word does not already exist in the dictionary, add it
        if not word in self.word2idx:
            self.word2idx[word] = self.idx
            self.idx2word[self.idx] = word
            # Increment the ID for the next word
            self.idx += 1

    def __call__(self, word):
        # If we try to access a word in the dictionary which does not exist, return the <unk> id
        if not word in self.word2idx:
            return self.word2idx['<unk>']
        return self.word2idx[word]

    def __len__(self):
        return len(self.word2idx)
```

**Read ground truth text file**:

```python
def read_lines(filepath):
    """ Open the ground truth captions into memory, line by line. """
    file = open(filepath, 'r')
    lines = []

    while True: 
        # Get next line from file until there's no more
        line = file.readline() 
        if not line: 
            break
        lines.append(line.strip())
    file.close() 
    return lines

lines = read_lines(caption_dir + token_file)
```

**Split the image ID and caption text and do processing**:

```python
import re
import string

image_ids = []
captions = []

for i in lines:
    image_ids.append(i.split('\t')[0][:-6])
    # split the caption text into words and convert all words into lowercase
    i = i.split('\t')[1].replace(" .", ".").lower()
    # remove any punctuation
    i = re.sub("[{}]+".format(string.punctuation), "", i)
    captions.append(i.split())
```

Remove any words which appear 3 times or less. There are many different ways to implement it. I split all captions into words, then use the funciton in `collections` package to count the number of all words.

```python
total = sum(captions, [])

from collections import Counter
word = []
c = Counter(total)
for j in range(len(c)):
    if list(c.values())[j] > 3:
        word.append(list(c.keys())[j])
```

Build the vocabulary.

```python
# Create a vocab instance
vocab = Vocabulary()

# Add the token words first
vocab.add_word('<pad>')
vocab.add_word('<start>')
vocab.add_word('<end>')
vocab.add_word('<unk>')

for i in word:
    vocab.add_word(i)
    
len(vocab)
```

Because four words were added into `vocab`, the `vocab` should include **3440** words.

### Dataset and loaders for training

**Build Flickr8k class for the dataset**:

```python
from PIL import Image
import cv2
from nltk import tokenize
from torch.utils.data import Dataset, DataLoader

class Flickr8k(Dataset):
    """ Flickr8k custom dataset compatible with torch.utils.data.DataLoader. """
    
    def __init__(self, df, vocab, transform=None):
        """ Set the path for images, captions and vocabulary wrapper.
        
        Args:
            df: df containing image paths and captions.
            vocab: vocabulary wrapper.
            transform: image transformer.
        """
        self.df = df
        self.vocab = vocab
        self.transform = transform

    def __getitem__(self, index):
        """ Returns one data pair (image and caption). """

        vocab = self.vocab

        caption = self.df['caption'][index]
        img_id = self.df['image_id'][index]
        path = self.df['path'][index]

        image = Image.open(open(path, 'rb'))

        if self.transform is not None:
            image = self.transform(image)

        # Convert caption (string) to word ids.
        tokens = caption.split()
        caption = []
        # Build the Tensor version of the caption, with token words
        caption.append(vocab('<start>'))
        caption.extend([vocab(token) for token in tokens])
        caption.append(vocab('<end>'))
        target = torch.Tensor(caption)
        return image, target

    def __len__(self):
        return len(self.df)
```

This class extends the `torch.utils.data.Dataset` class and requires the following two methods:

* `__getitem__(self, index)`: get index number subscript to return data object
* `__len__(self)`: return length of the total amount of data

**Overwrite the default PyTorch `collate_fn()`**：

Because our ground truth captions are sequential data of varying lengths. The default `collate_fn()` does not support merging the captions with padding.

```python
def caption_collate_fn(data):
    """ Creates mini-batch tensors from the list of tuples (image, caption).
    Args:
        data: list of tuple (image, caption). 
            - image: torch tensor of shape (3, 256, 256).
            - caption: torch tensor of shape (?); variable length.
    Returns:
        images: torch tensor of shape (batch_size, 3, 256, 256).
        targets: torch tensor of shape (batch_size, padded_length).
        lengths: list; valid length for each padded caption.
    """
    # Sort a data list by caption length from longest to shortest.
    data.sort(key=lambda x: len(x[1]), reverse=True)
    images, captions = zip(*data)

    # Merge images (from tuple of 3D tensor to 4D tensor).
    images = torch.stack(images, 0)

    # Merge captions (from tuple of 1D tensor to 2D tensor).
    lengths = [len(cap) for cap in captions]
    targets = torch.zeros(len(captions), max(lengths)).long()
    for i, cap in enumerate(captions):
        end = lengths[i]
        targets[i, :end] = cap[:end]        
    return images, targets, lengths
```

Return some images, captions and captions lendth.

**Write dataloaders**:

use `collate_fn = caption_collate_fn` to replace the `collate_fn`.

```python
train_loader = DataLoader(
    dataset_train,
    batch_size=128,
    shuffle=True,
    collate_fn=caption_collate_fn
)

test_loader = DataLoader(
    dataset_test,
    batch_size=128,
    shuffle=False,
    collate_fn=caption_collate_fn
)
```

### Encoder and decoder models

Complete the class by writing the `forward()` function. Put the part involving the ResNet in a `with torch.no_grad()` block.

Note that the LSTM and RNN models are used separately once at a time.

```python
import torch
import torch.nn as nn
import torchvision.models as models
from torch.nn.utils.rnn import pack_padded_sequence

class EncoderCNN(nn.Module):
    def __init__(self, embed_size):
        """Load the pretrained ResNet-152 and replace top fc layer."""
        super(EncoderCNN, self).__init__()
        resnet = models.resnet152(pretrained=True) # Pre-trained on ImageNet by default
        layers = list(resnet.children())[:-1]      # Keep all layers except the last one
        # Unpack the layers and create a new Sequential
        self.resnet = nn.Sequential(*layers)
        
        # We want a specific output size, which is the size of our embedding, so
        # we feed our extracted features from the last fc layer (dimensions 1 x 1000)
        # into a Linear layer to resize
        self.linear = nn.Linear(resnet.fc.in_features, embed_size)
        
        # Batch normalisation helps to speed up training
        self.bn = nn.BatchNorm1d(embed_size, momentum=0.01)
        
    def forward(self, images):
        """Extract feature vectors from input images."""
        
        # Complete graph here. Remember to put the ResNet layer in a with torch.no_grad() block
        with torch.no_grad():
            features = self.resnet(images)
        # print("resnet_out:", features.shape)
        features = features.view(features.size(0), -1)
        # features = features.reshape(features.size(0), -1)
        # print("reshape:", features.shape)
        features = self.linear(features)
        # print("linear:", features.shape)
        features = self.bn(features)

        return features

class DecoderRNN(nn.Module):
    def __init__(self, embed_size, hidden_size, vocab_size, num_layers, max_seq_length=20):
        """Set the hyper-parameters and build the layers."""
        super(DecoderRNN, self).__init__()
        
        # What is an embedding layer?
        self.embed = nn.Embedding(vocab_size, embed_size)

        # Define this layer (one at a time)
        # self.lstm / self.rnn
        self.lstm = nn.LSTM(input_size=embed_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        # self.lstm = nn.RNN(input_size=embed_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        
        self.linear = nn.Linear(hidden_size, vocab_size)
        self.max_seq_length = max_seq_length
        
    def forward(self, features, captions, lengths):
        """Decode image feature vectors and generates captions."""
        embeddings = self.embed(captions)
        embeddings = torch.cat((features.unsqueeze(1), embeddings), 1)
        # What is "packing" a padded sequence?
        packed = pack_padded_sequence(embeddings, lengths, batch_first=True) 

        hiddens, _ = self.lstm(packed) # Replace with self.rnn when using RNN
        outputs = self.linear(hiddens[0])
        return outputs
    
    def sample(self, features, states=None):
        """Generate captions for given image features using greedy search."""
        sampled_ids = []
        inputs = features.unsqueeze(1)
        for i in range(self.max_seq_length):
            hiddens, states = self.lstm(inputs, states)          # hiddens: (batch_size, 1, hidden_size)
            outputs = self.linear(hiddens.squeeze(1))            # outputs:  (batch_size, vocab_size)
            _, predicted = outputs.max(1)                        # predicted: (batch_size)
            sampled_ids.append(predicted)
            inputs = self.embed(predicted)                       # inputs: (batch_size, embed_size)
            inputs = inputs.unsqueeze(1)                         # inputs: (batch_size, 1, embed_size)
        sampled_ids = torch.stack(sampled_ids, 1)                # sampled_ids: (batch_size, max_seq_length)
        return sampled_ids
```

Initialize the models and set the learning parameters.

```python
import numpy as np

# Build the models
encoder = EncoderCNN(embed_size).to(device)
decoder = DecoderRNN(embed_size, hidden_size, len(vocab), num_layers).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()

# Optimisation will be on the parameters of BOTH the enocder and decoder,
# but excluding the ResNet parameters, only the new added layers.
params = list(
    decoder.parameters()) + list(encoder.linear.parameters()) + list(encoder.bn.parameters()
)

optimizer = torch.optim.Adam(params, lr=learning_rate)

```

### Training the model

Since I need to train the LSTM and RNN models separately, the corresponding parameters have to be changed. Save the model once before training, and then save the model after each epoch training.

#### Train using an RNN for decoder

Add an RNN layer to the decoder where indicated, using the API as reference: https://pytorch.org/docs/stable/nn.html#rnn. Keep all the default parameters except for `batch_first`, which you may set to `True`.

Train for 5 epochs. Generate a sample caption from two test set images before any training, and after each epoch. Display both the sample images, the reference captions, generated caption, and its BLEU score after every epoch.

#### Train using an LSTM for decoder

Replace the RNN layer with an LSTM: https://pytorch.org/docs/stable/nn.html#lstm. The other operation is same as RNN. 

```python
encoder.train()
decoder.train()

if not os.path.exists(model_path):
    os.makedirs(model_path)

# before training
torch.save(encoder.state_dict(), os.path.join(model_path, 'RNN-encoder-0.ckpt'))
torch.save(decoder.state_dict(), os.path.join(model_path, 'RNN-decoder-0.ckpt'))

# Train the models
total_step = len(train_loader)
for epoch in range(num_epochs):
    for i, (images, captions, lengths) in enumerate(train_loader):

        # Set mini-batch dataset
        images = images.to(device)
        captions = captions.to(device)

        # Packed as well as we'll compare to the decoder outputs
        targets = pack_padded_sequence(captions, lengths, batch_first=True)[0]

        # Forward, backward and optimize
        features = encoder(images)
        outputs = decoder(features, captions, lengths)

        loss = criterion(outputs, targets)
        
        # Zero gradients for both networks
        decoder.zero_grad()
        encoder.zero_grad()

        loss.backward()
        optimizer.step()

        # Print log info
        if i % log_step == 0:
            print('Epoch [{}/{}], Step [{}/{}], Loss: {:.4f}'
                  .format(epoch, num_epochs, i, total_step, loss.item())) 

        # If you want to save the model checkpoints - recommended once you have everything working
        # Make sure to save RNN and LSTM versions separately
        # if (i+1) % save_step == 0:
        #     torch.save(decoder.state_dict(), os.path.join(model_path, 'decoder-{}-{}.ckpt'.format(epoch+1, i+1)))
        #     torch.save(encoder.state_dict(), os.path.join(model_path, 'encoder-{}-{}.ckpt'.format(epoch+1, i+1)))
    # loss_lstm.append(loss.item())    
    loss_rnn.append(loss.item())
    torch.save(decoder.state_dict(), os.path.join(model_path, 'RNN-decoder-{}.ckpt'.format(epoch+1)))
    torch.save(encoder.state_dict(), os.path.join(model_path, 'RNN-encoder-{}.ckpt'.format(epoch+1)))
print('Finished')
```

Collect the loss of LSTM and RNN, plot the figure to compare them.

```python
def plot_loss(lstm, rnn):
    x = np.arange(0, 5)

    plt.figure()
    plt.plot(x, lstm, "r", "-", linewidth=1)

    plt.plot(x, rnn, "b", ":", linewidth=1)

    plt.xlabel("epoch")
    plt.ylabel("loss")
    plt.title("Loss of LSTM and RNN")
    
plot_loss(loss_lstm, loss_rnn)
```

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/Snipaste_2020-04-10_11-26-38.png)

### BLEU for evaluation

One common way of comparing a generated text to a reference text  is using BLEU (Binlingual Evaluation Understudy). This article gives a good intuition to how the BLEU score is computed: [A Gentle Introduction to Calculating the BELU Score for Text in Python](https://machinelearningmastery.com/calculate-bleu-score-for-text-python). And here is a version translated by myself: [Calculating the BELU Score for Text Python](https://tech-hurley.netlify.app/2020/04/calculating-belu-for-text/).

The Python `nltk` package for natural language processing provides functions which computes this score given one or more reference texts and a hypothesis. You can import it on Google Colab like this:

```python
from nltk.translate.bleu_score import sentence_bleu
from nltk.translate.bleu_score import corpus_bleu
```

1. Display two sample images from test dataset, the reference captions, generated caption, and its BLEU score after every epoch. Train for 5 epochs.
2. Compare training using an LSTM vs. RNN for the decoder network (BELU scores over the whole test set, performance on long captions vs. short captions, etc.).

**Random Interface from dataset**:

```python
import random

def getRandomImage(img_list):
    """Returns a random filename, choose among the files of the given path"""
    index = random.randrange(0, len(img_list))
    return img_list[index], index

def loadImage(image_path, transform=None):
    image = Image.open(image_path)
    image = image.resize([224, 224])

    if transform is not None:
        image = transform(image).unsqueeze(0)

    return image

img_list = []
img_path = caption_dir + "Flickr_8k.testImages.txt"

with open(img_path, 'r') as f:
    for i in f:
        img_list.append(i.strip())
        
img_list = []
img_path = caption_dir + "Flickr_8k.testImages.txt"

with open(img_path, 'r') as f:
    for i in f:
        img_list.append(i.strip())
        
image1_id = image_ids.index(filename1[:-4])
image2_id = image_ids.index(filename2[:-4])
```

Using code above can get two sample images from test dataset randomly.

**Transform id to words**:

Since the captions we get are ids, I need to transform them to words.

```python
from nltk.translate.bleu_score import corpus_bleu

def transform_idx_to_words(input):
    sampled_caption = []

    for idx in input:
        word = vocab.idx2word[idx]
        sampled_caption.append(word)

        if word == '<end>':
            break
    
    output = ' '.join(sampled_caption[1:-1])
    output = output.replace(' ,', ',')
    
    return output.split(' ')
```

#### Get BLEU Scores of LSTM

```python
from nltk.translate.bleu_score import sentence_bleu

bleu_score1 = []
bleu_score2 = []
show1_captions = []
show2_captions = []

bleu_scores = []
long_scores = []
short_scores = []

for model_name in range(len(epoch_checkpoint)):
    print(model_name)
    encoder_model_path = os.path.join(model_path, 'LSTM-encoder-{}.ckpt'.format(model_name))
    decoder_model_path = os.path.join(model_path, 'LSTM-decoder-{}.ckpt'.format(model_name))

    test_encoder = EncoderCNN(embed_size)
    test_decoder = DecoderRNN(embed_size, hidden_size, len(vocab), num_layers)    

    test_encoder.load_state_dict(torch.load(encoder_model_path))
    test_decoder.load_state_dict(torch.load(decoder_model_path))

    if torch.cuda.is_available():
        test_encoder = test_encoder.to(device)
        test_decoder = test_decoder.to(device)

    test_encoder.eval()
    test_decoder.eval()

    image1 = image1.to(device)
    image2 = image2.to(device)

    predicted, actual = list(), list()
    predicted_total, actual_total = list(), list()    

    for i in range(len(test_loader.dataset)):
        image, caption = test_loader.dataset.__getitem__(i)
        image = image.unsqueeze(0).to(device)
        features = test_encoder(image)
        caps = test_decoder.sample(features)
        caps = caps.cpu().data.numpy()[0,:]
        if i % 5 == 0:
            predicted_total.append(" ".join(transform_idx_to_words(caps[0:])))

        actual_total.append(caption.numpy())

    actual_total = [[transform_idx_to_words(item)] for item in actual_total]

    refer_total = [[] for _ in range(len(predicted_total))]

    for i in range(len(actual_total)):
        sentence = " ".join(actual_total[i][0])
        refer_total[i//5].append(sentence)

    bleu = corpus_bleu(refer_total, predicted_total, weights=(0.5, 0.5, 0, 0))

    # long and short captions
    long_captions = [[] for _ in range(len(refer_total))]
    short_captions = [[] for _ in range(len(refer_total))]
    for i in range(len(refer_total)):
        for j in range(5):
            if (refer_total[i][j].count(" ") + 1 > 12):
                long_captions[i].append(refer_total[i][j])
            else:
                short_captions[i].append(refer_total[i][j])

    exist1 = 0
    for i in range(len(long_captions)):
        if long_captions[i]:
            exist1 = exist1 + 1;
        else:
            long_captions[i] = ['']

    exist2 = 0
    for j in range(len(short_captions)):
        if short_captions[j]:
            exist2 = exist2 + 1;
        else:
            short_captions[j] = ['']

    bleu_long = corpus_bleu(long_captions, predicted_total, weights=(0.5, 0.5, 0, 0))
    bleu_short = corpus_bleu(short_captions, predicted_total, weights=(0.5, 0.5, 0, 0))

    feature1 = test_encoder(image1)
    cap1 = test_decoder.sample(feature1)
    cap1 = cap1.cpu().data.numpy()
    # cap1 = cap1[0,:]

    feature2 = test_encoder(image2)
    cap2 = test_decoder.sample(feature2)
    cap2 = cap2.cpu().data.numpy()
    # cap2 = cap2[0,:]
 
    predicted.append(cap1)
    predicted.append(cap2)

    predicted1 = " ".join(transform_idx_to_words(predicted[0][0,:]))
    predicted2 = " ".join(transform_idx_to_words(predicted[1][0,:]))

    print("The generated caption of 1st image: " + predicted1)

    hypotheses = list()
    references = list()
    refer = list()

    # 1st image
    hypotheses.append(predicted1)
    show1_captions.append(predicted1)
    for i in range(len(epoch_checkpoint) - 1):
        refer.append(cleaned_captions[image1_id + i])
    references.append(refer)

    bleu1 = corpus_bleu(references, hypotheses, weights=(0.5, 0.5, 0, 0))

    # 2nd image
    print("The generated caption of 2nd image: " + predicted2)

    hypotheses.clear()
    references.clear()
    refer.clear()

    hypotheses.append(predicted2)
    show2_captions.append(predicted2)
    for i in range(len(epoch_checkpoint) - 1):
        refer.append(cleaned_captions[image2_id + i])
    references.append(refer)

    bleu2 = corpus_bleu(references, hypotheses, weights=(0.5, 0.5, 0, 0)) 

    bleu_score1.append((model_name, bleu1))
    bleu_score2.append((model_name, bleu2))
    bleu_scores.append((model_name, bleu))
    long_scores.append((model_name, bleu_long))
    short_scores.append((model_name, bleu_short))
    print('done for model: {}'.format(model_name))
```

The code above includes the BLEU scores of two sample images, the whole test dataset and the scores of long captions and short captions.

Get the scores as following shows:

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/Snipaste_2020-04-10_11-39-49.png)

Plot figures to show two sample image and the scores of each epoch:

```python
import matplotlib.image as img

npic = 2

count = 1
fig = plt.figure(figsize=(30,20))

pic1 = img.imread(data_df.loc[image1_id, 'path'])
pic2 = img.imread(data_df.loc[image2_id, 'path'])

for j in range(2):
    ax = fig.add_subplot(npic,2,count,xticks=[],yticks=[])
    if j == 0:
        ax.imshow(pic1)
        show_captions = show1_captions
    else:
        ax.imshow(pic2)
        show_captions = show2_captions
    count += 1

    ax = fig.add_subplot(npic,2,count)
    plt.axis('off')
    ax.plot()
    ax.set_xlim(0, 1)
    ax.set_ylim(len(show_captions), 0)
    for i, caption in enumerate(show_captions):
        if j == 0:
            ax.text(0,i,'BLEU score: ' + str(bleu_score1[i][1]) + ', ' + caption,fontsize=20)
        else:
            ax.text(0,i,'BLEU score: ' + str(bleu_score2[i][1]) + ', ' + caption,fontsize=20)

    count += 1  
plt.show()
```

![](https://raw.githubusercontent.com/HurleyJames/ImageHosting/master/Snipaste_2020-04-10_11-41-29.png)

#### Get BLEU Scores of RNN

As for RNN model, almost same as LSTM, only a few parameters shoudl replace `LSTM` to `RNN`.

### Conclusion

By comparing the BLEU scores of LSTM and RNN, it can be seen that LSTM has better performance than RNN. The scores of LSTM are higher overall than RNN. 

In addition, the short captions have high BLEU scores than long captions ( I set a long caption have more than 12 words at least), both for LSTM and RNN model. May be BLEU does well in short captions.

The full code can be viewed at Github: [Image_Caption_Generation.ipynb](https://github.com/HurleyJames/NNs/blob/master/Image_Caption_Generation.ipynb).

### Reference

[1] M. Hodosh, P. Young and J. Hockenmaier (2013) "Framing Image Description as a Ranking Task: Data, Models and Evaluation Metrics", Journal of Artifical Intellegence Research, Volume 47, pages 853-899 (http://www.jair.org/papers/paper3994.html)