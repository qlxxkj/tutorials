import { defineConfig, defaultTheme } from 'vitepress'

export default defineConfig({
  title: 'Palantir FDE 工程师培训',
  description: 'Frontend Development Engineer 入门与进阶指南',
  lang: 'zh-CN',
  base: '/palantir-fde/',

  ignoreDeadLinks: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/vp-icons.css' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'Palantir FDE 工程师培训' }],
    ['meta', { property: 'og:description', content: 'Frontend Development Engineer 入门与进阶指南' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '课程', link: '/zh/' },
      { text: '资源', link: '/zh/appendix/resources' },
      { text: 'FAQ', link: '/zh/appendix/faq' },
    ],
    sidebar: {
      '/zh/': [
        {
          text: '课程简介',
          items: [
            { text: '入门指南', link: '/zh/' },
            { text: '学习资源', link: '/zh/appendix/resources' },
            { text: '常见问题', link: '/zh/appendix/faq' },
            { text: '课程总览', link: '/zh/summary' },
          ],
        },
        {
          text: '模块一：认识 FDE',
          collapsed: false,
          items: [
            { text: '第 1 课：什么是 Palantir FDE', link: '/zh/modules/module-1/lesson-1' },
            { text: '第 2 课：技术栈概览', link: '/zh/modules/module-1/lesson-2' },
            { text: '第 3 课：Palantir 产品矩阵', link: '/zh/modules/module-1/lesson-3' },
          ],
        },
        {
          text: '模块二：前端基础巩固',
          collapsed: false,
          items: [
            { text: '第 4 课：TypeScript 深度实践', link: '/zh/modules/module-2/lesson-4' },
            { text: '第 5 课：React 高级模式', link: '/zh/modules/module-2/lesson-5' },
            { text: '第 6 课：前端工程化', link: '/zh/modules/module-2/lesson-6' },
          ],
        },
        {
          text: '模块三：Foundry 应用开发',
          collapsed: false,
          items: [
            { text: '第 7 课：Foundry 应用架构', link: '/zh/modules/module-3/lesson-7' },
            { text: '第 8 课：Ontology 本体建模', link: '/zh/modules/module-3/lesson-8' },
            { text: '第 9 课：Template Builder', link: '/zh/modules/module-3/lesson-9' },
            { text: '第 10 课：自定义模板开发', link: '/zh/modules/module-3/lesson-10' },
          ],
        },
        {
          text: '模块四：AIP 与高级特性',
          collapsed: false,
          items: [
            { text: '第 11 课：AI Platform (AIP) 入门', link: '/zh/modules/module-4/lesson-11' },
            { text: '第 12 课：Ontology API 开发', link: '/zh/modules/module-4/lesson-12' },
            { text: '第 13 课：数据可视化与图表', link: '/zh/modules/module-4/lesson-13' },
          ],
        },
        {
          text: '模块五：实战项目',
          collapsed: false,
          items: [
            { text: '项目一：搭建第一个 Foundry 应用', link: '/zh/modules/module-5/project-1' },
            { text: '项目二：构建 Ontology 驱动的业务面板', link: '/zh/modules/module-5/project-2' },
            { text: '项目三：AIP Agent 应用开发', link: '/zh/modules/module-5/project-3' },
          ],
        },
        {
          text: '总结与进阶',
          collapsed: false,
          items: [
            { text: '课程回顾与学习路径', link: '/zh/summary' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
      options: {
        placeholders: '搜索 FDE 培训内容...',
      },
    },
    footer: {
      message: 'Palantir FDE 工程师培训',
      copyright: 'Copyright © 2026 qlxxkj',
    },
  },
})
