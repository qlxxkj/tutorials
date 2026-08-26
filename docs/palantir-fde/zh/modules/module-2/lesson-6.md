# 第 6 课：前端工程化

> 📌 **学习目标**：掌握 Palantir FDE 的开发规范、测试策略和部署流程
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：代码规范 → 测试策略 → 构建部署 → 协作流程

---

## 一、代码规范

### ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
  extends: ['palantir', 'palantir/react', 'palantir/typescript'],
  rules: {
    // 禁止使用 any
    '@typescript-eslint/no-explicit-any': 'error',
    // 禁止空函数体
    '@typescript-eslint/no-empty-function': 'warn',
    // React 组件命名规范
    'react/display-name': 'error',
  },
};
```

### 命名约定

```
// 组件：PascalCase
const ObjectDetailPanel: React.FC = () => {}

// Hook：use前缀 + camelCase
function useObjectDetail() {}

// 接口：大写字母开头
interface ObjectCardProps {}

// 常量：UPPER_SNAKE_CASE
const MAX_OBJECTS_PER_PAGE = 50;

// 枚举：PascalCase
enum ObjectStatus { Pending, Active, Archived }
```

---

## 二、测试策略

### 测试金字塔

```
        /\
       /  \      E2E Tests（少量）
      /----\    Component Tests（中等）
     /......\   Unit Tests（大量）
    /........\
```

### 单元测试

```typescript
// __tests__/useObjectDetail.test.ts
describe('useObjectDetail', () => {
  it('should return data when API succeeds', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ oid: '123', objectType: 'User' }),
      ok: true,
    });

    const { result, waitFor } = renderHook(() =>
      useObjectDetail('123', 'User')
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual({ oid: '123', objectType: 'User' });
  });

  it('should handle errors gracefully', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const { result, waitFor } = renderHook(() =>
      useObjectDetail('invalid', 'User')
    );

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
```

### 组件测试

```typescript
// __tests__/ObjectCard.test.tsx
describe('ObjectCard', () => {
  it('renders object name', () => {
    const { getByText } = render(
      <ObjectCard object={{ oid: '1', properties: { name: 'Test' } }} />
    );
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    const { getByRole } = render(
      <ObjectCard
        object={{ oid: '1', properties: { name: 'Test' } }}
        onSelect={onSelect}
      />
    );
    fireEvent.click(getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ oid: '1' }));
  });
});
```

---

## 三、构建与部署

### 本地开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 运行测试
yarn test

# 代码检查
yarn lint
yarn typecheck
```

### CI/CD 流程

```
Push to main
    │
    ▼
┌─────────────┐
│  Lint 检查  │  ← ESLint + Prettier
└──────┬──────┘
       ▼
┌─────────────┐
│  类型检查   │  ← tsc --noEmit
└──────┬──────┘
       ▼
┌─────────────┐
│  单元测试   │  ← Jest
└──────┬──────┘
       ▼
┌─────────────┐
│  组件测试   │  ← React Testing Library
└──────┬──────┘
       ▼
┌─────────────┐
│  构建产物   │  ← Vite / Webpack
└──────┬──────┘
       ▼
┌─────────────┐
│  部署到     │  ← Foundry App Registry
│  Foundry    │
└─────────────┘
```

---

## 四、代码审查

### PR 检查清单

```
□ 代码符合 TypeScript 严格模式
□ 所有新增逻辑有单元测试
□ 组件有对应的测试
□ 无 console.log 残留
□ 无硬编码字符串（提取为常量）
□ 无 unsafe cast（as any）
□ 接口变更有文档说明
□ 变更影响已评估
```

### 审查关注点

| 关注点 | 说明 |
|--------|------|
| 类型安全 | 是否用了 any？类型是否完整？ |
| 错误处理 | 是否处理了 loading/error 状态？ |
| 性能 | 是否有不必要的重渲染？ |
| 可访问性 | 是否有 aria 属性？键盘可操作？ |
| 安全性 | 是否有 XSS 风险？输入是否校验？ |

---

## 五、本章小结

| 环节 | 工具/实践 |
|------|---------|
| 代码规范 | ESLint + Prettier + TypeScript strict |
| 测试 | Jest + RTL + MSW |
| CI/CD | Git push → Lint → Test → Build → Deploy |
| Code Review | 类型安全、错误处理、性能、可访问性 |

---

*下节课进入[模块三：Foundry 应用开发](../module-3/lesson-7.md)*
