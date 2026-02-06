import subprocess
import tempfile
import os
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

app = FastAPI()

class CompileRequest(BaseModel):
    code: str

@app.post("/compile")
async def compile_pdf(request: CompileRequest):
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        input_file = os.path.join(temp_dir, "resume.typ")
        output_file = os.path.join(temp_dir, "resume.pdf")

        # Write user code to file
        with open(input_file, "w", encoding="utf-8") as f:
            f.write(request.code)

        # Run Typst
        try:
            result = subprocess.run(
                ["typst", "compile", input_file, output_file],
                capture_output=True,
                text=True,
                check=False
            )

            # Check for compilation errors
            if result.returncode != 0:
                print(f"Typst Error: {result.stderr}") # Print to Docker logs for debugging
                raise HTTPException(status_code=400, detail=result.stderr)

            # --- FIX STARTS HERE ---
            # Read the file into memory BEFORE the temp folder is deleted
            if os.path.exists(output_file):
                with open(output_file, "rb") as f:
                    pdf_content = f.read()
            else:
                raise HTTPException(status_code=500, detail="PDF file was not created by Typst.")
            
            # Return the raw bytes instead of a FileResponse
            return Response(content=pdf_content, media_type="application/pdf")
            # --- FIX ENDS HERE ---

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Compiler Service is Running"}