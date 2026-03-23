---
name: typescript-utility-types
description: TypeScript 内置工具类型详解。适用于需要转换类型、创建变体类型、选取/排除属性等场景。包含 Partial、Required、Pick、Omit、Record 等常用类型。
---

# TypeScript 内置工具类型

TypeScript 提供了一系列内置工具类型，能帮我们快速转换类型。

## 常用工具类型

### Partial<T> - 将所有属性变为可选

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 所有属性变为可选
type PartialUser = Partial<User>;
// 等价于:
// { id?: number; name?: string; email?: string; }
```

### Required<T> - 将所有属性变为必需

```typescript
type RequiredUser = Required<PartialUser>;
// 恢复所有必需属性
```

### Pick<T, K> - 选取部分属性

```typescript
// 只选取 id 和 name
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }
```

### Omit<T, K> - 排除部分属性

```typescript
// 排除 email
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; }
```

### Record<K, V> - 创建键值对类型

```typescript
type UserRole = 'admin' | 'user' | 'guest';

type RolePermissions = Record<UserRole, string[]>;
// {
//   admin: string[];
//   user: string[];
//   guest: string[];
// }
```

### Exclude<T, U> - 排除联合类型

```typescript
type Status = 'pending' | 'success' | 'error';

// 排除 error
type NonErrorStatus = Exclude<Status, 'error'>;
// 'pending' | 'success'
```

### Extract<T, U> - 提取联合类型

```typescript
type Status = 'pending' | 'success' | 'error' | 'loading';

// 只提取成功状态
type SuccessStatus = Extract<Status, 'success' | 'error'>;
// 'success' | 'error'
```

### NonNullable<T> - 移除 null 和 undefined

```typescript
type MaybeUser = User | null | undefined;

type DefiniteUser = NonNullable<MaybeUser>;
// User
```

## 实际应用

### 1. 更新表单（Partial）

```typescript
function updateUser(id: number, updates: Partial<User>) {
  // 只更新提供的字段
}
```

### 2. 创建只读版本（Readonly）

```typescript
type ImmutableUser = Readonly<User>;
```

### 3. 函数参数类型（Parameters）

```typescript
function createUser(name: string, email: string, age: number) {
  return { name, email, age };
}

type CreateUserArgs = Parameters<typeof createUser>;
// [name: string, email: string, age: number]
```

## 最佳实践

1. 用 `Partial` 处理更新函数
2. 用 `Omit` 排除不需要的字段
3. 用 `Pick` 选择需要的字段
4. 用 `Record` 创建映射类型
