# 第 2 课：技术架构与目录结构

## 2.1 小程序的基本结构

一个页面由 4 个文件组成（称为"四件套"）：

```
pages/
  index/
    index.wxml   # 模板（结构）
    index.wxss   # 样式
    index.js     # 逻辑
    index.json   # 页面配置（标题、导航栏等）
```

全局文件：

```
miniprogram/
├── app.js           # 小程序入口，App() 定义全局生命周期
├── app.json         # 全局配置：页面路由、窗口样式、底部 TabBar
├── app.wxss         # 全局样式
├── project.config.json  # 开发者工具配置（AppID）
└── sitemap.json     # 微信索引配置（影响"搜一搜"流量）
```

## 2.2 app.json 关键字段

```json
{
  "pages": [
    "pages/index/index",
    "pages/detail/detail",
    "pages/mine/mine"
  ],
  "window": {
    "navigationBarTitleText": "我的小程序",
    "navigationBarBackgroundColor": "#fff",
    "backgroundColor": "#f8f8f8"
  },
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "images/icon-home.png" },
      { "pagePath": "pages/mine/mine", "text": "我的", "iconPath": "images/icon-mine.png" }
    ]
  }
}
```

> `pages` 数组第一项是首页；TabBar 最多 5 项，最少 2 项。

## 2.3 为什么推荐原生小程序

| 框架 | 特点 | AI 生成友好度 | 推荐场景 |
|------|------|-------------|---------|
| 原生小程序 | 语法简单，文档完善 | 高 | 独立开发者、MVP |
| Taro | 跨三端（小程序/H5/App） | 中 | 需要多平台 |
| Uni-app | Vue 语法，多端编译 | 中 | 已有 Vue 经验 |

原生小程序代码量最少（一个页面 4 个文件），AI 理解力最强（WXML 接近 HTML），学习曲线最低。

## 2.4 用 AI 生成页面

告诉 AI 你的需求，它会直接生成完整的 WXML / WXSS / JS 三个文件：

```
帮我写一个微信小程序首页，功能是展示天气信息。
顶部是城市名称和温度大字，中间是天气图标和描述，
底部是 7 天天气预报横向滚动列表。
风格简洁，用浅蓝色背景。
```

AI 生成的代码直接粘贴到对应文件即可，通常需要微调 1-3 处。

---

**小结**：理解四件套和 app.json 是所有后续开发的基础。页面结构越清晰，AI 生成越准确。
