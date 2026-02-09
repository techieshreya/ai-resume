import sys
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the Brain
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# --- 1. PATH FIX ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
if project_root not in sys.path:
    sys.path.append(project_root)

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json

# --- IMPORTS ---
try:
    from src.tools import generate_resume_pdf
    from src.gap_analyzer import analyze_job_match
    from src.builder import build_typst_code
    # The Critical Import for Auto-Fetching
    from src.fetch_github import fetch_github_profile 
except ModuleNotFoundError:
    from tools import generate_resume_pdf
    from gap_analyzer import analyze_job_match
    from builder import build_typst_code
    from fetch_github import fetch_github_profile

app = FastAPI(title="AI Resume Backend")

# --- 2. CORS FIX ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. MOUNT OUTPUT FOLDER ---
output_dir = os.path.join(project_root, "output")
os.makedirs(output_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=output_dir), name="static")

# --- DATA MODELS ---
class ResumeRequest(BaseModel):
    username: str
    profile_data: Dict[str, Any]
    jd_text: Optional[str] = None

class RewriteRequest(BaseModel):
    text: str
    context: Optional[str] = "software engineering"

# --- ENDPOINTS ---
@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Resume Agent is online"}

@app.get("/profile/{username}")
def get_profile(username: str):
    """
    Auto-Fetch Logic:
    1. Look for local file.
    2. If missing, FETCH from GitHub API immediately.
    3. Save and return.
    """
    file_path = os.path.join(project_root, "data", "github", f"{username}.json")
    
    # 1. Check Local Cache
    if os.path.exists(file_path):
        print(f"📂 Loading cached profile for {username}")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Cache corrupted, re-fetching: {e}")

    # 2. Fetch from GitHub (This is the magic part)
    print(f"🌍 User {username} not found locally. Fetching from GitHub...")
    try:
        # Fetch Data
        profile_data = fetch_github_profile(username)
        
        # Convert to Dictionary (Handle Pydantic v1/v2)
        if hasattr(profile_data, "model_dump"):
            data_dict = profile_data.model_dump()
        else:
            data_dict = profile_data.dict()

        # 3. Save to Disk (So next time it's instant)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data_dict, f, indent=4)
            
        print(f"✅ Successfully fetched and saved {username}")
        return data_dict

    except Exception as e:
        print(f"❌ GitHub Fetch Failed: {e}")
        # Return 404 only if BOTH fail
        raise HTTPException(status_code=404, detail=f"User {username} not found on GitHub")

@app.post("/rewrite")
def rewrite_text(request: RewriteRequest):
    print(f"✨ Rewriting text...")
    prompt = f"Rewrite these resume notes into professional XYZ bullets: '{request.text}'"
    try:
        response = llm.invoke(prompt)
        return {"refined_text": response.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
def generate_resume(request: ResumeRequest):
    print(f"⚡ Generating resume for @{request.username}")
    
    # Save Data
    temp_path = os.path.join(project_root, "data", "github", f"{request.username}.json")
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(request.profile_data, f)

    # Gap Analysis
    analysis = {}
    if request.jd_text and len(request.jd_text) > 10:
        try:
            analysis = analyze_job_match(temp_path, request.jd_text)
        except Exception as e:
            print(f"❌ Analyzer Error: {e}")
            analysis = {"match_score": 0, "critique": "Analysis failed.", "missing_critical_skills": []}
    
    # Build PDF
    typst_code = build_typst_code(request.profile_data, analysis)
    result = generate_resume_pdf.invoke({"typst_code": typst_code})
    
    return {
        "status": "success",
        "pdf_path": result,
        "analysis": analysis,
        "typst_code": typst_code 
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)