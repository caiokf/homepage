---
title: "RAG lessons learned"
date: 2024-08-05
tags: [ai, rag, architecture]
slug: rag-lessons-learned
---

Wrapped up a RAG implementation at work. The naive approach (chunk → embed → retrieve top-k → prompt) works for demos but falls apart in production.

What actually moved the needle:

**Semantic chunking** - Splitting on paragraph boundaries instead of fixed sizes. Preserving headers as metadata. Huge improvement in retrieval relevance.

**Hybrid search** - Combining vector similarity with keyword search (Elasticsearch). Some queries need semantic understanding, others need exact matches. Run both and rerank.

**Query expansion** - Using the LLM to reformulate queries before retrieval. Generate variations, extract key entities, sometimes create hypothetical answers for embedding (HyDE).

**Metadata filtering** - Filter by date, source, access level *before* semantic search. Reduces noise significantly.

Biggest lesson: evaluation is everything. Built a test set of queries with expected sources early. Without it, impossible to know if changes actually help.
