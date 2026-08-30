# 🌸 Devbloom — Full-Stack Coding Bootcamp & Streak Tracker

<p align="center">
  <strong>Track your 180-day coding journey, maintain daily streaks, submit GitHub projects, and customize your aesthetic workspace.</strong>
</p>

<p align="center">
  <a href="https://bootcamp-r0i8.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/Render-Live_Demo-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  🚀 <strong>Live Deployment:</strong> <a href="https://bootcamp-r0i8.onrender.com" target="_blank">https://bootcamp-r0i8.onrender.com</a>
</p>

---

## ✨ Highlights & Features

- 🗺️ **180-Day Bootcamp Roadmap**: Daily structured curriculum covering AI Engineering (~90m), Full-Stack Web (~60m), and DSA LeetCode (~30m) across 6 comprehensive phases.
- 🔥 **Timezone-Aware Streak Engine**: Daily check-in logging, longest streak tracking, streak freeze protection, and interactive contribution heatmaps (90, 180, 365 days).
- 🎨 **10 Curated Aesthetic Themes**: Includes *Rose Gold & Champagne*, *Sakura Blossom*, *Cotton Candy Pastel*, *Lavender Mist*, *Midnight Velvet*, *Cyber Neon Tokyo*, *Amethyst Crystal*, *Matcha & Cherry*, *Sunset Boulevard*, and *Nordic Minimalist Rose*.
- 🌓 **3 Shade Modes**: Toggle seamlessly between **Dark**, **Medium**, and **Light** shades across every color aesthetic with ultra-readable typography and crisp borders.
- 📦 **GitHub Project Submissions**: Submit, filter, and review repository links for each milestone day with live URL validation.
- 🏆 **Milestone Badges & Data Export**: Earn progressive streak badges and export your full history in CSV or JSON.
- 🔐 **JWT Authentication & Profile Sharing**: Secure token-based auth with shareable public developer cards (`/u/:username`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib (Bcrypt), Pytest |
| **Frontend** | React 19, TypeScript, Vite, Vanilla CSS Design System, Lucide Icons, Canvas Confetti |
| **Database** | SQLite (zero-config local dev) or PostgreSQL via `DATABASE_URL` |

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/devbloom.git
cd devbloom
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
> 📚 **API Docs**: Interactive Swagger UI available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
> 🌐 **App URL**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Run backend tests for auth, streak validation, and timezone handling:
```bash
cd backend
pytest
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints (auth, streaks, roadmap, submissions, export)
│   │   ├── core/         # Security, database session, streak calculations & curriculum
│   │   ├── models/       # SQLAlchemy models (User, Checkin, Submission, RoadmapProgress)
│   │   └── main.py       # FastAPI app entrypoint & CORS config
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, StreakHeatmap, ThemeSelectorModal, MilestoneBadges
│   │   ├── context/      # ThemeContext (3-way shades & themes) & AuthContext
│   │   ├── pages/        # Dashboard, 180-Day Roadmap, History, Settings, Public Profile
│   │   └── theme/        # 10 aesthetic themes & dynamic CSS engine
│   └── package.json
└── README.md
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
