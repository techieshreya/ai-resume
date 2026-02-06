# 🚀 AI Resume Agent

> A full-stack AI-powered resume builder that writes professional content, compiles real-time PDFs, and analyzes your resume against Job Descriptions to help you beat the ATS.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Stack](https://img.shields.io/badge/Stack-Next.js_FastAPI_Gemini-blue)

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
* **Framework:** Next.js 14 (React)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Editor:** Monaco Editor (VS Code style text editing)

### **Backend**
* **Server:** FastAPI (Python)
* **AI Engine:** Google Gemini Pro (`langchain-google-genai`)
* **PDF Engine:** Typst (Local Compiler)
* **Package Manager:** uv

---

## ⚡ Quick Start

### Prerequisites
1.  **Node.js** (v18+)
2.  **Python** (v3.10+)
3.  **Google Gemini API Key** (Get one [here](https://aistudio.google.com/))
4.  **Typst** (Install via `pip` or system package manager)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/ai-resume-agent.git](https://github.com/yourusername/ai-resume-agent.git)
cd ai-resume-agent
