from pydantic import BaseModel, Field
from typing import List, Optional

# --- EXISTING MODELS (unchanged) ---

class Project(BaseModel):
    name: str
    url: Optional[str]= None
    stars: int = 0
    description_raw: str ="" # What we get from GitHub API
    
    # --- The "Impact Quantifier" Features ---
    tech_stack: List[str] = []
    
    # Stores the raw "interview" notes from you (e.g. "Latency 50ms, 500 users")
    metrics_raw: Optional[str] = None
    
    # The final, AI-polished bullet points ready for the PDF
    refined_bullets: List[str] = []   
    
    # Extracted distinct metrics for quick stats (e.g. ["50%", "500+"])
    impact_metrics: List[str] = []   

    # CRITICAL: Logic flag for LangGraph to know if this project is "Done"
    is_refined: bool = False 

class WorkExperience(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str = "Present"
    raw_responsibilities: str
    
    # --- The "Impact Quantifier" Features ---
    metrics_raw: Optional[str] = None
    refined_bullets: List[str] = []
    
    # CRITICAL: Logic flag for LangGraph
    is_refined: bool = False

class SkillGap(BaseModel):
    missing_skill: str
    recommendation: str  # e.g. "Build a small project using Terraform"

class PipelineConfig(BaseModel):
    """
    Configuration for an 'AI Agent' pipeline that transforms the resume.
    """
    name: str # e.g. "SRE Agent", "Frontend Specialist"
    include_tags: List[str] = [] # Projects MUST have ONE of these tags (OR logic)
    exclude_tags: List[str] = [] # Projects MUST NOT have ANY of these tags
    section_order: List[str] = ["summary", "experience", "projects", "education", "skills"]
    template_id: str = "modern"


# --- NEW MODELS FOR PHASE 4 (Job Matching) ---

class JobDescription(BaseModel):
    """Stores the parsed Job Description data."""
    raw_text: str
    role_title: str
    company_name: str = "Unknown Company"
    required_skills: List[str] = [] 
    bonus_skills: List[str] = []

class GapAnalysis(BaseModel):
    """Stores the result of the AI comparison between Profile and JD."""
    match_score: int # 0-100
    missing_critical_skills: List[str] # e.g. ["Kubernetes", "React"]
    suggested_project_order: List[str] # Names of projects in order of relevance
    critique: str # A 2-sentence summary from the "Hiring Manager"


# --- UPDATED USER PROFILE ---

class UserProfile(BaseModel):
    full_name: str
    github_username: str
    email: str=""
    bio: str=""
    
    # The Database of your career
    projects: List[Project] = []
    experience: List[WorkExperience] = []
    skills: List[str] = []
    
    # --- The "Gap Analysis" Storage ---
    known_gaps: List[SkillGap] = []
    
    # PHASE 4 ADDITION: 
    # Store the specific analysis for the current target job
    job_match_analysis: Optional[GapAnalysis] = None