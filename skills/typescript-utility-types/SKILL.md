---
name: typescript-utility-types
description: TypeScript 内置工具类型详解。适用于需要转换类型、创建变体类型、选取/排除属性等场景。包含 Partial、Required、Pick、Omit、Record 等常用类型。
tags:
  - typescript
  - ai
  - frontend
  - 工具
---

# TypeScript 内置工具类型

TypeScript 提供了一系列内置工具类型，能帮我们快速转换类型。

## 常用工具类型

### 偏函数<T> - 将所有属性变为可选

```TypeScript
接口 用户 {
  id: number;
  name: 字符串;
  email: 字符串;
}

// 所有属性变为可选
类型 PartialUser = 偏函数<用户>;
// 等价于:
// { id?: number; name?: 字符串; email?: 字符串; }
```

### 必需<T> - 将所有属性变为必需

```TypeScript
类型 RequiredUser = 必需<PartialUser>;
// 恢复所有必需属性
```

### 选取<T, K> - 选取部分属性

```TypeScript
// 只选取 id 和 name
类型 UserPreview = 选取<用户, 'id' | 'name'>;
// { id: number; name: 字符串; }
```

### 省略<T, K> - 排除部分属性

```TypeScript
// 排除 email
类型 UserWithoutEmail = 省略<用户, 'email'>;
// { id: number; name: 字符串; }
```

### 记录<K, V> - 创建键值对类型

```TypeScript
类型 UserRole = '管理员' | '用户' | 'guest';

类型 RolePermissions = 记录<UserRole, 字符串[]>;
// {
//   管理员: 字符串[];
//   用户: 字符串[];
//   guest: 字符串[];
// }
```

### Exclude<T, U> - 排除联合类型

```TypeScript
类型 状态 = 'pending' | 'success' | '错误';

// 排除 错误
类型 NonErrorStatus = Exclude<状态, '错误'>;
// 'pending' | 'success'
```

### 提取<T, U> - 提取联合类型

```TypeScript
类型 状态 = 'pending' | 'success' | '错误' | 'loading';

// 只提取成功状态
类型 SuccessStatus = 提取<状态, 'success' | '错误'>;
// 'success' | '错误'
```

### NonNullable<T> - 移除 null 和 undefined

```TypeScript
类型 MaybeUser = 用户 | null | undefined;

类型 DefiniteUser = NonNullable<MaybeUser>;
// 用户
```

## 实际应用

### 1. 更新表单（偏函数）

```TypeScript
函数 updateUser(id: number, updates: 偏函数<用户>) {
  // 只更新提供的字段
}
```

### 2. 创建只读版本（只读）

```TypeScript
类型 ImmutableUser = 只读<用户>;
```

### 3. 函数参数类型（参数）

```TypeScript
函数 createUser(name: 字符串, email: 字符串, age: number) {
  return { name, email, age };
}

类型 CreateUserArgs = 参数<typeof createUser>;
// [name: 字符串, email: 字符串, age: number]
```

## 最佳实践

1. 用 `偏函数` 处理更新函数
2. 用 `省略` 排除不需要的字段
3. 用 `选取` 选择需要的字段
4. 用 `记录` 创建映射类型
