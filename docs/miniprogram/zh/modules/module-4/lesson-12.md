# 第 12 课：wx.login 与手机号授权

## 12.1 wx.login 流程

`wx.login` 获取临时 `code`，云函数用 `code` 换取 `openid`/`session_key`，完成静默登录：

```js
// 页面中获取 code
wx.login({
  success: async (res) => {
    const code = res.code  // 临时登录凭证，5 分钟有效
    const loginRes = await wx.cloud.callFunction({
      name: 'login',
      data: { code }
    })
    this.setData({ openid: loginRes.result.openid })
  }
})
```

```js
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  // 云函数可直接从 context 拿 openid，无需 code 兑换
  const { OPENID, UNIONID } = cloud.getWXContext()

  // 查用户是否已存在
  const userRes = await db.collection('users').where({ openid: OPENID }).get()

  if (userRes.data.length === 0) {
    const newUser = await db.collection('users').add({
      data: { openid: OPENID, unionid: UNIONID, createdAt: db.serverDate() }
    })
    return { openid: OPENID, isNew: true, userId: newUser._id }
  }

  return { openid: OPENID, isNew: false, userId: userRes.data[0]._id }
}
```

> 在云函数中用 `cloud.getWXContext()` 直接拿到 `OPENID`，比 `wx.login` → `code2session` 简单得多。

## 12.2 手机号快速验证

用户点按钮授权手机号（需企业认证 + 开通微信支付）：

```xml
<button open-type="getPhoneNumber" bindgetphonenumber="onGetPhone">
  手机号登录
</button>
```

```js
async onGetPhone(e) {
  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    wx.showToast({ title: '未授权', icon: 'none' })
    return
  }

  // 云函数验证手机号
  const res = await wx.cloud.callFunction({
    name: 'phone-login',
    data: { code: e.detail.code }  // 新版直接传 code
  })

  if (res.result.phone) {
    this.setData({ phone: res.result.phone })
    wx.showToast({ title: '登录成功' })
  }
}
```

```js
// cloudfunctions/phone-login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { code } = event
  try {
    const res = await cloud.openapi({
      method: 'phonenumber.getPhoneNumber',
      data: { code }
    })
    if (res.errcode === 0) {
      return { phone: res.phone_info.purePhoneNumber }
    }
    return { error: res.errmsg }
  } catch (e) {
    return { error: e.message }
  }
}
```

> 个人主体小程序不支持手机号授权，只能用 `wx.login` 静默获取 openid。

## 12.3 登录态管理

```js
// 登录成功后本地缓存 token
wx.setStorageSync('openid', openid)

// 页面加载时检查登录态
onLoad() {
  const openid = wx.getStorageSync('openid')
  if (!openid) {
    this.doLogin()  // 触发 wx.login
  }
}
```

| 场景 | 方式 |
|------|------|
| 静默获取用户身份 | `wx.login` → openid |
| 获取手机号 | `open-type="getPhoneNumber"` |
| 获取昵称头像 | 用户手动填写（微信 2021 起不再提供 `wx.getUserProfile`） |
| 免打扰登录 | 不调用 `wx.login`，直接功能页 |

---

**小结**：`wx.login` 是最基础的登录方式，手机号授权适合需要绑定用户的场景。个人主体只能用 openid，企业主体才能拿手机号。
