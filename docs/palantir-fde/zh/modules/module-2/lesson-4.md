# 第 4 课：TypeScript 深度实践

> 📌 **学习目标**：掌握 FDE 日常开发所需的 TypeScript 高级特性
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：类型系统 → 高级技巧 → Palantir 模式 → 实战练习

---

## 一、严格类型系统

Palantir 的代码库开启严格的 TypeScript 配置：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Null 安全

```typescript
// ❌ 错误 - 可能为 undefined
const name = user.name.toUpperCase();

// ✅ 正确 - 使用可选链
const name = user.name?.toUpperCase();

// ✅ 正确 - 使用非空断言（确认不为 null 时）
const name = user.name!.toUpperCase();
```

### 索引访问安全

```typescript
const arr = [1, 2, 3];
// noUncheckedIndexedAccess 下，arr[99] 返回 number | undefined
const first = arr[0];       // number | undefined
const exists = arr[0] ?? 0; // number
```

---

## 二、工具类型（Utility Types）

### 常用工具类型

```typescript
// Partial - 所有属性可选
type UserPartial = Partial<User>;

// Required - 所有属性必填
type UserRequired = Required<User>;

// Pick - 选择部分属性
type UserName = Pick<User, 'name' | 'email'>;

// Omit - 排除部分属性
type UserWithoutPassword = Omit<User, 'password'>;

// Record - 键值对类型
type StatusMap = Record<string, boolean>;

// Readonly - 只读
type ReadonlyUser = Readonly<User>;

// ReturnType - 函数返回值类型
type HandleClick = ReturnType<typeof handleClick>;

// Parameters - 函数参数类型
type ClickArgs = Parameters<typeof handleClick>;
```

### 自定义工具类型

```typescript
// Palantir 常用：深度只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Palantir 常用：Maybe 联合
type Maybe<T> = T | null | undefined;

// Palantir 常用：非空数组
type NonEmptyArray<T> = [T, ...T[]];
```

---

## 三、泛型编程

### 基础泛型

```typescript
// 泛型函数
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 泛型组件
interface Props<T> {
  data: T;
  render: (item: T) => React.ReactNode;
}

function List<T>({ data, render }: Props<T>) {
  return (
    <ul>
      {data.map(render)}
    </ul>
  );
}
```

### 泛型约束

```typescript
// 限制泛型必须有 id 属性
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

---

## 四、Palantir 特有类型模式

### Ontology 对象类型

```typescript
// Ontology Object 的基本类型定义
interface OntologyObject {
  oid: string;              // Object ID
  objectType: string;       // 对象类型名
  properties: Record<string, unknown>;
  relationships: Relationship[];
}

interface Relationship {
  type: string;
  targetOid: string;
  properties?: Record<string, unknown>;
}

// 具体业务对象的类型
interface Transaction extends OntologyObject {
  objectType: 'Transaction';
  properties: {
    amount: number;
    currency: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
  };
}
```

### Template Props 模式

```typescript
// 模板通用的 Props 定义
interface TemplateProps {
  objects: OntologyObject[];
  selectedObject?: OntologyObject;
  onObjectSelect?: (obj: OntologyObject) => void;
  actions: ActionDefinition[];
  isLoading?: boolean;
  error?: string;
}

// 操作定义
interface ActionDefinition {
  name: string;
  label: string;
  icon?: string;
  confirms?: ConfirmationConfig;
  execute: (oid: string, params?: Record<string, unknown>) => Promise<void>;
}

interface ConfirmationConfig {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
}
```

---

## 五、实战：类型安全的 Hook

```typescript
// 对象数据获取 Hook
function useObject<T extends OntologyObject>(
  oid: string | null,
  objectType?: string
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!oid) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 调用 Foundry API
    fetch(`/api/ontology/objects/${oid}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [oid]);

  return { data, isLoading, error };
}

// 批量对象获取 Hook
function useObjects<T extends OntologyObject>(
  oids: string[],
  objectType?: string
): {
  data: Map<string, T>;
  isLoading: boolean;
  error: string | null;
} {
  // ...
}
```

---

## 六、本章小结

| 要点 | 说明 |
|------|------|
| 严格模式 | strict + noUncheckedIndexedAccess 是标配 |
| 工具类型 | Partial/Pick/Omit/Record 高频使用 |
| 泛型 | 组件和 Hook 大量使用泛型 |
| Ontology 类型 | 所有业务对象继承 OntologyObject |
| 类型安全 | 宁可多写类型，不要 any |

---

*下节课：[第 5 课：React 高级模式](lesson-5.md)*
