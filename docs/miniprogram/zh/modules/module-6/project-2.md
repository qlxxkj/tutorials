# 项目 2：家谱管理小程序

> CRUD + 微信登录 + 树形视图，覆盖云开发完整能力

## 1. 功能范围

| 功能 | 说明 |
|------|------|
| 微信登录 | `wx.login` → openid，首次自动创建用户记录 |
| 族谱创建 | 新建族谱，填始祖信息，选世代规则（父/子/女） |
| 成员管理 | 添加成员（姓名、性别、生卒年、与父系关系） |
| 树形视图 | 纵向世代树，横向同辈排列，可缩放 |
| 成员详情 | 查看/编辑/删除成员 |
| 权限控制 | 仅创建者可编辑，其他用户只读 |

## 2. 数据模型

```
genealogy 集合（族谱）
├── _id: string
├── name: string          // 族谱名称，如"陈氏家谱"
├── founderName: string   // 始祖姓名
├── founderGender: 'm' | 'f'
├── founderBirthYear: number
├── creatorOpenid: string // 创建者
├── memberCount: number   // 冗余计数
└── createdAt: date

member 集合（成员）
├── _id: string
├── genealogyId: string   // 关联族谱
├── name: string
├── gender: 'm' | 'f'
├── birthYear: number
├── deathYear: number|null
├── parentId: string|null // 父亲 _id（父系为主）
├── generation: number    // 第几代（1=始祖）
└── createdAt: date
```

## 3. 核心云函数

### 创建族谱 + 始祖

```js
// cloudfunctions/create-genealogy/index.js
exports.main = async (event) => {
  const { name, founderName, founderGender, founderBirthYear } = event
  const { OPENID } = cloud.getWXContext()

  const genealogy = await db.collection('genealogy').add({
    data: {
      name, founderName, founderGender, founderBirthYear,
      creatorOpenid: OPENID,
      memberCount: 1,
      createdAt: db.serverDate()
    }
  })

  // 始祖同时作为 member 记录
  await db.collection('member').add({
    data: {
      genealogyId: genealogy._id,
      name: founderName,
      gender: founderGender,
      birthYear: founderBirthYear,
      deathYear: null,
      parentId: null,
      generation: 1,
      createdAt: db.serverDate()
    }
  })

  return { genealogyId: genealogy._id }
}
```

### 添加成员

```js
// cloudfunctions/add-member/index.js
exports.main = async (event) => {
  const { genealogyId, name, gender, birthYear, deathYear, parentId } = event
  const { OPENID } = cloud.getWXContext()

  // 权限：只有创建者能添加
  const gRes = await db.collection('genealogy').doc(genealogyId).get()
  if (gRes.data.creatorOpenid !== OPENID) {
    return { code: 403, message: '无权限' }
  }

  // 计算 generation
  let generation = 1
  if (parentId) {
    const pRes = await db.collection('member').doc(parentId).get()
    generation = pRes.data.generation + 1
  }

  await db.collection('member').add({
    data: { genealogyId, name, gender, birthYear, deathYear, parentId, generation }
  })
  await db.collection('genealogy').doc(genealogyId).update({
    data: { memberCount: db.command.inc(1) }
  })

  return { code: 0 }
}
```

## 4. 树形视图（前端）

```js
// pages/tree/tree.js
// 将平铺的 member 列表转为树结构
buildTree(members) {
  const map = {}
  const roots = []
  members.forEach(m => {
    map[m._id] = { ...m, children: [] }
  })
  members.forEach(m => {
    if (m.parentId && map[m.parentId]) {
      map[m.parentId].children.push(map[m._id])
    } else {
      roots.push(map[m._id])
    }
  })
  // 按 generation + name 排序，同辈内稳定排列
  this.setData({ roots })
}
```

```xml
<!-- pages/tree/tree.wxml -->
<scroll-view scroll-x scroll-y class="tree-container"
             style="width:100%;height:calc(100vh - 120rpx);">
  <view class="tree" style="padding:20rpx;">
    <node-view wx:for="{{roots}}" wx:key="_id" node="{{item}}" level="0" />
  </view>
</scroll-view>
```

> 树形视图的横向宽度由最大世代数决定，`scroll-view` 双方向滚动。节点用 `position: absolute` 或 flex 对齐。

## 5. 审核注意事项

- 类目：选"社交 > 社区/论坛"或"工具 > 信息查询"，个人主体建议选"工具"
- 隐私协议：不收集手机号，只有 openid，无需额外隐私声明
- 测试账号：提审时在备注中提供可访问的族谱 ID

## 6. 交付物

- [ ] 登录（openid）后自动识别用户
- [ ] 创建族谱 + 填写始祖信息
- [ ] 添加成员（选择父系关系）
- [ ] 树形视图正确渲染，世代层级清晰
- [ ] 仅创建者可编辑，他人只读

---

**提示**：树形视图是这个项目的核心难点。建议先用固定数据（3 代 10 人）验证布局，再接入真实数据。`generation` 字段是排序的关键，建索引。
