# DataSciOS · Autonomous Data Scientist Platform

> Upload datasets → Auto EDA → Train ML models → Chat with data → Generate reports

A production-grade AI SaaS platform built in 8 days.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 · TypeScript · TailwindCSS · Recharts |
| Backend | FastAPI · Python 3.12 · pandas |
| Design | Dark theme · Glassmorphism · Syne + DM Mono fonts |
| Later | scikit-learn · XGBoost · OpenAI · LangGraph |

---

## Project Structure

```
datascios/
├── frontend/           # Next.js App Router
│   ├── app/
│   │   └── (app)/      # Dashboard route group
│   │       ├── page.tsx          # Main dashboard
│   │       ├── upload/page.tsx   # File upload
│   │       ├── eda/              # Day 2
│   │       ├── models/           # Day 3
│   │       ├── chat/             # Day 5
│   │       └── reports/          # Day 6
│   ├── components/
│   │   ├── dashboard/  # StatCard, RecentActivity
│   │   ├── upload/     # UploadZone (drag & drop)
│   │   ├── charts/     # Recharts wrappers
│   │   └── sidebar/    # Sidebar, Navbar
│   ├── lib/            # utils (cn, formatBytes)
│   └── services/       # api.ts — HTTP client
│
└── backend/            # FastAPI
    ├── main.py         # App entry + CORS
    ├── routes/
    │   └── upload.py   # POST /upload, GET /uploads
    ├── services/       # Business logic (Day 2+)
    ├── models/         # Pydantic schemas (Day 2+)
    ├── utils/          # Helpers
    └── uploads/        # Stored dataset files
```

---

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/docs (Swagger UI)
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 8-Day MVP Roadmap

| Day | Focus |
|-----|-------|
| **1** ✅ | Setup · Dashboard UI · Upload endpoint · Frontend-backend connection |
| 2 | EDA — pandas profiling, auto charts, statistics |
| 3 | ML model training — scikit-learn, XGBoost |
| 4 | Model comparison UI, feature importance |
| 5 | Chat with data — LangChain + OpenAI |
| 6 | AI insights + report generation |
| 7 | Polish, auth skeleton, deployment |
| 8 | Final testing, docs, portfolio packaging |

---

## API Endpoints (Day 1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload CSV/XLSX dataset |
| GET | `/uploads` | List uploaded files |

---

## Design Philosophy

- **Dark-first**: Deep void background (#050507) with layered surfaces
- **Glassmorphism**: backdrop-blur cards with subtle borders
- **Typography**: Syne (display) + DM Mono (data/code)
- **Accent system**: Cyan (data) · Violet (AI) · Emerald (success) · Amber (models) · Rose (alerts)
- **Inspiration**: Vercel · Linear · Supabase


in progress