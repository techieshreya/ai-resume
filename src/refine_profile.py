import json
import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from src.schemas import UserProfile

# 1. Setup
load_dotenv()
if not os.getenv("GOOGLE_API_KEY"):
    print("❌ Error: API Key missing.")
    exit()

# Use the model that worked for you earlier
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest")

# 2. Define the "Impact" Prompt
# This tells the AI how to turn boring text into "Resume Gold"
impact_prompt = ChatPromptTemplate.from_template("""
You are an expert Resume Writer and Technical Recruiter.
Your goal is to rewrite a simple GitHub project description into high-impact "Resume Bullets".

Input Project:
- Name: {name}
- Tech Stack: {tech}
- Raw Description: {desc}

Instructions:
1. Generate 2-3 bullet points using the "STAR" method (Situation, Task, Action, Result).
2. Use strong action verbs (Architected, Deployed, Optimized).
3. IF the description is vague, infer logical technical details based on the tech stack (e.g., if "Python/Django", mention "REST APIs").
4. Return ONLY the bullet points as a Python list of strings. Do not output Markdown or explanations.

Example Output format:
["Built a high-concurrency payment engine...", "Reduced database query time by 30%..."]
""")

def refine_user_profile():
    # 3. Load the Raw Data
    try:
        with open("data/profile.json", "r") as f:
            data = json.load(f)
            # Validate it with our Schema
            profile = UserProfile(**data)
    except FileNotFoundError:
        print("❌ Error: profile.json not found. Run fetch_github.py first!")
        return

    print(f"🚀 Starting Impact Refinement for {profile.full_name}...\n")

    # 4. Iterate through Projects and "Upgrade" them
    for project in profile.projects:
        print(f"⚡ Improving: {project.name}...")
        
        # Prepare the input for AI
        chain = impact_prompt | llm
        
        try:
            # Ask AI to rewrite
            response = chain.invoke({
                "name": project.name,
                "tech": ", ".join(project.tech_stack),
                "desc": project.description_raw
            })
            
            # Clean up the response to get a real list
            # (AI sometimes returns text, we want to parse it into a list)
            refined_text = response.content.strip()
            
            # Simple parser to turn string representation into actual list
            if refined_text.startswith("[") and refined_text.endswith("]"):
                project.refined_bullets = eval(refined_text)
            else:
                # Fallback if AI didn't format perfectly
                project.refined_bullets = [refined_text]
                
            print(f"   ✅ Generated {len(project.refined_bullets)} impact bullets.")
            
        except Exception as e:
            print(f"   ⚠️ Failed to refine {project.name}: {e}")

    # 5. Save the "Golden" Profile
    with open("data/profile.json", "w") as f:
        f.write(profile.model_dump_json(indent=2))
    
    print("\n✨ SUCCESS! Your 'profile.json' now contains professional resume bullets.")

if __name__ == "__main__":
    refine_user_profile()