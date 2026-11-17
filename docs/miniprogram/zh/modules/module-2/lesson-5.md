# 第 5 课：事件处理与页面跳转

## 5.1 常用事件

```xml
<!-- 点击 -->
<view bindtap="onTap">点击我</view>

<!-- 长按 -->
<view bindlongpress="onLongPress">长按</view>

<!-- 输入 -->
<input bindinput="onInput" placeholder="请输入" />

<!-- 滑动 -->
<scroll-view bindscrolltolower="onLoadMore">...</scroll-view>
```

```js
Page({
  onTap(e) {
    console.log('点击', e.currentTarget.dataset.id)
  },
  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },
  onLoadMore() {
    // 触底加载更多
  }
})
```

> 用 `data-*` 传递参数：`data-id="123"` 在事件中通过 `e.currentTarget.dataset.id` 读取。

## 5.2 页面跳转

```js
// 跳转新页面（保留当前页）
wx.navigateTo({ url: '/pages/detail/detail?id=1' })

// 替换当前页（不可返回）
wx.redirectTo({ url: '/pages/login/login' })

// 跳转 TabBar 页面
wx.switchTab({ url: '/pages/index/index' })

// 返回上一页
wx.navigateBack({ delta: 1 })
```

## 5.3 带参跳转与接收

```js
// 详情页接收参数
Page({
  onLoad(options) {
    // options.id 即为跳转时传递的 id
    const id = options.id
    this.fetchDetail(id)
  },
  fetchDetail(id) {
    // ...
  }
})
```

## 5.4 导航栏与标题

```js
// 动态设置页面标题
wx.setNavigationBarTitle({ title: '商品详情' })

// 禁用右滑返回（防误触）
wx.disablePageScroll()
```

## 5.5 下拉刷新与触底加载

`app.json` 中开启：

```json
{
  "window": {
    "enablePullDownRefresh": true
  }
}
```

```js
Page({
  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    this.loadMore()
  }
})
```

---

**小结**：`bindtap` + `navigateTo` + `onLoad(options)` 是页面间通信的三大件。下拉刷新和触底加载是列表页的标配。
