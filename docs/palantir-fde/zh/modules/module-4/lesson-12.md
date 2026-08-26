# 第 12 课：Ontology API 开发

> 📌 **学习目标**：掌握通过 API 与 Ontology 交互的方法
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：API 概览 → 查询对象 → 执行操作 → 错误处理

---

## 一、API 概览

Palantir Foundry 提供 REST API 和 GraphQL API 两种接口方式。

### REST API 端点

```
基础路径：/api/ontology

对象操作：
  GET    /api/ontology/objects/{oid}        # 获取对象详情
  GET    /api/ontology/objects              # 搜索对象列表
  POST   /api/ontology/objects/{oid}/actions/{actionName}  # 执行操作

查询操作：
  POST   /api/ontology/queries/{queryName}  # 执行查询

关系操作：
  GET    /api/ontology/objects/{oid}/relationships  # 获取关系
```

---

## 二、查询对象

### 2.1 搜索对象

```typescript
// 搜索订单对象
async function searchOrders(filters: OrderFilters): Promise<OntologyObject[]> {
  const params = new URLSearchParams({
    objectType: 'Order',
    limit: '50',
  });

  if (filters.status) {
    params.set('status', filters.status);
  }
  if (filters.dateFrom) {
    params.set('created_at_gte', filters.dateFrom.toISOString());
  }
  if (filters.customerId) {
    params.set('customer_id', filters.customerId);
  }

  const response = await fetch(`/api/ontology/objects?${params}`);
  const data = await response.json();
  return data.objects ?? [];
}
```

### 2.2 获取对象详情

```typescript
async function getOrderDetail(oid: string): Promise<OntologyObject> {
  const response = await fetch(`/api/ontology/objects/${encodeURIComponent(oid)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch object ${oid}: ${response.status}`);
  }
  return response.json();
}
```

---

## 三、执行操作

### 3.1 简单操作

```typescript
async function cancelOrder(oid: string, reason?: string): Promise<void> {
  const response = await fetch(
    `/api/ontology/objects/${encodeURIComponent(oid)}/actions/cancel`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? '操作失败');
  }
}
```

### 3.2 带确认的操作

```typescript
async function confirmAndExecute(
  oid: string,
  action: string,
  params: Record<string, unknown>,
  confirmation: { title: string; message: string }
): Promise<void> {
  // 前端确认
  if (!window.confirm(`${confirmation.title}\n\n${confirmation.message}`)) {
    return;
  }

  await executeAction(oid, action, params);
}
```

---

## 四、错误处理

### 4.1 常见错误码

| 状态码 | 含义 | 处理方式 |
|--------|------|---------|
| 400 | 请求参数错误 | 检查参数格式 |
| 401 | 未认证 | 检查 Token |
| 403 | 无权限 | 检查权限配置 |
| 404 | 对象不存在 | 提示用户 |
| 409 | 冲突（状态不允许操作） | 显示冲突信息 |
| 422 | 验证失败 | 显示验证错误 |
| 500 | 服务器错误 | 重试或联系客服 |

### 4.2 统一错误处理

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        error.code ?? 'UNKNOWN',
        error.message ?? `HTTP ${response.status}`
      );
    }
    return response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'NETWORK_ERROR', err instanceof Error ? err.message : '网络错误');
  }
}
```

---

## 五、本章小结

| 操作 | 方法 | 端点 |
|------|------|------|
| 搜索对象 | GET | `/api/ontology/objects` |
| 获取详情 | GET | `/api/ontology/objects/{oid}` |
| 执行操作 | POST | `/api/ontology/objects/{oid}/actions/{name}` |
| 获取关系 | GET | `/api/ontology/objects/{oid}/relationships` |

---

*下节课：[第 13 课：数据可视化与图表](lesson-13.md)*
