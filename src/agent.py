import os
import json
import sys
import re
from typing import TypedDict, List, Optional
from dotenv import load_dotenv

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from src.tools import generate_resume_pdf, save_refined_profile
    from src.gap_analyzer import analyze_job_match
except ModuleNotFoundError:
    from tools import generate_resume_pdf, save_refined_profile
    from gap_analyzer import analyze_job_match

load_dotenv()

# --- CONFIG ---
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash") # Updated to Flash for speed, or keep 1.5 Pro

# --- HELPER: SANITIZER ---
def clean_typst_code(code: str) -> str:
    """
    Aggressively cleans common LLM hallucinations in Typst code.
    """
    # 1. Remove Markdown code blocks
    code = code.replace("```typst", "").replace("```", "").strip()
    
    # 2. Fix Python Booleans (True/False -> true/false)
    code = code.replace(": True", ": true").replace(": False", ": false")
    
    # 3. Fix Python 'None' -> Typst 'none'
    code = code.replace(": None", ": none").replace("== None", "== none")
    
    # 4. Fix String Methods (.upper() -> upper())
    # Regex finds 'something.upper()' and turns it into 'upper(something)'
    code = re.sub(r'(\w+)\.upper\(\)', r'upper(\1)', code)
    
    # 5. Fix illegal '#' inside code blocks (The most common crash)
    # Replaces "[#text" with "[text", "[#align" with "[align", etc.
    code = code.replace("[#", "[")
    
    return code

# --- STATE ---
class AgentState(TypedDict):
    username: str
    profile_data: dict
    current_project_index: int
    user_input: str
    processed_projects: List[str]
    jd_text: Optional[str]
    analysis_result: dict
    next_step: str

# --- NODES ---
def load_profile_node(state: AgentState):
    if state.get("profile_data"): return {} 
    
    username = state.get("username")
    path = f"data/github/{username}.json"
    
    if not os.path.exists(path):
        raise FileNotFoundError(f"Could not find profile at: {path}")
        
    with open(path, "r") as f: data = json.load(f)
    print(f"\n[SYSTEM]  Loaded profile for: {data.get('full_name')} (@{username})")
    
    new_state = {
        "profile_data": data,
        "current_project_index": 0,
        "processed_projects": []
    }
    
    if not state.get("jd_text"):
        new_state["next_step"] = "ask_jd"
    
    return new_state

def refinement_check_node(state: AgentState):
    profile = state["profile_data"]
    idx = state.get("current_project_index", 0)
    projects = profile.get("projects", [])
    processed = state.get("processed_projects", [])
    
    if idx >= len(projects):
        return {"next_step": "analyze_gap"}
    
    current_project = projects[idx]
    
    # Skip logic
    if current_project.get("is_refined", False) or current_project.get("name") in processed:
        return {"next_step": "skip", "current_project_index": idx + 1}
        
    print(f"\n AI INTERVIEW: {current_project.get('name')}")
    print(f"Desc: {current_project.get('description_raw', '')}")
    return {"next_step": "ask_user"}

def update_profile_node(state: AgentState):
    profile = state["profile_data"]
    idx = state["current_project_index"]
    user_metrics = state["user_input"]
    project = profile["projects"][idx]
    processed = state.get("processed_projects", [])
    
    if user_metrics.lower() in ["skip", "no", "next"]:
        print(f"  Skipping refinement.")
        project["is_refined"] = True
        project["refined_bullets"] = [project.get("description_raw", "")]
        processed.append(project.get("name"))
    else:
        print("  Rewriting bullets...")
        prompt = f"Project: {project['name']}\nMetrics: {user_metrics}\nWrite 2 bullet points (XYZ format). JSON list only."
        try:
            res = llm.invoke(prompt)
            new_bullets = json.loads(res.content.replace("```json","").replace("```","").strip())
            project["refined_bullets"] = new_bullets
        except:
            project["refined_bullets"] = [project.get("description_raw")]
        
        project["is_refined"] = True
        processed.append(project.get("name"))
        print(" Saved.")

    save_refined_profile.invoke({"profile_data": profile, "filename": f"github/{state['username']}.json"})
    return {"profile_data": profile, "current_project_index": idx + 1, "processed_projects": processed, "user_input": ""}

def analysis_node(state: AgentState):
    print("\n Running Gap Analysis...")
    jd = state.get("jd_text", "")
    username = state["username"]
    
    if not jd or len(jd) < 5:
        print("  No JD found. Skipping analysis.")
        return {"next_step": "generate", "analysis_result": {}}
        
    result = analyze_job_match(f"data/github/{username}.json", jd)
    if result:
        print(f" Match Score: {result.get('match_score')}/100")
        print(f" Suggestion: {result.get('critique')}")
    return {"analysis_result": result, "next_step": "generate"}

