# 第 10 课：云函数 — 后端逻辑 AI 实现

## 10.1 云函数能做什么

| 场景 | 示例 |
|------|------|
| 用户登录 | 验证 openid、创建/查找用户记录 |
| 数据增删改查 | 待办事项、订单、评论 |
| 第三方 API | 调用天气、地图、AI 服务 |
| 支付回调 | 微信支付结果通知 |
| 定时任务 | 每天清理过期数据（需配置定时触发器） |
| 消息推送 | 订阅消息（需用户授权） |

## 10.2 典型登录云函数

```js
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 查询用户是否存在
  const userRes = await db.collection('users').where({ openid }).get()

  if (userRes.data.length === 0) {
    // 新用户：创建记录
    const newUser = await db.collection('users').add({
      data: {
        openid,
        nickname: '',
        avatar: '',
        role: 'member',
        createdAt: db.serverDate()
      }
    })
    return { openid, isNew: true, userId: newUser._id }
  }

  // 老用户：返回已有记录
  const user = userRes.data[0]
  return { openid, isNew: false, userId: user._id, role: user.role }
}
```

## 10.3 调用第三方 API（示例：天气）

```js
// cloudfunctions/get-weather/index.js
const cloud = require('wx-server-sdk')
const axios = require('axios')  // 云函数支持 npm 包

exports.main = async (event, context) => {
  const { city } = event
  try {
    const res = await axios.get(`https://api.tianqi.com/?city=${encodeURIComponent(city)}`)
    return { code: 0, data: res.data }
  } catch (e) {
    return { code: -1, message: e.message }
  }
}
```

> 云函数支持 `require` 任意 npm 包，在云开发控制台"云函数" → 函数详情 → "依赖" 中安装。

## 10.4 用 AI 生成云函数的 Prompt 模板

```
帮我写一个云函数 order-create：
- 输入：{ productIds: [], quantity, address, phone }
- 逻辑：
  1. 校验 productIds 非空
  2. 查商品价格（collection 'products'）
  3. 计算总价
  4. 创建订单记录（status: 'pending'）
  5. 返回 orderId
- 错误处理：商品不存在返回 code=404，其他错误返回 code=500
- 用 openid 标识下单用户
```

## 10.5 云函数部署与调试

```
右键 cloudfunctions/order-create/ → "上传并部署：云端安装依赖"
```

调试方式：
- 开发者工具 → 云开发 → 云函数 → 选中函数 → "测试" 输入 JSON 参数
- 查看控制台日志（云开发控制台 → 日志）
- 线上报错查看"云函数日志"，支持筛选时间范围

---

**小结**：云函数是小程序的后端大脑。AI 生成 + 控制台调试的组合，让没有后端经验的人也能写出生产级业务逻辑。
