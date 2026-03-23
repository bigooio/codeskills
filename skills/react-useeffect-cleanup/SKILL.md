---
name: react-useeffect-cleanup
description: 正确清理 React useEffect 副作用。适用于处理异步请求、事件监听、定时器等需要清理的场景，避免内存泄漏和不必要的重复请求。
---

# React useEffect 清理函数

useEffect 的清理函数非常重要，它能确保组件卸载时清理副作用，避免内存泄漏。

## 基础用法

```tsx
useEffect(() => {
  // 设置副作用
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

  // 返回清理函数
  return () => controller.abort();
}, []);
```

## 常见场景

### 1. 异步请求清理

```tsx
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data', {
        signal: controller.signal
      });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Fetch error:', err);
      }
    }
  };

  fetchData();

  return () => controller.abort();
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
    console.log('Window resized:', window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## 最佳实践

1. **总是返回清理函数** - 当副作用需要清理时
2. **使用 AbortController** - 取消 fetch 请求
3. **处理 AbortError** - 忽略因清理导致的错误
4. **依赖数组要准确** - 避免不必要的重新执行
