# 第 9 课：Template Builder

> 📌 **学习目标**：掌握 Template Builder 可视化构建工具，快速搭建业务面板
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：工具介绍 → 布局系统 → 组件库 → 交互配置

---

## 一、Template Builder 简介

Template Builder 是 Foundry 提供的**可视化模板构建工具**，无需编写代码即可快速创建业务面板。

```
适用场景：
✅ 快速原型开发
✅ 简单数据展示面板
✅ 内部工具快速搭建
❌ 复杂交互逻辑（需要写代码）
❌ 高度定制化的 UI（需要写代码）
```

---

## 二、布局系统

### 2.1 布局容器

```
Grid Layout（网格布局）：
┌──────────┬──────────┬──────────┐
│  Col 1   │  Col 2   │  Col 3   │
│  (span 4)│  (span 4)│  (span 4)│
├──────────┼──────────┼──────────┤
│          │          │          │
│  Row 1   │  Row 2   │  Row 3   │
│  (span 12)│ (span 12)│ (span 12)│
│          │          │          │
└──────────┴──────────┴──────────┘

Flex Layout（弹性布局）：
┌────────────────────────────┐
│  ← item1 →  ← item2 →      │
└────────────────────────────┘

Stack Layout（堆叠布局）：
┌─────────────┐
│   item 1    │
├─────────────┤
│   item 2    │
├─────────────┤
│   item 3    │
└─────────────┘
```

### 2.2 响应式断点

```
手机： < 640px
平板： 640px - 1024px
桌面： > 1024px
```

---

## 三、内置组件库

### 3.1 数据展示组件

| 组件 | 用途 | 配置项 |
|------|------|--------|
| **Table** | 展示结构化数据 | 列定义、排序、分页、筛选 |
| **Chart** | 数据可视化 | 图表类型、数据绑定、颜色 |
| **Card** | 展示单个对象 | 标题、属性、操作按钮 |
| **Map** | 地理数据展示 | 坐标字段、聚类、弹出框 |
| **Timeline** | 时间序列展示 | 时间字段、事件标记 |
| **KPI** | 关键指标展示 | 数值、标签、趋势 |

### 3.2 交互组件

| 组件 | 用途 |
|------|------|
| **Button** | 触发 Action |
| **Filter** | 数据筛选 |
| **DatePicker** | 日期范围选择 |
| **TextInput** | 文本输入 |
| **Dropdown** | 下拉选择 |
| **Tabs** | 多面板切换 |

---

## 四、数据绑定

### 4.1 绑定到 Object

```
在 Template Builder 中：
1. 选择组件 → 配置数据源
2. 选择 Ontology Object（如 Order）
3. 配置查询条件（过滤、排序、分页）
4. 绑定属性到组件字段
```

### 4.2 查询配置

```json
{
  "objectType": "Order",
  "filters": [
    { "property": "status", "operator": "in", "value": ["pending", "processing"] },
    { "property": "created_at", "operator": "gte", "value": "{{dateRange.start}}" }
  ],
  "sortBy": "created_at",
  "sortOrder": "desc",
  "pageSize": 20
}
```

---

## 五、交互配置

### 5.1 点击导航

```
配置 Table 的行点击行为：
→ 跳转到 Object Detail 页面
→ 打开侧边面板
→ 执行某个 Action
```

### 5.2 联动过滤

```
DatePicker 变化 → 刷新 Table 数据
Dropdown 选择 → 过滤 Chart 数据
搜索框输入 → 实时过滤所有组件
```

### 5.3 Action 触发

```
Button 点击 → 执行 Object Action
  → 显示确认对话框
  → 执行成功后刷新数据
  → 显示成功/失败提示
```

---

## 六、从 Template Builder 到代码

当 Template Builder 无法满足需求时，导出为 TypeScript 模板：

```
Template Builder → 导出 JSON → 转换为 React 组件
                                    ↓
                            需要自定义逻辑时
                                    ↓
                            直接用 React + TypeScript 重写
```

**建议工作流程：**
1. 先用 Template Builder 快速搭建原型
2. 验证交互和布局是否满足需求
3. 需要定制时，参考导出的代码结构
4. 用 React + TypeScript 实现最终版本

---

## 七、本章小结

| 要点 | 说明 |
|------|------|
| 定位 | 快速原型工具，非代码开发 |
| 布局 | Grid/Flex/Stack 三种布局 |
| 组件 | 丰富的内置组件库 |
| 数据绑定 | 直接绑定 Ontology Object |
| 交互 | 导航、联动、Action 触发 |
| 升级路径 | Template Builder → React 代码 |

---

*下节课：[第 10 课：自定义模板开发](lesson-10.md)*
