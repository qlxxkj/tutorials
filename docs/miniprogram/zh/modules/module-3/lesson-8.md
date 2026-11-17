# 第 8 课：云开发架构与初始化

## 8.1 什么是云开发

云开发 = 云函数（后端）+ 云数据库（存储）+ 云存储（文件），全部在微信后台完成，**免服务器、免运维**。

```
小程序页面
  └── wx.cloud.callFunction('login')  →  云函数（Node.js 沙箱）
          └── db.collection('users').where({ openid })  →  云数据库（文档型）
```

## 8.2 开通云开发

1. 在微信开发者工具中，点击顶部"云开发"按钮
2. 选择环境（建议选国内）
3. 创建环境（如 `prod`）
4. 在 `app.js` 中初始化：

```js
// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'your-env-id'  // 在云开发控制台找到
    })
  },
  globalData: {}
})
```

## 8.3 创建云函数

在开发者工具中：

1. 右键 `cloudfunctions/` 目录 → "新建云函数"
2. 输入名称（如 `login`），生成模板文件

```js
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { openid, unionid } = wxContext
  return { openid, unionid }
}
```

3. 右键云函数目录 → "上传并部署"

## 8.4 在页面中调用

```js
// 页面中调用云函数
async loadUser() {
  try {
    const res = await wx.cloud.callFunction({ name: 'login' })
    this.setData({ openid: res.result.openid })
  } catch (e) {
    console.error(e)
  }
}
```

## 8.5 云开发 vs 自建后端

| 维度 | 云开发 | 自建（Hono/Express） |
|------|--------|---------------------|
| 部署 | 免运维，点击部署 | 需要 VPS + systemd |
| 成本 | 免费额度够用 | 服务器费用 |
| 数据库 | 文档型（MongoDB-like） | 任意（PostgreSQL 等） |
| 灵活性 | 受限于微信 API | 完全自由 |
| 适合 | MVP、小型工具 | 中大型、复杂业务 |

> 本课程以云开发为主（零门槛），家谱管理项目（project-2）会演示自建后端方案。

---

**小结**：云开发让独立开发者无需维护服务器，10 分钟开通，点几下鼠标就有完整的后端。
