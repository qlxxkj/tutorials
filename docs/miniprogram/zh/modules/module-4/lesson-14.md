# 第 14 课：openid / unionid 与会员系统

## 14.1 openid vs unionid

| 字段 | 唯一性 | 场景 |
|------|--------|------|
| `openid` | 同一用户 + 同一小程序 | 小程序内识别用户 |
| `unionid` | 同一用户 + 同一微信开放平台下所有应用 | 跨小程序/H5/公众号识别 |

> 如果你的产品有多个小程序或公众号，用 `unionid` 做用户统一身份；只有单个小程序用 `openid` 就够。

```js
// 云函数获取 unionid
exports.main = async (event) => {
  const { UNIONID } = cloud.getWXContext()
  return { unionid: UNIONID }
}
```

> 获取 `unionid` 需要：小程序已绑定微信开放平台 + 开通 unionid 功能（开放平台后台申请）。

## 14.2 会员系统设计

```
users 集合
├── openid: string
├── unionid: string（可选）
├── nickname: string
├── avatar: string
├── phone: string
├── role: 'member' | 'premium' | 'admin'
├── expireAt: date（会员到期时间）
└── createdAt: date
```

### 判断会员是否有效

```js
// cloudfunctions/check-member/index.js
exports.main = async (event) => {
  const { openid } = event
  const userRes = await db.collection('users').where({ openid }).get()
  const user = userRes.data[0]

  if (!user) return { isMember: false }

  // 会员角色 + 未过期
  const isMember = user.role !== 'member' &&
    (user.expireAt === null || user.expireAt > new Date())

  return { isMember, role: user.role, expireAt: user.expireAt }
}
```

## 14.3 会员升级流程

```js
// 支付成功回调中升级
// cloudfunctions/pay-callback/index.js（在 status=paid 之后）
async function upgradeMember(orderId) {
  const order = await db.collection('orders').doc(orderId).get()
  const { openid, goodsId } = order.data

  // goodsId 对应升级包，如 'premium-1y'
  const duration = GOODS_DURATION[goodsId]  // { 'premium-1y': 365 }

  const userRes = await db.collection('users').where({ openid }).get()
  const user = userRes.data[0]

  // 在原到期时间基础上叠加，而非覆盖
  const base = user.expireAt && user.expireAt > new Date()
    ? user.expireAt
    : new Date()

  const newExpire = new Date(base.getTime() + duration * 24 * 60 * 60 * 1000)

  await db.collection('users').doc(user._id).update({
    data: { role: 'premium', expireAt: newExpire }
  })
}
```

## 14.4 权限中间件（云函数）

每个需要登录的接口统一校验：

```js
// utils/auth.js（云函数内使用）
function requireAuth(openid, minRole = 'member') {
  const roleRank = { guest: 0, member: 1, premium: 2, admin: 3 }
  const userRank = roleRank[getUserRole(openid)] || 0
  if (userRank < roleRank[minRole]) {
    throw new Error(`权限不足：需要 ${minRole}`)
  }
}
```

> 云函数中权限控制必须做在云端，不能只靠前端隐藏按钮。

## 14.5 用户数据模型扩展

| 字段 | 用途 |
|------|------|
| `credits` | 积分（会员消费、签到） |
| `couponIds` | 持有优惠券 |
| `invites` | 邀请人数（裂变） |
| `lastActiveAt` | 最近活跃时间（RFM 模型） |

---

**小结**：单个产品用 `openid`，多产品用 `unionid`。会员到期时间用叠加而非覆盖，权限校验必须在云函数侧。
