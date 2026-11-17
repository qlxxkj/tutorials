# 第 13 课：微信支付完整流程

## 13.1 前置条件

| 条件 | 说明 |
|------|------|
| 企业主体 | 个人主体不支持微信支付 |
| 开通微信支付商户号 | 在 [pay.weixin.qq.com](https://pay.weixin.qq.com) 申请 |
| 关联小程序 | 商户后台 → 产品中心 → 绑定小程序 |
| 开通云开发 | 推荐用云开发，免服务器，SDK 内置支付 |

## 13.2 云开发内置支付（最简方案）

```js
// cloudfunctions/create-order/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { openid, goodsId, price } = event
  // price 单位：分

  // 1. 创建订单记录
  const orderRes = await db.collection('orders').add({
    data: {
      openid,
      goodsId,
      price,
      status: 'pending',
      createdAt: db.serverDate()
    }
  })
  const orderId = orderRes._id

  // 2. 发起支付（云开发内置，无需自己调微信支付 API）
  const payRes = await cloud.cloudPay.unifiedOrder({
    body: `商品-${goodsId}`,
    outTradeNo: orderId,
    spbillCreateIp: '127.0.0.1',
    totalFee: price,  // 单位：分
    envId: cloud.DYNAMIC_CURRENT_ENV,
    functionName: 'pay-callback'  // 支付结果回调云函数
  })

  return {
    paySignData: {
      ...payRes,
      nonceStr: payRes.nonceStr
    }
  }
}
```

```js
// 页面中调起支付
async pay() {
  const orderRes = await wx.cloud.callFunction({
    name: 'create-order',
    data: { openid: this.data.openid, goodsId: this.data.goodsId, price: 990 }
  })

  const res = await wx.cloud.cloudPay.requestPayment(orderRes.result.paySignData)
  wx.showToast({ title: '支付成功', icon: 'success' })
}
```

## 13.3 支付回调（服务端验证）

```js
// cloudfunctions/pay-callback/index.js
exports.main = async (event, context) => {
  // event 中微信支付会推送回调信息
  const { outTradeNo, resultCode } = event

  if (resultCode === 'SUCCESS') {
    const db = cloud.database()
    await db.collection('orders').doc(outTradeNo).update({
      data: { status: 'paid', paidAt: db.serverDate() }
    })
    // 触发后续业务：发货、开通会员、发送订阅消息
  }
  return { errcode: 0 }
}
```

> **关键原则**：永远以服务端回调为准，不要以客户端 `requestPayment` 成功为支付完成依据。客户端可能被拦截或伪造。

## 13.4 常见错误排查

| 错误码 | 原因 |
|--------|------|
| `ORDERPAID` | 订单已支付，重复调用 |
| `NOTENOUGH` | 余额不足 |
| `SYSTEMERROR` | 微信支付系统异常，重试即可 |
| 回调未触发 | `functionName` 配置错误或云函数未部署 |

## 13.5 退款

```js
// cloudfunctions/refund/index.js
exports.main = async (event) => {
  const { orderId, refundPrice } = event  // 单位：分
  const order = await db.collection('orders').doc(orderId).get()

  const res = await cloud.cloudPay.refund({
    outTradeNo: orderId,
    outRefundNo: `R${orderId}`,
    totalFee: order.data.price,
    refundFee: refundPrice,
    envId: cloud.DYNAMIC_CURRENT_ENV
  })
  return res
}
```

---

**小结**：云开发内置支付免写微信支付 API 签名，3 个云函数（create-order / pay-callback / refund）覆盖完整流程。永远以服务端回调为准。
