from typing import List, Dict, Any

def generate_180_days_curriculum() -> List[Dict[str, Any]]:
    days_data = []

    # Helper template data generator across 26 weeks x 6 days = 156 core study days
    # Sunday is review/integration day for each week.

    curriculum_specs = [
        # Phase 1: Weeks 1-4 (Days 1-24 + Sundays)
        {
            "week": 1, "phase": 1, "phase_title": "Phase 1 — Foundations",
            "dsa_pattern": "Arrays & Strings",
            "days": [
                {
                    "day": 1, "title": "API Fundamentals & First Request",
                    "ai_eng": "Watch freeCodeCamp 'APIs for Beginners' (0:00 - 30:00). Write a Python script using `requests` to fetch data from `https://api.github.com/users/octocat`.",
                    "full_stack": "Review JS Variables (`let`, `const`), Data Types, and ES6 Arrow Functions on freeCodeCamp JS. Write 3 ES6 utility functions.",
                    "dsa": "LeetCode #217 — Contains Duplicate (Easy)",
                    "checkpoint": "Set up project directory and run first Python HTTP request script."
                },
                {
                    "day": 2, "title": "HTTP Methods & JSON Parsing",
                    "ai_eng": "Watch freeCodeCamp 'APIs for Beginners' (30:00 - 1:00:00). Query Open-Meteo Weather API and extract temperature & humidity fields from response JSON.",
                    "full_stack": "Practice JS Array Methods (`map`, `filter`, `reduce`) on freeCodeCamp JS. Write functions to transform mock user data arrays.",
                    "dsa": "LeetCode #242 — Valid Anagram (Easy)",
                    "checkpoint": "Parse nested API JSON response into clean Python dictionary."
                },
                {
                    "day": 3, "title": "API Keys & Authorization Headers",
                    "ai_eng": "Learn API key authentication in headers vs query parameters. Request API key from OpenWeatherMap or CoinGecko and send authorized request.",
                    "full_stack": "Learn JS Async/Await & Promises (Traversy Media 'JS Async Crash Course'). Write an `async fetch()` function.",
                    "dsa": "LeetCode #1 — Two Sum (Easy)",
                    "checkpoint": "Securely store API key in `.env` file using `python-dotenv`."
                },
                {
                    "day": 4, "title": "Building a Formatting CLI Utility",
                    "ai_eng": "Watch 'Rich Library in Python' video by Coreyms. Build a Python CLI script formatting API output into styled tables.",
                    "full_stack": "Practice JS Error Handling with `try...catch` blocks in async fetch calls.",
                    "dsa": "LeetCode #125 — Valid Palindrome (Easy)",
                    "checkpoint": "Handle HTTP status codes (401, 404, 500) gracefully in your CLI tool."
                },
                {
                    "day": 5, "title": "CLI Tool Optimization & Modularization",
                    "ai_eng": "Refactor API fetcher script into a clean Python class with logging and custom error classes.",
                    "full_stack": "Build a basic HTML page fetching live crypto or weather data and displaying it dynamically.",
                    "dsa": "LeetCode #121 — Best Time to Buy and Sell Stock (Easy)",
                    "checkpoint": "Add `--format json` vs `--format table` command line flags."
                },
                {
                    "day": 6, "title": "Week 1 Checkpoint Finalization",
                    "ai_eng": "Finalize CLI tool script that calls a public API and prints formatted data reports.",
                    "full_stack": "Style CLI output and clean up documentation.",
                    "dsa": "Review & re-solve any failed LeetCode problems from Days 1-5.",
                    "checkpoint": "Push Week 1 CLI Project to GitHub and log submission in Devbloom!"
                }
            ]
        },
        {
            "week": 2, "phase": 1, "phase_title": "Phase 1 — Foundations",
            "dsa_pattern": "Two Pointers",
            "days": [
                {
                    "day": 7, "title": "First Anthropic / OpenAI LLM Call",
                    "ai_eng": "Watch Anthropic Official 'Getting Started with Claude API' video. Install `anthropic` / `openai` SDK and run your first completion call.",
                    "full_stack": "Watch Traversy Media 'JS DOM Crash Course' (Part 1). Practice `document.querySelector` and DOM manipulation.",
                    "dsa": "LeetCode #167 — Two Sum II (Medium)",
                    "checkpoint": "Execute basic Python script sending prompt to LLM and printing completion."
                },
                {
                    "day": 8, "title": "System Prompts & Temperature Parameters",
                    "ai_eng": "Experiment with system prompts, temperature (0.0 vs 0.9), and max_tokens parameters in Anthropic API calls.",
                    "full_stack": "Watch Traversy Media 'JS DOM Crash Course' (Part 2). Attach click and input event listeners to DOM elements.",
                    "dsa": "LeetCode #15 — 3Sum (Medium)",
                    "checkpoint": "Build Python script allowing user to select persona via system prompt."
                },
                {
                    "day": 9, "title": "Building a Terminal Q&A Loop",
                    "ai_eng": "Build interactive Python terminal CLI (`input()`) loop sending user questions to LLM and streaming responses.",
                    "full_stack": "Build interactive HTML/JS input form that updates a DOM list on button click.",
                    "dsa": "LeetCode #11 — Container With Most Water (Medium)",
                    "checkpoint": "Implement continuous CLI loop: type question, get streaming response, type 'exit' to quit."
                },
                {
                    "day": 10, "title": "Streaming LLM Responses",
                    "ai_eng": "Implement token streaming using Anthropic `client.messages.stream()` for real-time terminal output.",
                    "full_stack": "Learn `fetch()` POST requests with `headers` and `body: JSON.stringify()`.",
                    "dsa": "LeetCode #42 — Trapping Rain Water (Hard)",
                    "checkpoint": "Add real-time typewriter effect streaming to terminal CLI."
                },
                {
                    "day": 11, "title": "CLI Error Handling & Token Usage Tracking",
                    "ai_eng": "Add error handling for API timeouts/rate limits and track token usage (`input_tokens`, `output_tokens`).",
                    "full_stack": "Build mini JS app fetching search results from free public API and rendering list.",
                    "dsa": "LeetCode #344 — Reverse String (Easy)",
                    "checkpoint": "Print cost estimation and token counts after each LLM answer."
                },
                {
                    "day": 12, "title": "Week 2 Checkpoint Finalization",
                    "ai_eng": "Polish CLI tool: type question, get formatted LLM answer with token count.",
                    "full_stack": "Clean up CLI code structure and add `--help` documentation.",
                    "dsa": "Review & re-solve Two Pointer pattern problems.",
                    "checkpoint": "Push LLM CLI tool to GitHub and log submission in Devbloom!"
                }
            ]
        },
        {
            "week": 3, "phase": 1, "phase_title": "Phase 1 — Foundations",
            "dsa_pattern": "Hashmaps",
            "days": [
                {
                    "day": 13, "title": "Prompt Engineering Basics & Few-Shot",
                    "ai_eng": "Read Anthropic Prompt Engineering Guide (Few-Shot Prompting). Write prompts with 3 input-output examples.",
                    "full_stack": "Build a vanilla JS interactive To-Do List (add items, mark complete, delete items).",
                    "dsa": "LeetCode #49 — Group Anagrams (Medium)",
                    "checkpoint": "Prompt LLM to extract JSON entities from text using few-shot techniques."
                },
                {
                    "day": 14, "title": "Structured Output & JSON Mode",
                    "ai_eng": "Guide LLM to return strictly valid JSON objects using system instructions and schema specifications.",
                    "full_stack": "Add `localStorage` persistence to your vanilla JS To-Do List app.",
                    "dsa": "LeetCode #347 — Top K Frequent Elements (Medium)",
                    "checkpoint": "Parse LLM JSON output into Python Pydantic model with validation."
                },
                {
                    "day": 15, "title": "Chain-of-Thought Prompting",
                    "ai_eng": "Practice Chain-of-Thought ('Think step by step before answering') prompting for math/logic tasks.",
                    "full_stack": "Add category filtering (All, Active, Completed) to the vanilla JS To-Do List.",
                    "dsa": "LeetCode #238 — Product of Array Except Self (Medium)",
                    "checkpoint": "Compare accuracy of standard prompting vs Chain-of-Thought prompting."
                },
                {
                    "day": 16, "title": "Prompt Templates in Python",
                    "ai_eng": "Create reusable Python prompt template module using string formatting (`f-strings` / `jinja2`).",
                    "full_stack": "Add search input filter to vanilla JS list page.",
                    "dsa": "LeetCode #36 — Valid Sudoku (Medium)",
                    "checkpoint": "Build modular prompt library in `prompts.py`."
                },
                {
                    "day": 17, "title": "Vanilla JS App Polish & Styling",
                    "ai_eng": "Test system prompt guardrails against simple prompt injection attempts.",
                    "full_stack": "Apply modern CSS styling, glassmorphism, and responsive layout to your vanilla JS app.",
                    "dsa": "LeetCode #128 — Longest Consecutive Sequence (Medium)",
                    "checkpoint": "Polish vanilla JS To-Do list UI without any framework."
                },
                {
                    "day": 18, "title": "Week 3 Checkpoint Finalization",
                    "ai_eng": "Combine prompt templates and structured JSON output into one python utility script.",
                    "full_stack": "Finalize vanilla JS interactive application.",
                    "dsa": "Review & re-solve Hashmap pattern problems.",
                    "checkpoint": "Push vanilla JS app to GitHub and log submission in Devbloom!"
                }
            ]
        },
        {
            "week": 4, "phase": 1, "phase_title": "Phase 1 — Foundations",
            "dsa_pattern": "Sliding Window",
            "days": [
                {
                    "day": 19, "title": "Intro to Embeddings & Vector Space",
                    "ai_eng": "Watch DeepLearning.AI 'RAG Free Course' (Module 1). Generate embeddings for text strings using OpenAI/Sentence-Transformers.",
                    "full_stack": "Watch Scrimba 'Learn React' (Section 1: Components, JSX, Props). Build first React component.",
                    "dsa": "LeetCode #3 — Longest Substring Without Repeating Characters (Medium)",
                    "checkpoint": "Compute cosine similarity score between two embedding vectors in Python."
                },
                {
                    "day": 20, "title": "Embedding Similarity & Searching Text",
                    "ai_eng": "Embed a list of 10 sentences and query the dataset by embedding similarity using `numpy`.",
                    "full_stack": "Watch Scrimba 'Learn React' (Section 2: State & `useState`). Build interactive counter in React.",
                    "dsa": "LeetCode #424 — Longest Repeating Character Replacement (Medium)",
                    "checkpoint": "Return top-3 most relevant text chunks for a query using vector distance."
                },
                {
                    "day": 21, "title": "React Component Architecture",
                    "ai_eng": "Experiment with different embedding models (`text-embedding-3-small` vs `all-MiniLM-L6-v2`).",
                    "full_stack": "Rebuild To-Do List app structure in React (`TodoList`, `TodoItem`, `AddTodoForm`).",
                    "dsa": "LeetCode #567 — Permutation in String (Medium)",
                    "checkpoint": "Set up React component tree with props and state."
                },
                {
                    "day": 22, "title": "React Event Handling & Forms",
                    "ai_eng": "Understand why chunk size and overlap matter when embedding documents.",
                    "full_stack": "Implement form submission and controlled inputs in React To-Do List.",
                    "dsa": "LeetCode #76 — Minimum Window Substring (Hard)",
                    "checkpoint": "Add item creation and toggle completion logic in React."
                },
                {
                    "day": 23, "title": "React State Persistence",
                    "ai_eng": "Build Python script that takes a document, splits into sentences, embeds, and searches.",
                    "full_stack": "Persist React state using `localStorage` inside `useEffect` hook.",
                    "dsa": "LeetCode #239 — Sliding Window Maximum (Hard)",
                    "checkpoint": "Connect React To-Do list state to `localStorage`."
                },
                {
                    "day": 24, "title": "Week 4 Checkpoint Finalization",
                    "ai_eng": "Review Phase 1 AI Engineering achievements.",
                    "full_stack": "Polish React To-Do List styling and layout.",
                    "dsa": "Review & re-solve Sliding Window pattern problems.",
                    "checkpoint": "Push React To-Do List project to GitHub and log submission in Devbloom!"
                }
            ]
        }
    ]

    # Generate complete day-by-day mapping for all 26 weeks
    # For weeks 5 through 26, create structured daily breakdown automatically
    full_schedule = []
    
    # Add manually specified detailed days first
    for spec in curriculum_specs:
        for d in spec["days"]:
            full_schedule.append({
                "day": d["day"],
                "week": spec["week"],
                "phase": spec["phase"],
                "phase_title": spec["phase_title"],
                "title": d["title"],
                "ai_eng_task": d["ai_eng"],
                "full_stack_task": d["full_stack"],
                "dsa_task": d["dsa"],
                "checkpoint_step": d["checkpoint"]
            })

    # Auto-generate detailed days for Weeks 5 to 26 based on curriculum specs
    remaining_weeks = [
        # Phase 2: Weeks 5-8
        (5, 2, "Phase 2 — Core Skills", "Vector Databases (Chroma/FAISS)", "React Hooks (`useEffect`, `useState`)", "Stacks & Queues", "Store & query text snippets in Chroma"),
        (6, 2, "Phase 2 — Core Skills", "Chunking Strategies for Docs", "Connect React to FastAPI (CRUD Calls)", "Linked Lists", "Chunk a PDF, embed it, store it"),
        (7, 2, "Phase 2 — Core Skills", "End-to-End RAG Pipeline", "React Router (Multi-Page App)", "Binary Search", "'Ask questions about PDF' Web Page"),
        (8, 2, "Phase 2 — Core Skills", "RAG Evaluation & Relevance", "Basic Auth (JWT) in FastAPI + React", "Trees (Intro)", "Polish RAG project UI"),
        # Phase 3: Weeks 9-12
        (9, 3, "Phase 3 — Intermediate Build", "Function Calling & Tool Use", "Testing Basics (Pytest + React Component)", "Trees (Traversal)", "LLM calling a real Python function"),
        (10, 3, "Phase 3 — Intermediate Build", "Reranking & Hybrid Search", "Deployment (FastAPI + React to Render/Vercel)", "Trees (BFS / DFS)", "Deploy RAG app publicly"),
        (11, 3, "Phase 3 — Intermediate Build", "RAG + Tool Use Assistant", "Env Configs & CORS in Production", "Graphs (Intro)", "RAG assistant calling a function"),
        (12, 3, "Phase 3 — Intermediate Build", "Review & Hardening (Retries & Error Handling)", "CI Basics (GitHub Actions)", "Graphs (BFS / DFS Practice)", "Production-hardened RAG assistant"),
        # Phase 4: Weeks 13-16
        (13, 4, "Phase 4 — Agents & Scaling", "Agent Design Fundamentals", "State Management Patterns in React", "Graphs (Topological Sort)", "Agent tool list & loop specification"),
        (14, 4, "Phase 4 — Agents & Scaling", "Build 2-Tool Agent Loop", "Chat-like Interface in React UI", "Dynamic Programming (Intro)", "Working 2-tool agent in UI"),
        (15, 4, "Phase 4 — Agents & Scaling", "Multi-Step Agents & Session Memory", "Polish Chat UI / UX", "DP (1D Problems)", "Agent remembering prior session turns"),
        (16, 4, "Phase 4 — Agents & Scaling", "Guardrails & Input Validation", "Loading States & Error Boundaries", "DP (1D Problems Reps)", "Safe and polished agent"),
        # Phase 5: Weeks 17-20
        (17, 5, "Phase 5 — Production & MCP", "Model Context Protocol (MCP)", "Performance (Lazy Loading, Code Splitting)", "DP (2D Intro)", "Connect MCP tool to agent"),
        (18, 5, "Phase 5 — Production & MCP", "Observability & Tracing (LangSmith)", "Backend Logging & Monitoring", "DP (2D Reps)", "Agent observability log dashboard"),
        (19, 5, "Phase 5 — Production & MCP", "Cost & Latency Optimization", "CI/CD Pipeline Cleanup", "Greedy Algorithms", "Optimize cost & latency per query"),
        (20, 5, "Phase 5 — Production & MCP", "Security & Prompt Injection Prevention", "Security Basics & Input Sanitization", "Mixed Review", "Security audit pass on full app"),
        # Phase 6: Weeks 21-26
        (21, 6, "Phase 6 — Capstone & Portfolio", "Capstone Architecture Design", "Full Stack Spec Definition", "NeetCode 150 Review", "Written capstone specification"),
        (22, 6, "Phase 6 — Capstone & Portfolio", "Build FastAPI RAG/Agent Backend", "API Endpoints & Handlers", "Timed Mixed Sets", "Backend functional end-to-end"),
        (23, 6, "Phase 6 — Capstone & Portfolio", "Build React UI for Capstone", "React State & Component Integration", "Timed Mixed Sets", "Full app usable locally"),
        (24, 6, "Phase 6 — Capstone & Portfolio", "Deploy Capstone & Add Observability", "Production Deployment", "Mock Interviews", "Capstone live on internet"),
        (25, 6, "Phase 6 — Capstone & Portfolio", "System Hardening & Performance Audit", "UI Polish & Edge Case Testing", "DSA Focus Week — Mock Interviews", "Fill remaining pattern gaps"),
        (26, 6, "Phase 6 — Capstone & Portfolio", "Portfolio Pass & Video Demo", "README, Demo GIF, Writeup", "Final Interview Pass", "Capstone published on GitHub & LinkedIn")
    ]

    for w_num, phase_num, phase_title, ai_topic, fs_topic, dsa_topic, chkpt in remaining_weeks:
        start_day = (w_num - 1) * 6 + 1
        
        # Day 1 of week
        full_schedule.append({
            "day": start_day, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": f"{ai_topic} — Concepts & Setup",
            "ai_eng_task": f"Watch/read core resources on {ai_topic}. Set up development environment and initial test script.",
            "full_stack_task": f"Study {fs_topic}. Implement initial code setup in your project repository.",
            "dsa_task": f"Solve LeetCode problem on {dsa_topic} (Problem 1 of 5 for week).",
            "checkpoint_step": f"Initiate week {w_num} project setup: {chkpt}."
        })
        
        # Day 2 of week
        full_schedule.append({
            "day": start_day + 1, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": f"{ai_topic} — Deep Dive & Implementation",
            "ai_eng_task": f"Implement {ai_topic} core logic in Python. Test with sample inputs and log results.",
            "full_stack_task": f"Build component/API integration for {fs_topic}.",
            "dsa_task": f"Solve LeetCode problem on {dsa_topic} (Problem 2 of 5 for week).",
            "checkpoint_step": f"Implement core logic for checkpoint: {chkpt}."
        })

        # Day 3 of week
        full_schedule.append({
            "day": start_day + 2, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": f"{fs_topic} — Integration & Wireup",
            "ai_eng_task": f"Refactor {ai_topic} module into clean, reusable Python functions.",
            "full_stack_task": f"Wire backend API endpoints to frontend React UI for {fs_topic}.",
            "dsa_task": f"Solve LeetCode problem on {dsa_topic} (Problem 3 of 5 for week).",
            "checkpoint_step": f"Connect AI backend and React frontend for {chkpt}."
        })

        # Day 4 of week
        full_schedule.append({
            "day": start_day + 3, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": "Error Handling & Edge Cases",
            "ai_eng_task": "Add error handling, retries, and rate-limiting safeguards to AI module.",
            "full_stack_task": "Add user loading states, error boundaries, and notifications to React UI.",
            "dsa_task": f"Solve LeetCode problem on {dsa_topic} (Problem 4 of 5 for week).",
            "checkpoint_step": "Test error cases and invalid inputs for checkpoint."
        })

        # Day 5 of week
        full_schedule.append({
            "day": start_day + 4, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": "UI Polish & Optimization",
            "ai_eng_task": "Optimize latency and token usage for AI operations.",
            "full_stack_task": "Apply responsive glassmorphism styling and clean up UX interactions.",
            "dsa_task": f"Solve LeetCode problem on {dsa_topic} (Problem 5 of 5 for week).",
            "checkpoint_step": f"Polish UI and feature complete: {chkpt}."
        })

        # Day 6 of week
        full_schedule.append({
            "day": start_day + 5, "week": w_num, "phase": phase_num, "phase_title": phase_title,
            "title": f"Week {w_num} Checkpoint Finalization & GitHub Push",
            "ai_eng_task": f"Finalize week {w_num} AI Engineering components and verify test pass.",
            "full_stack_task": f"Finalize week {w_num} Full Stack code and verify build succeeds.",
            "dsa_task": f"Review & re-solve any failed LeetCode problems from Week {w_num}.",
            "checkpoint_step": f"Push Week {w_num} project repo to GitHub and submit link in Devbloom!"
        })

    return full_schedule
