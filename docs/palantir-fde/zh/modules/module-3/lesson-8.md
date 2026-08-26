# 第 8 课：Ontology 本体建模

> 📌 **学习目标**：掌握 Ontology 的核心概念，能够设计业务对象模型
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：概念理解 → 对象设计 → 操作定义 → 关系建模

---

## 一、Ontology 是什么？

**Ontology（本体）** 是 Palantir Foundry 的核心抽象层——它将原始数据转化为**业务对象**，让非技术人员也能理解和操作数据。

```
传统方式：
  数据库表 → SQL 查询 → 程序员理解 → 展示给用户

Ontology 方式：
  数据库表 → Object 定义 → 业务人员理解 → 直接操作
```

---

## 二、Object（对象）设计

### 2.1 对象的基本结构

```
Object: Order（订单）
├── Properties（属性）
│   ├── order_id: string          // 唯一标识
│   ├── customer_id: string       // 关联客户
│   ├── amount: number            // 金额
│   ├── currency: string          // 币种
│   ├── status: OrderStatus       // 状态枚举
│   ├── created_at: timestamp     // 创建时间
│   └── shipping_address: Address // 嵌套对象
│
├── Actions（操作）
│   ├── cancel()                  // 取消订单
│   ├── update_status(newStatus)  // 更新状态
│   └── request_refund()          // 申请退款
│
└── Relationships（关系）
    ├── customer → Customer Object
    ├── items → LineItem[]
    └── payments → Payment[]
```

### 2.2 属性类型

```typescript
// 标量类型
type: 'string' | 'number' | 'boolean' | 'timestamp' | 'email' | 'url'

// 枚举类型
type: 'enum'
values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

// 复合类型
type: 'object'
properties: {
  street: { type: 'string' },
  city: { type: 'string' },
  zipCode: { type: 'string' },
  country: { type: 'string' }
}

// 数组类型
type: 'array'
items: { type: 'string' }
```

---

## 三、Action（操作）设计

### 3.1 Action 的定义

Action 是用户在对象上可以执行的操作，对应前端按钮和后端逻辑。

```
Action: cancel（取消订单）

输入参数：
  - reason: string (可选) - 取消原因

执行逻辑：
  1. 验证订单状态是否可取消
  2. 更新数据库状态
  3. 发送通知
  4. 记录审计日志

输出：
  - success: boolean
  - message: string
```

### 3.2 Action 的确认机制

```typescript
interface ConfirmationConfig {
  title: string;           // "确认取消订单？"
  message: string;         // "取消后无法恢复，确定继续吗？"
  confirmLabel: string;    // "确认取消"
  cancelLabel?: string;    // "返回"
  requireInput?: boolean;  // 是否需要用户输入
  inputPlaceholder?: string; // 输入提示
}
```

---

## 四、Relationship（关系）建模

### 4.1 关系类型

```
一对一（1:1）：
  Customer ↔ BillingAddress

一对多（1:N）：
  Customer → Orders[]
  Product → Reviews[]

多对多（M:N）：
  Order ↔ Product（通过 OrderItem 关联）
```

### 4.2 关系配置

```typescript
interface RelationshipConfig {
  sourceObject: 'Order';
  targetObject: 'Customer';
  type: 'belongs_to' | 'has_many' | 'many_to_many';
  properties?: Record<string, PropertyConfig>;
  // 如：Order → Customer 的关系可能包含 order_date
}
```

---

## 五、实战：设计一个供应链 Ontology

### 场景：电商供应链管理

```
Objects:
├── Supplier（供应商）
│   ├── 属性：name, contact, rating, location
│   ├── 操作：updateRating, blacklist
│   └── 关系：supplies → Product
│
├── Product（商品）
│   ├── 属性：sku, name, price, stock, category
│   ├── 操作：updateStock, changePrice
│   └── 关系：supplied_by → Supplier, ordered_in → Order
│
├── Order（订单）
│   ├── 属性：id, status, total, createdAt
│   ├── 操作：cancel, ship, refund
│   └── 关系：customer → Customer, items → OrderItem
│
├── OrderItem（订单明细）
│   ├── 属性：quantity, unitPrice
│   └── 关系：product → Product, part_of → Order
│
└── Customer（客户）
    ├── 属性：name, email, address
    ├── 操作：updateProfile
    └── 关系：places → Order
```

---

## 六、本章小结

| 概念 | 说明 |
|------|------|
| Object | 业务实体的抽象，包含属性和操作 |
| Property | 对象的字段，支持多种类型 |
| Action | 对象上可执行的操作，对应前端按钮 |
| Relationship | 对象之间的关系，支持 1:1、1:N、M:N |
| Ontology Editor | Foundry 中设计和管理本体模型的工具 |

---

*下节课：[第 9 课：Template Builder](lesson-9.md)*
