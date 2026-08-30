# 180-Day Roadmap — AI Engineering + Full Stack + DSA

**Starting point:** Python basics ✅, HTML/CSS ✅, some ML fundamentals (house price predictor, spam classifier) ✅, FastAPI + React experience from the AI Inventory Management project ✅.

---

## Daily Schedule Structure (Mon–Sat; Sunday = Review & Integrate / Rest)

| Time | Track | Focus & Action |
|---|---|---|
| ~90 min | **AI Engineering** | Watch/follow that week's resource, then build AI components |
| ~60–75 min | **Full Stack** | Watch/follow that week's resource, then build frontend & backend API features |
| ~30–45 min | **DSA / LeetCode** | 1 problem, timed (25–30 min), focusing on that week's target pattern |

*Note: Each week has one primary resource per track and one small project checkpoint. Days are time-boxes, not hard content boundaries.*

---

## Phase 1 — Foundations (Weeks 1–4, Days 1–28)

**Goal:** First working LLM script, first React app, Easy LeetCode rhythm.

| Week | AI Engineering | Full Stack | DSA Pattern | Weekly Project Checkpoint |
|---|---|---|---|---|
| **Week 1** | What an API is — `requests` library, JSON, status codes (freeCodeCamp "APIs for Beginners") | JavaScript fundamentals — variables, functions, arrays/objects (freeCodeCamp JS or The Odin Project) | Arrays & Strings (Easy) | Script that calls a public API and prints formatted data |
| **Week 2** | First LLM call — Anthropic/OpenAI SDK, system prompts, temperature (official Anthropic "Getting Started" docs + video) | DOM manipulation & events, `fetch()` (Traversy Media "JS DOM Crash Course") | Two Pointers (Easy) | CLI tool: type a question, get an LLM answer |
| **Week 3** | Prompt engineering basics — few-shot, structured output (Anthropic prompt engineering guide) | Build one vanilla-JS interactive page (to-do list or live filter) | Hashmaps (Easy) | Same to-do list, no framework |
| **Week 4** | Intro to embeddings — what they are, why RAG needs them (DeepLearning.AI "RAG free course," audit mode) | React basics — components, props, state (Scrimba "Learn React" free path) | Sliding Window (Easy) | Rebuild the to-do list in React |

---

## Phase 2 — Core Skills (Weeks 5–8, Days 29–56)

**Goal:** First working RAG pipeline, React talking to a backend, comfortable with Easy-tier patterns.

| Week | AI Engineering | Full Stack | DSA Pattern | Weekly Project Checkpoint |
|---|---|---|---|---|
| **Week 5** | Vector databases — Chroma or FAISS basics (Boot.dev "Learn RAG" or LangChain Academy intro) | React hooks — `useEffect`, `useState` deeper dive | Stacks & Queues | Store & query a few text snippets in Chroma |
| **Week 6** | Chunking strategies for documents (LangChain Academy RAG track) | Connect React to your existing FastAPI backend (real CRUD calls) | Linked Lists | Chunk a PDF, embed it, store it |
| **Week 7** | Build a minimal RAG pipeline end-to-end | React Router — multi-page app | Binary Search | "Ask questions about this PDF" CLI or simple web page |
| **Week 8** | RAG evaluation basics — is retrieval actually relevant? (DeepLearning.AI eval short course) | Basic auth (JWT) in your FastAPI + React app | Trees (Intro) | Polish the RAG project — add a simple UI |

---

## Phase 3 — Intermediate Build (Weeks 9–12, Days 57–84)

**Goal:** Deployed RAG app, deployed full-stack app, trees/graphs comfort.

| Week | AI Engineering | Full Stack | DSA Pattern | Weekly Project Checkpoint |
|---|---|---|---|---|
| **Week 9** | Function calling / tool use with an LLM (Anthropic tool-use docs) | Testing basics — unit tests for API + component tests | Trees (Traversal) | LLM that can call one real function (e.g. lookup in your data) |
| **Week 10** | Reranking & hybrid search (Class Central RAG roundup picks) | Deployment — push FastAPI + React to Render/Vercel | Trees (BFS / DFS) | Deploy the RAG app publicly |
| **Week 11** | Combine RAG + tool use into one small assistant | Environment configs, `.env` handling, CORS in production | Graphs (Intro) | RAG assistant that can also call a function |
| **Week 12** | Review & harden — error handling, rate limits, retries | CI basics — auto-deploy on push (GitHub Actions) | Graphs (BFS / DFS practice) | Same assistant, now production-hardened |

