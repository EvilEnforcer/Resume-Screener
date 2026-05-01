import base64
import google.generativeai as genai
import os
import json
import re
import fitz
import io
from docx import Document

# ✅ Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Use the correct Gemini model for chat-style interaction
model = genai.GenerativeModel("models/gemini-2.5-flash")


def extract_pdf_text(binary_data):
    try:
        with fitz.open(stream=io.BytesIO(binary_data), filetype="pdf") as doc:
            return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print("Failed to extract PDF text:", e)
        return ""


def extract_docx_text(binary_data):
    try:
        import io
        doc = Document(io.BytesIO(binary_data))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception as e:
        print("Failed to extract DOCX text:", e)
        return ""


def analyze_resume(resume_b64, job_title, job_description):

    try:
        # Decode and extract resume
        binary_data = base64.b64decode(resume_b64)

        # Detect file type (very basic – you can enhance this later)
        if binary_data[:4] == b'%PDF':
            resume_text = extract_pdf_text(binary_data)
        else:
            resume_text = extract_docx_text(binary_data)

        prompt = f"""
        You are an AI assistant tasked with evaluating a candidate's resume against a job description.

        Your output must be a **strict JSON object** with a total score, a summary, and a section-by-section breakdown.

        ---

        ### SCORING INSTRUCTIONS

        You must assign a score out of 100 based on 5 evaluation categories:

        Each category has a maximum point value. You may assign **any number within the range**, not just multiples of 5. 
        Justify each score clearly.

        ---

        #### 1. Technical Skills Match (25 pts)
        Compare the required technologies/tools in the job description with those mentioned in the resume.

        - 25: ~100% of key skills matched
        - 20–24: ~80–99% match
        - 15–19: ~60–79% match
        - 10–14: ~30–59% match
        - 1–9: minor overlap
        - 0: almost no relevant skills

        #### 2. Job Experience Relevance (25 pts)
        Evaluate whether the candidate has experience in similar roles (internships and jobs).

        - 22–25: extensive directly relevant experience
        - 15–21: some relevant experience or partial match
        - 5–14: unrelated jobs or weak overlap
        - 0–4: no relevant experience

        #### 3. Educational Background (20 pts)
        Evaluate how closely the candidate’s education matches what's required or preferred.

        Fallback (if no job requirement listed):
        - 20: PhD in a related field
        - 15–19: Master’s in a related field
        - 10–14: Bachelor’s in a related field
        - 5–9: Unrelated degree
        - 1–4: Incomplete or irrelevant
        - 0: Nothing listed

        #### 4. Projects & Initiatives (25 pts)
        Evaluate personal/professional projects based on relevance, complexity, and uniqueness.

        - 22–25: Impressive, highly relevant and complex
        - 15–21: Somewhat relevant, decent effort
        - 5–14: Basic or loosely related
        - 0–4: No projects or completely unrelated

        #### 5. Communication & Clarity (5 pts)
        Review clarity, structure, formatting, and grammar.

        - 5: Very clear and polished
        - 3–4: Mostly clean, small issues
        - 0–2: Poor formatting or structure

        ---

        ### 🔁 OUTPUT FORMAT (strict JSON only)

        Respond with an object in the exact format below:

        {{
          "score": <TOTAL_SCORE_OUT_OF_100>,
          "summary": "<1-2 sentence overall evaluation>",
          "sections": {{
            "technicalSkills": {{
              "score": <score_out_of_25>, 
              "outOf": 25,
              "comment": "<why this score was given>"
            }},
            "experience": {{
              "score": <score_out_of_25>,
              "outOf": 25,
              "comment": "<why this score was given>"
            }},
            "education": {{
              "score": <score_out_of_20>,
              "outOf": 20,
              "comment": "<why this score was given>"
            }},
            "projects": {{
              "score": <score_out_of_25>,
              "outOf": 25,
              "comment": "<why this score was given>"
            }},
            "communication": {{
              "score": <score_out_of_5>,
              "outOf": 5,
              "comment": "<why this score was given>"
            }}
          }}
        }}

        ⚠️ IMPORTANT: Do not include explanations outside of the JSON. No markdown, no extra text.

        ---

        ### Evaluation Data

        --- Resume ---
        {resume_text}

        --- Job Title ---
        {job_title}

        --- Job Description ---
        {job_description}
        """

        chat = model.start_chat()
        response = chat.send_message(prompt, generation_config=genai.types.GenerationConfig(temperature=0))

        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            json_text = match.group()
            return json.loads(json_text)
        else:
            return {
                "error": "Gemini response was not JSON. Prompt may need adjustment."
            }


    except Exception as e:

        import traceback

        traceback.print_exc()

        return {

            "error": f"Failed to analyze resume: {str(e)}"

        }
