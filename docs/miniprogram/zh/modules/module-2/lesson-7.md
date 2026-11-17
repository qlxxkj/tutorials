# 第 7 课：网络请求、本地存储与定位 API

## 7.1 wx.request 网络请求

```js
// GET 请求
wx.request({
  url: 'https://api.example.com/weather',
  data: { city: '北京' },
  method: 'GET',
  success: (res) => {
    if (res.data.code === 0) {
      this.setData({ weather: res.data.data })
    }
  },
  fail: (err) => {
    wx.showToast({ title: '网络错误', icon: 'none' })
  }
})
```

**封装为工具函数**（推荐）：

```js
// utils/api.js
const BASE = 'https://api.example.com'

export function get(path, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE + path,
      data,
      method: 'GET',
      success: (res) => res.data.code === 0 ? resolve(res.data.data) : reject(res.data),
      fail: reject
    })
  })
}

export function post(path, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE + path,
      data,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => res.data.code === 0 ? resolve(res.data.data) : reject(res.data),
      fail: reject
    })
  })
}
```

## 7.2 本地存储

```js
// 同步
wx.setStorageSync('city', '上海')
const city = wx.getStorageSync('city')  // '上海'

// 异步（大数据量）
wx.setStorage({ key: 'cache', data: largeObject })

// 清除
wx.removeStorageSync('city')
wx.clearStorage()  // 全部清除
```

> 存储上限 1MB，适合存 token、用户偏好、小数据缓存。

## 7.3 定位

```js
wx.getLocation({
  type: 'wgs84',
  success: (res) => {
    const { latitude, longitude } = res
    // 用经纬度查询附近信息
  },
  fail: () => {
    // 用户拒绝授权，用默认城市
    this.setData({ city: '北京' })
  }
})
```

> 需要在 `app.json` 中声明：`"permission": { "scope.userLocation": { "desc": "用于获取当前位置" } }`

## 7.4 图片与文件上传

```js
// 上传图片
wx.chooseImage({
  count: 1,
  success: (res) => {
    const filePath = res.tempFiles[0].path
    wx.uploadFile({
      url: 'https://api.example.com/upload',
      filePath,
      name: 'file',
      success: (uploadRes) => {
        const result = JSON.parse(uploadRes.data)
        // result.url 为上传后的图片地址
      }
    })
  }
})
```

## 7.5 用 AI 封装 API 层

```
帮我封装一个 wx.request 工具类，
- 支持 GET/POST
- 自动附加 Authorization header（token 从本地存储读取）
- 错误统一弹出 toast
- 支持取消请求
生成完整的 utils/api.js 文件
```

---

**小结**：封装好的 `api.js` 工具类是所有项目的基础设施，AI 生成一次后全项目复用。
