import json
import os
from typing import List, Dict
from openai import OpenAI  # Or your preferred LLM provider
from src.schemas import Profile  # Assuming you have a Pydantic schema

client = OpenAI() # Ensure OPENAI_API_KEY is in your env

def load_profile(path: str = "data/profile.json") -> Dict:
    with open(path, "r") as f:
        return json.load(f)

def save_profile(data: Dict, path: str = "data/profile.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

def quantify_bullet(project_name: str, bullet: str) -> str:
    print(f"\n--- Project: {project_name} ---")
    print(f"Current Bullet: {bullet}")
    
    # Prompt the LLM to find what's missing
    analysis_prompt = f"""
    Analyze this resume bullet point: "{bullet}"
    What specific metrics (latency, scale, cost, percentage) are missing to make it impactful?
    Keep it brief.
    """
    
    # We use a simple completion here for the "Interview" prompt
    suggestion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": analysis_prompt}]
    ).choices[0].message.content

    print(f"AI Suggestion: {suggestion}")
    user_input = input("Enter metrics/details (or press Enter to skip): ")

    if not user_input:
        return bullet

    # Refine the bullet using the XYZ formula
    refine_prompt = f"""
    Original Bullet: {bullet}
    Additional Info: {user_input}
    Rewrite this as a high-impact, one-line resume bullet point using the XYZ formula:
    'Accomplished [X] as measured by [Y], by doing [Z]'.
    Focus on technical engineering terms.
    """

    refined_bullet = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": refine_prompt}]
    ).choices[0].message.content

    return refined_bullet.strip('"')

def main():
    profile = load_profile()
    
    # Iterate through projects (or experience)
    if "projects" in profile:
        for project in profile["projects"]:
            new_bullets = []
            for bullet in project.get("description", []):
                refined = quantify_bullet(project["name"], bullet)
                new_bullets.append(refined)
            project["description"] = new_bullets

    save_profile(profile)
    print("\n✅ Profile updated with refined impact metrics!")

if __name__ == "__main__":
    main()