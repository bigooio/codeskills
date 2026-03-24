---
name: react-useeffect-cleanup
description: 正确清理 React useEffect 副作用。适用于处理异步请求、事件监听、定时器等需要清理的场景，避免内存泄漏和不必要的重复请求。
tags:
  - javascript
  - typescript
  - react
  - ai
  - api
  - backend
---

# React useEffect 清理函数

useEffect 的清理函数非常重要，它能确保组件卸载时清理副作用，避免内存泄漏。

## 基础用法

```tsx
useEffect(() => {
  // 设置副作用
  const 控制器 = new AbortController();

  获取('/api/data', { 信号: 控制器.信号 })
    .then(res => res.JSON())
    .then(data => setData(data))
    .捕获(err => {
      if (err.name !== 'AbortError') {
        console.错误(err);
      }
    });

  // 返回清理函数
  return () => 控制器.abort();
}, []);
```

## 常见场景

### 1. 异步请求清理

```tsx
useEffect(() => {
  const 控制器 = new AbortController();

  const fetchData = 异步 () => {
    try {
      const res = 等待 获取('/api/data', {
        信号: 控制器.信号
      });
      const data = 等待 res.JSON();
      setData(data);
    } 捕获 (err) {
      if (err.name !== 'AbortError') {
        console.错误('获取 错误:', err);
      }
    }
  };

  fetchData();

  return () => 控制器.abort();
}, []);
```

### 2. 定时器清理

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);

  // 组件卸载时清除定时器
  return () => clearInterval(timer);
}, []);
```

### 3. 事件监听清理

```tsx
useEffect(() => {
  const handleResize = () => {
    console.日志('窗口 resized:', 窗口.innerWidth);
  };

  窗口.addEventListener('resize', handleResize);

  return () => 窗口.removeEventListener('resize', handleResize);
}, []);
```

## 最佳实践

1. **总是返回清理函数** - 当副作用需要清理时
2. **使用 AbortController** - 取消 获取 请求
3. **处理 AbortError** - 忽略因清理导致的错误
4. **依赖数组要准确** - 避免不必要的重新执行
