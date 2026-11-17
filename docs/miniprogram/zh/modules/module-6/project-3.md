# 项目 3：预约咨询小程序

> 完整商业流程：列表 → 详情 → 预约 → 支付 → 通知

## 1. 功能范围

| 功能 | 说明 |
|------|------|
| 咨询师列表 | 展示可选咨询师（头像、职称、评分、价格） |
| 咨询师详情 | 介绍、可预约时段、历史评价 |
| 预约时段选择 | 日历 + 时间段，显示已占用 |
| 微信支付 | 在线支付咨询费 |
| 支付成功通知 | 订阅消息推送给咨询师 |
| 我的预约 | 查看/取消预约（未开始可退） |

## 2. 数据模型

```
consultant 集合（咨询师）
├── _id: string
├── name: string
├── avatar: string        // 云存储 fileID
├── title: string         // 职称
├── price: number         // 单价（分）
├── bio: string
├── rating: number        // 0-5
├── slotInterval: 30     // 时段粒度（分钟）
└── active: boolean

booking 集合（预约）
├── _id: string
├── consultantId: string
├── openid: string
├── date: string          // '2026-11-20'
├── slot: string          // '14:00-14:30'
├── amount: number        // 实付（分）
├── status: 'pending'|'paid'|'cancelled'|'completed'
├── paidAt: date
└── createdAt: date
```

## 3. 核心流程

### 检查时段是否可用

```js
// cloudfunctions/check-slot/index.js
exports.main = async (event) => {
  const { consultantId, date, slot } = event
  const res = await db.collection('booking')
    .where({ consultantId, date, slot, status: _.in(['pending', 'paid']) })
    .get()
  return { available: res.data.length === 0 }
}
```

### 创建预约 + 发起支付

```js
// cloudfunctions/create-booking/index.js
exports.main = async (event) => {
  const { consultantId, date, slot } = event
  const { OPENID } = cloud.getWXContext()

  // 1. 确认时段可用（双重检查，防并发）
  const checkRes = await db.collection('booking')
    .where({ consultantId, date, slot, status: _.in(['pending', 'paid']) })
    .get()
  if (checkRes.data.length > 0) {
    return { code: 409, message: '该时段已被预约' }
  }

  // 2. 查咨询师价格
  const cRes = await db.collection('consultant').doc(consultantId).get()
  const price = cRes.data.price

  // 3. 创建预约记录
  const bRes = await db.collection('booking').add({
    data: {
      consultantId, date, slot,
      openid: OPENID,
      amount: price,
      status: 'pending',
      createdAt: db.serverDate()
    }
  })

  // 4. 发起支付
  const payRes = await cloud.cloudPay.unifiedOrder({
    body: `咨询预约-${date} ${slot}`,
    outTradeNo: bRes._id,
    spbillCreateIp: '127.0.0.1',
    totalFee: price,
    envId: cloud.DYNAMIC_CURRENT_ENV,
    functionName: 'booking-pay-callback'
  })

  return { bookingId: bRes._id, paySignData: payRes }
}
```

### 支付回调 + 订阅消息

```js
// cloudfunctions/booking-pay-callback/index.js
exports.main = async (event) => {
  const { outTradeNo, resultCode } = event
  if (resultCode !== 'SUCCESS') return { errcode: 0 }

  await db.collection('booking').doc(outTradeNo).update({
    data: { status: 'paid', paidAt: db.serverDate() }
  })

  // 发送订阅消息给咨询师（需咨询师提前授权）
  const booking = await db.collection('booking').doc(outTradeNo).get()
  const consultant = await db.collection('consultant').doc(booking.data.consultantId).get()

  await cloud.openapi({
    method: 'subscribeMessage.send',
    data: {
      touser: consultant.data.openid,
      templateId: 'your-template-id',
      page: 'pages/booking/detail?id=' + outTradeNo,
      data: {
        'thing1': { value: booking.data.date + ' ' + booking.data.slot },
        'amount2': { value: booking.data.amount / 100 + ' 元' }
      }
    }
  })

  return { errcode: 0 }
}
```

## 4. 订阅消息前置

1. 在小程序后台申请订阅消息模板
2. 用户在预约前需点击"允许订阅"按钮授权：

```js
wx.requestSubscribeMessage({
  tmplIds: ['your-template-id'],
  success: (res) => {
    // res['your-template-id'] === 'accept' 才有效
  }
})
```

> 订阅消息是一次性订阅，每次授权只能发一条，需要用户在每次预约时重新授权。

## 5. 取消预约 + 退款

```js
// cloudfunctions/cancel-booking/index.js
exports.main = async (event) => {
  const { bookingId } = event
  const { OPENID } = cloud.getWXContext()

  const bRes = await db.collection('booking').doc(bookingId).get()
  if (bRes.data.openid !== OPENID) return { code: 403 }
  if (bRes.data.status !== 'paid') return { code: 400, message: '状态不可取消' }

  // 只有未开始的预约可取消（以预约时间为准）
  const slotStart = parseSlotTime(bRes.data.date, bRes.data.slot)
  if (new Date() > slotStart) return { code: 400, message: '已开始不可取消' }

  await db.collection('booking').doc(bookingId).update({
    data: { status: 'cancelled' }
  })

  // 退款（金额全额退）
  await cloud.cloudPay.refund({
    outTradeNo: bookingId,
    outRefundNo: 'R' + bookingId,
    totalFee: bRes.data.amount,
    refundFee: bRes.data.amount,
    envId: cloud.DYNAMIC_CURRENT_ENV
  })

  return { code: 0 }
}
```

## 6. 交付物

- [ ] 咨询师列表 + 详情页
- [ ] 时段选择（已占用时段灰色不可点）
- [ ] 微信支付完成预约
- [ ] 支付后订阅消息推送给咨询师
- [ ] 我的预约页，未开始可取消并退款

---

**提示**：并发时段冲突是本项目最容易出现的数据问题。`check-slot` + `create-booking` 两步之间存在竞态窗口，生产环境建议加分布式锁（云开发用 `db.command` 的原子操作模拟）或 Redis。MVP 阶段接受极低概率冲突，用回调补偿。
