# 开发前准备清单

## 账号与资质

- [ ] 注册微信小程序账号（[mp.weixin.qq.com](https://mp.weixin.qq.com)）
- [ ] 选择主体类型（个人 / 企业）
  - 个人：免费，可提审工具/信息查询类
  - 企业：需营业执照，可提审全部类目，支持微信支付
- [ ] 完成备案（2023 年起新小程序强制，约 1-3 周）
- [ ] 开通云开发（开发者工具 → 云开发 → 创建环境）

## 开发环境

- [ ] 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（Stable 版）
- [ ] 导入或新建小程序项目，AppID 填写正式 AppID（不要用测试号）
- [ ] 安装 Node.js 16+（云函数本地调试需要）

## 项目结构确认

新建项目后目录结构应为：

```
project-root/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── pages/
│   └── index/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
└── cloudfunctions/        # 开通云开发后生成
```

## 网络配置

- [ ] 小程序后台 → 开发管理 → 服务器域名，配置 request 合法域名（API 域名，必须 HTTPS）
- [ ] 云存储合法域名（如使用云开发则自动配置）
- [ ] 测试环境用开发者工具勾选"不校验合法域名"

## 支付（企业主体）

- [ ] 申请微信支付商户号（[pay.weixin.qq.com](https://pay.weixin.qq.com)）
- [ ] 商户后台 → 产品中心 → 关联小程序
- [ ] 云函数中 `cloud.cloudPay` 可用（需开通云开发）

## 订阅消息

- [ ] 小程序后台 → 功能 → 订阅消息 → 申请模板
- [ ] 记录 `tmplIds`，配置到云函数

## 代码管理

- [ ] 初始化 git 仓库，`.gitignore` 排除 `project.private.config.json`（含本地 AppID 和密钥）
- [ ] 云函数代码纳入 git（`cloudfunctions/` 目录）
