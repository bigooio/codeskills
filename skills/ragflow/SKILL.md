---
name: ragflow
description: Universal Ragflow API client for RAG operations. Create datasets, upload documents, run chat queries against knowledge bases. Self-hosted RAG platform integration.
version: 1.0.2
author: Ania
env:
  RAGFLOW_URL:
    description: Ragflow instance URL (e.g., https://rag.example.com)
    required: true
  RAGFLOW_API_KEY:
    description: Ragflow API key (use least-privilege key, can manage datasets/upload files)
    required: true
metadata:
  clawdbot:
    emoji: 📚
    requires:
      bins:
        - node
tags:
  - javascript
  - typescript
  - ai
  - api
  - frontend
  - backend
---

# Ragflow api 客户端

Universal 客户端 for Ragflow — self-hosted RAG (Retrieval-Augmented Generation) platform.

## 特性

- **Dataset management** — Create, 列表, DELETE knowledge bases
- **Document 上传** — 上传 files or text content
- **Chat queries** — 运行 RAG queries against datasets
- **块 management** — 触发器 parsing, 列表 chunks

## 使用方法

```Bash
# 列表 datasets
节点 {baseDir}/scripts/ragflow.js datasets

# Create dataset
节点 {baseDir}/scripts/ragflow.js create-dataset --name "My Knowledge BASE"

# 上传 document
节点 {baseDir}/scripts/ragflow.js 上传 --dataset DATASET_ID --文件 article.md

# Chat query
节点 {baseDir}/scripts/ragflow.js chat --dataset DATASET_ID --query "What is stroke?"

# 列表 documents in dataset
节点 {baseDir}/scripts/ragflow.js documents --dataset DATASET_ID
```

## 配置

集合 环境变量 in your `.env`:

```Bash
RAGFLOW_URL=HTTPS://your-ragflow-instance.com
RAGFLOW_API_KEY=your-api-key
```

## api

This skill wraps Ragflow's REST api:

- `GET /api/v1/datasets` — 列表 datasets
- `POST /api/v1/datasets` — Create dataset
- `DELETE /api/v1/datasets/{id}` — DELETE dataset
- `POST /api/v1/datasets/{id}/documents` — 上传 document
- `POST /api/v1/datasets/{id}/chunks` — 触发器 parsing
- `POST /api/v1/datasets/{id}/retrieval` — RAG query

Full api docs: HTTPS://ragflow.io/docs

## 示例

```JavaScript
// Programmatic 使用方法
const ragflow = require('{baseDir}/lib/api.js');

// 上传 and 解析
等待 ragflow.uploadDocument(datasetId, './article.md', { filename: 'article.md' });
等待 ragflow.triggerParsing(datasetId, [documentId]);

// Query
const answer = 等待 ragflow.chat(datasetId, 'What are the stroke guidelines?');
```