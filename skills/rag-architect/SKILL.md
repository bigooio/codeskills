---
name: rag-architect
description: RAG Architect - POWERFUL
tags:
  - typescript
  - database
  - ai
  - security
  - testing
  - api
---

# RAG Architect - POWERFUL

## 概述

The RAG (Retrieval-Augmented Generation) Architect skill provides comprehensive tools and knowledge for designing, implementing, and optimizing 生产环境-grade RAG pipelines. This skill covers the entire RAG ecosystem from document chunking strategies to evaluation frameworks, enabling you to 构建 scalable, efficient, and accurate retrieval systems.

## Core Competencies

### 1. Document Processing & Chunking Strategies

#### Fixed-Size Chunking
- **Character-based chunking**: Simple splitting by character count (e.g., 512, 1024, 2048 chars)
- **令牌-based chunking**: Splitting by 令牌 count to respect model limits
- **Overlap strategies**: 10-20% overlap to maintain 上下文 continuity
- **Pros**: Predictable 块 sizes, simple implementation, consistent processing time
- **Cons**: May break semantic units, 上下文 boundaries ignored
- **Best for**: Uniform documents, when consistent 块 sizes are critical

#### Sentence-Based Chunking
- **Sentence boundary detection**: Using NLTK, spaCy, or 正则表达式 patterns
- **Sentence grouping**: Combining sentences until size threshold is reached
- **Paragraph preservation**: Avoiding mid-paragraph splits when possible
- **Pros**: Preserves natural language boundaries, better readability
- **Cons**: 变量 块 sizes, potential for very short/long chunks
- **Best for**: Narrative text, articles, books

#### Paragraph-Based Chunking
- **Paragraph detection**: Double newlines, HTML tags, markdown formatting
- **Hierarchical splitting**: Respecting document structure (sections, subsections)
- **Size balancing**: 合并中 small paragraphs, splitting large ones
- **Pros**: Preserves logical document structure, maintains topic coherence
- **Cons**: Highly 变量 sizes, may create very large chunks
- **Best for**: Structured documents, technical documentation

#### Semantic Chunking
- **Topic modeling**: Using TF-IDF, embeddings similarity for topic detection
- **Heading-aware splitting**: Respecting document hierarchy (H1, H2, H3)
- **Content-based boundaries**: Detecting topic shifts using semantic similarity
- **Pros**: Maintains semantic coherence, respects document structure
- **Cons**: Complex implementation, computationally expensive
- **Best for**: Long-form content, technical manuals, research papers

#### Recursive Chunking
- **Hierarchical approach**: Try larger chunks first, recursively split if needed
- **Multi-level splitting**: Different strategies at different levels
- **Size optimization**: Minimize number of chunks while respecting size limits
- **Pros**: Optimal 块 utilization, preserves 上下文 when possible
- **Cons**: Complex logic, potential performance overhead
- **Best for**: Mixed content types, when 块 count optimization is important

#### Document-Aware Chunking
- **文件 类型 detection**: PDF pages, Word sections, HTML elements
- **Metadata preservation**: Headers, footers, page numbers, sections
- **Table and 镜像 handling**: Special processing for non-text elements
- **Pros**: Preserves document structure and metadata
- **Cons**: Format-specific implementation 必需
- **Best for**: Multi-format document collections, when metadata is important

### 2. Embedding Model Selection

#### Dimension Considerations
- **128-256 dimensions**: Fast retrieval, lower 内存 使用方法, suitable for simple domains
- **512-768 dimensions**: Balanced performance, good for most applications
- **1024-1536 dimensions**: High quality, better for complex domains, higher cost
- **2048+ dimensions**: Maximum quality, specialized use cases, significant resources

#### Speed vs Quality Tradeoffs
- **Fast models**: sentence-transformers/all-MiniLM-L6-v2 (384 dim, ~14k tokens/sec)
- **Balanced models**: sentence-transformers/all-mpnet-BASE-v2 (768 dim, ~2.8k tokens/sec)
- **Quality models**: text-embedding-ada-002 (1536 dim, OpenAI api)
- **Specialized models**: 域名-specific fine-tuned models

#### Model Categories
- **General purpose**: all-MiniLM, all-mpnet, Universal Sentence Encoder
- **Code embeddings**: CodeBERT, GraphCodeBERT, CodeT5
- **Scientific text**: SciBERT, BioBERT, ClinicalBERT
- **Multilingual**: LaBSE, multilingual-e5, paraphrase-multilingual

### 3. Vector 数据库 Selection

#### Pinecone
- **Managed 服务**: Fully hosted, auto-scaling
- **特性**: Metadata filtering, hybrid 搜索, 实时 updates
- **Pricing**: $70/month for 1M vectors (1536 dim), pay-per-use scaling
- **Best for**: 生产环境 applications, when managed 服务 is preferred
- **Cons**: Vendor 锁-in, costs can scale quickly

#### Weaviate
- **Open source**: Self-hosted or cloud OPTIONS available
- **特性**: GraphQL api, multi-modal 搜索, automatic vectorization
- **Scaling**: Horizontal scaling, HNSW indexing
- **Best for**: Complex data types, when GraphQL api is preferred
- **Cons**: Learning curve, requires 基础设施 management

