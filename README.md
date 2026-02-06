# 🚀 AI Resume Agent

> A full-stack AI-powered resume builder that writes professional content, compiles real-time PDFs, and analyzes your resume against Job Descriptions to help you beat the ATS.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Stack](https://img.shields.io/badge/Stack-Next.js_16_FastAPI_Gemini_2.5_Typst-blue)

## 🌟 Features

### 1. 📝 Visual Resume Editor
- **Split-Screen UI:** Edit your details on the left, see the PDF update instantly on the right.
- **Real-Time Compilation:** Uses **Typst** (a modern LaTeX alternative) for lightning-fast, pixel-perfect PDF rendering.
- **Local & Private:** No data leaves your machine except for AI processing.

### 2. ✨ AI "Magic Button"
- **Lazy to Professional:** Type rough notes like *"built a react app"* and click the **Magic Wand**.
- **Gemini Powered:** The agent transforms your notes into metric-driven, XYZ-format bullet points (e.g., *"Architected a scalable React application, improving user engagement by 40%..."*).

### 3. 🎯 Job Matcher (ATS Analyzer)
- **Gap Analysis:** Paste a Job Description (JD) to see how well your resume matches.
- **Match Score:** Get a 0-100% compatibility score based on semantic analysis.
- **Missing Skills Detection:** The AI highlights critical keywords (e.g., *Kubernetes, AWS*) missing from your profile.

---

## 🏗️ Tech Stack

### **Frontend**
* **Framework:** Next.js 16 (React 19)
* **Styling:** Tailwind CSS 4
* **Icons:** Lucide React
* **Editor:** Monaco Editor (VS Code style text editing)
* **Language:** TypeScript

### **Backend**
* **Server:** FastAPI (Python)
* **AI Engine:** Google Gemini 2.5 Flash/Pro (`langchain-google-genai`, `langgraph`)
* **PDF Engine:** Typst (Python `typst` library)
* **Package Manager:** uv

---

## ⚡ Quick Start

### Prerequisites
1.  **Node.js** (v18+)
2.  **Python** (v3.11+)
3.  **Google Gemini API Key** (Set `GOOGLE_API_KEY`, get one [here](https://aistudio.google.com/))
4.  **uv** (recommended for dependency installs)
5.  **Typst** (installed via the Python `typst` package)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-resume-agent.git
cd ai-resume-agent
```

### 2. Backend Setup (FastAPI + Gemini)
```bash
uv sync
export GOOGLE_API_KEY="your-key-here"
uv run uvicorn src.server:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend expects the backend at `http://localhost:8000`.
