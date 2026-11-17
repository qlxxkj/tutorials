# 项目 1：天气查询小程序

> 基于真实 iweather 项目原型，完成一个可提交的天气小程序

## 1. 功能范围

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 定位获取当前城市 | P0 | `wx.getLocation` + 城市名反查 |
| 实时天气卡片 | P0 | 温度、天气图标、风向风力、湿度 |
| 15 日预报 | P1 | 横向滚动卡片 + 温度曲线 |
| 生活指数 | P1 | swiper 轮播（穿衣、紫外线、洗车等） |
| 城市切换 | P0 | 手动选城市 + 定位城市记忆 |
| 意见反馈 | P2 | `open-type="feedback"` |

## 2. 技术选型

```
数据源：  和风天气 API（免费 1000 次/天）
         或聚合数据（需申请 token）
定位：    wx.getLocation（wgs84）→ 经纬度反查城市
存储：    wx.setStorageSync 缓存最近城市
UI：      原生 WXML + canvas 温度曲线
```

## 3. 项目结构

```
pages/
  index/
    index.wxml    # 主页面（实况 + 预报 + 生活指数）
    index.js      # 数据获取、定位、canvas 绘制
    index.wxss
    index.json
utils/
  weather.js      # API 封装（getRealtime / getForecast）
  location.js     # 定位 + 城市反查
  canvas.js       # 温度曲线绘制工具
```

## 4. 核心代码

### 获取实时天气

```js
// utils/weather.js
const API_BASE = 'https://api.qweather.com/v7'
const KEY = 'your-api-key'

export function getRealtime(lat, lon) {
  const url = `${API_BASE}/weather/now?location=${lon},${lat}&key=${KEY}`
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: (res) => res.data.code === '200' ? resolve(res.data) : reject(res.data),
      fail: reject
    })
  })
}

export function getForecast15d(lat, lon) {
  const url = `${API_BASE}/weather/15d?location=${lon},${lat}&key=${KEY}`
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: (res) => res.data.code === '200' ? resolve(res.data) : reject(res.data),
      fail: reject
    })
  })
}
```

### 定位 + 加载数据

```js
// pages/index/index.js
async onShow() {
  const city = wx.getStorageSync('city')
  if (city) {
    this.loadWeather(city)
  } else {
    this.locateAndLoad()
  }
}

async locateAndLoad() {
  try {
    const loc = await wx.getLocation({ type: 'wgs84' })
    // 经纬度反查城市（可调用和风地理 API 或本地缓存）
    const city = await reverseGeoCode(loc.latitude, loc.longitude)
    wx.setStorageSync('city', city)
    this.loadWeather(city)
  } catch {
    this.setData({ city: '北京' })  // 定位失败用默认城市
    this.loadWeather('北京')
  }
}
```

### 温度曲线（canvas）

```js
drawTempCurve(forecast) {
  const query = wx.createSelectorQuery()
  query.select('#tempCanvas')
    .fields({ size: true })
    .exec(([canvas]) => {
      const ctx = canvas.getContext('2d')
      const { width, height } = canvas
      const temps = forecast.map(d => (d.max + d.min) / 2)
      const maxT = Math.max(...temps)
      const minT = Math.min(...temps)
      const step = width / (temps.length - 1)

      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = '#4a90d9'
      ctx.lineWidth = 2
      ctx.beginPath()

      temps.forEach((t, i) => {
        const x = i * step
        const y = height * 0.3 + (height * 0.4) * (1 - (t - minT) / (maxT - minT || 1))
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
    })
}
```

## 5. 审核注意事项

- 定位权限：`app.json` 中声明 `"permission": { "scope.userLocation": { "desc": "获取当前位置查询天气" } }`
- API 域名需在小程序后台配置 request 合法域名
- 和风天气 API 免费额度 1000 次/天，MVP 够用

## 6. 交付物

- [ ] 定位成功时自动加载天气，失败时提示选城市
- [ ] 实时卡片显示温度、天气、风向、湿度
- [ ] 15 日预报横向滚动，温度曲线覆盖
- [ ] 生活指数 swiper 可切换
- [ ] 切换城市后数据刷新，旧城市数据清除

---

**提示**：这个项目的难点在 canvas 温度曲线和定位反查城市，其余都是基础 CRUD 思路。AI 生成 canvas 绘图代码时，把坐标映射逻辑描述清楚，一次就能跑通。
