# 项目一：搭建第一个 Foundry 应用

> 📌 **学习目标**：综合运用所学，完成一个完整的 Foundry 应用
> ⏱️ **预计时长**：45 分钟
> 🎯 **本节节奏**：需求分析 → Ontology 设计 → 模板开发 → 部署测试

---

## 一、项目需求

**场景**：为电商客户构建订单管理面板

**功能需求**：
1. 展示订单列表（表格）
2. 点击订单查看详情
3. 支持订单状态更新
4. 显示关键指标（KPI）
5. 支持筛选和搜索

---

## 二、Ontology 设计

```
Object: Order
Properties:
  - order_id: string (PK)
  - customer_name: string
  - total_amount: number
  - status: enum [pending, processing, shipped, delivered, cancelled]
  - created_at: timestamp
  - shipping_address: object

Actions:
  - update_status(newStatus: string): void
  - cancel(reason: string): void

Relationships:
  - customer → Customer
  - items → OrderItem[]
```

---

## 三、模板开发步骤

### Step 1：创建项目骨架

```bash
palantir templates init order-management
cd order-management
```

### Step 2：实现主组件

```typescript
// src/Template.tsx
export const OrderManagementTemplate: React.FC = () => {
  const { orders, isLoading } = useObjectList('Order');
  const [selectedOid, setSelectedOid] = useState<string | null>(null);

  return (
    <Panel title="订单管理">
      <KPICard label="总订单数" value={orders.length} />
      <KPICard label="待处理" value={orders.filter(o => o.status === 'pending').length} />
      <KPICard label="本月金额" value={orders.filter(o => isThisMonth(o)).reduce((s, o) => s + o.amount, 0)} />

      <ObjectTable
        objects={orders}
        onSelect={setSelectedOid}
        actions={[
          { name: 'update_status', label: '更新状态' },
          { name: 'cancel', label: '取消订单' },
        ]}
      />

      {selectedOid && (
        <OrderDetailPanel
          oid={selectedOid}
          onClose={() => setSelectedOid(null)}
        />
      )}
    </Panel>
  );
};
```

### Step 3：测试与调试

```bash
palantir templates dev
# 在浏览器中打开 localhost 预览
```

### Step 4：发布

```bash
palantir templates publish --template-id order-management --version 1.0.0
```

---

## 四、本章小结

| 阶段 | 产出 |
|------|------|
| Ontology 设计 | Object/Action/Relationship 定义 |
| 组件开发 | React + TypeScript 模板 |
| 测试调试 | 本地预览验证 |
| 发布部署 | 发布到 Foundry Template Registry |

---

*下个项目：[项目二：构建 Ontology 驱动的业务面板](project-2.md)*
