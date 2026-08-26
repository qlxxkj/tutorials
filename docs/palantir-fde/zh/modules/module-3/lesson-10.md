# 第 10 课：自定义模板开发

> 📌 **学习目标**：掌握用 React + TypeScript 开发自定义 Foundry 模板
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：模板结构 → 数据获取 → 组件开发 → 部署发布

---

## 一、自定义模板结构

### 1.1 项目目录

```
my-template/
├── src/
│   ├── index.tsx              # 入口文件
│   ├── Template.tsx           # 模板主组件
│   ├── components/            # 子组件
│   │   ├── ObjectCard.tsx
│   │   ├── ObjectTable.tsx
│   │   └── ActionButton.tsx
│   ├── hooks/                 # 自定义 Hook
│   │   ├── useObjectDetail.ts
│   │   └── useObjectActions.ts
│   ├── types/                 # TypeScript 类型
│   │   └── ontology.ts
│   └── styles/                # 样式
│       └── template.css
├── package.json
├── tsconfig.json
└── palantir.config.json       # Palantir 配置
```

### 1.2 入口文件

```typescript
// src/index.tsx
import { defineTemplate } from '@palantir/templates';
import { MyTemplate } from './Template';

export default defineTemplate({
  name: 'My Custom Template',
  description: 'A custom template for object management',
  component: MyTemplate,
  defaultProps: {
    // 默认配置
  },
});
```

---

## 二、模板主组件

```typescript
// src/Template.tsx
import React, { useState } from 'react';
import {
  Panel,
  Toolbar,
  DataTable,
  ObjectActions,
  Spinner,
  EmptyState,
} from '@palantir/templates';
import { ObjectCard } from './components/ObjectCard';
import { useObjectList } from './hooks/useObjectList';

interface TemplateProps {
  objectType: string;
  filters?: Record<string, unknown>;
}

export const MyTemplate: React.FC<TemplateProps> = ({
  objectType,
  filters = {},
}) => {
  const { objects, isLoading, error } = useObjectList(objectType, filters);
  const [selectedOid, setSelectedOid] = useState<string | null>(null);

  if (isLoading) return <Spinner />;
  if (error) return <EmptyState title="加载失败" message={error} />;
  if (objects.length === 0) return <EmptyState title="暂无数据" />;

  return (
    <Panel title={`${objectType} 列表`}>
      <Toolbar>
        <ObjectActions
          objectType={objectType}
          selectedOids={[selectedOid].filter(Boolean)}
          onExecute={() => setSelectedOid(null)}
        />
      </Toolbar>

      <DataTable
        data={objects}
        objectType={objectType}
        onRowClick={(obj) => setSelectedOid(obj.oid)}
        selectedId={selectedOid}
      />

      {selectedOid && (
        <ObjectCard
          oid={selectedOid}
          objectType={objectType}
          onClose={() => setSelectedOid(null)}
        />
      )}
    </Panel>
  );
};
```

---

## 三、数据获取 Hook

```typescript
// src/hooks/useObjectList.ts
import { useState, useEffect } from 'react';
import type { OntologyObject } from '../types/ontology';

interface UseObjectListResult {
  objects: OntologyObject[];
  isLoading: boolean;
  error: string | null;
}

export function useObjectList(
  objectType: string,
  filters: Record<string, unknown> = {}
): UseObjectListResult {
  const [objects, setObjects] = useState<OntologyObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('objectType', objectType);
    Object.entries(filters).forEach(([k, v]) =>
      params.set(k, JSON.stringify(v))
    );

    fetch(`/api/ontology/objects?${params}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setObjects(data.objects ?? []))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [objectType, JSON.stringify(filters)]);

  return { objects, isLoading, error };
}
```

---

## 四、对象卡片组件

```typescript
// src/components/ObjectCard.tsx
import React from 'react';
import {
  Panel,
  PropertyList,
  Button,
  Divider,
} from '@palantir/templates';
import { useObjectDetail } from '../hooks/useObjectDetail';
import { useActionExecutor } from '../hooks/useActionExecutor';

interface ObjectCardProps {
  oid: string;
  objectType: string;
  onClose: () => void;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({
  oid,
  objectType,
  onClose,
}) => {
  const { data, isLoading } = useObjectDetail(oid, objectType);
  const { execute, isExecuting } = useActionExecutor(oid, objectType);

  if (isLoading || !data) return <Spinner />;

  return (
    <Panel
      title={`${objectType}: ${data.properties.name ?? oid}`}
      onClose={onClose}
    >
      <PropertyList
        data={data.properties}
        objectType={objectType}
      />

      <Divider />

      <div className="action-buttons">
        {data.actions?.map(action => (
          <Button
            key={action.name}
            label={action.label}
            intent={action.intent ?? 'primary'}
            loading={isExecuting && action.name === 'lastAction'}
            onClick={() => execute(action.name, action.params)}
          />
        ))}
      </div>
    </Panel>
  );
};
```

---

## 五、部署发布

### 5.1 本地测试

```bash
# 启动本地开发服务器
palantir templates dev

# 在浏览器中打开 localhost 预览
```

### 5.2 发布到 Foundry

```bash
# 构建
palantir templates build

# 发布
palantir templates publish \
  --template-id my-custom-template \
  --version 1.0.0 \
  --description "自定义对象管理模板"
```

### 5.3 在应用中使用

```
Foundry Web App → Template Registry → 选择发布的模板 → 配置参数 → 添加到应用
```

---

## 六、本章小结

| 步骤 | 操作 |
|------|------|
| 1 | 创建项目结构 |
| 2 | 实现模板主组件 |
| 3 | 编写数据获取 Hook |
| 4 | 开发子组件 |
| 5 | 本地测试 |
| 6 | 构建并发布到 Foundry |

---

*下节课进入[模块四：AIP 与高级特性](../module-4/lesson-11.md)*