def generation_node(state: AgentState):
    print("\n Generating Resume PDF (Safe Mode)...")
    profile = state["profile_data"]
    analysis = state.get("analysis_result", {})
    
    # --- 1. SETUP STATIC TYPST HEADER (Error-Free) ---
    typst_code = f"""
    #set page(
      paper: "us-letter",
      margin: (x: 1.5cm, y: 1.5cm),
    )
    #set text(font: "Linux Libertine", size: 11pt)
    
    // Define the Project Item function once
    #let project_item(name, tech, bullets) = {{
      block(below: 1em)[
        #grid(
          columns: (1fr, auto),
          [*#name*],
          text(style: "italic")[#tech]
        )
        #for b in bullets [ - #b \ ]
      ]
    }}
    
    // --- HEADER ---
    #align(center)[
      #text(size: 17pt, weight: "bold")[{profile.get('full_name', 'Your Name')}] \
      #link("https://github.com/{profile.get('github_username', '')}")[github.com/{profile.get('github_username', '')}] | {profile.get('email', '')}
      #line(length: 100%, stroke: 1pt + gray)
    ]
    
    // --- SUMMARY ---
    == Summary
    {profile.get('bio', 'Experienced Software Engineer...')}
    """
    
    # --- 2. GENERATE EXPERIENCE SECTION ---
    if profile.get('experience'):
        typst_code += "\n== Experience\n"
        for exp in profile.get('experience', []):
            # Escape strings to prevent crashes
            role = exp.get('role', 'Role').replace('"', '\\"')
            company = exp.get('company', 'Company').replace('"', '\\"')
            desc = exp.get('raw_responsibilities', '').replace('"', '\\"')
            
            typst_code += f"""
            #block(below: 1em)[
              #grid(
                columns: (1fr, auto),
                [* {company} *],
                [{exp.get('start_date')} - {exp.get('end_date')}]
              )
              _{role}_ \
              {desc}
            ]
            """

    # --- 3. GENERATE PROJECTS SECTION (Tailored via Python) ---
    typst_code += "\n== Projects\n"
    
    # Sort projects based on AI Analysis
    projects = profile.get('projects', [])
    suggested_order = analysis.get("suggested_project_order", [])
    
    # Create a map for easy lookup
    project_map = {p['name']: p for p in projects}
    ordered_projects = []
    
    # 3a. Add AI-suggested projects first
    for name in suggested_order:
        # Fuzzy match to find the project
        for p_name, p_data in project_map.items():
            if name.lower() in p_name.lower():
                ordered_projects.append(p_data)
                # Remove from map so we don't add it twice
                if p_name in project_map: del project_map[p_name]
                break
            
    # 3b. Add remaining projects
    ordered_projects.extend(project_map.values())

    # 3c. Write the Typst calls using Python (Safe!)
    for p in ordered_projects:
        # Use refined bullets if available
        bullets = p.get('refined_bullets', [])
        if not bullets: 
            bullets = [p.get('description_raw', '')]
            
        # Format bullets into a Typst array string: ("Point 1", "Point 2")
        bullet_list_str = ""
        for b in bullets:
            # CRITICAL: Escape double quotes in text
            clean_b = b.replace('"', '\\"') 
            bullet_list_str += f'"{clean_b}", '
            
        # Clean tech stack
        tech_str = ", ".join(p.get('tech_stack', [])).replace('"', '\\"')
        name_str = p.get('name', '').replace('"', '\\"')

        # Inject valid Typst function call
        typst_code += f'#project_item("{name_str}", "{tech_str}", ({bullet_list_str}))\n'
        
    # --- 4. EXECUTE ---
    try:
        result = generate_resume_pdf.invoke({"typst_code": typst_code})
        print(result)
    except Exception as e:
        print(f" Generation Error: {e}")
        
    return {"next_step": "done"}

# --- GRAPH WIRING ---
workflow = StateGraph(AgentState)
workflow.add_node("loader", load_profile_node)
workflow.add_node("refiner", refinement_check_node)
workflow.add_node("updater", update_profile_node)
workflow.add_node("analyzer", analysis_node)
workflow.add_node("generator", generation_node)

workflow.set_entry_point("loader")

def route_step(state):
    step = state.get("next_step")
    
    if step == "ask_jd": return END
    if step == "ask_user": return END
    
    if step == "continue_to_refiner": return "refiner"
    if step == "continue_to_updater": return "updater"
    
    if step == "analyze_gap": return "analyzer"
    if step == "generate": return "generator"
    if step == "skip": return "refiner"
    
    return "updater"

workflow.add_conditional_edges("loader", route_step)
workflow.add_conditional_edges("refiner", route_step)
workflow.add_edge("updater", "refiner")
workflow.add_conditional_edges("analyzer", route_step)
workflow.add_edge("generator", END)

app = workflow.compile(checkpointer=MemorySaver())

# --- RUNNER ---
def main():
    print(" AI Career Agent (Phase 4)")
    username = sys.argv[1] if len(sys.argv) > 1 else input("Enter GitHub username: ").strip()
    THREAD_ID = {"configurable": {"thread_id": f"resume_{username}"}}
    
    for event in app.stream({"username": username}, THREAD_ID, stream_mode="values"): pass
    
    while True:
        snapshot = app.get_state(THREAD_ID)
        if not snapshot.values: break
        step = snapshot.values.get("next_step")
        
        if step == "done":
            print("\n Process Complete!")
            break
            
        elif step == "ask_jd":
            print("\n" + "="*50)
            print(" PRE-FLIGHT: Paste Job Description (Ctrl+Z/D to finish):")
            lines = []
            try:
                while True: lines.append(input())
            except EOFError: pass
            jd_text = "\n".join(lines)
            
            print("Resuming with JD...")
            app.update_state(THREAD_ID, {"jd_text": jd_text, "next_step": "continue_to_refiner"}) 
            for event in app.stream(None, THREAD_ID, stream_mode="values"): pass

        elif step == "ask_user":
            user_input = input("\n> Enter metrics (or 'skip'): ")
            app.update_state(THREAD_ID, {"user_input": user_input, "next_step": "continue_to_updater"})
            print("Resuming...")
            for event in app.stream(None, THREAD_ID, stream_mode="values"): pass
            
        elif not snapshot.next:
            print("\n Process Complete!")
            break

if __name__ == "__main__":
    main()