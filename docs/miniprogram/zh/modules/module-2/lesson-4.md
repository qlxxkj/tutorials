# 第 4 课：第一个页面 — WXML + WXSS + 数据绑定

## 4.1 WXML 基础标签

WXML 接近 HTML，核心标签：

```xml
<!-- 文本 -->
<text>你好</text>

<!-- 图片 -->
<image src="{{imageUrl}}" mode="aspectFill" style="width:300rpx;height:200rpx;" />

<!-- 视图容器 -->
<view class="card">
  <text class="title">{{item.title}}</text>
  <text class="desc">{{item.desc}}</text>
</view>

<!-- 列表渲染 -->
<view wx:for="{{list}}" wx:key="id">
  <text>{{item.name}}</text>
</view>

<!-- 条件渲染 -->
<view wx:if="{{showBanner}}">Banner 内容</view>
<view wx:else>无 Banner</view>
```

> 单位用 `rpx`：1rpx = 屏幕宽度 / 750，自动适配不同机型。

## 4.2 WXSS 样式

```css
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
.title { font-size: 32rpx; font-weight: bold; color: #333; }
.desc  { font-size: 26rpx; color: #999; margin-top: 8rpx; }
```

WXSS 不支持所有 CSS，注意：
- 不支持通配符 `*` 选择器
- 不支持部分伪类
- 推荐使用 rpx 而非 px

## 4.3 数据绑定（JS）

```js
// pages/index/index.js
Page({
  data: {
    cityName: '北京',
    temperature: 22,
    weather: '晴',
    hourly: []
  },

  onLoad() {
    // 页面加载时获取天气
    this.fetchWeather()
  },

  fetchWeather() {
    wx.request({
      url: 'https://api.example.com/weather?city=北京',
      success: (res) => {
        this.setData({
          cityName: res.data.city,
          temperature: res.data.temp,
          weather: res.data.weather,
          hourly: res.data.hourly
        })
      }
    })
  }
})
```

> `setData` 是更新页面的唯一方式，WXML 中 `{{ }}` 绑定自动响应变化。

## 4.4 用 AI 生成完整首页

向 AI 描述需求：

```
帮我写一个微信小程序的天气首页：
- 顶部：城市名称（大字）+ 当前温度（超大字）+ 天气描述
- 中间：7天天气预报横向滚动（swiper）
- 底部：今日生活指数（穿衣、洗车、运动指数卡片）
- 浅蓝色渐变背景，卡片白色圆角
```

AI 生成后粘贴到对应文件，微调 1-2 处样式即可。

---

**小结**：WXML 写结构、WXSS 写样式、JS 管逻辑，三者通过 `data` + `setData` 联动。用 AI 生成可以省去 80% 的样板代码。
