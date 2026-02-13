# 🚀 Resume.ai — AI-Powered Resume Builder

> A full-stack AI resume builder with an **Overleaf-style editor**, **Resume Agents** (automated pipelines), **Job Matching**, and real-time PDF compilation — powered by Gemini, FastAPI, and Next.js.

![Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Stack](https://img.shields.io/badge/Stack-Next.js_16_|_FastAPI_|_Gemini_2.5_|_Typst-blue)
![Auth](https://img.shields.io/badge/Auth-JWT_%2B_SQLite-orange)

---

## ✨ Features

### 📝 Overleaf-Style Builder
- **Full-width editor** with a toggleable **PDF Preview** panel (split-view on demand).
- **Real-time compilation** using **Typst** — a modern LaTeX alternative for lightning-fast PDF rendering.
- **Monaco Editor** for direct code editing of the Typst source.
- **Dark mode** across the entire app (homepage, builder, auth pages).

### 🤖 Resume Agents (Pipelines)
- **Automated workflows** that filter and tailor your resume for specific job roles.
- **Tag-based filtering** — define which project tags to include/exclude (e.g., include `python, docker`, exclude `css, react`).
- **One-click execution** — select an agent and instantly generate a role-specific PDF.
- **Saved configurations** — create, save, and reuse agents for different roles (SRE, Frontend, Backend, etc.).

### ✨ AI "Magic Button"
- Type rough notes like *"built a react app"* and click the **Magic Wand**.
- **Gemini** transforms your notes into metric-driven, XYZ-format bullet points.

### 🎯 Job Matcher (ATS Analyzer)
- Paste a **Job Description** to get a **0–100% match score**.
- **Missing skills detection** — highlights critical keywords absent from your profile.

### 🔐 Authentication
- **JWT-based auth** with Sign Up / Sign In (unified split-screen UI).
- **Protected routes** — `/builder` requires login; unauthenticated users are redirected.
- **SQLite** user storage with `pbkdf2_sha256` password hashing.

### 🌐 Landing Page
- Premium landing page with Hero, Features, How It Works, Stats, Testimonials, Pricing, FAQ, and Footer sections.
- Fully responsive with dark mode support.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (React 19), TypeScript, Tailwind CSS 4 |
| **Editor** | Monaco Editor (VS Code-style) |
| **Icons** | Google Material Symbols Outlined |
| **Backend** | FastAPI (Python 3.11+) |
| **AI Engine** | Google Gemini 2.5 Flash (`langchain-google-genai`, `langgraph`) |
| **PDF Engine** | Typst (Python `typst` library) |
| **Auth** | JWT (`python-jose`), `passlib` (pbkdf2_sha256), SQLite |
| **Package Managers** | `bun` (frontend), `uv` (backend) |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ & [**Bun**](https://bun.sh/) (frontend)
- **Python** 3.11+ & [**uv**](https://docs.astral.sh/uv/) (backend)
- **Google Gemini API Key** — get one at [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/techieshreya/ai-resume.git
cd ai-resume
```

### 2. Backend Setup

```bash
# Install Python dependencies
uv sync

# Set your API key (create a .env file or export)
echo GOOGLE_API_KEY="your-key-here" > .env

# Start the backend server
uv run src/server.py
```

The backend runs at **https://ai-resume-production-564b.up.railway.app**.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Start the dev server
bun run dev
```

The frontend runs at **http://localhost:3000**.

### 4. Use the App

1. Open **http://localhost:3000** → you'll see the landing page.
2. Click **Get Started** → Sign up for an account.
3. You'll be redirected to the **Builder**.
4. Enter a GitHub username and click **Generate Profile**.
5. Toggle **PDF Preview** in the header to see real-time results.
6. Try the **Agents** tab to create automated resume pipelines.

---

## 📁 Project Structure

```
├── src/                    # Backend (FastAPI)
│   ├── server.py           # Main API server + /generate endpoint
│   ├── schemas.py          # Pydantic models (Profile, PipelineConfig, etc.)
│   ├── auth.py             # JWT auth endpoints (/auth/register, /auth/login)
│   ├── agent.py            # LangGraph AI agent
│   ├── builder.py          # Resume compilation logic
│   ├── gap_analyzer.py     # Job description analysis
│   └── fetch_github.py     # GitHub profile fetcher
│
├── frontend/               # Frontend (Next.js 16)
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout + fonts + dark mode script
│   │   ├── globals.css     # Design system (Tailwind v4 + dark variant)
│   │   └── builder/
│   │       └── page.tsx    # Overleaf-style builder (main app)
│   ├── components/
│   │   ├── WorkflowsTab.tsx   # Resume Agents UI
│   │   ├── ResumeForm.tsx     # Visual resume editor form
│   │   ├── AuthScreen.tsx     # Login / Signup UI
│   │   ├── Navbar.tsx         # Site navigation + theme toggle
│   │   ├── ThemeProvider.tsx   # Dark mode context
│   │   └── landing/           # Landing page sections
│   └── package.json
│
├── templates/              # Typst resume templates
├── data/                   # SQLite DB + generated files
├── pyproject.toml          # Python dependencies
└── Dockerfile              # Container build
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Your Google Gemini API key (required) |

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your-key-here
```

---

## 📄 License

MIT
