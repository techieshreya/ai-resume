import sys
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the Brain (Using Flash for speed)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

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

try:
    from src.tools import generate_resume_pdf
    # Import the robust analyzer
    from src.gap_analyzer import analyze_job_match
    from src.builder import build_typst_code
except ModuleNotFoundError:
    from tools import generate_resume_pdf
    from gap_analyzer import analyze_job_match
    from builder import build_typst_code

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

@app.post("/rewrite")
def rewrite_text(request: RewriteRequest):
    """
    Takes rough notes -> Returns professional bullet points.
    """
    print(f"✨ Rewriting text: {request.text[:20]}...")
    prompt = f"""
    You are an expert Resume Writer. Rewrite these notes into 2-3 professional XYZ-format bullet points.
    Rough Notes: "{request.text}"
    Return ONLY bullet points.
    """
    try:
        response = llm.invoke(prompt)
        return {"refined_text": response.content.strip()}
    except Exception as e:
        print(f"❌ AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
def generate_resume(request: ResumeRequest):
    print(f"⚡ Received generation request for @{request.username}")
    
    # 1. Save Profile Data (Required for gap_analyzer to read)
    temp_path = os.path.join(project_root, "data", "github", f"{request.username}.json")
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    
    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(request.profile_data, f)
    except Exception as e:
        print(f"❌ Error saving profile JSON: {e}")

    # 2. Run Gap Analysis (Safety Block)
    analysis = {}
    if request.jd_text and len(request.jd_text) > 10:
        print("🕵️ Running Analysis...")
        try:
            # Calls your robust gap_analyzer.py
            analysis = analyze_job_match(temp_path, request.jd_text)
        except Exception as e:
            print(f"❌ Analyzer Error: {e}")
            # Fallback so the app doesn't crash
            analysis = {
                "match_score": 0, 
                "critique": "AI Analysis unavailable at the moment.", 
                "missing_critical_skills": []
            }
    
    # 3. Build Typst Code
    print("🔨 Building Typst Code...")
    typst_code = build_typst_code(request.profile_data, analysis)
    
    # 4. Compile PDF
    print("🚀 Compiling PDF...")
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