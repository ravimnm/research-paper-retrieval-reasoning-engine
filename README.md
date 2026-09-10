# Research Retrieval & Reasoning Engine

An AI engineering project that combines semantic retrieval, hybrid search, reranking, Retrieval-Augmented Generation (RAG), and external scholarly research discovery into a single research-intelligence pipeline.

The project is implemented as a Google Colab notebook and is designed as the Python AI component that can later be integrated with a Spring Boot backend.

## Overview

Research papers contain large amounts of technical information distributed across abstracts, methodologies, experiments, datasets, algorithms, and conclusions. Basic keyword search often fails to capture relationships expressed using different terminology.

This project builds a retrieval and reasoning pipeline that can:

- Process research papers in PDF format
- Split documents into token-aware chunks
- Generate semantic embeddings
- Perform dense vector retrieval
- Perform lexical BM25 retrieval
- Combine retrieval strategies using Reciprocal Rank Fusion
- Rerank results using a cross-encoder
- Generate grounded answers using Groq
- Discover related research papers from external scholarly sources
- Rank discovered papers using semantic similarity and reranking
- Explain relationships between research papers
- Evaluate retrieval quality using standard information-retrieval metrics

## Architecture

```
                         RESEARCH PAPER
                              │
                              ▼
                       PDF Text Extraction
                              │
                              ▼
                       Token-Aware Chunking
                              │
                              ▼
                         BGE Embeddings
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
               FAISS Search          BM25
                    │                   │
                    └─────────┬─────────┘
                              ▼
                       RRF Hybrid Fusion
                              │
                              ▼
                    Cross-Encoder Reranker
                              │
                              ▼
                         Top-K Evidence
                              │
                              ▼
                            Groq
                              │
                              ▼
                     Grounded RAG Answer
```

The project also provides an external research-discovery pipeline:

```
                     RESEARCH PAPER
                           │
                           ▼
                         Groq
                           │
                    Search Query Generation
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
             OpenAlex               arXiv
                │                     │
                └──────────┬──────────┘
                           ▼
                    Candidate Papers
                           │
                           ▼
                   Deduplication
                           │
                           ▼
                  BGE Semantic Ranking
                           │
                           ▼
                  Cross-Encoder Ranking
                           │
                           ▼
                  Related Research Papers
                           │
                           ▼
                          Groq
                           │
                           ▼
                Relationship Explanation
```

## Core Capabilities

### 1. PDF Research Paper Processing

Research papers are loaded as PDF documents and processed into structured page-level text.

The system preserves:

- Paper/page information
- Chunk identifiers
- Source text
- Page provenance

This allows generated answers to be traced back to the retrieved evidence.

### 2. Token-Aware Chunking

Documents are divided into manageable chunks before embedding.

The project uses token-aware chunking rather than simply splitting documents by characters or pages.

```
PDF
 ↓
Pages
 ↓
Text
 ↓
Tokenization
 ↓
Overlapping Chunks
```

This improves retrieval granularity and allows the system to retrieve specific portions of a research paper.

### 3. Semantic Embeddings

Research text is converted into dense vector representations using a BGE embedding model.

```
Research Text
      ↓
Embedding Model
      ↓
Dense Vector
```

These vectors represent semantic meaning rather than relying only on exact keyword matches.

### 4. Dense Retrieval with FAISS

FAISS is used for efficient vector similarity search.

```
Query
 ↓
Query Embedding
 ↓
FAISS
 ↓
Semantically Relevant Chunks
```

This enables queries such as:

> What architecture was used for blockchain wallet risk prediction?

to retrieve relevant content even when the query wording differs from the original document.

### 5. Lexical Retrieval with BM25

Dense retrieval is combined with BM25 lexical retrieval.

BM25 is useful when exact terminology matters, particularly for:

- Algorithm names
- Dataset names
- Technical terminology
- Acronyms
- Specific identifiers

The project therefore combines semantic and lexical retrieval rather than relying on only one retrieval strategy.

### 6. Hybrid Retrieval with RRF

The results from FAISS and BM25 are combined using Reciprocal Rank Fusion (RRF).

```
              Query
                │
        ┌───────┴───────┐
        ▼               ▼
      FAISS            BM25
        │               │
        └───────┬───────┘
                ▼
             RRF
                │
                ▼
       Unified Candidate Set
```

This provides a more robust retrieval strategy than relying exclusively on dense or lexical search.

### 7. Cross-Encoder Reranking

The initial retrieval stage produces candidate chunks.

A cross-encoder then performs a second-stage relevance evaluation.

```
FAISS + BM25
     ↓
Candidate Chunks
     ↓
Cross-Encoder
     ↓
Reranked Evidence
```

This creates a two-stage retrieval architecture:

```
Fast candidate retrieval
          ↓
Precise relevance ranking
```

### 8. Retrieval-Augmented Generation

The retrieved evidence is passed to Groq for grounded answer generation.

```
User Question
      ↓
Hybrid Retrieval
      ↓
Reranking
      ↓
Relevant Evidence
      ↓
Context Construction
      ↓
Groq
      ↓
Answer
```

The model is instructed to answer using the retrieved research context rather than relying solely on its internal knowledge.

The system also retains source information for the retrieved evidence.

### 9. External Research Discovery

One of the major capabilities of the project is discovering related research outside the uploaded document corpus.

This is different from normal RAG.

Instead of asking:

> "Which chunks in my uploaded PDF collection are similar?"

the system can answer:

> "What existing research is related to this paper?"

**Pipeline**

