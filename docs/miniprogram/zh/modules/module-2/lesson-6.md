# 第 6 课：组件与页面生命周期

## 6.1 页面生命周期

```
onLoad(options)       → 页面加载（接收参数）
onShow()              → 页面显示（每次显示都触发，包括从详情页返回）
onReady()             → 页面初次渲染完成
onHide()              → 页面隐藏（跳转到其他页面时触发）
onUnload()            → 页面卸载（关闭页面时触发）
onPullDownRefresh()   → 下拉刷新
onReachBottom()       → 触底
onPageScroll()        → 页面滚动
```

> 关键区别：`onShow` 每次显示都触发，适合刷新数据；`onLoad` 只触发一次，适合初始化。

## 6.2 自定义组件

创建组件目录：

```
components/
  weather-card/
    index.wxml
    index.wxss
    index.js
    index.json
```

```json
// index.json
{ "component": true }
```

```js
// index.js
Component({
  properties: {
    data: { type: Object, value: null }
  },
  methods: {
    onDetail() {
      this.triggerEvent('detail', { id: this.data.id })
    }
  }
})
```

在页面中使用：

```xml
<weather-card data="{{item}}" bind:detail="onDetailTap" />
```

## 6.3 全局数据共享

```js
// app.js
App({
  globalData: {
    userInfo: null,
    city: '北京'
  }
})
```

```js
// 任意页面读取
const app = getApp()
app.globalData.city = '上海'
```

## 6.4 组件通信方式对比

| 方式 | 适用场景 | 代码量 |
|------|---------|--------|
| `properties` + `triggerEvent` | 父子组件通信 | 低 |
| `getApp().globalData` | 全局共享（登录态、城市） | 低 |
| `EventBus`（自建） | 跨层级组件通信 | 中 |
| `wx.eventCenter` | 官方事件总线（3.0+） | 低 |

---

**小结**：组件让代码可复用；生命周期决定何时获取数据；`onShow` vs `onLoad` 是新手最常混淆的点。
