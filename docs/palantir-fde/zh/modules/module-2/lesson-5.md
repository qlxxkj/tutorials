# 第 5 课：React 高级模式

> 📌 **学习目标**：掌握 Palantir FDE 常用的 React 高级模式和模式
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：复合组件 → 渲染属性 → 自定义 Hook → 性能优化

---

## 一、复合组件模式

Palantir 大量使用复合组件（Compound Components）模式：

```typescript
// 类似 <Select><Option /></Select> 的模式
interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> & { Option: React.FC<OptionProps> } = ({
  value,
  onChange,
  children,
}) => {
  return (
    <div className="select-wrapper">
      {children}
    </div>
  );
};

interface OptionProps {
  value: string;
  label: string;
}

const Option: React.FC<OptionProps> = ({ value, label }) => (
  <button onClick={() => /* notify parent */}>
    {label}
  </button>
);

Select.Option = Option;

// 使用
<Select value={selected} onChange={setSelected}>
  <Select.Option value="1" label="选项一" />
  <Select.Option value="2" label="选项二" />
</Select>
```

---

## 二、对象列表组件模式

这是 FDE 最常见的组件模式：

```typescript
interface ObjectListProps {
  objects: OntologyObject[];
  objectType: string;
  onSelect?: (obj: OntologyObject) => void;
  actions?: ActionDefinition[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const ObjectList: React.FC<ObjectListProps> = ({
  objects,
  objectType,
  onSelect,
  actions = [],
  isLoading,
  emptyMessage = '暂无数据',
}) => {
  if (isLoading) return <Spinner />;
  if (objects.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="object-list">
      <ObjectToolbar actions={actions} />
      <ObjectTable
        objects={objects}
        objectType={objectType}
        onSelect={onSelect}
      />
    </div>
  );
};
```

---

## 三、自定义 Hook 模式

### 3.1 对象详情 Hook

```typescript
function useObjectDetail(
  oid: string | null,
  objectType: string
): ObjectDetailState {
  const [state, setState] = useState<ObjectDetailState>({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!oid) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    setState(s => ({ ...s, isLoading: true, error: null }));

    // 获取对象详情
    fetch(`/api/ontology/objects/${encodeURIComponent(oid)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setState({ data, isLoading: false, error: null }))
      .catch(err => setState({ data: null, isLoading: false, error: err.message }));
  }, [oid, objectType]);

  return state;
}
```

### 3.2 操作执行 Hook

```typescript
function useActionExecutor(
  oid: string,
  objectType: string
): {
  execute: (actionName: string, params?: Record<string, unknown>) => Promise<void>;
  isExecuting: boolean;
  lastError: string | null;
} {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const execute = useCallback(async (actionName, params = {}) => {
    setIsExecuting(true);
    setLastError(null);

    try {
      await fetch(`/api/ontology/objects/${encodeURIComponent(oid)}/actions/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
    } catch (err) {
      setLastError(err instanceof Error ? err.message : '执行失败');
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, [oid]);

  return { execute, isExecuting, lastError };
}
```

---

## 四、条件渲染与懒加载

### 4.1 路由参数驱动的视图

```typescript
interface ObjectViewProps {
  objectId: string;
  objectType: string;
  tab?: string;
}

const ObjectView: React.FC<ObjectViewProps> = ({ objectId, objectType, tab = 'overview' }) => {
  const { data } = useObjectDetail(objectId, objectType);

  if (!data) return <Spinner />;

  const tabs = [
    { key: 'overview', label: '概览', component: <OverviewPanel object={data} /> },
    { key: 'actions', label: '操作', component: <ActionsPanel object={data} /> },
    { key: 'relationships', label: '关系', component: <RelationshipsPanel object={data} /> },
  ];

  const activeTab = tabs.find(t => t.key === tab) ?? tabs[0];

  return (
    <div>
      <ObjectHeader object={data} objectType={objectType} />
      <Tabs tabs={tabs} activeKey={tab} />
      {activeTab.component}
    </div>
  );
};
```

---

## 五、性能优化

### 5.1 记忆化

```typescript
// 避免不必要的重渲染
const ObjectCard = React.memo(({ object, onSelect }: ObjectCardProps) => {
  // 只在 object 或 onSelect 变化时重渲染
  return <Card title={object.properties.name} onClick={() => onSelect(object)} />;
}, (prev, next) => prev.object.oid === next.object.oid);
```

### 5.2 虚拟列表

```typescript
// 大数据量时使用虚拟滚动
import { FixedSizeList } from 'react-window';

const VirtualObjectList: React.FC<{ objects: OntologyObject[] }> = ({ objects }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ObjectCard object={objects[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={objects.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

---

## 六、本章小结

| 模式 | 适用场景 |
|------|---------|
| 复合组件 | 相关组件需要共享状态（如 Select/Option）|
| 对象列表 | 展示 Ontology 对象集合 |
| useObjectDetail | 获取单个对象详情 |
| useActionExecutor | 执行 Ontology 操作 |
| React.memo | 避免不必要的重渲染 |
| 虚拟列表 | 大数据量列表 |

---

*下节课：[第 6 课：前端工程化](lesson-6.md)*
