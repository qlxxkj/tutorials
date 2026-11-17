# 第 11 课：实时数据监听与文件存储

## 11.1 实时数据监听（watch）

实时监听可以在数据变化时自动推送给客户端，适合：在线聊天、实时通知、协作编辑。

```js
const db = wx.cloud.database()
const _ = db.command

// 监听某个集合的数据变化
const task = db.collection('messages')
  .where({ roomId: 'room-1' })
  .orderBy('createTime', 'asc')
  .watch({
    onChange: (snapshot) => {
      // 新增的数据
      const added = snapshot.docs
      this.setData({ messages: [...this.data.messages, ...added] })
    },
    onError: (err) => {
      console.error('监听失败', err)
    }
  })

// 页面卸载时停止监听（防止内存泄漏）
onUnload() {
  task.close()
}
```

> `watch` 会建立 WebSocket 长连接，数据变化实时推送，无需轮询。

## 11.2 文件存储

云开发提供对象存储，适合存用户头像、上传的图片、视频等：

```js
// 上传图片
wx.chooseImage({
  count: 1,
  success: async (res) => {
    const filePath = res.tempFiles[0].path
    const cloudPath = `avatars/${Date.now()}.jpg`

    const uploadRes = await wx.cloud.uploadFile({
      cloudPath,
      filePath
    })

    // 存入数据库
    await db.collection('users').doc('userId').update({
      data: { avatar: uploadRes.fileID }
    })
  }
})
```

在 WXML 中显示：

```xml
<image src="{{user.avatar}}" mode="aspectFill" style="width:80rpx;height:80rpx;border-radius:50%;" />
```

> `fileID` 是云存储的唯一标识，可直接作为 `image src` 使用，无需转换 URL。

## 11.3 临时文件与下载

```js
// 下载云文件到本地
wx.cloud.downloadFile({
  fileID: 'cloud://xxx/avatar.jpg',
  success: (res) => {
    wx.previewImage({ urls: [res.tempFilePath] })
  }
})
```

## 11.4 定时触发器

云函数支持定时执行（cron）：

1. 云开发控制台 → 云函数 → 选中函数 → "定时触发器"
2. 添加规则，如每天凌晨 3 点清理过期数据：

```json
{
  "name": "cleanup",
  "type": "cron",
  "config": "0 3 * * *"
}
```

```js
// cloudfunctions/cleanup/index.js
exports.main = async (event, context) => {
  const db = wx.cloud.database()
  // 删除 30 天前的临时数据
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const res = await db.collection('temp-data').where({
    createdAt: db.command.lt(cutoff)
  }).remove()
  return { deleted: res.stats.removed }
}
```

---

**小结**：`watch` 实现实时功能，文件存储管理图片视频，定时触发器做后台维护。三者配合可以覆盖 90% 的小程序业务需求。
