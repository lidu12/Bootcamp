from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.roadmap import UserRoadmapProgress
from app.models.roadmap_day import UserDayProgress
from app.core.daily_curriculum import generate_180_days_curriculum

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

class ToggleProgressRequest(BaseModel):
    week_number: int
    is_completed: bool

class ToggleDayProgressRequest(BaseModel):
    day_number: int
    is_completed: bool

CURRICULUM_DATA = [
  {
    "phase": 1,
    "phase_title": "Phase 1 — Foundations",
    "weeks_range": "Weeks 1–4, Days 1–28",
    "goal": "First working LLM script, first React app, Easy LeetCode rhythm.",
    "weeks": [
      {
        "week": 1,
        "ai_eng": "What an API is — requests library, JSON, status codes (freeCodeCamp 'APIs for Beginners')",
        "full_stack": "JavaScript fundamentals — variables, functions, arrays/objects (freeCodeCamp JS or TOP)",
        "dsa": "Arrays & Strings (Easy)",
        "checkpoint": "Script that calls a public API and prints formatted data"
      },
      {
        "week": 2,
        "ai_eng": "First LLM call — Anthropic/OpenAI SDK, system prompts, temperature (Official docs + video)",
        "full_stack": "DOM manipulation & events, fetch() (Traversy Media 'JS DOM Crash Course')",
        "dsa": "Two Pointers (Easy)",
        "checkpoint": "CLI tool: type a question, get an LLM answer"
      },
      {
        "week": 3,
        "ai_eng": "Prompt engineering basics — few-shot, structured output (Anthropic prompt guide)",
        "full_stack": "Build one vanilla-JS interactive page (to-do list or live filter)",
        "dsa": "Hashmaps (Easy)",
        "checkpoint": "Same to-do list, no framework"
      },
      {
        "week": 4,
        "ai_eng": "Intro to embeddings — what they are, why RAG needs them (DeepLearning.AI RAG free course)",
        "full_stack": "React basics — components, props, state (Scrimba 'Learn React' free path)",
        "dsa": "Sliding Window (Easy)",
        "checkpoint": "Rebuild the to-do list in React"
      }
    ]
  },
  {
    "phase": 2,
    "phase_title": "Phase 2 — Core Skills",
    "weeks_range": "Weeks 5–8, Days 29–56",
    "goal": "First working RAG pipeline, React talking to a backend, comfortable with Easy-tier patterns.",
    "weeks": [
      {
        "week": 5,
        "ai_eng": "Vector databases — Chroma or FAISS basics (Boot.dev 'Learn RAG' or LangChain Academy)",
        "full_stack": "React hooks — useEffect, useState deeper dive",
        "dsa": "Stacks & Queues",
        "checkpoint": "Store & query a few text snippets in Chroma"
      },
      {
        "week": 6,
        "ai_eng": "Chunking strategies for documents (LangChain Academy RAG track)",
        "full_stack": "Connect React to your existing FastAPI backend (real CRUD calls)",
        "dsa": "Linked Lists",
        "checkpoint": "Chunk a PDF, embed it, store it"
      },
      {
        "week": 7,
        "ai_eng": "Build a minimal RAG pipeline end-to-end",
        "full_stack": "React Router — multi-page app",
        "dsa": "Binary Search",
        "checkpoint": "'Ask questions about this PDF' CLI or simple web page"
      },
      {
        "week": 8,
        "ai_eng": "RAG evaluation basics — is retrieval actually relevant? (DeepLearning.AI eval course)",
        "full_stack": "Basic auth (JWT) in your FastAPI + React app",
        "dsa": "Trees (Intro)",
        "checkpoint": "Polish the RAG project — add a simple UI"
      }
    ]
  },
  {
    "phase": 3,
    "phase_title": "Phase 3 — Intermediate Build",
    "weeks_range": "Weeks 9–12, Days 57–84",
    "goal": "Deployed RAG app, deployed full-stack app, trees/graphs comfort.",
    "weeks": [
      {
        "week": 9,
        "ai_eng": "Function calling / tool use with an LLM (Anthropic tool-use docs)",
        "full_stack": "Testing basics — unit tests for API + component tests",
        "dsa": "Trees (Traversal)",
        "checkpoint": "LLM that can call one real function (e.g. lookup in your data)"
      },
      {
        "week": 10,
        "ai_eng": "Reranking & hybrid search (Class Central RAG roundup picks)",
        "full_stack": "Deployment — push FastAPI + React to Render/Vercel",
        "dsa": "Trees (BFS / DFS)",
        "checkpoint": "Deploy the RAG app publicly"
      },
      {
        "week": 11,
        "ai_eng": "Combine RAG + tool use into one small assistant",
        "full_stack": "Environment configs, .env handling, CORS in production",
        "dsa": "Graphs (Intro)",
        "checkpoint": "RAG assistant that can also call a function"
      },
      {
        "week": 12,
        "ai_eng": "Review & harden — error handling, rate limits, retries",
        "full_stack": "CI basics — auto-deploy on push (GitHub Actions)",
        "dsa": "Graphs (BFS / DFS practice)",
        "checkpoint": "Same assistant, now production-hardened"
      }
    ]
  },
  {
    "phase": 4,
    "phase_title": "Phase 4 — Agents & Scaling",
    "weeks_range": "Weeks 13–16, Days 85–112",
    "goal": "Multi-step agent, richer frontend state, graph fluency.",
    "weeks": [
      {
        "week": 13,
        "ai_eng": "Agent design fundamentals (Scrimba 'AI Engineer Path' — agents module)",
        "full_stack": "State management patterns in React (Context or lightweight store)",
        "dsa": "Graphs (Cycles, Topological Sort)",
        "checkpoint": "Sketch an agent's tool list and loop on paper first"
      },
      {
        "week": 14,
        "ai_eng": "Build a 2-tool agent loop (search + calculator, or search + your own API)",
        "full_stack": "Wire agent output into your React UI as a chat-like interface",
        "dsa": "Dynamic Programming (Intro)",
        "checkpoint": "Working 2-tool agent, visible in the app"
      },
      {
        "week": 15,
        "ai_eng": "Multi-step agents, memory across turns",
        "full_stack": "Polish UI/UX for the agent chat interface",
        "dsa": "DP (1D Problems)",
        "checkpoint": "Agent that remembers prior turns in a session"
      },
      {
        "week": 16,
        "ai_eng": "Guardrails — stopping bad tool calls, input validation",
        "full_stack": "Loading states, error boundaries in React",
        "dsa": "DP (1D Problems, more reps)",
        "checkpoint": "Same agent, safer and more polished"
      }
    ]
  },
  {
    "phase": 5,
    "phase_title": "Phase 5 — Production & MCP",
    "weeks_range": "Weeks 17–20, Days 113–140",
    "goal": "MCP-aware agent, observability, deployment pipeline maturity.",
    "weeks": [
      {
        "week": 17,
        "ai_eng": "Model Context Protocol (MCP) fundamentals (LangChain Academy 'Quickstart')",
        "full_stack": "Performance — lazy loading, code splitting",
        "dsa": "DP (2D Intro)",
        "checkpoint": "Connect one MCP-style tool to your agent"
      },
      {
        "week": 18,
        "ai_eng": "Observability — logging/tracing LLM calls (LangSmith or custom logging)",
        "full_stack": "Backend logging & monitoring basics",
        "dsa": "DP (2D Reps)",
        "checkpoint": "Dashboard/log view of your agent's calls"
      },
      {
        "week": 19,
        "ai_eng": "Cost & latency optimization — caching, smaller models where possible",
        "full_stack": "CI/CD pipeline cleanup, staging vs prod",
        "dsa": "Greedy Algorithms",
        "checkpoint": "Optimize the agent's cost per query"
      },
      {
        "week": 20,
        "ai_eng": "Review — security basics for LLM apps (prompt injection awareness)",
        "full_stack": "Security basics — input sanitization, auth hardening",
        "dsa": "Mixed Review (Patterns so far)",
        "checkpoint": "Security pass on both apps"
      }
    ]
  },
  {
    "phase": 6,
    "phase_title": "Phase 6 — Capstone & Portfolio",
    "weeks_range": "Weeks 21–26, Days 141–180",
    "goal": "Flagship project fusing AI engineering + full stack, portfolio-ready, interview-ready DSA.",
    "weeks": [
      {
        "week": 21,
        "ai_eng": "Design capstone — RAG/agent feature integrated into AI Inventory app or INSA solution",
        "full_stack": "Architecture & Written Spec",
        "dsa": "NeetCode 150 / Blind 75 Review",
        "checkpoint": "Written spec: what it does, target users, architecture"
      },
      {
        "week": 22,
        "ai_eng": "Build core backend (FastAPI + RAG/agent logic)",
        "full_stack": "FastAPI Services & Handlers",
        "dsa": "Timed Mixed Sets",
        "checkpoint": "Backend functional end-to-end"
      },
      {
        "week": 23,
        "ai_eng": "AI Frontend Integration",
        "full_stack": "Build frontend (React UI & State)",
        "dsa": "Timed Mixed Sets",
        "checkpoint": "Full app usable locally"
      },
      {
        "week": 24,
        "ai_eng": "Deploy & Monitor AI Pipeline",
        "full_stack": "Deploy + add observability + polish UI",
        "dsa": "Mock Interviews",
        "checkpoint": "App live on the internet"
      },
      {
        "week": 25,
        "ai_eng": "System Hardening",
        "full_stack": "Final Polish & Performance Audit",
        "dsa": "DSA Focus Week — Mock Interviews & Timed Sets",
        "checkpoint": "Fill remaining gaps in pattern list"
      },
      {
        "week": 26,
        "ai_eng": "Portfolio Showcase Video / Writeup",
        "full_stack": "Portfolio pass — README, demo video/GIF, write-up",
        "dsa": "Final Interview Readiness Pass",
        "checkpoint": "Capstone published on GitHub, linked from profile"
      }
    ]
  }
]

