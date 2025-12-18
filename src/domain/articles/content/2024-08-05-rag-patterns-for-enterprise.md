---
title: RAG Patterns for Enterprise Applications
date: 2024-08-05
tags: [ai, rag, architecture, search]
slug: rag-patterns-for-enterprise
authors: claude code
---

Retrieval-Augmented Generation (RAG) has become the go-to pattern for grounding LLM responses in factual, domain-specific data. After implementing RAG systems across several enterprise projects, I've identified patterns that consistently improve results.

## Beyond Basic RAG

The naive approach—chunk documents, embed them, retrieve top-k, and stuff them into a prompt—works for demos but falls apart in production. Enterprise RAG requires more sophisticated strategies.

## Chunking Strategies

How you split documents dramatically affects retrieval quality:

### Semantic Chunking

Instead of fixed-size chunks, split on semantic boundaries:

```typescript
type ChunkingStrategy =
  | { type: "fixed"; size: number; overlap: number }
  | { type: "semantic"; model: string }
  | { type: "hierarchical"; levels: string[] };

function semanticChunk(document: string): Chunk[] {
  // Split on paragraph boundaries
  // Further split if sections exceed max tokens
  // Preserve headers as metadata
}
```

### Hierarchical Indexing

Index at multiple granularities—document summaries for broad queries, detailed chunks for specific questions:

```
Document Summary (high-level)
  └── Section Summaries
        └── Detailed Chunks
```

## Retrieval Enhancements

### Hybrid Search

Combine semantic and keyword search for better coverage:

```typescript
async function hybridSearch(query: string): Promise<SearchResult[]> {
  const [semantic, keyword] = await Promise.all([
    vectorStore.search(embed(query), { limit: 10 }),
    elasticSearch.search(query, { limit: 10 }),
  ]);

  return rerank(mergeResults(semantic, keyword), query);
}
```

### Query Expansion

Use the LLM to reformulate queries before retrieval:

- Generate multiple query variations
- Extract key entities and concepts
- Create hypothetical answer embeddings (HyDE)

## Production Lessons

1. **Evaluation is critical**: Build a test set of queries with expected sources
2. **Metadata matters**: Filter by date, source, access level before semantic search
3. **Caching saves money**: Cache embeddings and common query results
4. **Freshness vs. relevance**: Recent documents aren't always most relevant

## When RAG Isn't Enough

Sometimes you need:

- **Fine-tuning**: When the task requires specific output formats
- **Knowledge graphs**: When relationships between entities matter
- **Structured queries**: When precision trumps natural language flexibility

RAG is a powerful pattern, but it's not magic. Success requires careful attention to each component of the pipeline.
