# 第 11 课：AI Platform (AIP) 入门

> 📌 **学习目标**：理解 AIP 的核心概念，掌握 Agent 开发基础
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：AIP 概述 → Agent 架构 → Prompt 工程 → 工具集成

---

## 一、AIP 是什么？

**AIP（AI Platform）** 是 Palantir 的 AI 原生平台，让业务用户通过**自然语言**直接与数据交互。

```
传统方式：
  用户 → 找分析师 → 写 SQL → 看报表 → 做决策

AIP 方式：
  用户 → 自然语言提问 → Agent 执行 → 直接操作
```

---

## 二、AIP Agent 架构

```
┌─────────────────────────────────────────────┐
│              User Interface                  │
│        （聊天界面 / 嵌入到 Template）         │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            AIP Agent                         │
│  ┌─────────────┐  ┌─────────────┐           │
│  │  LLM (GPT)  │  │  Ontology   │           │
│  │  理解意图   │  │  语义映射   │           │
│  └──────┬──────┘  └──────┬──────┘           │
│         │                │                  │
│  ┌──────▼────────────────▼──────┐           │
│  │      Tool Executor           │           │
│  │  （执行 Ontology Actions）    │           │
│  └──────────────┬───────────────┘           │
└─────────────────┼───────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│Objects │  │Actions   │  │Queries   │
└────────┘  └──────────┘  └──────────┘
```

---

## 三、Agent 开发核心概念

### 3.1 Tool（工具）

Tool 是 Agent 可以调用的操作，对应 Ontology 的 Action。

```typescript
// 定义一个 Tool
const cancelOrderTool = {
  name: 'cancel_order',
  description: '取消订单，可用于客户投诉处理',
  parameters: {
    orderId: { type: 'string', description: '订单 ID' },
    reason: { type: 'string', description: '取消原因' },
  },
  execute: async (params: { orderId: string; reason: string }) => {
    // 调用 Ontology Action
    const result = await ontology.actions.cancel(params.orderId, { reason: params.reason });
    return result;
  },
};
```

### 3.2 Prompt 模板

```
系统提示词模板：
你是一个订单处理助手。用户可以用自然语言描述订单相关问题，
你应该：
1. 理解用户意图
2. 查询相关订单信息
3. 提供建议或执行操作
4. 用简洁清晰的方式回复

可用工具：
- search_orders: 搜索订单
- get_order_detail: 获取订单详情
- cancel_order: 取消订单
- update_status: 更新订单状态
```

### 3.3 Few-shot 示例

```
用户：我想取消订单 ORD-12345
助手：好的，正在为您取消订单 ORD-12345。
      取消原因是什么？
用户：商品损坏了
助手：已取消订单 ORD-12345，原因是商品损坏。
      退款将在 3-5 个工作日返回您的账户。

用户：订单 ORD-67890 到哪了？
助手：正在查询订单 ORD-67890 的状态...
      该订单已发货，预计明天送达。
      物流单号：SF1234567890
```

---

## 四、AIP 与 Foundry 的集成

### 4.1 在 Template 中嵌入 AIP

```typescript
// 在 Foundry 模板中嵌入 AIP Chat 组件
import { AIPChat } from '@palantir/aip';

const OrderManagementPanel: React.FC = () => {
  return (
    <div className="aip-layout">
      <ObjectList objectType="Order" />
      <AIPChat
        ontologyType="Order"
        tools={['search_orders', 'cancel_order', 'get_order_detail']}
        placeholder="用自然语言查询或操作订单..."
      />
    </div>
  );
};
```

### 4.2 Agent 配置

```json
{
  "agent": {
    "name": "OrderAgent",
    "model": "gpt-4",
    "systemPrompt": "你是一位专业的订单处理助手...",
    "tools": [
      { "name": "search_orders", "schema": "..." },
      { "name": "cancel_order", "schema": "..." }
    ],
    "fewShotExamples": [...]
  }
}
```

---

## 五、本章小结

| 概念 | 说明 |
|------|------|
| Agent | 理解自然语言并执行操作的 AI 程序 |
| Tool | Agent 可调用的操作，对应 Ontology Action |
| Prompt | 定义 Agent 行为和风格的指令 |
| Few-shot | 示例对话，提升 Agent 理解准确度 |
| 集成方式 | 嵌入到 Foundry Template 或独立使用 |

---

*下节课：[第 12 课：Ontology API 开发](lesson-12.md)*
