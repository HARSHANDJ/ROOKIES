# KnowSphere AI — Knowledge Intelligence & Verification Platform

> **Ask Anything. Trust Everything You Can Verify.**
>
> KnowSphere AI is an auditable AI knowledge processing, grounding, and verification platform designed to eliminate hallucinations, detect inter-document contradictions, and provide end-to-end evidence lineage.

---

## ⚡ Key Standout Features

### 1. 🛡️ Evidence-Based Trust Meter
Every generated answer is paired with a real-time, evidence-driven **Trust Meter** that evaluates:
- **Retrieval Relevance Score**: Vector similarity percentage (e.g. `98.4%`).
- **Evidence Strength**: Categorized as `Strong Evidence`, `Moderate Evidence`, or `Insufficient Evidence`.
- **Source Coverage**: Count of verified vector passages and distinct document sources.

### 2. 🔍 Answer Forensics Audit Lineage
Clicking **"View Answer Forensics"** on any answer card opens a slide-over audit panel displaying the complete 5-stage RAG reasoning lineage:
1. `Query Understanding & Concept Mapping`
2. `Vector Search & Candidate Extraction`
3. `Cosine Evidence Ranking`
4. `Knowledge Boundary Verification`
5. `Grounded Answer Synthesis`

Click any candidate chunk to inspect its exact text, page number, document ID, and vector score.

### 3. 🧭 Knowledge Boundary Inspector
The **Knowledge Boundary** framework visually categorizes system knowledge into three distinct columns:
- **WHAT THE AI KNOWS**: Topics with strong evidence in active datasets (e.g., Attendance 75% Rule, Exam Eligibility, Grade Appeals, Library Overdue Fines).
- **PARTIAL KNOWLEDGE**: Topics with incomplete evidence (e.g., Medical Condonation, Residence Hall Quiet Hours).
- **WHAT THE AI DOESN'T KNOW**: Questions outside the knowledge base (e.g., Quantum Physics Rocket Propulsion, Cafeteria Meal Plan Rates).

### 4. ⚠ Contradiction Radar
Detects conflicting rules, numbers, or opposing clauses across retrieved documents (e.g., `College Student Handbook 2026.pdf` specifying a 75% attendance rule vs `Revised Academic Council Circular 2026.pdf` specifying an 80% honours rule). Instead of silently guessing or choosing one, KnowSphere AI presents a **⚠ Potential Knowledge Conflict Detected** alert highlighting both sources side-by-side.

### 5. 🕸️ Interactive Knowledge Graph Topology
An interactive SVG visualization rendering the entire knowledge structure:
`DOCUMENT → TOPIC → ENTITY/RULE → VECTOR CHUNK`
Supports canvas zoom in/out, drag panning, node search filtering, click node inspection, and source passage drawers.

### 6. 🏆 Judge Demo Mode
Click the prominent **“LAUNCH JUDGE DEMO”** button to launch a guided 10-step interactive demonstration tour covering knowledge base selection, grounded query execution, source inspection, Answer Forensics, out-of-domain refusal fallback, Contradiction Radar, Knowledge Graph topology, and system evaluation statistics.

---

## 📁 Technical Architecture & Pipeline

```
DOCUMENT UPLOAD / INGESTION
       ↓
TEXT EXTRACTION (pdf-parse / Page Partitioning)
       ↓
TEXT CLEANING & NORMALIZATION (Whitespace, Hyphen Repair)
       ↓
RECURSIVE CHARACTER CHUNKING (~500 chars, 100 char overlap)
       ↓
VECTOR EMBEDDINGS (OpenAI / Gemini API or Local TF-IDF Fallback)
       ↓
STORAGE & SEARCH (MongoDB $vectorSearch or Cosine Vector Ranker / InMemoryStore)
       ↓
GROUNDED CONVERSATIONAL RAG & TRUST METER & CONTRADICTION RADAR
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

---

### Backend Server Setup (`server/`)

1. Open terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (Optional):
   Create a `.env` file inside `server/` (see `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/knowsphere
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here # Optional
   GEMINI_API_KEY=your_gemini_api_key_here # Optional
   ```
   *Note: If no API keys or MongoDB instance are present, KnowSphere AI automatically operates in zero-downtime fallback mode using its local vectorizer and in-memory repository.*

4. Build and start the backend server:
   ```bash
   npm run build
   npm run start
   ```
   The backend engine will start at `http://localhost:5000`.

---

### Frontend Client Setup (`client/`)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build or start the development server:
   - For development mode:
     ```bash
     npm run dev
     ```
     The web interface will open at `http://localhost:5173`.

   - For production build:
     ```bash
     npm run build
     ```

---

## 🛠️ Verified Functional API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & MongoDB connection status |
| `/api/documents` | `GET` | List all indexed document records |
| `/api/documents/upload` | `POST` | Upload PDF/TXT file into vector pipeline |
| `/api/documents/process-text` | `POST` | Ingest raw text snippet into vector pipeline |
| `/api/documents/:id` | `DELETE` | Delete document and associated vector chunks |
| `/api/retrieval/search` | `POST` | Vector semantic search with similarity scores |
| `/api/chat/ask` | `POST` | Grounded Conversational RAG, Trust Meter, & Contradiction Radar |
| `/api/chat/boundary` | `GET` | Knowledge Boundary categories (`knows`, `partial`, `doesNotKnow`) |
| `/api/graph/topology` | `GET` | Interactive Knowledge Graph nodes and edges |
