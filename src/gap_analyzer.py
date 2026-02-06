import json
import os
import sys
import re
import ast
from typing import Dict, Any
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# --- 1. PATH SETUP (Crucial for Imports) ---
# Finds the root folder "Resume-Builder"
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.append(project_root)

# --- 2. LOAD ENV VARS ---
env_path = os.path.join(project_root, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

if not os.getenv("GOOGLE_API_KEY"):
    print("❌ Error: GOOGLE_API_KEY not found in .env file.")
    sys.exit(1)

# Import schemas (Robust Logic)
try:
    from src.schemas import UserProfile, GapAnalysis
except ModuleNotFoundError:
    try:
        from schemas import UserProfile, GapAnalysis
    except ModuleNotFoundError:
        print("❌ Critical Error: Could not find 'schemas.py'.")
        print(f"   Searched in: {project_root} and {current_dir}")
        sys.exit(1)

# --- 3. CONFIGURE LLM ---
# Using 'gemini-1.5-pro' for high-quality reasoning
llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")

def extract_json_from_text(text: str) -> str:
    """
    Isolates the JSON object from the AI's response text.
    """
    # 1. Regex for Markdown blocks: ```json ... ```
    pattern = r"```(?:json)?\s*(\{.*?\})\s*```"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1)

    # 2. Manual Bracket Hunt (Outermost {})
    start_index = text.find('{')
    end_index = text.rfind('}')
    
    if start_index != -1 and end_index != -1:
        return text[start_index : end_index + 1]
    
    return text

def analyze_job_match(profile_path: str, jd_text: str) -> Dict[str, Any]:
    
    # --- LOAD PROFILE ---
    if not os.path.exists(profile_path):
        raise FileNotFoundError(f"Profile not found at {profile_path}")
        
    try:
        with open(profile_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            # Validate input data against schema
            profile = UserProfile(**raw_data)
    except Exception as e:
        print(f"❌ Error loading profile JSON: {e}")
        return {}

    # Create simplified summary for AI to read
    project_summaries = [
        f"Project: {p.name} | Tech: {p.tech_stack} | Desc: {p.description_raw}"
        for p in profile.projects
    ]
    
    print(f"\n🤔 AI is analyzing the Job Description vs. {profile.full_name}'s Profile...")

    # --- THE PROMPT ---
    prompt = f"""
    Act as a strict Technical Hiring Manager at a FAANG company.
    
    JOB DESCRIPTION:
    {jd_text[:4000]}... (truncated)
    
    CANDIDATE PROJECTS:
    {json.dumps(project_summaries, indent=2)}
    
    TASK:
    1. Extract Job Title/Company.
    2. Compare projects to requirements.
    3. Calculate Match Score (0-100).
    4. List CRITICAL missing skills.
    5. Re-order projects by relevance.
    
    CRITICAL INSTRUCTION: 
    - Output VALID JSON only. 
    - Use DOUBLE QUOTES for keys and values (e.g. "key": "value").
    - Do not use single quotes.
    
    JSON TEMPLATE:
    {{
        "match_score": 75,
        "missing_critical_skills": ["AWS", "Docker"],
        "suggested_project_order": ["Project B", "Project A"],
        "critique": "Candidate lacks Cloud experience."
    }}
    """
    
    try:
        response = llm.invoke(prompt)
        
        # --- ROBUST PARSING LOGIC ---
        
        # 1. Handle Response Types (String vs List)
        full_text = ""
        if isinstance(response.content, str):
            full_text = response.content
        elif isinstance(response.content, list):
            # Flatten list content
            parts = [str(p) if not isinstance(p, str) else p for p in response.content]
            full_text = "".join(parts)
        else:
            full_text = str(response.content)

        # 2. Extract JSON string
        clean_json = extract_json_from_text(full_text)
        
        # 3. Parse (Try Strict, Failover to Permissive)
        try:
            analysis_result = json.loads(clean_json)
        except json.JSONDecodeError:
            # Fallback: Python Eval handles single quotes ('key': 'val')
            try:
                analysis_result = ast.literal_eval(clean_json)
            except Exception:
                print(f"❌ JSON Parsing Failed completely. Raw Output:\n{clean_json}")
                return {}
        
        # 4. Final Validation
        validated_gap = GapAnalysis(**analysis_result)
        return validated_gap.model_dump()
        
    except Exception as e:
        print(f"❌ Analysis process failed: {e}")
        return {}

# --- CLI TEST RUNNER ---
if __name__ == "__main__":
    username = input("Enter GitHub username: ").strip()
    if not username:
        print("❌ Username is required")
        sys.exit(1)

    profile_path = os.path.join(project_root, "data", "github", f"{username}.json")
    
    print("\nPaste the Job Description below (Press Ctrl+D or Ctrl+Z on new line to finish):")
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass
    
    jd_text = "\n".join(lines)
    
    if not jd_text.strip():
        print("❌ No JD provided.")
        sys.exit(1)
        
    result = analyze_job_match(profile_path, jd_text)
    
    if result:
        print("\n" + "="*50)
        print(f"📊 MATCH SCORE: {result.get('match_score')}/100")
        print(f"👮 CRITIQUE: {result.get('critique')}")
        print(f"🚫 MISSING: {result.get('missing_critical_skills')}")
        print(f"📋 ORDER: {result.get('suggested_project_order')}")
        print("="*50)