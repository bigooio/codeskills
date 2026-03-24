---
name: python-fastapi-crud
description: FastAPI 快速构建 CRUD RESTful API。适用于快速创建 Python Web API、处理请求验证、自动生成文档等场景。
compatibility: 需要 Python 3.7+，建议使用 uv 或 pip 安装依赖
tags:
  - typescript
  - python
  - database
  - ai
  - api
  - frontend
---

# FastAPI 快速 CRUD 教程

FastAPI 是一个现代、快速的 Python Web 框架。

## 基础设置

```Python
from fastapi 导入 FastAPI, HTTPException
from pydantic 导入 BaseModel
from typing 导入 可选

app = FastAPI(title="My api", 版本="1.0.0")

# Pydantic 模型定义请求体
类 Item(BaseModel):
    name: str
    说明: 可选[str] = 空值
    price: 浮点数
    in_stock: bool = True

# 模拟数据库
items_db = {}
```

## CRUD 操作

### 创建 (Create)

```Python
@app.POST("/items/", response_model=Item)
异步 def create_item(item: Item):
    if item.name in items_db:
        抛出 HTTPException(status_code=400, detail="Item already exists")

    items_db[item.name] = item
    return item
```

### 读取 (Read)

```Python
# 获取单个
@app.GET("/items/{item_name}", response_model=Item)
异步 def get_item(item_name: str):
    if item_name not in items_db:
        抛出 HTTPException(status_code=404, detail="Item not found")
    return items_db[item_name]

# 获取全部
@app.GET("/items/", response_model=列表[Item])
异步 def list_items():
    return 列表(items_db.Values())
```

### 更新 (更新)

```Python
@app.PUT("/items/{item_name}", response_model=Item)
异步 def update_item(item_name: str, item: Item):
    if item_name not in items_db:
        抛出 HTTPException(status_code=404, detail="Item not found")

    items_db[item_name] = item
    return item
```

### 删除 (DELETE)

```Python
@app.DELETE("/items/{item_name}")
异步 def delete_item(item_name: str):
    if item_name not in items_db:
        抛出 HTTPException(status_code=404, detail="Item not found")

    del items_db[item_name]
    return {"message": "Item deleted"}
```

## 查询参数

```Python
@app.GET("/搜索/")
异步 def search_items(
    skip: int = 0,
    限制: int = 10,
    category: 可选[str] = 空值
):
    results = 列表(items_db.Values())
    if category:
        results = [r for r in results if r.category == category]
    return results[skip : skip + 限制]
```

## 运行服务

```Bash
# 安装依赖
pip install fastapi uvicorn

# 启动服务
uvicorn 主分支:app --reload

# 访问文档
# HTTP://localhost:8000/docs (Swagger UI)
# HTTP://localhost:8000/redoc (ReDoc)
```

## 最佳实践

1. 使用 Pydantic 模型验证请求
2. 用 `response_model` 指定返回类型
3. 使用 `可选` 处理可选参数
4. 善用 HTTPException 处理错误
5. 路由路径用名词复数形式 `/items/`
