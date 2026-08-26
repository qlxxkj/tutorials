# 第 2 课：技术栈概览

> 📌 **学习目标**：了解 FDE 使用的完整技术栈，建立全局认知
> ⏱️ **预计时长**：15 分钟
> 🎯 **本节节奏**：前端栈 → 平台栈 → 工具链 → 学习优先级

---

## 一、前端技术栈

### 1.1 核心语言：TypeScript

Palantir 全栈使用 TypeScript，这是 FDE 最重要的技能。

```typescript
// Palantir 风格 - 严格的类型定义
interface BusinessObject {
  oid: string;          // Ontology Object ID
  type: ObjectType;
  properties: Record<string, PropertyValue>;
}

type ObjectType = 'User' | 'Transaction' | 'Product' | 'Location';

// 泛型用于模板参数
interface TemplateProps<TData> {
  data: TData;
  onSelect: (item: TData) => void;
}
```

**关键点：**
- 严格模式（strict: true）
- 大量使用工具类型（Partial、Pick、Omit、Required）
- 自定义 Hook 的完整类型标注

### 1.2 框架：React

```
React 版本：18.x
UI 组件库：自建 Design System（基于 Palantir 设计规范）
状态管理： Zustand / Redux Toolkit
路由：React Router
表单：React Hook Form + Zod 校验
```

**Palantir 特有的 React 模式：**

```typescript
// 对象卡片组件模式
const ObjectCard: React.FC<ObjectCardProps> = ({ oid, type }) => {
  const { data, isLoading } = useObject(oid);
  return <Card object={data} type={type} />;
};

// 操作按钮模式
const ObjectActions: React.FC<{ oid: string; actions: Action[] }> = ({ oid, actions }) => (
  <ActionBar actions={actions.map(a => ({
    ...a,
    onClick: () => executeAction(oid, a.name, a.params)
  }))}
 />
);
```

---

## 二、Palantir 平台技术栈

### 2.1 Foundry 核心概念

```
┌──────────────────────────────────────────────┐
│                 Foundry 平台                 │
├──────────────────────────────────────────────┤
│  Layer 1: Ontology（本体层）                  │
│    ├── Objects（业务对象）                    │
│    ├── Actions（操作）                        │
│    └── Relationships（关系）                  │
├──────────────────────────────────────────────┤
│  Layer 2: Applications（应用层）              │
│    ├── Templates（模板）                      │
│    ├── Dashboard（仪表板）                    │
│    └── Workspaces（工作区）                   │
├──────────────────────────────────────────────┤
│  Layer 3: Integration（集成层）               │
│    ├── APIs（REST/GraphQL）                   │
│    ├── Data Connectors（数据连接器）          │
│    └── Webhooks（事件通知）                   │
└──────────────────────────────────────────────┘
```

### 2.2 Template Builder

Palantir 提供的可视化模板构建工具，无需写代码即可快速搭建界面。

```
Template Builder 能力：
✅ 拖拽式布局（Grid、Flex、Stack）
✅ 预置组件库（表格、图表、卡片、表单）
✅ 绑定 Ontology 数据
✅ 添加交互逻辑（过滤、排序、导航）
⚠️ 复杂定制需要写 TypeScript
```

### 2.3 TypeScript Templates

当 Template Builder 不够用时，用 React + TypeScript 写自定义模板。

```typescript
// 自定义模板基本结构
import { Template, Panel } from '@palantir/templates';

const MyCustomPanel: React.FC<MyCustomPanelProps> = ({ objectId }) => {
  const { data } = useObject(objectId);

  return (
    <Panel title="我的面板">
      <DataTable data={data.items} />
      <ActionButton
        label="执行操作"
        onClick={() => createAction(objectId)}
      />
    </Panel>
  );
};
```

---

## 三、AIP（AI Platform）

AIP 是 Palantir 最新的 AI 产品，FDE 需要掌握与 AIP 的集成。

```
AIP 技术栈：
- Agent 开发（自然语言 → 操作）
- Prompt 工程
- Ontology 查询（用自然语言查数据）
- RAG（检索增强生成）
```

---

## 四、开发与工具链

### 4.1 开发环境

```
本地开发：
- Node.js 18+
- yarn / pnpm（包管理）
- Palantir CLI（平台命令行工具）
- VS Code + Palantir 插件

代码规范：
- ESLint（Palantir 定制规则）
- Prettier
- TypeScript strict mode
```

### 4.2 测试

```
单元测试：Jest
组件测试：React Testing Library
端到端测试：Playwright
Mock 数据：MSW (Mock Service Worker)
```

### 4.3 部署

```
Foundry 应用部署流程：
1. 本地开发 → 提交 Git
2. CI/CD 自动构建和测试
3. 部署到 Foundry 开发环境
4. 客户验收测试
5. 上线到生产环境
```

---

## 五、学习优先级

| 优先级 | 技术 | 原因 |
|--------|------|------|
| ⭐⭐⭐ | TypeScript | 日常开发主要语言 |
| ⭐⭐⭐ | React | 核心框架 |
| ⭐⭐⭐ | Foundry 平台概念 | 理解工作上下文 |
| ⭐⭐ | Template Builder | 快速原型工具 |
| ⭐⭐ | Ontology 建模 | 数据抽象核心 |
| ⭐ | AIP | 未来趋势 |
| ⭐ | 自定义组件开发 | 进阶能力 |

---

## 六、本章小结

| 层面 | 核心技术 |
|------|---------|
| 前端基础 | TypeScript + React + 工程化 |
| 平台核心 | Foundry + Ontology + Templates |
| 新兴方向 | AIP + AI 集成 |
| 工具链 | CLI + Git + 测试 + CI/CD |

---

*下节课：[第 3 课：Palantir 产品矩阵](lesson-3.md)*
