---
title: 外文翻译：A Gentle Introduction to Calculating the BELU Score for Text in Python
date: 2020-04-04T21:00:00+08:00
published: false
slug: calculating-belu-for-text
tags:
- BLEU
- translate
cover_image: "./images/calculating-belu-for-text.png"
canonical_url: false
description: 对外文 "A Gentle Introduction to Calculating the BELU Score for Text in Python" 的翻译与解释
---

:::note 📜 Intro

BLEU, or the Bilingual Evaluation Understudy, is a score for comparing a candidate translation or text to one or more reference translations.

Although developed for translation, it can be used to evaluate text generated for a suite of natural language processing tasks.

:::

### Aim

* A gentle introduction to the BLEU score and an intuition for what is being calculated.
* How to calculate BLEU scores in Python using the NLTK library for sentences and documents.
* How to use a suite of small examples to develop an intuition for how differences between a candidate and reference text impact the final BLEU score.

<!-- more -->

### Bilingual Evaluation Understudy Score

简称 BLEU，意思是双语评估替补，是用于评估模型生成的句子 (candidate) 和实际的句子 (reference) 的差异的指标。

它的取值范围在 $[0, 1]$ 之间。如果两个句子完美匹配 (perfect match)，那么 BLEU 是 1.0；如果两个句子是完美不匹配 (perfect mismatch)，那么 BLEU 是 0.0。

BLEU 分数是由 Kishore Papineni 在其 2002 年的论文 "*BLEU: a Method for Automatic Evaluation of Machine Translation*" 中提出。

1. 该方法通过分别计算 candidate 句中 n-gram 与 reference 中的 n-gram 来工作的。

    > The primary programming task for a BLEU implementor is to compare n-grams of the candidate with the n-grams of the reference translation and count the number of matched. These matches are position-independent. The more the matched, the better the candidate translation is.

2. 使用修正的 n-gram 精度。即修改匹配中 n-gram 的技术以确保将 reference 中的单词的出现也考虑在内，而不是使用大量的 candidate 的翻译。

    > Unfortunately, MT systems can overgenerate "reasonable" words, resulting in improbable, but high-precision, translations [...] Intuitively the problem is clear: a reference word should be considered exhausted after a matching candidate word is identified. We formalize this intuition as the modified unigram precision.

**unigram** 的准确率可以用于衡量单词翻译的准确性，更高阶的 **n-gram** 的准确率可以用来衡量句子的流畅性。

> BLEU偏向于短翻译分数更高一点。

### Calculate BLEU Scores

Python 自然语言工具库或者 NLTK 提供了 BLEU 分数的计算方法，可以使用该分数来评估生成的文本。

#### 句子的BLEU值

NLTK 提供`sentence_bleu()`方法来评估一组 candidate 和 reference 的 BLEU 得分情况。例如：

```python
from nltk.translate.bleu_score import sentence_bleu
reference = [['this', 'is', 'a', 'test'], ['this', 'is', 'test']]
candidate = ['this', 'is', 'a', 'test']
score = sentence_bleu(reference, candidate)
print(score)
```

运行上面这个例子会得到一个完美的分数 1.0，因为 candidate 与 reference 是完全匹配的。

#### 语料库的BLEU值

NLTK 还提供了一个`corpus_bleu()`的方法，用于计算多个句子（段落或者文档）的 BLEU 的值。

参考句必须由一系列的 documents 组成，每个 document 都应该由一系列的 references 组成，而每个句子又应该拆分为一个个的 token。例子：

```python
from nltk.translate.bleu_score import corpus_bleu
references = [[['this', 'is', 'a ', 'test'], ['this', 'is', 'test']]]
candidates = [['this', 'is', 'a', 'test']]
score = corpus_bleu(references, candidates)
print(score)
```

输出结果仍然是完美匹配 1.0。这个例子看起来和上一个很相似，不同的是又多了一个维度（三个中括号）。

### Cumulative and Individual BLEU Scores

NLTK 中的 BLEU 值的计算可以指定不同的 n-gram 的权重。这样就意味着可以灵活使用不同类型的 BLEU 分数，例如单个的和累计的 n-gram 分数。

#### 单个的值

单个的 n-gram 的值是对 gram 是否按特定顺序排列的评估方式，比如 1-gram 和 2-gram (biggram)。例子：

```python
# 1-gram individual BLEU
from nltk.translate.bleu_score import sentence_bleu
reference = [['this', 'is', 'small', 'test']]
candidate = ['this', 'is', 'a', 'test']
score = sentence_bleu(reference, candidate, weights=(1, 0, 0, 0))
print(score)
```

上面这个例子把 1-gram 的权重设置为 1，其余的为 0。

所以运行出来的结果是 0.75。

如果把 candidate 的顺序打乱，如下所示：

```python
candidate = ['this', 'test', 'is', 'a']
score = sentence_bleu(reference, candidate, weights=(1, 0, 0, 0))
print(score)
```

运行结果仍然是 0.75。

如果使用 n-grams，则例子 (4-grams) 如下：

```python
# n-gram individual BLEU
from nltk.translate.bleu_score import sentence_bleu
reference = [['this', 'is', 'a', 'test']]
candidate = ['this', 'is', 'a', 'test']
print('Individual 1-gram: %f' % sentence_bleu(reference, candidate, weights=(1, 0, 0, 0)))
print('Individual 2-gram: %f' % sentence_bleu(reference, candidate, weights=(0, 1, 0, 0)))
print('Individual 3-gram: %f' % sentence_bleu(reference, candidate, weights=(0, 0, 1, 0)))
print('Individual 4-gram: %f' % sentence_bleu(reference, candidate, weights=(0, 0, 0, 1)))
```

结果如下：

```python
Individual 1-gram: 1.000000
Individual 2-gram: 1.000000
Individual 3-gram: 1.000000
Individual 4-gram: 1.000000
```

尽管可以计算单个的 BLEU 的值，但是这种方式的含义是有限的，不是常规使用的方式，所以引出累计的 BLEU 的值。

#### 累计的值

累计的 n-gram 是指计算从 1 到 n 的所有阶数的单个 n-gram 的值，并通过计算其加权几何平均值对其进行加权。

在默认情况下，`sentence_bleu()`和`corpus_bleu()`都是计算累计的 4-gram 的 BLEU 的值，称之为 **BELU-4**。

通过计算 BELU-1，BLEU-2，BLEU-3，BLEU-4 的累计值来说明：

```python
# cumulative BLEU scores
from nltk.translate.bleu_score import sentence_bleu
reference = [['this', 'is', 'small', 'test']]
candidate = ['this', 'is', 'a', 'test']
print('Cumulative 1-gram: %f' % sentence_bleu(reference, candidate, weights=(1, 0, 0, 0)))
print('Cumulative 2-gram: %f' % sentence_bleu(reference, candidate, weights=(0.5, 0.5, 0, 0)))
print('Cumulative 3-gram: %f' % sentence_bleu(reference, candidate, weights=(0.33, 0.33, 0.33, 0)))
print('Cumulative 4-gram: %f' % sentence_bleu(reference, candidate, weights=(0.25, 0.25, 0.25, 0.25)))
```

得到的结果与单个的值相比有很大的不同：

```python
Cumulative 1-gram: 0.750000
Cumulative 2-gram: 0.500000
Cumulative 3-gram: 0.000000
Cumulative 4-gram: 0.000000
```

### Reference

1. [A Gentle Introduction to Calculating the BELU Score for Text in Python](https://machinelearningmastery.com/calculate-bleu-score-for-text-python/)