# Research Retrieval & Reasoning Engine

A full-stack AI research intelligence platform that combines hybrid information retrieval, semantic search, BM25, FAISS, Reciprocal Rank Fusion, cross-encoder reranking, Retrieval-Augmented Generation (RAG), and external scholarly research discovery.

The system allows users to upload research papers, ask grounded questions about their contents, discover related research from scholarly sources, and understand relationships between papers.

## Architecture

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
Python FastAPI AI Engine
      ↓
Retrieval / RAG / Research Discovery
```

## Features

### Research Library

* Upload research papers in PDF format
* Store paper metadata in PostgreSQL
* View uploaded papers through the React interface
* Delete papers
* Validate uploaded files
* Maintain local paper storage

### Paper Question Answering

The system uses a multi-stage retrieval pipeline:

```text
PDF
 ↓
PyMuPDF Text Extraction
 ↓
Token-Aware Chunking
 ↓
BGE Embeddings
 ↓
FAISS Semantic Search
 +
BM25 Lexical Search
 ↓
Reciprocal Rank Fusion
 ↓
Cross-Encoder Reranking
 ↓
Evidence Context
 ↓
Groq LLM
 ↓
Grounded Answer + Sources
```

### External Research Discovery

```text
Uploaded Paper
 ↓
Groq Query Generation
 ↓
OpenAlex + arXiv
 ↓
Candidate Papers
 ↓
Deduplication
 ↓
BGE Semantic Ranking
 ↓
Cross-Encoder Reranking
 ↓
Related Papers
 ↓
Groq Relationship Analysis
```

## Technology Stack

### Frontend

* React 19
* Vite
* JavaScript
* REST API integration

### Backend

* Java 21
* Spring Boot 4
* Spring Web
* Spring Data JPA
* Hibernate
* PostgreSQL
* Bean Validation
* Spring RestClient
* Maven

### AI Engine

* Python
* FastAPI
* PyMuPDF
* Sentence Transformers
* BAAI/bge-small-en-v1.5
* FAISS
* BM25
* Reciprocal Rank Fusion
* Cross-Encoder reranking
* Groq
* OpenAlex
* arXiv

### Development

* Google Colab
* Postman
* ngrok
* Git / GitHub

## System Architecture

```text
                         ┌───────────────────────┐
                         │     React Frontend    │
                         │                       │
                         │ Research Library      │
                         │ Paper Upload           │
                         │ Ask Paper              │
                         │ Discover Research      │
                         └───────────┬───────────┘
                                     │
                                  REST/JSON
                                     │
                         ┌───────────▼───────────┐
                         │    Spring Boot API    │
                         │                       │
                         │ Controllers            │
                         │ Services               │
                         │ Validation             │
                         │ Exception Handling     │
                         │ AI Engine Client       │
                         └───────┬─────────┬─────┘
                                 │         │
                         PostgreSQL         │ HTTP
                                 │         │
                         ┌───────▼───┐     │
                         │  Database │     │
                         └───────────┘     │
                                           ▼
                              ┌─────────────────────┐
                              │ Python FastAPI      │
                              │ AI Engine           │
                              └──────────┬──────────┘
                                         │
                       ┌─────────────────┴─────────────────┐
                       │                                   │
                       ▼                                   ▼
                Local RAG Pipeline              Research Discovery
                       │                                   │
                       ▼                                   ▼
                 FAISS + BM25                       OpenAlex
                       │                              arXiv
                       ▼
                RRF + Reranker
                       │
                       ▼
                     Groq
