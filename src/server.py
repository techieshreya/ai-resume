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
from typing import Dict, Any, Optional, List
import json
import logging

# --- IMPORTS ---
try:
    from src.tools import generate_resume_pdf
    from src.gap_analyzer import analyze_job_match
    from src.builder import build_typst_code
    from src.fetch_github import fetch_github_profile 
    from src.auth import router as auth_router
    # New Import
    from src.schemas import PipelineConfig
except ModuleNotFoundError:
    from tools import generate_resume_pdf
    from gap_analyzer import analyze_job_match
    from builder import build_typst_code
    from fetch_github import fetch_github_profile
    from auth import router as auth_router
    from schemas import PipelineConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# --- 4. INCLUDE AUTH ROUTER ---
app.include_router(auth_router)

# --- DATA MODELS ---
class ResumeRequest(BaseModel):
    username: str
    profile_data: Dict[str, Any]
    jd_text: Optional[str] = None
    # NEW: Optional Pipeline Config
    pipeline: Optional[PipelineConfig] = None

class RewriteRequest(BaseModel):
    text: str
    context: Optional[str] = "software engineering"

# --- HELPER: PIPELINE LOGIC ---
def apply_pipeline(profile: Dict[str, Any], config: PipelineConfig) -> Dict[str, Any]:
    """
    Applies the 'AI Agent' pipeline to transform the profile data.
    1. Filters projects based on tags.
    2. Filters experience (future).
    3. Reorders sections (future/typst-side).
    """
    logger.info(f"🤖 Applying Pipeline: {config.name}")
    modified_profile = profile.copy() # Shallow copy
    
    # 1. Filter Projects
    if config.include_tags or config.exclude_tags:
        original_projects = modified_profile.get("projects", [])
        filtered_projects = []
        
        for project in original_projects:
            tech_stack = [t.lower() for t in project.get("tech_stack", [])]
            name = project.get("name", "").lower()
            
            # COMBINED CHECK: Check tech_stack AND name for tags
            # (e.g. if tag is "react", match if "react" in tech_stack OR "react" in name)
            project_keywords = tech_stack + name.split()
            
            # EXCLUDE LOGIC: If ANY exclude tag is found, skip
            if any(tag.lower() in project_keywords for tag in config.exclude_tags):
                continue
            
            # INCLUDE LOGIC: If include_tags are present, MUST have at least one
            if config.include_tags:
                if not any(tag.lower() in project_keywords for tag in config.include_tags):
                    continue
            
            filtered_projects.append(project)
        
        modified_profile["projects"] = filtered_projects
        logger.info(f"   Projects filtered: {len(original_projects)} -> {len(filtered_projects)}")

    return modified_profile

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
    
    # Save Data (Raw)
    temp_path = os.path.join(project_root, "data", "github", f"{request.username}.json")
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(request.profile_data, f)

    # Apply Pipeline (if present)
    final_data = request.profile_data
    if request.pipeline:
        final_data = apply_pipeline(request.profile_data, request.pipeline)

    # Gap Analysis
    analysis = {}
    if request.jd_text and len(request.jd_text) > 10:
        try:
            # Note: Analyze against RAW data or FILTERED data? 
            # Probably RAW is better to see all potential, but let's stick to standard flow for now.
            # Ideally analysis informs the pipeline, but here pipeline is user-defined.
            analysis = analyze_job_match(temp_path, request.jd_text)
        except Exception as e:
            print(f"❌ Analyzer Error: {e}")
            analysis = {"match_score": 0, "critique": "Analysis failed.", "missing_critical_skills": []}
    
    # Build PDF
    # Pass final_data (filtered) instead of request.profile_data
    typst_code = build_typst_code(final_data, analysis)
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