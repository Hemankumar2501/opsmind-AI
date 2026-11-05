<div align="center">

# 🧠 OpsMind AI
### Autonomous Enterprise Operations & Multi-Agent Copilot Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-049EF4?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
[![Tests Passing](https://img.shields.io/badge/Tests-7%20Passed-10B981?style=for-the-badge&logo=githubactions&logoColor=white)](#-testing--quality-assurance)

<p align="center">
  <b>OpsMind AI</b> is an enterprise-grade autonomous operational copilot platform designed to streamline high-volume customer support operations, ingest corporate knowledge bases via semantic RAG, analyze real-time customer sentiment, and orchestrate specialized domain agents with strict human-in-the-loop approval gates.
</p>

[Explore Capabilities](#-core-capabilities) • [System Architecture](#-system-architecture) • [Specialized Agents](#-multi-agent-orchestration-matrix) • [Quick Start](#-quick-start--development) • [API Reference](#-api-specification)

</div>

---

## 🌟 Executive Overview

Modern customer operations teams face escalating ticket volumes, fragmented knowledge silos, and slow response times. OpsMind AI solves these bottlenecks by pairing multi-modal document intelligence and deep vector search with an ensemble of autonomous AI agents governed by an executive Supervisor.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   OPSMIND AI PLATFORM                                   │
├────────────────────────────┬─────────────────────────────┬──────────────────────────────┤
│  ⚡ Autonomous Triage      │  📚 Semantic RAG Index      │  🛡️ Human-in-the-Loop Gate   │
│  Instant intent classifier │  Chunking & cosine scoring  │  Safe agentic response drafting│
│  & SLA urgency scoring     │  with live citation links   │  prior to customer dispatch  │
└────────────────────────────┴─────────────────────────────┴──────────────────────────────┘
```

---

## 🏗️ System Architecture

OpsMind AI follows a clean, decoupled full-stack architecture separating real-time 3D UI presentation, secure state management, mathematical domain algorithms, and an Express REST API backend.

```
                           ┌───────────────────────────────┐
                           │      Client Application       │
                           │  (React 19 + Three.js + Vite) │
                           └───────────────┬───────────────┘
                                           │
                                  HTTP / JSON (REST)
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │       Express API Server      │
                           │          (Node.js 20+)        │
                           └───────┬───────────────┬───────┘
                                   │               │
            ┌──────────────────────┴──────┐ ┌──────┴──────────────────────┐
            ▼                             ▼ ▼                             ▼
┌─────────────────────────┐ ┌───────────────────────────┐ ┌─────────────────────────┐
│  Pure Logic Algorithms  │ │  Multi-Agent Orchestrator │ │    Knowledge Engine     │
│  • Cosine Similarity    │ │  • Supervisor Router      │ │  • Document Chunker     │
│  • Sentiment Vectorizer │ │  • Ticket Intelligence    │ │  • Normalized Vectors   │
│  • Metrics Aggregation  │ │  • Response Generator     │ │  • RAG Similarity Top-K │
└─────────────────────────┘ └───────────────────────────┘ └─────────────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │   Storage & Identity Layer    │
                           │   • Cloud Firestore (ABAC)    │
                           │   • Firebase Auth (RBAC)      │
                           │   • In-Memory Fallback Engine │
                           └───────────────────────────────┘
```

---

## 🤖 Multi-Agent Orchestration Matrix

OpsMind coordinates five specialized autonomous agents under a hierarchical supervisor pattern:

| Agent | Domain Role | Primary Trigger | Core Intelligence Output | Typical Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Supervisor Agent** | Central Orchestrator | User intent queries / System events | Intelligent task routing, multi-agent collaboration telemetry, consolidated audit logs | `< 950 ms` |
| **Ticket Intelligence Agent** | Support Triage | Inbound ticket creation | Sentiment scoring (-1.0 to +1.0), category tagging, SLA priority calculation, intent summarization | `< 450 ms` |
| **Knowledge Intelligence Agent** | Semantic RAG | Knowledge base uploads & user searches | Vector embeddings, document chunking, top-k cosine similarity retrieval, citation referencing | `< 620 ms` |
| **Response Generation Agent** | Customer Drafter | Ticket resolution requests | Context-aware responses across 4 tone presets (*Empathetic*, *Technical*, *Concise*, *Executive*) with human approval gate | `< 750 ms` |
| **Business Insights Agent** | Executive Analytics | Periodic review / Analytics tab | Recurring issue clustering, churn risk detection, operational bottleneck identification, C-level briefings | `< 820 ms` |

---

## 🎨 Immersive Design System & 3D Visualizations

* **Enterprise Dark Palette**: Engineered with high-contrast glassmorphic panels utilizing obsidian voids (`#080B14`), midnight surfaces (`#101625`), bordered container cards (`#151D2E`), and status accents (Violet `#8B5CF6`, Cyan `#06B6D4`, Emerald `#10B981`, Amber `#F59E0B`).
* **Interactive 3D Three.js Elements**:
  * **Landing Neural Sphere**: High-performance Three.js particle sphere with pulsing nodes, dynamic connecting vectors, and mouse parallax tilt.
  * **Reactive AI Orb**: Real-time canvas orb reflecting current supervisor agent execution states (`idle`, `thinking`, `responding`).
  * **CSS Fallback Engine**: Low-overhead geometric CSS animation fallback ensuring 100% responsiveness on low-power devices.
* **Sound Design**: Integrated Web Audio API sound synthesizer ([src/utils/audio.ts](src/utils/audio.ts)) providing tactile audio feedback without external audio file dependencies.

---

## 🚀 Quick Start & Development

### Prerequisites
* **Node.js**: `20.x` or higher
* **npm**: `10.x` or higher

### 1. Clone Repository
```bash
git clone https://github.com/Hemankumar2501/opsmind-AI.git
cd opsmind-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create your local environment file by copying the template:
```bash
cp .env.example .env
```
Edit `.env` to supply your configuration:
```ini
# Server Port
PORT=3000

# Google Gemini API Key (Optional: fallbacks to local mock engine if empty)
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL
APP_URL="http://localhost:3000"

# Firebase Client Configuration (Optional: Instant Demo mode works out-of-the-box)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
```

### 4. Launch Development Server
```bash
npm run dev
```
Open your browser to **[http://localhost:3000](http://localhost:3000)**.

> **Tip**: Visit `http://localhost:3000?demo=1` to immediately access the pre-seeded enterprise workspace with 5 realistic tickets, 2 indexed knowledge base documents, and active agent telemetry without signing in.

---

## 🧪 Testing & Quality Assurance

All algorithmic computations are decoupled into pure, deterministic functions in [src/utils/pureLogic.ts](src/utils/pureLogic.ts) and verified via Node's native test harness:

```bash
# Execute unit test suite
npm test
```

### Verification Matrix
* `calculateCosineSimilarity`: Verifies identical, orthogonal, opposite, and zero vector boundary cases.
* `chunkDocumentText`: Tests sliding window chunking with word boundary preservation and overlap thresholds.
* `rankDocumentChunks`: Validates top-k semantic ranking by cosine score.
* `textToVector`: Tests bag-of-words vector generation and L2 norm calculations.
* `computeSentimentScore`: Tests sentiment scoring distributions and priority weighting algorithms.
* `aggregateTicketMetrics`: Verifies SLA violation calculations, open/closed ticket counts, and sentiment averages.
* `determineRoutingAgent`: Validates contextual intent routing to domain-specific agents.

### Type Checking & Build Verification
```bash
# Verify TypeScript types without emitting code
npm run lint

# Build production bundle
npm run build
```

---

## 📡 API Specification

| Method | Endpoint | Description | Sample Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and timestamp | *None* |
| `GET` | `/api/tickets` | Query workspace tickets with filters | `?status=Open&priority=Critical` |
| `POST` | `/api/tickets` | Create a new customer support ticket | `{ "customerName": "...", "subject": "..." }` |
| `GET` | `/api/tickets/:id` | Fetch specific ticket details | `id: "t-1001"` |
| `POST` | `/api/tickets/simulate-inbound` | Simulate an inbound ticket with automated triage | *None* |
| `POST` | `/api/ai/analyze-ticket` | Run Ticket Intelligence Agent analysis | `{ "subject": "...", "description": "..." }` |
| `POST` | `/api/ai/generate-response` | Draft response with specific tone preset | `{ "ticketId": "...", "tone": "Empathetic" }` |
| `POST` | `/api/ai/business-insights` | Generate executive root-cause briefing | *None* |
| `POST` | `/api/ai/chat` | Conversational interface with Supervisor | `{ "message": "Investigate ticket t-1001" }` |
| `GET` | `/api/documents` | List indexed knowledge documents | *None* |
| `POST` | `/api/documents/upload` | Ingest and chunk text or policy documents | `{ "fileName": "...", "content": "..." }` |
| `POST` | `/api/documents/query-rag` | Query knowledge chunks using semantic search | `{ "query": "What is our refund SLA?" }` |
| `GET` | `/api/analytics/overview` | Compute aggregate operational KPIs | *None* |
| `GET` | `/api/agents` | Telemetry, uptime, and latency for all 5 agents | *None* |

---

## 🔒 Security & Tenant Isolation

1. **Zero Hardcoded Secrets**: All private keys, database identifiers, and sensitive tokens are injected exclusively via runtime environment variables.
2. **Hardened Cloud Firestore Rules**: Fully declared Attribute-Based Access Control (ABAC) in [firestore.rules](firestore.rules) ensuring:
   * Mandatory authentication for reading and mutating operational data.
   * Strict workspace isolation preventing cross-tenant leakage.
   * Strict schema validation restricting field types and maximum payload lengths.
3. **Defense in Depth**: Express API endpoints incorporate strict request payload size caps (`15mb`), input sanitization, and graceful in-memory fallbacks when external cloud dependencies are offline.

---

## 📂 Repository Structure

```
├── .env.example                # Clean environment variables configuration template
├── .gitignore                  # Comprehensive Git exclusion rules (secrets, logs, dist)
├── firestore.rules             # Production ABAC & RBAC security rules for Firestore
├── index.html                  # HTML5 entry point with Plus Jakarta Sans & JetBrains Mono
├── package.json                # Project dependencies, build targets & scripts
├── server.ts                   # Full-stack Express API server & Vite middleware
├── src/
│   ├── App.tsx                 # Core application controller & client-side router
│   ├── main.tsx                # React DOM entry point
│   ├── index.css               # Tailwind CSS v4 styling & glassmorphic utilities
│   ├── components/
│   │   ├── 3d/                 # Three.js 3D Neural Sphere & Reactive AI Orb
│   │   ├── layout/             # Responsive Sidebar, TopNavbar, and AppShell
│   │   ├── tickets/            # NewTicketModal, ticket triage & approval controls
│   │   └── CommandPalette.tsx  # Global Ctrl+K / Cmd+K rapid search modal
│   ├── contexts/               # AuthContext (Firebase Auth + Zero-Config Demo Mode)
│   ├── lib/                    # Firebase client initialization & error sanitization
│   ├── pages/                  # 14 complete application route views:
│   │   ├── LandingPage.tsx     # High-conversion marketing landing page with 3D sphere
│   │   ├── DashboardPage.tsx   # Operational overview & live KPI charts
│   │   ├── AIWorkspacePage.tsx # Collaborative copilot chat & prompt laboratory
│   │   ├── TicketsPage.tsx     # Support ticket queue with multi-filter sorting
│   │   ├── TicketDetailsPage.tsx # Detailed triage view with Human-in-the-Loop drafting
│   │   ├── KnowledgeBasePage.tsx # Document RAG ingestion, chunk viewer, and search bench
│   │   ├── AgentsPage.tsx      # Multi-agent roster, live telemetry, and prompt testing
│   │   ├── AnalyticsPage.tsx   # Recharts trend curves, sentiment distributions, and SLA metrics
│   │   └── SettingsPage.tsx    # Workspace settings, theme controls, and API keys
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & domain models
│   └── utils/
│       ├── audio.ts            # Web Audio API sound synthesizer
│       ├── pureLogic.ts        # Testable pure computational algorithms
│       └── pureLogic.test.ts   # Node.js native test suite
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler & development server configuration
```

---

## 📄 License

This project is licensed under the **Apache-2.0 License** — see the [LICENSE](LICENSE) file for details.
