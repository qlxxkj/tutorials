import { defineConfig, defaultTheme } from 'vitepress'

export default defineConfig({
  title: 'ComfyUI 完全指南',
  description: '从零掌握 ComfyUI 本地图像生成',
  lang: 'zh-CN',
  base: '/comfyui/',

  ignoreDeadLinks: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/vp-icons.css' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'ComfyUI 完全指南' }],
    ['meta', { property: 'og:description', content: '从零掌握 ComfyUI 本地图像生成' }],
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
          text: '模块一：认识 ComfyUI',
          collapsed: false,
          items: [
            { text: '第 1 课：什么是 ComfyUI', link: '/zh/modules/module-1/lesson-1' },
            { text: '第 2 课：为什么选择 ComfyUI', link: '/zh/modules/module-1/lesson-2' },
            { text: '第 3 课：界面导航与核心概念', link: '/zh/modules/module-1/lesson-3' },
          ],
        },
        {
          text: '模块二：环境搭建',
          collapsed: false,
          items: [
            { text: '第 4 课：安装与启动', link: '/zh/modules/module-2/lesson-4' },
            { text: '第 5 课：模型下载与管理', link: '/zh/modules/module-2/lesson-5' },
            { text: '第 6 课：自定义节点安装', link: '/zh/modules/module-2/lesson-6' },
          ],
        },
        {
          text: '模块三：基础操作',
          collapsed: false,
          items: [
            { text: '第 7 课：第一个工作流——文生图', link: '/zh/modules/module-3/lesson-7' },
            { text: '第 8 课：理解节点与连线', link: '/zh/modules/module-3/lesson-8' },
            { text: '第 9 课：常用参数详解', link: '/zh/modules/module-3/lesson-9' },
          ],
        },
        {
          text: '模块四：进阶技巧',
          collapsed: false,
          items: [
            { text: '第 10 课：角色一致性——IP-Adapter', link: '/zh/modules/module-4/lesson-10' },
            { text: '第 11 课：精确控制——ControlNet', link: '/zh/modules/module-4/lesson-11' },
            { text: '第 12 课：局部重绘——Inpainting', link: '/zh/modules/module-4/lesson-12' },
          ],
        },
        {
          text: '模块五：图像实战',
          collapsed: false,
          items: [
            { text: '第 13 课：生成角色参考图', link: '/zh/modules/module-5/lesson-13' },
            { text: '第 14 课：批量生成分镜画面', link: '/zh/modules/module-5/lesson-14' },
            { text: '第 15 课：画质修复与放大', link: '/zh/modules/module-5/lesson-15' },
          ],
        },
        {
          text: '模块六：高效工作流',
          collapsed: false,
          items: [
            { text: '项目一：搭建个人图像生产流', link: '/zh/modules/module-6/project-1' },
            { text: '项目二：建立风格模板库', link: '/zh/modules/module-6/project-2' },
            { text: '项目三：批量并行生产', link: '/zh/modules/module-6/project-3' },
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
    footer: {
      message: 'ComfyUI 完全指南',
      copyright: 'Copyright © 2026 qlxxkj',
    },
    search: {
      provider: 'local',
      options: {
        placeholders: '搜索 ComfyUI 教程...',
      },
    },
  },
})
