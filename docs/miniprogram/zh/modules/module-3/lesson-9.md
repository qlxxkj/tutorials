# 第 9 课：云数据库 CRUD 实战

## 9.1 创建集合

在云开发控制台 → 数据库 → 创建集合（如 `todos`）。

集合权限（右上角）：
- **所有用户可读，仅创建者可写**：适合公开内容
- **仅创建者可读写**：适合私人数据
- **所有用户可读，所有用户可写**：公开社区（慎用）

## 9.2 CRUD 操作

```js
const db = wx.cloud.database()
const _ = db.command

// 增
await db.collection('todos').add({
  data: {
    title: '买牛奶',
    done: false,
    createTime: db.serverDate()  // 服务器时间（推荐，避免时区问题）
  }
})

// 查（单条）
const res = await db.collection('todos').doc('docId').get()
console.log(res.data.title)

// 查（多条，分页）
const list = await db.collection('todos')
  .where({ done: false })
  .orderBy('createTime', 'desc')
  .skip(0)
  .limit(10)
  .get()

// 改
await db.collection('todos').doc('docId').update({
  data: { done: true }
})

// 删
await db.collection('todos').doc('docId').remove()
```

## 9.3 在云函数中操作数据库

云函数中权限更高，可以绕过客户端权限限制：

```js
// cloudfunctions/todo-list/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid } = cloud.getWXContext()
  const res = await db.collection('todos')
    .where({ openid })  // 只查当前用户的数据
    .orderBy('createTime', 'desc')
    .limit(50)
    .get()
  return { todos: res.data }
}
```

## 9.4 用 AI 生成 CRUD 云函数

```
帮我写一个云函数 todo-crud，支持 4 个操作：
- action=add：添加一条 todo（title, note）
- action=list：列出当前用户所有 todo（分页，page/pageSize）
- action=toggle：切换某条 todo 的 done 状态
- action=delete：删除某条 todo
所有操作校验 openid，只操作自己的数据。
```

## 9.5 数据索引

在云开发控制台 → 数据库 → 集合 → "索引管理"，为常用查询字段建索引：

| 字段 | 索引类型 | 用途 |
|------|---------|------|
| `openid` | 单字段 | 按用户查数据 |
| `createTime` | 单字段 | 按时间排序 |
| `openid + createTime` | 复合 | 按用户+时间查 |

> 不建索引的查询全表扫描，数据量大后性能急剧下降。

---

**小结**：云数据库语法接近 MongoDB，AI 生成 CRUD 云函数是最常见的后端任务，掌握 5 个基本操作（增删改查分页）就够用了。
