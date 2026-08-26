# 第 7 课：Foundry 应用架构

> 📌 **学习目标**：理解 Foundry 应用的架构分层，知道代码应该写在哪里
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：架构总览 → 各层职责 → 开发流程 → 最佳实践

---

## 一、Foundry 应用架构分层

```
┌─────────────────────────────────────────────────────────┐
│                  用户界面层（UI）                        │
│   Templates / Dashboards / Workspaces                   │
│   ← FDE 主要在这里工作                                  │
├─────────────────────────────────────────────────────────┤
│                  业务逻辑层（Logic）                     │
│   Actions / Workflows / Policies                        │
│   ← FDE + OT 协作                                       │
├─────────────────────────────────────────────────────────┤
│                  数据模型层（Model）                     │
│   Ontology: Objects / Relationships / Queries           │
│   ← FDE + DS 协作                                       │
├─────────────────────────────────────────────────────────┤
│                  数据集成层（Data）                      │
│   Datasets / Spreadsheets / Connections                 │
│   ← BE / OT 主导                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 二、各层详细说明

### 2.1 用户界面层

```
应用类型：
├── Template（模板）
│   ├── 系统模板（表格、图表、卡片等）
│   ├── 自定义模板（React/TypeScript）
│   └── Template Builder（可视化构建）
├── Dashboard（仪表板）
│   └── 多个 Template 的组合
└── Workspace（工作区）
    └── 包含模板、工具、配置的完整工作空间
```

**FDE 的主要产出物**。

### 2.2 业务逻辑层

```
Actions（操作）：
  - 在对象上执行的动作
  - 如： Approve Order、Send Notification
  - 可以触发 Workflow

Workflows（工作流）：
  - 自动化的业务逻辑链
  - 触发条件 → 处理步骤 → 结果

Policies（策略）：
  - 数据访问权限控制
  - 行级/列级权限
```

### 2.3 数据模型层

```
Ontology（本体）的核心概念：

Objects（对象）：
  - 业务实体：Order、Customer、Product
  - 每个 Object 有唯一的 OID
  - 包含 Properties（属性）和 Actions（操作）

Relationships（关系）：
  - Object 之间的关联
  - 如：Customer → orders → Product

Queries（查询）：
  - 定义如何获取和过滤对象数据
  - 支持复杂条件和聚合
```

---

## 三、FDE 的开发流程

### 典型开发流程

```
1. 需求分析
   ↓
2. Ontology 设计（与 DS/PO 协作）
   ↓
3. Template 开发（Template Builder 快速原型）
   ↓
4. 自定义组件开发（React + TypeScript）
   ↓
5. Actions 实现
   ↓
6. 测试（单元 + 集成）
   ↓
7. 部署到客户环境
   ↓
8. 用户验收 + 迭代
```

### 开发环境

```
本地：
  - IDE: VS Code
  - 语言: TypeScript
  - 框架: React
  - 样式: CSS Modules / Tailwind
  - 测试: Jest + RTL

Foundry 平台：
  - Template Registry: 管理模板版本
  - Ontology Editor: 编辑本体模型
  - App Registry: 管理应用部署
  - Audit Log: 查看操作日志
```

---

## 四、最佳实践

### 4.1 组件设计原则

```
✅ 做：
- 小组件组合（单一职责）
- Props 类型完整标注
- 错误边界处理
- 加载状态管理
- 可访问性（ARIA）

❌ 不做：
- 超大组件（>300行）
- 隐式依赖（不声明 Props）
- 直接 DOM 操作
- 内联样式（除非必要）
```

### 4.2 数据处理原则

```
✅ 做：
- 在 Hook 层处理数据获取
- 使用 React Query / SWR 做缓存
- 分页和虚拟滚动处理大数据
- 防抖/节流处理高频操作

❌ 不做：
- 在组件内直接 fetch
- 一次性加载全部数据
- 频繁重新请求相同数据
```

---

## 五、本章小结

| 层级 | 职责 | FDE 参与度 |
|------|------|----------|
| UI 层 | 模板、仪表板、工作区 | ⭐⭐⭐ 主要工作 |
| 逻辑层 | 操作、工作流、策略 | ⭐⭐ 协作开发 |
| 模型层 | Ontology 对象设计 | ⭐⭐ 协作设计 |
| 数据层 | 数据集、连接器 | ⭐ 少量集成 |

---

*下节课：[第 8 课：Ontology 本体建模](lesson-8.md)*
