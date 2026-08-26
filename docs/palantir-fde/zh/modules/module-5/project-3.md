# 项目三：AIP Agent 应用开发

> 📌 **学习目标**：掌握 AIP Agent 的开发和部署
> ⏱️ **预计时长**：40 分钟

---

## 一、项目需求

**场景**：智能订单助手

**功能**：用户用自然语言查询和操作用单

---

## 二、Agent 设计

### 工具定义

```typescript
const orderTools = [
  {
    name: 'search_orders',
    description: '搜索订单，支持按状态、日期、客户筛选',
    parameters: {
      status: { type: 'string', required: false },
      dateFrom: { type: 'string', required: false },
      customerId: { type: 'string', required: false },
    },
    execute: async (params) => searchOrders(params),
  },
  {
    name: 'get_order_detail',
    description: '获取订单详细信息',
    parameters: { orderId: { type: 'string' } },
    execute: async (params) => getOrderDetail(params.orderId),
  },
  {
    name: 'cancel_order',
    description: '取消订单',
    parameters: {
      orderId: { type: 'string' },
      reason: { type: 'string' },
    },
    execute: async (params) => cancelOrder(params.orderId, params.reason),
  },
];
```

### Prompt 设计

```
你是一个专业的订单处理助手。你的任务是帮助用户查询和操作订单。

可用工具：
- search_orders: 搜索订单
- get_order_detail: 获取订单详情
- cancel_order: 取消订单

回复规则：
1. 先用工具获取信息
2. 用简洁清晰的方式回答
3. 涉及敏感操作（取消/修改）需要确认
4. 不知道的信息不要编造
```

---

## 三、集成到 Template

```typescript
const OrderAssistantPanel: React.FC = () => {
  return (
    <div className="assistant-layout">
      <div className="main-content">
        <OrderList />
      </div>
      <div className="ai-panel">
        <AIPChat
          tools={orderTools}
          systemPrompt={orderAgentPrompt}
          placeholder="例如：帮我找一下昨天 Pending 的订单..."
        />
      </div>
    </div>
  );
};
```

---

## 四、本章小结

| 要点 | 说明 |
|------|------|
| Tool 定义 | 将 Ontology Action 封装为 Agent 工具 |
| Prompt 工程 | 清晰的指令和约束 |
| Few-shot | 示例对话提升准确率 |
| 集成方式 | 嵌入到 Foundry Template |

---

*至此，本课程全部内容完成！回到 [课程总览](../summary.md)*
