import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'qlxxkj Tutorials',
  description: 'AI 编程与跨境电商教程合集',
  lang: 'zh-CN',
  base: '/',

  ignoreDeadLinks: true,
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/vp-icons.css' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'qlxxkj 教程中心' }],
    ['meta', { property: 'og:description', content: 'Claude Code、Codex、亚马逊运营教程合集' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '课程',
        items: [
          { text: 'Claude Code 入门', link: '/claude-code/' },
          { text: 'Codex 从零到一', link: '/codex/' },
          { text: '亚马逊运营 SOP', link: '/amazon/' },
        ],
      },
    ],
    sidebar: {
      '/claude-code/': [
        {
          text: 'Claude Code 入门教程',
          items: [
            { text: '课程简介', link: '/claude-code/zh/' },
            { text: '课程总览', link: '/claude-code/zh/summary' },
            { text: '模块一：认识 Claude Code', collapsed: true, items: [
              { text: '第 1 课：AI 编程助手是什么？', link: '/claude-code/zh/modules/module-1/lesson-1' },
              { text: '第 2 课：Claude Code 能帮你做什么？', link: '/claude-code/zh/modules/module-1/lesson-2' },
              { text: '第 3 课：认识 Claude Code 界面', link: '/claude-code/zh/modules/module-1/lesson-3' },
            ]},
            { text: '模块二：基础操作', collapsed: true, items: [
              { text: '第 4 课：文件与文件夹', link: '/claude-code/zh/modules/module-2/lesson-4' },
              { text: '第 5 课：用自然语言写代码', link: '/claude-code/zh/modules/module-2/lesson-5' },
              { text: '第 6 课：调试和错误处理', link: '/claude-code/zh/modules/module-2/lesson-6' },
              { text: '第 7 课：使用技能完成复杂任务', link: '/claude-code/zh/modules/module-2/lesson-7' },
            ]},
            { text: '模块三：进阶技巧', collapsed: true, items: [
              { text: '第 8 课：提示词工程', link: '/claude-code/zh/modules/module-3/lesson-8' },
              { text: '第 9 课：Web 搜索与信息收集', link: '/claude-code/zh/modules/module-3/lesson-9' },
              { text: '第 10 课：自动化工作流', link: '/claude-code/zh/modules/module-3/lesson-10' },
            ]},
            { text: '模块四：最佳实践', collapsed: true, items: [
              { text: '第 11 课：与 AI 合作的最佳实践', link: '/claude-code/zh/modules/module-4/lesson-11' },
              { text: '第 12 课：搭建个人知识库', link: '/claude-code/zh/modules/module-4/lesson-12' },
            ]},
            { text: '模块五：项目实战', collapsed: true, items: [
              { text: '项目 1：自动化日报系统', link: '/claude-code/zh/modules/module-5/project-1' },
              { text: '项目 2：自动化内容发布', link: '/claude-code/zh/modules/module-5/project-2' },
              { text: '项目 3：个人财务追踪器', link: '/claude-code/zh/modules/module-5/project-3' },
              { text: '项目 4：会议记录助手', link: '/claude-code/zh/modules/module-5/project-4' },
            ]},
            { text: '模块六：总结与进阶', collapsed: true, items: [
              { text: '第 15 课：总结与进阶', link: '/claude-code/zh/modules/module-6/lesson-15' },
              { text: '第 16 课：课后反馈与下一步', link: '/claude-code/zh/modules/module-6/lesson-16' },
            ]},
            { text: '附录', collapsed: true, items: [
              { text: '常见问题 FAQ', link: '/claude-code/zh/appendix/faq' },
              { text: '术语表', link: '/claude-code/zh/appendix/glossary' },
              { text: '课前准备清单', link: '/claude-code/zh/appendix/prep-checklist' },
              { text: '反馈表单', link: '/claude-code/zh/appendix/feedback' },
            ]},
          ],
        },
      ],
      '/codex/': [
        {
          text: 'Codex 从零到一',
          items: [
            { text: '课程简介', link: '/codex/zh/' },
            { text: '模块一：认识 Codex', collapsed: true, items: [
              { text: '第 1 课：AI 编程助手是什么？', link: '/codex/zh/modules/module-1/lesson-1' },
              { text: '第 2 课：Codex 能帮你做什么？', link: '/codex/zh/modules/module-1/lesson-2' },
              { text: '第 3 课：Codex vs 其他工具', link: '/codex/zh/modules/module-1/lesson-3' },
            ]},
            { text: '模块二：上手准备', collapsed: true, items: [
              { text: '第 4 课：准备工作', link: '/codex/zh/modules/module-2/lesson-4' },
              { text: '第 5 课：安装 Codex 桌面 App', link: '/codex/zh/modules/module-2/lesson-5' },
              { text: '第 6 课：认识 Codex 界面', link: '/codex/zh/modules/module-2/lesson-6' },
              { text: '第 7 课：第一次对话', link: '/codex/zh/modules/module-2/lesson-7' },
            ]},
            { text: '模块三：核心功能', collapsed: true, items: [
              { text: '第 8 课：文件操作', link: '/codex/zh/modules/module-3/lesson-8' },
              { text: '第 9 课：自然语言驱动', link: '/codex/zh/modules/module-3/lesson-9' },
              { text: '第 10 课：联网与资料检索', link: '/codex/zh/modules/module-3/lesson-10' },
              { text: '第 11 课：自动化任务', link: '/codex/zh/modules/module-3/lesson-11' },
            ]},
            { text: '模块四：实用技巧', collapsed: true, items: [
              { text: '第 12 课：如何写出更好的指令', link: '/codex/zh/modules/module-4/lesson-12' },
              { text: '第 13 课：安全与权限管理', link: '/codex/zh/modules/module-4/lesson-13' },
              { text: '第 14 课：Codex 的"技能"', link: '/codex/zh/modules/module-4/lesson-14' },
            ]},
            { text: '模块五：项目实战', collapsed: true, items: [
              { text: '项目 1：整理你的电脑', link: '/codex/zh/modules/module-5/project-1' },
              { text: '项目 2：生成一份 PPT 报告', link: '/codex/zh/modules/module-5/project-2' },
              { text: '项目 3：做一个简单网页', link: '/codex/zh/modules/module-5/project-3' },
              { text: '项目 4：待办事项管理小工具', link: '/codex/zh/modules/module-5/project-4' },
            ]},
            { text: '模块六：总结与进阶', collapsed: true, items: [
              { text: '第 15 课：课程回顾与学习路径', link: '/codex/zh/modules/module-6/lesson-15' },
              { text: '第 16 课：下一步可以学什么', link: '/codex/zh/modules/module-6/lesson-16' },
            ]},
            { text: '附录', collapsed: true, items: [
              { text: '常见问题 FAQ', link: '/codex/zh/appendix/faq' },
              { text: '术语速查表', link: '/codex/zh/appendix/glossary' },
              { text: '课前准备清单', link: '/codex/zh/appendix/prep-checklist' },
              { text: '课后反馈表', link: '/codex/zh/appendix/feedback' },
            ]},
          ],
        },
      ],
      '/amazon/': [
        {
          text: '亚马逊运营 SOP',
          items: [
            { text: '课程简介', link: '/amazon/' },
            { text: '目录', link: '/amazon/SUMMARY' },
            { text: '第1章 平台与业务认知', link: '/amazon/chapters/chapter-01' },
            { text: '第2章 账号注册与合规运营', link: '/amazon/chapters/chapter-02' },
            { text: '第3章 选品与市场调研', link: '/amazon/chapters/chapter-03' },
            { text: '第4章 供应链与产品开发', link: '/amazon/chapters/chapter-04' },
            { text: '第5章 Listing打造与优化', link: '/amazon/chapters/chapter-05' },
            { text: '第6章 广告与流量运营', link: '/amazon/chapters/chapter-06' },
            { text: '第7章 物流与仓储管理', link: '/amazon/chapters/chapter-07' },
            { text: '第8章 运营数据分析与优化', link: '/amazon/chapters/chapter-08' },
            { text: '第9章 客户服务与评价管理', link: '/amazon/chapters/chapter-09' },
            { text: '第10章 品牌打造与进阶策略', link: '/amazon/chapters/chapter-10' },
            { text: '每日运营工作清单', link: '/amazon/daily/operation-daily-report' },
            { text: '附录', collapsed: true, items: [
              { text: '常见问题 FAQ', link: '/amazon/appendix/faq' },
              { text: '术语表', link: '/amazon/appendix/glossary' },
              { text: '准备清单', link: '/amazon/appendix/prep-checklist' },
              { text: '反馈表单', link: '/amazon/appendix/feedback' },
            ]},
            { text: '模板', collapsed: true, items: [
              { text: '周度广告报告模板', link: '/amazon/templates/ad-weekly-report-template' },
              { text: '竞品分析模板', link: '/amazon/templates/competitor-analysis-template' },
              { text: '利润计算模板', link: '/amazon/templates/profit-calculation-template' },
              { text: '供应商评估模板', link: '/amazon/templates/supplier-evaluation-template' },
            ]},
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 qlxxkj',
    },
    search: {
      provider: 'local',
      options: {
        placeholders: ['搜索教程内容...'],
      },
    },
  },
})
