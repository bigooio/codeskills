---
name: python-fastapi-crud
description: FastAPI 快速构建 CRUD RESTful API。适用于快速创建 Python Web API、处理请求验证、自动生成文档等场景。
compatibility: 需要 Python 3.7+，建议使用 uv 或 pip 安装依赖
---

# FastAPI 快速 CRUD 教程

FastAPI 是一个现代、快速的 Python Web 框架。

## 基础设置

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="My API", version="1.0.0")

# Pydantic 模型定义请求体
class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    in_stock: bool = True

# 模拟数据库
items_db = {}
```

## CRUD 操作

### 创建 (Create)

```python
@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    if item.name in items_db:
        raise HTTPException(status_code=400, detail="Item already exists")

    items_db[item.name] = item
    return item
```

### 读取 (Read)

```python
# 获取单个
@app.get("/items/{item_name}", response_model=Item)
async def get_item(item_name: str):
    if item_name not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_name]

# 获取全部
@app.get("/items/", response_model=list[Item])
async def list_items():
    return list(items_db.values())
```

### 更新 (Update)

```python
@app.put("/items/{item_name}", response_model=Item)
async def update_item(item_name: str, item: Item):
    if item_name not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")

    items_db[item_name] = item
    return item
```

### 删除 (Delete)

```python
@app.delete("/items/{item_name}")
async def delete_item(item_name: str):
    if item_name not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")

    del items_db[item_name]
    return {"message": "Item deleted"}
```

## 查询参数

```python
@app.get("/search/")
async def search_items(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None
):
    results = list(items_db.values())
    if category:
        results = [r for r in results if r.category == category]
    return results[skip : skip + limit]
```

## 运行服务

```bash
# 安装依赖
pip install fastapi uvicorn

# 启动服务
uvicorn main:app --reload

# 访问文档
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

## 最佳实践

1. 使用 Pydantic 模型验证请求
2. 用 `response_model` 指定返回类型
3. 使用 `Optional` 处理可选参数
4. 善用 HTTPException 处理错误
5. 路由路径用名词复数形式 `/items/`
