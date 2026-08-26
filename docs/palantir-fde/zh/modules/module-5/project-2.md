# 项目二：构建 Ontology 驱动的业务面板

> 📌 **学习目标**：掌握 Ontology 驱动的复杂面板开发
> ⏱️ **预计时长**：40 分钟

---

## 一、项目需求

**场景**：供应链可视化面板

**功能需求**：
1. 供应商列表 + 评分
2. 商品库存地图
3. 订单趋势图表
4. 实时告警通知
5. 一键执行补货操作

---

## 二、Ontology 设计

```
Objects:
  - Supplier（供应商）: rating, location, leadTime
  - Product（商品）: stock, reorderThreshold, supplier
  - Order（订单）: status, quantity, date
  - Alert（告警）: type, severity, message, resolved

Relationships:
  - Supplier → supplies → Product
  - Product → ordered_in → Order
  - Product → triggers → Alert (when stock < threshold)
```

---

## 三、关键实现

### 地图组件

```typescript
const SupplyChainMap: React.FC<{ products: Product[] }> = ({ products }) => (
  <Map
    data={products}
    locationField="supplier_location"
    sizeField={(p) => p.stock / p.reorderThreshold}
    colorField={(p) => p.stock < p.reorderThreshold ? 'red' : 'green'}
    tooltip={(p) => `${p.name}: 库存 ${p.stock}`}
  />
);
```

### 告警组件

```typescript
const AlertBanner: React.FC<{ alerts: Alert[] }> = ({ alerts }) => (
  <AlertBar
    alerts={alerts.filter(a => !a.resolved)}
    onResolve={(alertId) => resolveAlert(alertId)}
  />
);
```

---

## 四、本章小结

| 要点 | 说明 |
|------|------|
| 多 Object 关联 | 通过 Relationship 串联数据 |
| 实时告警 | 基于阈值的自动检测 |
| 地图可视化 | 地理数据展示 |
| 一键操作 | Action 直接触发业务逻辑 |

---

*下个项目：[项目三：AIP Agent 应用开发](project-3.md)*
