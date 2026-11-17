# 术语表

| 术语 | 英文/缩写 | 说明 |
|------|----------|------|
| 小程序 | WeChat Mini Program | 微信内嵌应用，无需下载，基于 WXML + WXSS + JS |
| 云开发 | Cloud Development | 微信提供的 BaaS（后端即服务）：云函数 + 云数据库 + 云存储 |
| 云函数 | Cloud Function | 服务端 Node.js 函数，通过 `wx.cloud.callFunction` 调用 |
| 云数据库 | Cloud DB | 文档型数据库（MongoDB 兼容），存 JSON 文档 |
| 云存储 | Cloud Storage | 对象存储，存图片/视频，返回 `fileID` |
| WXML | - | 微信小程序标记语言，类似 HTML，支持数据绑定和条件渲染 |
| WXSS | - | 微信小程序样式语言，类似 CSS，支持 rpx 响应式单位 |
| rpx | - | 响应式像素，屏幕宽度 750rpx，不同设备自动换算 |
| `setData` | - | 将 JS 数据同步到 WXML 渲染层的方法，有性能开销 |
| 生命周期 | Lifecycle | `onLoad` → `onShow` → `onReady` → `onHide` → `onUnload` |
| openid | - | 用户在当前小程序的唯一标识，每次调用 `wx.login` 获取 |
| unionid | - | 同一微信开放平台下所有应用的统一用户标识 |
| code2Session | - | 用 `wx.login` 的 code 换 openid + session_key 的 API |
| 订阅消息 | Subscribe Message | 需用户每次授权、一次授权发一条的推送机制 |
| 服务通知 | Service Notification | 微信支付/物流等服务触发的推送，无需用户授权 |
| 灰度发布 | Canary Release | 新版本先推送给部分用户，逐步放量的发布策略 |
| 体验版 | Trial Version | 仅开发者 + 体验成员（最多 92 人）可访问的内测版本 |
| 分包加载 | Subpackage | 小程序主包 ≤2MB 限制下，将部分页面放子包按需下载 |
| BaaS | Backend as a Service | 云开发的本质：免运维的后端服务集合 |
| fileID | - | 云存储文件的唯一标识，可直接用于 `image src` |
| watch | - | 云数据库实时监听，数据变化通过 WebSocket 推送到客户端 |
| cron 触发器 | Cron Trigger | 云函数定时执行机制，格式为标准 5 段 cron 表达式 |
| rpx 换算 | - | 750rpx = 屏幕宽度；iPhone 6 上 1rpx ≈ 0.5px |