```

## Project Structure

```text
research-retrieval-reasoning-engine/
│
├── README.md
│
├── ai-engine/
│   └── Research_Retrieval_Reasoning_Engine.ipynb
│
├── backend/
│   └── research-retrieval-api/
│       ├── pom.xml
│       └── src/
│           └── main/
│               ├── java/com/research/retrieval/
│               │   ├── ResearchRetrievalApplication.java
│               │
│               │   ├── controller/
│               │   │   ├── PaperController.java
│               │   │   ├── RetrievalController.java
│               │   │   └── DiscoveryController.java
│               │
│               │   ├── service/
│               │   │   ├── PaperService.java
│               │   │   ├── RetrievalService.java
│               │   │   └── DiscoveryService.java
│               │
│               │   ├── client/
│               │   │   └── AiEngineClient.java
│               │
│               │   ├── dto/
│               │   │   ├── RetrievalRequest.java
│               │   │   ├── RetrievalResponse.java
│               │   │   ├── DiscoveryRequest.java
│               │   │   └── DiscoveryResponse.java
│               │
│               │   ├── entity/
│               │   │   └── ResearchPaper.java
│               │
│               │   ├── repository/
│               │   │   └── ResearchPaperRepository.java
│               │
│               │   ├── config/
│               │   │   ├── RestClientConfig.java
│               │   │   └── WebConfig.java
│               │
│               │   └── exception/
│               │       ├── GlobalExceptionHandler.java
│               │       └── ResourceNotFoundException.java
│               │
│               └── resources/
│                   └── application.yml
│
└── frontend/
    └── research-retrieval-ui/
        ├── package.json
        ├── vite.config.js
        ├── index.html
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── components/
            │   ├── FileUpload.jsx
            │   ├── LoadingState.jsx
            │   ├── PaperCard.jsx
            │   ├── SearchBar.jsx
            │   └── SourceCard.jsx
            ├── pages/
            │   ├── Home.jsx
            │   ├── ComparePapers.jsx
            │   └── DiscoverResearch.jsx
            └── services/
                └── api.js
```

## Backend API

### Paper APIs

```text
POST   /api/papers
POST   /api/papers/upload
GET    /api/papers
GET    /api/papers/{id}
GET    /api/papers/local
DELETE /api/papers/{id}
```

### Retrieval API

```text
POST /api/retrieval
```

Example:

```json
{
  "query": "What is the main contribution of this paper?",
  "topK": 5
}
```

### Discovery API

```text
POST /api/discovery
```

Example:

```json
{
  "paperId": 1,
  "query": null,
  "topK": 5
}
```

## Retrieval Architecture

The retrieval system uses both semantic and lexical retrieval.

### Semantic Retrieval

Research-paper chunks are embedded using:

```text
BAAI/bge-small-en-v1.5
```

and indexed with FAISS.

### Lexical Retrieval

BM25 provides exact keyword-based retrieval for technical terminology.

### Reciprocal Rank Fusion

The FAISS and BM25 rankings are combined using Reciprocal Rank Fusion.

```text
FAISS ──────┐
            ├── RRF ── Cross-Encoder ── Final Evidence
BM25 ───────┘
```

### Cross-Encoder Reranking

Candidate chunks are reranked before being supplied to the LLM.

This creates a two-stage retrieval architecture:

```text
Fast Candidate Retrieval
          ↓
Accurate Reranking
          ↓
Evidence Selection
```

## RAG Pipeline

The final question-answering workflow is:

```text
User Question
      ↓
Hybrid Retrieval
      ↓
RRF
      ↓
Cross-Encoder Reranking
      ↓
Top Evidence
      ↓
Context Construction
      ↓
Groq
      ↓
Grounded Answer
      +
Source Provenance
```

The LLM does not directly search the uploaded document. Retrieval first determines the relevant evidence, which is then supplied to the generation stage.

## Research Discovery

The external discovery system searches scholarly sources including OpenAlex and arXiv.

```text
Research Paper
      ↓
LLM Query Generation
      ↓
OpenAlex + arXiv
      ↓
Deduplication
      ↓
Embedding Similarity
      ↓
Cross-Encoder Reranking
      ↓
Top Related Papers
      ↓
Relationship Analysis
```

Returned paper information includes:

* Title
* Authors
* Publication year
* Abstract
* DOI
* URL
* Source
* Embedding similarity
* Reranking score
* Relationship analysis

## Database

PostgreSQL stores research-paper metadata.

Main entity:

```text
ResearchPaper
```

Fields include:

```text
id
title
authors
abstractText
sourceUrl
fileName
filePath
sourceType
uploadedAt
```

Spring Data JPA and Hibernate are used for persistence.

## AI Engine API

The Python service exposes:

```text
GET  /health
POST /upload
POST /retrieve
POST /discover
```

The Spring Boot backend communicates with the AI engine through `AiEngineClient`.

```text
React
  ↓