---

## Phase 4 — Agents & Scaling (Weeks 13–16, Days 85–112)

**Goal:** Multi-step agent, richer frontend state, graph fluency.

| Week | AI Engineering | Full Stack | DSA Pattern | Weekly Project Checkpoint |
|---|---|---|---|---|
| **Week 13** | Agent design fundamentals (Scrimba "AI Engineer Path" — agents module) | State management patterns in React (Context or lightweight store) | Graphs (Cycles, Topological Sort) | Sketch an agent's tool list and loop on paper first |
| **Week 14** | Build a 2-tool agent loop (search + calculator, or search + your own API) | Wire agent output into your React UI as a chat-like interface | Dynamic Programming (Intro) | Working 2-tool agent, visible in the app |
| **Week 15** | Multi-step agents, memory across turns | Polish UI/UX for the agent chat interface | DP (1D Problems) | Agent that remembers prior turns in a session |
| **Week 16** | Guardrails — stopping bad tool calls, input validation | Loading states, error boundaries in React | DP (1D Problems, more reps) | Same agent, safer and more polished |

---

## Phase 5 — Production & MCP (Weeks 17–20, Days 113–140)

**Goal:** MCP-aware agent, observability, deployment pipeline maturity.

| Week | AI Engineering | Full Stack | DSA Pattern | Weekly Project Checkpoint |
|---|---|---|---|---|
| **Week 17** | Model Context Protocol (MCP) fundamentals (LangChain Academy "Quickstart: LangChain Essentials") | Performance — lazy loading, code splitting | DP (2D Intro) | Connect one MCP-style tool to your agent |
| **Week 18** | Observability — logging/tracing LLM calls (LangSmith or simple custom logging) | Backend logging & monitoring basics | DP (2D Reps) | Dashboard/log view of your agent's calls |
| **Week 19** | Cost & latency optimization — caching, smaller models where possible | CI/CD pipeline cleanup, staging vs prod | Greedy Algorithms | Optimize the agent's cost per query |
| **Week 20** | Review — security basics for LLM apps (prompt injection awareness) | Security basics — input sanitization, auth hardening | Mixed Review (Patterns so far) | Security pass on both apps |

---

## Phase 6 — Capstone & Portfolio (Weeks 21–26, Days 141–180)

**Goal:** Flagship project fusing AI engineering + full stack, portfolio-ready, interview-ready DSA.

| Week | Focus Area | Weekly Project Checkpoint |
|---|---|---|
| **Week 21** | Design the capstone — RAG/agent feature integrated into AI Inventory Management app or focused INSA/African-market solution | Written spec: what it does, target users, architecture |
| **Week 22** | Build core backend (FastAPI + RAG/agent logic) | Backend functional end-to-end |
| **Week 23** | Build frontend (React) | Full app usable locally |
| **Week 24** | Deploy + add observability + polish | App live on the internet |
| **Week 25** | DSA focus week — mock interviews, timed mixed-pattern sets (NeetCode 150 / Blind 75) | Fill remaining gaps in pattern list |
| **Week 26** | Portfolio pass — README, demo video/GIF, write-up of build & trade-offs, resume + LinkedIn update | Capstone published on GitHub, linked from profile |

---

## Core Guidelines & Strategy
- **LeetCode Pattern Follow-Through:** Follow Blind 75 or NeetCode 150 in sequence rather than random selection.
- **Pacing Flexibility:** If a week's resource is completed early, advance immediately; if extra time is needed, shift subsequent weeks without sacrificing core understanding.
- **Sunday Integration Merge:** Every Sunday, spend 30–60 minutes connecting AI-engineering work with full-stack work in the same codebase to build real cohesive projects.