@router.get("/")
def get_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_progress_records = db.query(UserRoadmapProgress).filter(
        UserRoadmapProgress.user_id == current_user.id
    ).all()
    completed_weeks = {p.week_number for p in user_progress_records if p.is_completed}

    total_weeks = 26
    completed_count = len(completed_weeks)
    percentage = round((completed_count / total_weeks) * 100, 1) if total_weeks > 0 else 0

    return {
        "phases": CURRICULUM_DATA,
        "completed_weeks": list(completed_weeks),
        "total_weeks": total_weeks,
        "completed_count": completed_count,
        "progress_percentage": percentage,
        "daily_schedule": [
          {"time": "~90 min", "track": "AI Engineering", "action": "Watch/follow resource, then build AI components"},
          {"time": "~60–75 min", "track": "Full Stack", "action": "Watch/follow resource, then build API & React features"},
          {"time": "~30–45 min", "track": "DSA / LeetCode", "action": "1 problem, timed (25–30 min), focusing on target pattern"}
        ]
    }

@router.get("/days")
def get_daily_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    days_curriculum = generate_180_days_curriculum()
    day_records = db.query(UserDayProgress).filter(
        UserDayProgress.user_id == current_user.id
    ).all()
    completed_days = {r.day_number for r in day_records if r.is_completed}

    total_days = 156 # 26 weeks x 6 study days
    completed_count = len(completed_days)
    percentage = round((completed_count / total_days) * 100, 1) if total_days > 0 else 0

    return {
        "days": days_curriculum,
        "completed_days": list(completed_days),
        "total_days": total_days,
        "completed_count": completed_count,
        "progress_percentage": percentage
    }

