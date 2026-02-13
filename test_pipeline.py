import requests
import json

payload = {
    "username": "techieshreya",
    "profile_data": {
        "projects": [
            {"name": "Project Alpha", "tech_stack": ["Python", "Docker"]},
            {"name": "Project Beta", "tech_stack": ["React", "CSS"]},
            {"name": "Project Gamma", "tech_stack": ["Python", "FastAPI"]}
        ]
    },
    "pipeline": {
        "name": "Backend Test",
        "include_tags": ["python"],
        "exclude_tags": ["css"],
        "section_order": [],
        "template_id": "modern"
    }
}

try:
    res = requests.post("http://localhost:8000/generate", json=payload)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print("Success!")
        # Verify filtering happened (we can't easily check the PDF, but we can check if it didn't crash)
        # In a real test we'd mock the PDF generation or check the logs, 
        # but for now a 200 OK means the schema was accepted and logic ran.
    else:
        print(f"Error: {res.text}")
except Exception as e:
    print(f"Connection failed: {e}")
