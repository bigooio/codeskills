---
name: Vue
slug: vue
version: 1.0.1
description: Build Vue 3 applications with Composition API, proper reactivity patterns, and production-ready components.
metadata:
  clawdbot:
    emoji: 💚
    requires:
      bins:
        - node
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - react
  - vue
  - ai
  - api
  - frontend
---

## 何时使用

用户 needs Vue expertise — from Composition api patterns to 生产环境 optimization. Agent handles reactivity, 组件 design, 状态 management, and performance.

## 快速参考

| Topic | 文件 |
|-------|------|
| Reactivity patterns | `reactivity.md` |
| 组件 patterns | `components.md` |
| Composables design | `composables.md` |
| Performance optimization | `performance.md` |

## Composition api Philosophy

- Composition api is not about replacing OPTIONS api—它's about better code organization
- 用户组 code by feature, not by option 类型—相关 logic stays together
- 提取 reusable logic into composables—the 主分支 win of Composition api
- `<脚本 设置>` is the recommended 语法—cleaner and better performance

## Reactivity Traps

- `ref` for primitives—access with `.value` in 脚本, auto-unwrapped in 模板
- `reactive` can't reassign whole 对象—`状态 = {...}` breaks reactivity
- Destructuring `reactive` loses reactivity—use `toRefs(状态)` to preserve
- 数组 index assignment reactive in Vue 3—`arr[0] = x` works, unlike Vue 2
- Nested refs unwrap inside reactive—`reactive({count: ref(0)}).count` is number, not ref

## Watch vs Computed

- `computed` for derived 状态—cached, recalculates only when 依赖 change
- `watch` for side effects—when you need to DO something in 响应 to changes
- `computed` 应该 be pure—no side effects, no 异步
- `watchEffect` for immediate reaction with auto-tracked 依赖

## Watch Traps

- Watching reactive 对象 needs `deep: true`—or watch a getter 函数
- `watch` is 懒惰 by default—use `immediate: true` for initial 运行
- Watch 回调 receives old/new—`watch(source, (newVal, oldVal) => {})`
- `watchEffect` can't access old value—use `watch` if you need old/new comparison
- 停止 watchers with returned 函数—`const 停止 = watch(...); 停止()`

## 属性 and Emits Traps

- `defineProps` for 类型-safe 属性—`defineProps<{ msg: 字符串 }>()`
- 属性 are 只读—don't mutate, emit 事件 to parent
- `defineEmits` for 类型-safe events—`defineEmits<{ (e: '更新', val: 字符串): void }>()`
- `v-model` is `:modelValue` + `@更新:modelValue`—custom v-model with `defineModel()`
- Default value for objects must be 工厂 函数—`default: () => ({})`

## 模板 Ref Traps

- `ref="name"` + `const name = ref(null)`—names must 匹配 exactly
- 模板 refs available after mount—access in `onMounted`, not during 设置
- `ref` on 组件 gives 组件 instance—`ref` on element gives DOM element
- 模板 ref with `v-for` becomes 数组 of refs

## Lifecycle Traps

- `onMounted` for DOM access—组件 mounted to DOM
- `onUnmounted` for cleanup—subscriptions, timers, 事件 listeners
- `onBeforeMount` runs before DOM insert—rarely needed but exists
- Hooks must be called synchronously in 设置—not inside callbacks or conditionals
- 异步 设置 needs `<Suspense>` 包装器

## Provide/Inject Traps

- `provide('key', value)` in parent—`inject('key')` in any descendant
- Reactive if value is ref/reactive—otherwise 静态 快照
- Default value: `inject('key', defaultVal)`—third param for 工厂 函数
- Symbol keys for 类型 safety—avoid 字符串 key collisions

## Vue 路由 Traps

- `useRoute` for current 路由—reactive, use in 设置
- `useRouter` for 导航—`路由.推送('/路径')`
- 导航 guards: `beforeEach`, `beforeResolve`, `afterEach`—return `false` to cancel
- `<RouterView>` with named views—multiple views per 路由

## Common Mistakes

- `v-if` vs `v-show`—v-if removes from DOM, v-show toggles display
- Key on `v-for` 必需—`v-for="item in items" :key="item.id"`
- 事件 modifiers order matters—`.prevent.停止` vs `.停止.prevent`
- Teleport for modals—`<Teleport to="请求体">` renders outside 组件 tree
