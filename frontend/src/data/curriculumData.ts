export interface DailyTaskItem {
  day: number;
  week: number;
  phase: number;
  phase_title: string;
  title: string;
  ai_eng_task: string;
  full_stack_task: string;
  dsa_task: string;
  checkpoint_step: string;
}

export interface WeekItem {
  week: number;
  ai_eng: string;
  full_stack: string;
  dsa: string;
  checkpoint: string;
}

export interface PhaseItem {
  phase: number;
  phase_title: string;
  weeks_range: string;
  goal: string;
  weeks: WeekItem[];
}

export const PHASES_DATA: PhaseItem[] = [
  {
    phase: 1,
    phase_title: "Phase 1 — Foundations",
    weeks_range: "Weeks 1–4 (Days 1–24)",
    goal: "Master Python HTTP/APIs, Modern JavaScript ES6+, and Arrays & Strings DSA patterns.",
    weeks: [
      { week: 1, ai_eng: "API fundamentals, JSON parsing, API keys & requests", full_stack: "JS ES6+, arrow functions, array methods, async/await", dsa: "Arrays & Strings (Contains Duplicate, Two Sum, Valid Anagram)", checkpoint: "CLI tool that calls a public API and outputs formatted data" },
      { week: 2, ai_eng: "OpenAI/Anthropic APIs, prompt engineering basics, temperature, system prompts", full_stack: "DOM manipulation, event listeners, local storage, fetch API", dsa: "Two Pointers (Valid Palindrome, Two Sum II, 3Sum)", checkpoint: "Interactive web page calling LLM API with styled output" },
      { week: 3, ai_eng: "Token optimization, structured outputs (JSON mode), error handling & retries", full_stack: "CSS Grid & Flexbox mastery, responsive design, glassmorphism UI", dsa: "Sliding Window (Best Time to Buy/Sell Stock, Longest Substring)", checkpoint: "Full-page AI app with error boundaries and responsive layout" },
      { week: 4, ai_eng: "Phase 1 Integration: Build end-to-end AI summarizer tool", full_stack: "Phase 1 Integration: Connect vanilla frontend with backend API", dsa: "Stack & Queue basics (Valid Parentheses, Min Stack)", checkpoint: "Project 1 Final Deliverable: AI Study Assistant with clean UI" }
    ]
  },
  {
    phase: 2,
    phase_title: "Phase 2 — Core Stack",
    weeks_range: "Weeks 5–9 (Days 25–54)",
    goal: "Build Full-Stack FastAPI backends, React 19 frontends, and master Sliding Window & Stacks.",
    weeks: [
      { week: 5, ai_eng: "LangChain & LlamaIndex basics, prompt templates, chains", full_stack: "React components, props, state, hooks (useState, useEffect)", dsa: "Binary Search (Binary Search, Search 2D Matrix, Rotated Array)", checkpoint: "React component consuming FastAPI backend endpoint" },
      { week: 6, ai_eng: "Embeddings, vector representations, cosine similarity, ChromaDB", full_stack: "React context, custom hooks, component composition", dsa: "Linked Lists (Reverse Linked List, Merge Two Lists, Cycle Detection)", checkpoint: "Vector search script finding semantic similarity in documents" },
      { week: 7, ai_eng: "RAG pipeline architecture: chunking, embedding, indexing, retrieval", full_stack: "FastAPI APIRouter, dependency injection, Pydantic validation", dsa: "Trees: Traversals & BFS/DFS (Invert Tree, Max Depth, Same Tree)", checkpoint: "Working RAG prototype answering questions from PDF files" },
      { week: 8, ai_eng: "RAG evaluation & optimization (retrieval accuracy, context relevance)", full_stack: "SQLAlchemy ORM models, migrations, relationship mapping", dsa: "Trees: BST properties & LCA (Lowest Common Ancestor, Validate BST)", checkpoint: "RAG backend with SQLite persistent storage" },
      { week: 9, ai_eng: "Phase 2 Integration: Multi-document RAG system with citations", full_stack: "Phase 2 Integration: Full-stack React + FastAPI + DB connection", dsa: "Heap / Priority Queue (Kth Largest Element, Top K Frequent)", checkpoint: "Project 2 Final Deliverable: Enterprise Document Search & QA" }
    ]
  },
  {
    phase: 3,
    phase_title: "Phase 3 — Database & Advanced AI",
    weeks_range: "Weeks 10–13 (Days 55–78)",
    goal: "Production PostgreSQL, Vector DBs (Pinecone/Qdrant), and Advanced Tree/Graph DSA.",
    weeks: [
      { week: 10, ai_eng: "Production Vector DBs (Pinecone / Qdrant), hybrid search (BM25 + vector)", full_stack: "PostgreSQL setup, indexes, query optimization, foreign keys", dsa: "Backtracking (Subsets, Combination Sum, Permutations)", checkpoint: "Hybrid search engine with sub-50ms latency on 10k documents" },
      { week: 11, ai_eng: "Advanced RAG techniques: reranking (Cohere), query expansion, HyDE", full_stack: "Database connection pooling, transactions, alembic migrations", dsa: "Tries (Implement Trie, Word Search II)", checkpoint: "Reranked search pipeline scoring precision vs raw vector search" },
      { week: 12, ai_eng: "Fine-tuning fundamentals vs RAG: when to fine-tune, dataset curation", full_stack: "Authentication & Authorization: JWT tokens, bcrypt, protected routes", dsa: "Graphs: BFS/DFS (Number of Islands, Clone Graph, Max Area)", checkpoint: "Secure auth flow with protected RAG workspace routes" },
      { week: 13, ai_eng: "Phase 3 Integration: AI Knowledge Base with role-based access", full_stack: "Phase 3 Integration: Multi-tenant dashboard with permissions", dsa: "Graphs: Advanced (Course Schedule, Pacific Atlantic Water Flow)", checkpoint: "Project 3 Final Deliverable: Multi-Tenant AI Knowledge Base" }
    ]
  },
  {
    phase: 4,
    phase_title: "Phase 4 — AI Agents & Systems",
    weeks_range: "Weeks 14–18 (Days 79–108)",
    goal: "Autonomous Agent workflows with LangGraph & CrewAI, WebSockets, and Dynamic Programming.",
    weeks: [
      { week: 14, ai_eng: "Agent architectures: ReAct pattern, tool use, function calling", full_stack: "Real-time communication: WebSockets in FastAPI & React", dsa: "1D Dynamic Programming (Climbing Stairs, House Robber, Coin Change)", checkpoint: "Agent that autonomously calls calculator & web search tools" },
      { week: 15, ai_eng: "Multi-agent systems with LangGraph / CrewAI: roles, delegation, state", full_stack: "Streaming responses: Server-Sent Events (SSE) & streaming tokens", dsa: "1D DP Continued (Longest Increasing Subsequence, Word Break)", checkpoint: "Two-agent team: Researcher agent + Writer agent collaborating" },
      { week: 16, ai_eng: "Agent memory & human-in-the-loop approval workflows", full_stack: "Background tasks & job queues (Celery / Redis / async workers)", dsa: "2D Dynamic Programming (Unique Paths, Longest Common Subsequence)", checkpoint: "Agent that pauses and requests user confirmation for critical steps" },
      { week: 17, ai_eng: "Evaluation frameworks: Ragas, TruLens, automated benchmark tests", full_stack: "Caching strategies with Redis: API response & vector query cache", dsa: "2D DP Continued (Edit Distance, Target Sum)", checkpoint: "Automated test suite measuring agent task success rate" },
      { week: 18, ai_eng: "Phase 4 Integration: Autonomous Code Review & Refactor Agent", full_stack: "Phase 4 Integration: Live streaming UI with task execution timeline", dsa: "Greedy Algorithms (Jump Game, Gas Station, Hand of Straights)", checkpoint: "Project 4 Final Deliverable: Autonomous Developer Assistant" }
    ]
  },
  {
    phase: 5,
    phase_title: "Phase 5 — Production & Scale",
    weeks_range: "Weeks 19–22 (Days 109–132)",
    goal: "Docker, Kubernetes, CI/CD pipelines, rate limiting, and Intervals/Math DSA.",
    weeks: [
      { week: 19, ai_eng: "Model serving & quantization: vLLM, Ollama, GPU vs CPU inference", full_stack: "Docker containerization: Dockerfile multi-stage builds, docker-compose", dsa: "Intervals (Merge Intervals, Insert Interval, Non-overlapping Intervals)", checkpoint: "Dockerized full-stack app running backend, frontend & Redis" },
      { week: 20, ai_eng: "LLM observability & monitoring: Langfuse / Helicone, latency tracking", full_stack: "CI/CD pipelines with GitHub Actions: automated lint, test, build", dsa: "Bit Manipulation (Single Number, Number of 1 Bits, Counting Bits)", checkpoint: "GitHub Actions workflow running tests & Docker build on push" },
      { week: 21, ai_eng: "Security & guardrails: NeMo Guardrails, prompt injection defense", full_stack: "Cloud deployment on Render / AWS / GCP with SSL & custom domain", dsa: "Math & Geometry (Rotate Image, Spiral Matrix, Set Matrix Zeroes)", checkpoint: "Production deployment with rate limiting & input sanitization" },
      { week: 22, ai_eng: "Phase 5 Integration: Production-grade AI SaaS boilerplate", full_stack: "Phase 5 Integration: Stripe billing integration & usage metering", dsa: "DSA Comprehensive Speed Run: 10 Mixed Top Interview Questions", checkpoint: "Project 5 Final Deliverable: Live Deployed Multi-User SaaS App" }
    ]
  },
  {
    phase: 6,
    phase_title: "Phase 6 — Capstone & Portfolio",
    weeks_range: "Weeks 23–26 (Days 133–156)",
    goal: "Enterprise Capstone project, comprehensive interview prep, and live launch.",
    weeks: [
      { week: 23, ai_eng: "Capstone planning: Architecture design, tech stack selection, PRD", full_stack: "System design: High-level diagrams, database schema, API contracts", dsa: "DSA Mock Interview 1: Arrays, Strings, Trees under timed conditions", checkpoint: "Detailed technical architecture doc & wireframes approved" },
      { week: 24, ai_eng: "Capstone build sprint 1: Core AI pipeline & agent workflows", full_stack: "Capstone build sprint 1: Backend endpoints & database models", dsa: "DSA Mock Interview 2: Graphs, Dynamic Programming & Backtracking", checkpoint: "Working end-to-end prototype of Capstone core feature" },
      { week: 25, ai_eng: "Capstone build sprint 2: Performance tuning, evaluation & security", full_stack: "Capstone build sprint 2: Polished UI/UX, animations, mobile layout", dsa: "Behavioral interview prep: STAR method stories for all projects", checkpoint: "Feature-complete Capstone app ready for production testing" },
      { week: 26, ai_eng: "Capstone Launch: Production deployment, demo video, documentation", full_stack: "Portfolio website finalized with all 6 projects linked to GitHub", dsa: "Final interview review: 75 Blind / NeetCode key patterns cheat sheet", checkpoint: "Project 6 Final Deliverable: Live Enterprise Capstone & Portfolio!" }
    ]
  }
];

export const generateStaticDailyTasks = (): DailyTaskItem[] => {
  const allTasks: DailyTaskItem[] = [];
  let dayCounter = 1;

  PHASES_DATA.forEach((phase) => {
    phase.weeks.forEach((week) => {
      for (let dayOfWeek = 1; dayOfWeek <= 6; dayOfWeek++) {
        const currentDay = dayCounter++;
        allTasks.push({
          day: currentDay,
          week: week.week,
          phase: phase.phase,
          phase_title: phase.phase_title,
          title: `Day ${currentDay} — ${week.ai_eng.split(",")[0] || phase.phase_title}`,
          ai_eng_task: week.ai_eng,
          full_stack_task: week.full_stack,
          dsa_task: week.dsa,
          checkpoint_step: week.checkpoint
        });
      }
    });
  });

  return allTasks;
};