```
Input Research Paper
        ↓
Groq extracts research concepts
        ↓
Generates scholarly search queries
        ↓
OpenAlex + arXiv
        ↓
External Research Candidates
        ↓
Semantic Similarity
        ↓
Cross-Encoder Reranking
        ↓
Related Research
```

### 10. OpenAlex Integration

OpenAlex is used as an external scholarly research source.

The system searches for research works based on automatically generated research queries and extracts metadata such as:

- Title
- Authors
- Publication year
- Abstract
- DOI
- Landing-page URL

### 11. arXiv Integration

The project also searches arXiv for relevant research papers.

The retrieved information includes:

- Paper title
- Authors
- Publication year
- Abstract
- arXiv URL

This allows the system to return direct links to discovered research.

### 12. External Paper Ranking

External research candidates are ranked using the same retrieval principles used internally.

```
External Candidate Papers
          ↓
BGE Embeddings
          ↓
Semantic Similarity
          ↓
Top Candidates
          ↓
Cross-Encoder
          ↓
Final Ranked Papers
```

This separates:

- Candidate discovery
- Semantic retrieval
- Precise reranking

rather than trusting the search API's ranking alone.

### 13. Research Relationship Analysis

After related papers are discovered and ranked, Groq analyzes the relationship between the source paper and selected related papers.

The analysis considers:

- Shared research problem
- Shared methodology
- Shared algorithms/models
- Shared application domain
- Important differences
- Why the related paper is relevant

The system explicitly instructs the model not to invent unsupported information.

### 14. Retrieval Evaluation

The retrieval pipeline was evaluated using standard information-retrieval metrics:

- Recall@5
- Mean Reciprocal Rank (MRR)
- NDCG@5

Current manually annotated evaluation:

| Metric   | Score  |
|----------|--------|
| Recall@5 | 1.0000 |
| MRR      | 1.0000 |
| NDCG@5   | 1.0000 |

These results were obtained on a small manually annotated evaluation set based on the project research report. They should not be interpreted as general benchmark performance.

The evaluation demonstrates that the relevant annotated evidence was retrieved within the top five results, with the first relevant result appearing at rank 1 for the evaluated queries.

## Technology Stack

**AI / ML**
- Python
- BGE Embedding Model
- Cross-Encoder Reranking
- Groq LLM

**Retrieval**
- FAISS
- BM25
- Reciprocal Rank Fusion
- Cosine / vector similarity

**Document Processing**
- PyMuPDF
- tiktoken

**External Research**
- OpenAlex
- arXiv

**Development**
- Google Colab
- Python notebooks

## End-to-End Workflow

The complete system supports two major workflows.

### Local Research Question Answering

```
Research PDF
    ↓
Text Extraction
    ↓
Token-Aware Chunking
    ↓
Embeddings
    ↓
FAISS ──────┐
            │
BM25 ───────┤
            ▼
           RRF
            ↓
      Cross-Encoder
            ↓
      Relevant Evidence
            ↓
           Groq
            ↓
      Grounded Answer
```

### External Research Discovery

```
Research Paper
      ↓
Research Profile
      ↓
Groq Query Generation
      ↓
OpenAlex + arXiv
      ↓
Candidate Papers
      ↓
Deduplication
      ↓
BGE Similarity
      ↓
Cross-Encoder Reranking
      ↓
Related Papers + Links
      ↓
Groq Relationship Analysis
```

## Example Use Cases

**Ask questions about a research paper**

> What model architecture was used for blockchain wallet risk prediction?

The system retrieves the relevant technical sections and generates a grounded response.

**Discover related research**

> Find research papers related to this work.

The system searches OpenAlex and arXiv and returns ranked papers with available links and metadata.

**Analyze research relationships**

> Why is this paper related to my research?

The system compares the source paper with the discovered paper and explains their shared problem, methodology, domain, and differences.

## Project Structure

The project is intentionally maintained as a single Google Colab notebook to keep the AI engineering workflow reproducible and easy to experiment with.

```
research-retrieval-reasoning-engine/
│
├── Research_Retrieval_Reasoning_Engine.ipynb
└── README.md
```

The notebook contains the complete implementation, including:

```
Environment Setup
        ↓
PDF Processing
        ↓
Chunking
        ↓
Embeddings
        ↓
FAISS
        ↓
BM25
        ↓
RRF
        ↓
Reranking
        ↓
RAG
        ↓
External Research Discovery
        ↓
Evaluation
```

## Why This Project

The project focuses on demonstrating AI engineering rather than simply calling an LLM API.

The LLM is only one component of the system.

The main engineering pipeline includes:

- Document processing
- Token-aware chunking
- Embedding generation
- Vector retrieval
- Lexical retrieval
- Hybrid retrieval
- Reciprocal Rank Fusion
- Cross-encoder reranking
- Context construction
- Grounded generation
- External research discovery
- Semantic ranking
- Research relationship analysis
- Retrieval evaluation

This makes the project a practical implementation of a modern retrieval and reasoning system rather than a simple chatbot.

## Future Integration

The Python notebook is designed as the AI engineering layer of a larger backend system.

A future Spring Boot service can consume the core capabilities through an API boundary:

```
                    Spring Boot Backend
                           │
                           ▼
                  Python AI Engine
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
       Local RAG Pipeline        Research Discovery
             │                           │
             ▼                           ▼
           Groq                 OpenAlex / arXiv
```

Potential backend responsibilities include:

- REST API
- Paper management
- PostgreSQL persistence
- Job management
- Authentication if ever required
- Storage
- Production deployment

The Python component remains responsible for the AI/retrieval pipeline.
