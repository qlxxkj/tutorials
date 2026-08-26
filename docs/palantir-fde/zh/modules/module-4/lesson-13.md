# 第 13 课：数据可视化与图表

> 📌 **学习目标**：掌握 Foundry 中的数据可视化能力，选择合适的图表类型
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：图表类型 → 配置方法 → 交互设计 → 最佳实践

---

## 一、图表类型选择

### 1.1 基础图表

| 图表 | 适用场景 | 配置要点 |
|------|---------|---------|
| **Line Chart** | 趋势分析 | x 轴时间字段，y 轴数值字段 |
| **Bar Chart** | 对比分析 | 类别字段 vs 数值字段 |
| **Pie Chart** | 占比分析 | 分类字段 + 占比计算 |
| **Scatter Plot** | 相关性分析 | 两个数值字段 |
| **Area Chart** | 趋势+总量 | 类似折线图，填充区域 |

### 1.2 高级图表

| 图表 | 适用场景 |
|------|---------|
| **Map** | 地理分布数据 |
| **Heatmap** | 密度/强度展示 |
| **Treemap** | 层级占比 |
| **Sankey Diagram** | 流程/流转分析 |
| **Gauge** | 目标达成率 |
| **KPI Card** | 关键指标展示 |

---

## 二、图表配置示例

### 2.1 折线图配置

```json
{
  "type": "line",
  "title": "订单趋势",
  "data": {
    "xAxis": "order_date",
    "yAxis": "order_count",
    "group": "order_status"
  },
  "style": {
    "colors": ["#0066FF", "#00C49A", "#FF6B6B"],
    "showPoints": true,
    "showLegend": true
  }
}
```

### 2.2 柱状图配置

```json
{
  "type": "bar",
  "title": "各产品线销售额",
  "data": {
    "xAxis": "product_category",
    "yAxis": "sales_amount"
  },
  "style": {
    "orientation": "horizontal",
    "colors": ["#6366F1"],
    "showValue": true
  }
}
```

### 2.3 地图配置

```json
{
  "type": "map",
  "title": "客户分布",
  "data": {
    "locationField": "city",
    "sizeField": "customer_count",
    "colorField": "revenue"
  },
  "style": {
    "mapType": "china",
    "colorScale": "sequential"
  }
}
```

---

## 三、交互设计

### 3.1 图表联动

```
柱状图点击 → 刷新折线图数据
地图区域选择 → 过滤表格数据
时间范围选择 → 所有图表同步更新
```

### 3.2 悬停提示

```json
{
  "tooltip": {
    "enabled": true,
    "format": "{category}: {value} ({percent}%)"
  }
}
```

### 3.3 点击跳转

```json
{
  "clickAction": {
    "type": "navigate",
    "target": "/objects/{objectId}"
  }
}
```

---

## 四、最佳实践

### 4.1 选择图表的原则

```
问自己三个问题：
1. 我要回答什么问题？（对比/趋势/占比/分布）
2. 数据有多少？（少量用饼图，大量用表格）
3. 用户是谁？（管理层看 KPI，分析师看详情）
```

### 4.2 常见的坑

```
❌ 在饼图中放超过 6 个类别
❌ 用柱状图展示时间趋势（用折线图）
❌ 颜色对比度太低（考虑色盲友好）
❌ 3D 图表（增加认知负担）
❌ 同时展示太多图表（超过 5 个）
```

---

## 五、本章小结

| 要点 | 说明 |
|------|------|
| 图表选择 | 根据分析目的选择合适类型 |
| 配置结构 | type/data/style 三层配置 |
| 交互设计 | 联动、悬停、跳转提升体验 |
| 最佳实践 | 简洁优先，避免过度装饰 |

---

*下节课进入[模块五：实战项目](../module-5/project-1.md)*
