---
title: How to decide two static websites generators -- Gatsby and Gridsome?
date: 2021-01-28T21:00:00+08:00
published: true
slug: gastby-vs-gridsome
tags:
- gatsby
- gridsome
- Vue.js
- React
cover_image: "./images/gatsby-vs-gridsome.png"
canonical_url: false
description: How do you choose the right framework for you?
---

:::note ⚙️ For Devs
In this article, I will compare and explain the differences between a static website using two leading JS frameworks -- React and Vue.js. Actually, with their respective static site generators, **Gatsby** and **Gridsome**.
:::

## JAMstack

If you still have not use static websites, then I think now is the best time for you to try. Static sites, or what we call JMAstack, have become very popular recently.

The term JAMstack was first proposed by Netlify, and it stands for:

* JavaScript -- web developer's best friend, a place where the logic is executed
* APIs -- providers for JS to pull data from
* Markup -- templates, processed at deployment time of your website

![What is JAMstack?](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F26982df2-0caf-44d1-8960-57bba01844ab%2FUntitled.png?table=block&id=bedeaa7f-66b7-4da0-967b-df63bcd57ecc&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=3810&userId=&cache=v2)

The key aspect to JAMstack is that it does not depend on a web server. It can make you to run a beautiful website within a few hours.

> To summarize, the main idea behind the JAMstack is the removal of any tight connection between client and server. The only way to receive your data is through APIs.

### Pricing

Price is the biggest advantage of static websites that I totally agree with this view. We can deploy our static website on Netlify, free and fast. Of course, you can choose to host it on other platforms, such as Vercel, which is also simple to use. The simplest possibility is to deploy websites directly on Github Pages, while the speed may not be ideal.

In any case, the basic needs for using these platforms are free, and the free package can already meet the needs of most people. If you want a meaningful or easy-to-remember domain name, then you can go to domain name service providers to buy a domain name and bind it to your JAMstack adderss. It depends on you.

### Stability

Well, is it not enough stability? In fact, as we deploy websites in the stable services, including Netlify, Vercel, etc., the stability is great! They are good enough for the performance of static websites. Additionally, there are better, big-name serverless service providers, such as AWS, Google, etc. for developers to choose!

### Shortcoming

Obviously, static websties also have some disadvantages. As the website functions become more powerful, and even more content in the website, the loading process of the website may slow down. I have seen many personal websites with powerful plugins and dazzling interfaces. However, when I open such websites, the fan of my MacBook Pro even starts to spin quickly!

Therefore, not all websites can be replaced by serverless services, and JAMstack may not be suitable for websites that require a lot of functions and traffic.

## Gatsby

Gatsby can be said to be the most popular static website generator at present. It allows developers to use Webpack. In addition, because of the powerful community, it has many plugins that can help you implement any functions you want.

![Gatsby](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7fb04379-0803-4267-acd7-eb091a5f93bf%2FUntitled.png?table=block&id=89d69069-7e3c-4695-85c2-98bbebc189c3&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5700&userId=&cache=v2)

In terms of development language, it is based on React, which means you need to master at least `.JSX` and other skills. Everything in Gatsby is built with React! As for data sources, it use the query language developed by Fackbook. Yes, that's **GraphQL**. Although I think that different SQLs are essentially the same, the synatx of GraphQL is indeed different from the Oracle or MySQL that developers often choose to use, so, I hope you do not mind and can control it.

Finally, one of the most important aspects of Gatsby is its **eco-system**. As of the time of writing this blog post, it already has about 700 plugins and a huge number of starters that the developers can choose to build directly and quickly. Note that the code in their starter project is not **shit**, that is to say, it is not difficult to modify the style and functions of the website you want to own on the basis of other developer's starter.

### Quick Start

1. Create a new site

    ```shell
    npm init gatsby
    ```

2. Once everything is downloaded, you will see a message with instructions for navigating to your site and running it locally.

    ```shell
    # going to the directory with
    cd your-own-name-to-store

    # start the local development server with
    npm run develop
    ```

    Gatsby will start a hot-reloading development environment accessible by default at `localhost:8080`.

3. Now you can happy code by yourself!

## Gridsome

