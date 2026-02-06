import json

def escape_typst(text: str) -> str:
    """
    Escapes special Typst characters to prevent syntax errors.
    """
    if not text: return ""
    text = str(text) # Ensure it's a string
    text = text.replace("@", "\\@")
    text = text.replace("#", "\\#")
    text = text.replace("$", "\\$")
    text = text.replace('"', '\\"')
    return text

def build_typst_code(profile: dict, analysis: dict = None) -> str:
    if analysis is None: analysis = {}
    
    # --- DATA PREPARATION ---
    raw_name = profile.get('full_name') or profile.get('name') or "Your Name"
    display_name = escape_typst(raw_name.title())
    
    raw_email = profile.get('email', "email@example.com")
    if "not public" in raw_email.lower(): raw_email = "your.email@example.com"
    email = escape_typst(raw_email)
    
    github_user = escape_typst(profile.get('github_username', 'github'))
    
    # --- HEADER ---
    typst_code = f"""
    #set page(
      paper: "us-letter",
      margin: (x: 1.5cm, y: 1.5cm),
    )
    #set text(font: "Linux Libertine", size: 11pt)
    
    // Header
    #align(center)[
      #text(size: 17pt, weight: "bold")[{display_name}] \
      #link("https://github.com/{github_user}")[github.com/{github_user}] | {email}
      #line(length: 100%, stroke: 1pt + gray)
    ]
    
    // Project Helper Function
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
    
    // --- SUMMARY ---
    == Summary
    {escape_typst(profile.get('bio', 'Aspiring Software Engineer...'))}
    """
    
    # --- PROJECTS ---
    typst_code += "\n== Projects\n"
    
    projects = profile.get('projects', [])
    suggested_order = analysis.get("suggested_project_order", [])
    
    project_map = {p['name']: p for p in projects}
    ordered_projects = []
    
    for name in suggested_order:
        for p_name, p_data in project_map.items():
            if name.lower() in p_name.lower():
                ordered_projects.append(p_data)
                if p_name in project_map: del project_map[p_name]
                break
    ordered_projects.extend(project_map.values())

    for p in ordered_projects:
        # Tech Stack
        stack = p.get('tech_stack', [])
        if isinstance(stack, str): stack = [stack] # Handle string case
        
        if not stack or stack == ["tech"]:
             tech_str = ""
        else:
             tech_str = ", ".join(stack)
        tech_str = escape_typst(tech_str)
            
        # --- BULLET HANDLING (THE FIX) ---
        # 1. Prefer 'refined_bullets' (AI generated)
        # 2. Fallback to 'description_raw' (Manual input)
        bullets = p.get('refined_bullets') or p.get('description_raw')
        
        # 3. CRITICAL FIX: If it's a string, wrap it in a list!
        if isinstance(bullets, str):
            # Split by newlines if the user typed multiple lines in the text box
            if '\n' in bullets:
                bullets = [line.strip() for line in bullets.split('\n') if line.strip()]
            else:
                bullets = [bullets]
                
        if not bullets: bullets = ["No description provided."]
        
        # Build Typst List
        bullet_list = []
        for b in bullets:
            clean_b = escape_typst(b)
            bullet_list.append(f'"{clean_b}"')
        
        bullet_str = ", ".join(bullet_list)
        name_str = escape_typst(p.get('name', ''))
        
        typst_code += f'#project_item("{name_str}", "{tech_str}", ({bullet_str}))\n'

    return typst_code