Spring Boot
  ↓ HTTP
FastAPI
  ↓
AI Pipeline
```

## Running the Project

### PostgreSQL

Create:

```text
Database: research_retrieval
Host: localhost
Port: 5432
Username: postgres
```

Configure credentials in:

```text
backend/research-retrieval-api/src/main/resources/application.yml
```

### AI Engine

Open:

```text
ai-engine/Research_Retrieval_Reasoning_Engine.ipynb
```

Configure:

```text
GROQ_API_KEY
NGROK_AUTH_TOKEN
```

Run the notebook and start the FastAPI service.

The AI engine runs on:

```text
http://localhost:8000
```

During development, ngrok can expose the AI service to Spring Boot.

### Spring Boot

Navigate to:

```text
backend/research-retrieval-api
```

Run:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### React

Navigate to:

```text
frontend/research-retrieval-ui
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Complete Request Flow

```text
User
 ↓
React
 ↓
Spring Boot REST API
 ↓
PostgreSQL
 ↓
AiEngineClient
 ↓
Python FastAPI
 ↓
PDF Processing / Retrieval / Discovery
 ↓
Groq / OpenAlex / arXiv
 ↓
Python Response
 ↓
Spring Boot
 ↓
React
```

## Evaluation

The retrieval pipeline includes standard information-retrieval evaluation metrics:

```text
Recall@5 = 1.00
MRR      = 1.00
NDCG@5   = 1.00
```

These results were obtained on a small manually annotated evaluation set and should not be interpreted as a broad benchmark.

## Engineering Highlights

### Information Retrieval

* Dense vector retrieval
* BM25 lexical retrieval
* Hybrid search
* Reciprocal Rank Fusion
* Cross-encoder reranking
* Recall@K
* MRR
* NDCG

### LLM Engineering

* Token-aware document chunking
* Sentence embeddings
* Retrieval-Augmented Generation
* Grounded generation
* Query generation
* Research relationship analysis
* Provenance-aware responses

### Backend Engineering

* Java 21
* Spring Boot
* REST API design
* Layered architecture
* Spring Data JPA
* Hibernate
* PostgreSQL
* Bean Validation
* Global exception handling
* Service-to-service HTTP communication

### Frontend Engineering

* React
* Vite
* Component-based UI
* REST API integration
* PDF upload workflow
* Loading states
* Error handling
* Research discovery interface

### AI System Architecture

* Python AI microservice
* FastAPI
* FAISS
* BM25
* Cross-encoder reranking
* Groq LLM integration
* OpenAlex integration
* arXiv integration
* Hybrid retrieval
* RAG

## Why This Is More Than a Basic RAG Application

A basic RAG system commonly follows:

```text
PDF
 ↓
Embeddings
 ↓
Vector Database
 ↓
LLM
```

This project implements a multi-stage retrieval architecture:

```text
PDF
 ↓
Token-Aware Chunking
 ↓
BGE Embeddings
 ↓
FAISS ──────────┐
                │
BM25 ───────────┤
                ▼
               RRF
                ↓
        Cross-Encoder
                ↓
       Evidence Selection
                ↓
               RAG
                ↓
              Groq
                ↓
      Grounded Answer
                +
           Provenance
```

It also extends beyond local document Q&A by discovering and analyzing related scholarly research.

## Future Improvements

* Multi-paper simultaneous indexing
* Persistent vector indexes
* Background document indexing
* Redis caching
* Object storage for PDFs
* Authentication and authorization
* Docker deployment
* Streaming LLM responses
* Research graph construction
* Citation graph analysis
* Persistent conversation history
* Larger retrieval evaluation datasets

## Author

**Ravi Sankar Manem**

Computer Science & Engineering
RGUKT Nuzvid

GitHub:

[https://github.com/ravimnm/research-paper-retrieval-reasoning-engine](https://github.com/ravimnm/research-paper-retrieval-reasoning-engine)

## License

This project is intended for educational, research, and portfolio purposes.
