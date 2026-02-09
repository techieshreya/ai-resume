import os
import sys
import json

# Ensure we can import from src
sys.path.append(os.getcwd())

try:
    from src.fetch_github import fetch_github_profile
except ImportError:
    print("❌ Could not import 'fetch_github_data'. Check your file structure.")
    sys.exit(1)

username = "techieshreya"

print(f"------------\n📡 TESTING FETCH FOR: {username}\n------------")

try:
    # 1. Run the fetch
    user_profile = fetch_github_profile(username)
    
    # 2. Check if we got data
    print(f"✅ Name Found: {user_profile.full_name}")
    print(f"✅ Projects Found: {len(user_profile.projects)}")
    
    # 3. Print first project details
    if user_profile.projects:
        p1 = user_profile.projects[0]
        print(f"   -> First Project: {p1.name} ({p1.stars} stars)")

    # 4. Save to disk (Simulate what server does)
    save_path = f"data/github/{username}.json"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    with open(save_path, "w") as f:
        # Handle Pydantic v2 serialization
        data_dict = user_profile.model_dump() if hasattr(user_profile, "model_dump") else user_profile.dict()
        json.dump(data_dict, f, indent=4)
        
    print(f"\n💾 File successfully saved to: {os.path.abspath(save_path)}")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("💡 Tip: Check if your GITHUB_TOKEN is valid in .env")