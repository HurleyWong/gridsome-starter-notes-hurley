// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const marked = require('marked')
    // const yaml = require('js-yaml')

module.exports = {
    siteUrl: 'https://tech.hurley.fun/',
    siteName: "Hurley's Tech Site",
    siteDescription: '',

    templates: {
        Post: '/:year/:month/:slug',
        Tag: '/tag/:id',
    },

    plugins: [{
            // Create posts from markdown files
            use: '@gridsome/source-filesystem',
            options: {
                typeName: 'Post',
                path: 'content/posts/*.md',
                refs: {
                    // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
                    tags: {
                        typeName: 'Tag',
                        create: true,
                    },
                },
            },
        },
        {
            use: 'gridsome-plugin-feed',
            options: {
                contentTypes: ['Post'],
                feedOptions: {
                    title: "Hurley's Blog",
                    description: 'Hurley Huang',
                },
                rss: {
                    enabled: true,
                    output: '/posts/index.xml',
                },
                htmlFields: ['description', 'content'],
                enforceTrailingSlashes: false,
                filterNodes: node => node.published,
                nodeToFeedItem: node => ({
                    title: node.title,
                    date: node.date || node.fields.date,
                    content: marked(node.content),
                }),
            },
        },
        {
            use: '@gridsome/plugin-google-analytics',
            options: {
                id: 'UA-111664763-2',
            },
        },
    ],

    transformers: {
        // Add markdown support to all file-system sources
        remark: {
            useBuiltIns: true,
            externalLinksTarget: '_blank',
            externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
            slug: true,
            autolinkHeadings: true,
            autolinkClassName: 'icon icon-link',
            plugins: [
                // flow chart plugin
                'gridsome-plugin-remark-mermaid',
                // ['@gridsome/remark-prismjs', { transformInlineCode: false }],
                // ['gridsome-plugin-remark-shiki', { theme: 'nord', skipInline: true }],
                'gridsome-plugin-remark-container',
                'gridsome-remark-katex',
                'gridsome-plugin-remark-youtube',
                'gridsome-remark-figure-caption',
            ],
            config: {
                footnotes: true,
            },
            // grayMatter: {
            //   engines: {
            //     yaml: s => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }),
            //   },
            // },
        },
    },
}