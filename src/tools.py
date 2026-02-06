import os
import typst  # <--- Make sure you ran: uv add typst
from langchain_core.tools import tool
import json

# --- Helper: Find Project Root ---
def get_project_root():
    """Returns the absolute path to the 'Resume-Builder' root directory."""
    current_script_path = os.path.abspath(__file__)
    src_folder = os.path.dirname(current_script_path)
    return os.path.dirname(src_folder)

@tool
def generate_resume_pdf(typst_code: str):
    """
    Compiles Typst code into a PDF using the local Python library.
    Saves the output to 'output/resume.pdf'.
    """
    print(f"\n[DEBUG] 🚀 Tool Triggered! Compiling PDF locally...")
    
    # 1. Setup Paths
    project_root = get_project_root()
    output_dir = os.path.join(project_root, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    pdf_path = os.path.join(output_dir, "resume.pdf")
    temp_typ_path = os.path.join(output_dir, "temp_resume.typ")

    # 2. Write the Typst code to a temporary file
    try:
        with open(temp_typ_path, "w", encoding="utf-8") as f:
            f.write(typst_code)
            
        print(f"📄 Saved Typst code to: {temp_typ_path}")

        # 3. Compile using Local Typst Library (No Docker needed!)
        typst.compile(temp_typ_path, output=pdf_path)
        
        print(f"✅ PDF compiled successfully: {pdf_path}")
        return f"Saved to {pdf_path}"

    except Exception as e:
        print(f"❌ Compilation Failed: {e}")
        return f"Error: {e}"

@tool
def save_refined_profile(profile_data: dict, filename: str):
    """
    Saves the updated profile data back to disk.
    """
    try:
        project_root = get_project_root()
        # Ensure we are saving to data/github/ regardless of input
        if "github" not in filename:
             filename = f"github/{filename}"
             
        file_path = os.path.join(project_root, "data", filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2)
            
        return "Saved successfully."
    except Exception as e:
        return f"Error saving profile: {e}"