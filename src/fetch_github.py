import requests
try:
    from src.schemas import UserProfile, Project
except ModuleNotFoundError:
    from schemas import UserProfile, Project
import os

def fetch_github_profile(username: str) -> UserProfile:
    base_url = f"https://api.github.com/users/{username}"
    
    print(f"🔍 Fetching GitHub data for: {username}...")
    
    # 1. Fetch Basic Profile
    user_resp = requests.get(base_url)
    if user_resp.status_code != 200:
        raise Exception(f"GitHub User not found: {user_resp.text}")
    
    user_data = user_resp.json()
    
    # 2. Fetch Repositories (Sorted by stars)
    repos_url = f"{base_url}/repos?sort=updated&per_page=100"
    repos_resp = requests.get(repos_url)
    repos_data = repos_resp.json()
    
    # 3. Filter & Clean Projects
    cleaned_projects = []
    for repo in repos_data:
        # Skip forks and empty repos to keep quality high
        if repo['fork']:
            continue
            
        # Create a Project object (initially empty refined bullets)
        proj = Project(
            name=repo['name'],
            url=repo['html_url'],
            stars=repo['stargazers_count'],
            # Fix: Handle None description
            description_raw=repo['description'] or "No description provided.",
            tech_stack=[repo['language']] if repo['language'] else []
        )
        cleaned_projects.append(proj)
    
    # Sort by stars (descending) to show best work first
    cleaned_projects.sort(key=lambda x: x.stars, reverse=True)
    
    # 4. Create the Master Profile
    # CRITICAL FIX: We use 'or' to handle None values safely
    profile = UserProfile(
        full_name=user_data.get('name') or username, 
        github_username=username,
        email=user_data.get('email') or "Email not public",
        bio=user_data.get('bio') or "",
        projects=cleaned_projects[:5] # Keep top 5 best projects
    )
    
    return profile

# --- Updated Test Block ---
if __name__ == "__main__":
    target_user = input("Enter your GitHub username: ")
    try:
        my_profile = fetch_github_profile(target_user)
        
        print("\n SUCCESS! Master Profile Created.")
        
        # 1. Ensure the folder exists
        os.makedirs("data", exist_ok=True) 

        # 2. DYNAMIC FILENAME: Use the username in the path
        filename = f"data/github/{target_user}.json"
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(my_profile.model_dump_json(indent=2))
            print(f"\n💾 Saved to '{filename}'")
            
    except Exception as e:
        print(f" Error: {e}")