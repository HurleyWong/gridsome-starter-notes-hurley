---
title: 论文实现：A visual data profiling tool for Electronic Health Records (EHRs) dataset
date: 2021-02-17T21:00:00+08:00
published: false
slug: visualization-ehr
tags:
- visualization
- EHR
- Django
cover_image: "./images/visualization-ehr.png"
canonical_url: false
description: 常规电子健康记录数据的可视化分析。
---

:::note 🎯 Aim
The aim of this project is to investigate effective visualization techniques for profiling EHRs, and implement them in a Python tool. Hence, this project will develop compact (sparkline-type or based on glyphs) methods that allow users to visualize descriptive statistics for hundreds of variables at a time.
:::

## 什么是 EHR

Electronic Health Records (EHR)，中文意思是电子健康记录，是病人纸质病历的电子版本。它收集和整理了护理中各个方面随着时间变化的信息，是实时的、以病人为中心的记录，可以即时、安全地向授权用户提供信息。它包含了哪些数据类型？从**药物描述**（包括通过标准化系统记录的日期和剂量）等**结构化信息**到**临床描述**（描述处方背后的医学推理）等**非结构化信息**，常见的主要有病史、诊断、药物、治疗计划、免疫日期、过敏症、放射图像等。因此，应用于 EHR 的可视化分析可以极大地帮助医生根据病人的临床状态识别其潜在的患病风险。

## EHR 可视化

关于 EHR 可视化的内容，这里主要参考了 [Visualization of Medical Data Based on EHR Standards](https://pdfs.semanticscholar.org/0cf2/2fdf7c1d86ce2f7a1462a2b08c015289c8e1.pdf) 这篇论文。这篇论文同样是对 EHR 进行可视化分析，其中根据已经存在的几种可视化标准（openEHR, ISO 13606, HL7）分析了几种不同的可视化模型：

* LifeLines projects
* The PropeR project
* GastrOS project
* MUDR electronic health record

其中，有的是通过图形化展示所有的医疗数据，有的是通过 web 的方式展现，有的则是应用 GUI 的方式。

除此之外，这篇论文还探究了另外一个部分：**分析患者对于医疗数据的感知**。传统的研究是以医生为导向，几乎不考虑病人是 EHR 的活跃用户。而实际上，让患者访问他们的健康记录对它们的医疗保健都是有好处的。

## 可视化方案

在本项目中，主要是通过 sparkline-type or based on glyphs 的方式去进行可视化。同时，要避免使用到主要面向商业化的 Tableau 框架去实现。最终通过比对，决定使用 web 页面的方式来实现（因为项目本身规模并不庞大），使用基于 Python 的 Django 框架，可视化框架使用基于 Plotly 的 Dash 框架来进行可视化操作。

### Dash

> Dash & Plotly
are how the world productionizes Python analytics.

既然是数据可视化并且进行数据分析，这显然是 Python 的绝对强项而非 JavaScript。因此，我们希望能够直接使用基于 Python 实现的可视化而不用 JS。

> Dash & Dash Enterprise let you build & deploy analytic web apps using Python, R, and Julia. No JavaScript or DevOps required.

### Usage

因为本项目的核心部分是可视化数据分析吗，所以界面的精美程度暂时不在考虑范围之内。所以，在界面 UI 方面，我们实现地十分简洁，只提供了一个上传 .csv 文件的方式，然后将结果展现给用户。本项目代码位于：[Visualization-EHRs](https://github.com/HurleyWong/Visualization-EHRs)

1. Open this Django project by Pycharm and type `python manage.py runserver` in the terminal.
2. Enter `localhost:8080/datagrid` in the browser, upload the `test_data.csv` file in the `EHR_statistic_app` directory of this project, select `Program_Year` or `Payment_Year` in the top bar `Provider Name`, and then click the `Submit` button to see the visual analysis interface.

![The Screenshot of Result for Visualization-EHRs](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2d87e504-5d1b-46b4-915b-38dfd87b7120%2FUntitled.png?table=block&id=fc288b54-c144-4447-bf09-94f655f214b0&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=6270&userId=&cache=v2)

## Reference

1. [Visualization of Medical Data Based on EHR Standards](https://pdfs.semanticscholar.org/0cf2/2fdf7c1d86ce2f7a1462a2b08c015289c8e1.pdf)