#### Qdrant
- **Rust-based**: High performance, low 内存 footprint
- **特性**: Payload filtering, clustering, distributed 部署
- **api**: REST and gRPC interfaces
- **Best for**: High-performance 要求, resource-constrained environments
- **Cons**: Smaller community, fewer integrations

#### Chroma
- **Embedded 数据库**: SQLite-based, easy 本地 开发环境
- **特性**: Collections, metadata filtering, persistence
- **Scaling**: Limited, suitable for prototyping and small deployments
- **Best for**: 开发环境, testing, small-scale applications
- **Cons**: Not suitable for 生产环境 scale

#### pgvector (PostgreSQL)
- **SQL integration**: Leverage existing PostgreSQL 基础设施
- **特性**: ACID compliance, joins with relational data, mature ecosystem
- **Performance**: ivfflat and HNSW indexing, parallel query processing
- **Best for**: When you already use PostgreSQL, need ACID compliance
- **Cons**: Requires PostgreSQL expertise, less specialized than purpose-built DBs

### 4. Retrieval Strategies

#### Dense Retrieval
- **Semantic similarity**: Using embedding cosine similarity
- **Advantages**: Captures semantic meaning, handles paraphrasing well
- **限制**: May miss exact keyword matches, requires good embeddings
- **Implementation**: Vector similarity 搜索 with k-NN or ANN algorithms

#### Sparse Retrieval
- **Keyword-based**: TF-IDF, BM25, Elasticsearch
- **Advantages**: Exact keyword matching, interpretable results
- **限制**: Misses semantic similarity, vulnerable to vocabulary mismatch
- **Implementation**: Inverted indexes, term frequency analysis

#### Hybrid Retrieval
- **Combination approach**: Dense + sparse retrieval with score fusion
- **Fusion strategies**: Reciprocal Rank Fusion (RRF), weighted combination
- **Benefits**: Combines semantic understanding with exact matching
- **Complexity**: Requires tuning fusion weights, more complex 基础设施

#### Reranking
- **Two-stage approach**: Initial retrieval followed by reranking
- **Reranking models**: Cross-encoders, specialized reranking transformers
- **Benefits**: Higher precision, can use more sophisticated models for final ranking
- **Tradeoff**: Additional 延迟, computational cost

### 5. Query Transformation Techniques

#### HyDE (Hypothetical Document Embeddings)
- **Approach**: Generate hypothetical answer, embed answer instead of query
- **Benefits**: Improves retrieval by matching document style rather than query style
- **Implementation**: Use LLM to generate hypothetical document, embed that
- **Use cases**: When queries and documents have different styles

#### Multi-Query Generation
- **Approach**: Generate multiple query variations, retrieve for each, 合并 results
- **Benefits**: Increases recall, handles query ambiguity
- **Implementation**: LLM generates 3-5 query variations, deduplicate results
- **Considerations**: Higher cost and 延迟 due to multiple retrievals

#### 步骤-Back Prompting
- **Approach**: Generate broader, more general 版本 of specific query
- **Benefits**: Retrieves more general 上下文 that helps answer specific questions
- **Implementation**: Transform "What is the capital of France?" to "What are European capitals?"
- **Use cases**: When specific questions need general 上下文

### 6. 上下文 窗口 Optimization

#### 动态 上下文 Assembly
- **Relevance-based ordering**: Most relevant chunks first
- **Diversity optimization**: Avoid redundant information
- **令牌 budget management**: Fit within model 上下文 limits
- **Hierarchical inclusion**: Include summaries before detailed chunks

#### 上下文 压缩
- **Summarization**: 压缩 less relevant chunks while preserving key information
- **Key information extraction**: 提取 only relevant facts/entities
- **模板-based 压缩**: Use structured formats to reduce 令牌 使用方法
- **Selective inclusion**: Include only chunks above relevance threshold

### 7. Evaluation Frameworks

#### Faithfulness Metrics
- **Definition**: How well generated answers are grounded in retrieved 上下文
- **Measurement**: Fact verification against source documents
- **Implementation**: NLI models to check entailment between answer and 上下文
- **Threshold**: >90% for 生产环境 systems

#### Relevance Metrics
- **上下文 relevance**: How relevant retrieved chunks are to the query
- **Answer relevance**: How well the answer addresses the original question
- **Measurement**: Embedding similarity, human evaluation, LLM-as-judge
- **Targets**: 上下文 relevance >0.8, Answer relevance >0.85

#### 上下文 Precision & Recall
- **Precision@K**: Percentage of 进程-K results that are relevant
- **Recall@K**: Percentage of relevant documents found in 进程-K results
- **Mean Reciprocal Rank (MRR)**: Average of reciprocal ranks of first relevant result
- **NDCG@K**: Normalized Discounted Cumulative Gain at K

#### End-to-End Metrics
- **RAGAS**: Comprehensive RAG evaluation 框架
- **Correctness**: Factual accuracy of generated answers
- **Completeness**: 覆盖率 of all relevant aspects
- **Consistency**: Consistency across multiple runs with same query