For static websites based on Vue.js, Gridsome is undoubtedly the leader framework. It also uses GraphQL, also has convenient construction packages and browsing performance, and also supports necessary functions for sites such as PWA. However, the shortcomings of it are of course obvious. Compared with React, Vue.js is indeed not born so early, so the birth of Girdsome is much later than Gatsby. Fortunately, its project documentation and community are constantly growing, so it can really give developers high hopes.

![Gridsome](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2644378a-905f-4018-b30e-06d8d96cb86f%2FUntitled.png?table=block&id=13120fc7-3eac-4b11-85eb-2685a91722ec&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=5550&userId=&cache=v2)

As you can see this site, my own article blog, it is based on the Gridsome-Blog-Starter. I just modified the style, use plugins to add some useful functions on the basis. Then, I am proud of it!

### Usage

1. Install Gridsome CLI tool
   * using YARN: `yarn global add @gridsome/cli`
   * using NPM: `npm install --global @gridsome/cli`
2. Create a Gridsome project
   1. `gridsome create my-gridsome-site` to create a new project
   2. `cd my-gridsome-site` to move into project directory
   3. `gridsome develop` to start local dev server at `localhost:8080`
   4. Cheers and happy coding~

## GraphQL

We found that the above two popular static website generator frameworks all use **GraphQL**, to query data. What is GraphQL? How is it different from traditional SQL?

GraphQL was invented by Fackbook. It is a query language for Graph, actually, for graph data, which is particularly advantageous. Developers may think is has relationship with SQL, however, as the matter of fact, they just share the suffix "QL". They are essentially different languages. Well, some developers who know NoSQL may think that GraphQL is a tpye of NoSQL, such as a graph database named Neo4j. Unfortunately, there is still no necessary relationship between these two. GraphQL does not rely on any database, and can be used with any backend, and can also be included on the RESTful API.

The biggest advantage of GraphQL is to query graph data as I mentioned above. Well, in this way, it may be a little abstract, so if I mention RESTful API, it will not unfamiliar to the developers. We usually develop a RESTful API to request complex tree data, such as using JSON format. However, if a new attribute needs to be added, then the implementation of the RESTful API needs to be changed. GraphQL can help us solve this problem well. If the produce introduces some new object types, for the GraphQL, we only need to use GraphQL to describe these newly added edges and vertices when querying the data, without changing the API to implement.

Abstract? Let's compare how a GraphQL is used basically.

```json
{
  "hero": {
    "name": "Hurley Huang",
    "height": 1.76,
    "gender": "male",
  }
}
```

The above is a simple data returned in JSON format. Then, if it corresponds to such data, how to use GraphQL to query it?

```sql
{
  hero {
    name
    height
    gender
  }
}
```

Too simple and direct! You only need to make a GraphQL request to the API to get exactly the data you want. Applications using GraphQL work fast and stable.

It also has some other differences from the RESTful API. We make RESTful API requests by loading multiple URLs and then processing at the same time. As for the GraphQL, it can get all the data with one request, too fast!

```sql
{
  hero {
    name
    friends {
      name
    }
  }
}
```

There are too many features actually, and there is definitely no end to the introduction here. Look below, GraphQL is already being used by teams of all sizes. I highly recommend that since you have been experienced to Gatsby and Gridsome, you might as well learn about this simple and promising GraphQL!

![使用 GraphQL 的部分厂商](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7490423a-b150-4c35-81b0-fa29979e11e6%2FUntitled.png?table=block&id=4f97d5bc-c923-43a9-97db-11b61dd1be81&spaceId=77b9deb7-cc8a-4bc2-82c7-73fdf2893565&width=4230&userId=&cache=v2)

## Which one is the Winner

In this article, I have shown you how to use these two different JS frameworks to build static sites. So, which one is better?

From my own perspective, I would not say that one is better than other because both are great! Hence, I use Gatsby to build my [Homepage](https://withh.life) and Gridsome in my [Blog](https://blog.withh.life). If you can both use React and Vue.js, or if you know how to use JavaScirpt, you might as well try both of them and choose which one is the suitable framework for you.

## Reference

[1] https://kontent.ai/blog/react-or-vue-gatsby-or-gridsome

[2] https://blog.logrocket.com/the-best-static-websites-generators-compared-5f1f9eeeaf1a

[3] https://www.gatsbyjs.com/docs/quick-start

[4] https://gridsome.org/docs

[5] https://graphql.cn