@router.post("/progress")
def toggle_roadmap_progress(
    payload: ToggleProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.week_number < 1 or payload.week_number > 26:
        raise HTTPException(status_code=400, detail="Invalid week number. Must be between 1 and 26.")

    record = db.query(UserRoadmapProgress).filter(
        UserRoadmapProgress.user_id == current_user.id,
        UserRoadmapProgress.week_number == payload.week_number
    ).first()

    if record:
        record.is_completed = payload.is_completed
    else:
        record = UserRoadmapProgress(
            user_id=current_user.id,
            week_number=payload.week_number,
            is_completed=payload.is_completed
        )
        db.add(record)

    db.commit()
    return {"status": "success", "week_number": payload.week_number, "is_completed": payload.is_completed}

@router.post("/day/progress")
def toggle_day_roadmap_progress(
    payload: ToggleDayProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.day_number < 1 or payload.day_number > 180:
        raise HTTPException(status_code=400, detail="Invalid day number. Must be between 1 and 180.")

    record = db.query(UserDayProgress).filter(
        UserDayProgress.user_id == current_user.id,
        UserDayProgress.day_number == payload.day_number
    ).first()

    if record:
        record.is_completed = payload.is_completed
    else:
        record = UserDayProgress(
            user_id=current_user.id,
            day_number=payload.day_number,
            is_completed=payload.is_completed
        )
        db.add(record)

    db.commit()
    return {"status": "success", "day_number": payload.day_number, "is_completed": payload.is_completed}