### 8. 生产环境 Patterns

#### Caching Strategies
- **Query-level caching**: 缓存 results for identical queries
- **Semantic caching**: 缓存 for semantically similar queries
- **块-level caching**: 缓存 embedding computations
- **Multi-level caching**: Redis for hot queries, disk for warm queries

#### Streaming Retrieval
- **Progressive loading**: 流 results as they become available
- **Incremental generation**: Generate answers while still retrieving
- **实时 updates**: 句柄 document updates without full reprocessing
- **连接 management**: 句柄 客户端 disconnections gracefully

#### Fallback Mechanisms
- **Graceful degradation**: Fallback to simpler retrieval if primary fails
- **缓存 fallbacks**: Serve stale results when retrieval is unavailable
- **Alternative sources**: Multiple vector databases for redundancy
- **错误 handling**: Comprehensive 错误 recovery and 用户 communication

### 9. Cost Optimization

#### Embedding Cost Management
- **批处理**: 批量 documents for embedding to reduce api costs
- **Caching strategies**: 缓存 embeddings to avoid recomputation
- **Model selection**: Balance cost vs quality for embedding models
- **更新 optimization**: Only re-embed changed documents

#### Vector 数据库 Optimization
- **Index optimization**: Choose appropriate index types for use case
- **压缩**: Use quantization to reduce 存储 costs
- **Tiered 存储**: Hot/warm/cold data strategies
- **Resource scaling**: Auto-scaling based on query patterns

#### Query Optimization
- **Query 路由**: 路由 simple queries to cheaper methods
- **Result caching**: Avoid repeated expensive retrievals
- **批量 querying**: 进程 multiple queries together when possible
- **Smart filtering**: Use metadata filters to reduce 搜索 space

### 10. Guardrails & Safety

#### Content Filtering
- **Toxicity detection**: 过滤 harmful or inappropriate content
- **PII detection**: Identify and 句柄 personally identifiable information
- **Content validation**: Ensure retrieved content meets quality standards
- **Source verification**: 验证 document authenticity and reliability

#### Query Safety
- **Injection prevention**: Prevent malicious query injection attacks
- **Rate limiting**: Prevent abuse and ensure fair 使用方法
- **Query validation**: 净化 and 验证 用户 inputs
- **Access controls**: Ensure users can only access authorized content

#### 响应 Safety
- **Hallucination detection**: Identify when model generates unsupported claims
- **Confidence scoring**: Provide confidence levels for generated responses
- **Source attribution**: Always provide sources for factual claims
- **Uncertainty handling**: Gracefully 句柄 cases where answer is uncertain

## Implementation 最佳实践

### 开发环境 工作流
1. **要求 gathering**: Understand use case, scale, and quality 要求
2. **Data analysis**: Analyze document corpus characteristics
3. **原型 开发环境**: 构建 minimal viable RAG 管道
4. **Chunking optimization**: 测试 different chunking strategies
5. **Retrieval tuning**: Optimize retrieval 参数 and thresholds
6. **Evaluation 设置**: Implement comprehensive evaluation metrics
7. **生产环境 部署**: Scale-ready implementation with monitoring

### Monitoring & Observability
- **Query 分析**: Track query patterns and performance
- **Retrieval metrics**: 监视器 precision, recall, and 延迟
- **Generation quality**: Track faithfulness and relevance scores
- **System health**: 监视器 数据库 performance and availability
- **Cost tracking**: 监视器 embedding and vector 数据库 costs

### Maintenance & Updates
- **Document refresh**: 句柄 new documents and updates
- **Index maintenance**: Regular vector 数据库 optimization
- **Model updates**: Evaluate and migrate to improved models
- **Performance tuning**: Continuous optimization based on 使用方法 patterns
- **安全 updates**: Regular 安全 assessments and updates

## Common Pitfalls & Solutions

### Poor Chunking 策略
- **Problem**: Chunks break mid-sentence or lose 上下文
- **Solution**: Use boundary-aware chunking with overlap

### Low Retrieval Precision
- **Problem**: Retrieved chunks are not relevant to query
- **Solution**: Improve embedding model, add reranking, tune similarity threshold

### High 延迟
- **Problem**: Slow retrieval and generation
- **Solution**: Optimize vector indexing, implement caching, use faster embedding models

### Inconsistent Quality
- **Problem**: 变量 answer quality across different queries
- **Solution**: Implement comprehensive evaluation, add quality scoring, improve fallbacks

### Scalability Issues
- **Problem**: System doesn't scale with increased 加载
- **Solution**: Implement proper caching, 数据库 sharding, and auto-scaling

## Conclusion

Building effective RAG systems requires careful consideration of each 组件 in the 管道. The key to success is understanding the tradeoffs between different approaches and choosing the right combination of techniques for your specific use case. Start with simple approaches and gradually add sophistication based on evaluation results and 生产环境 要求.

This skill provides the foundation for making informed decisions throughout the RAG 开发环境 lifecycle, from initial design to 生产环境 部署 and ongoing maintenance.