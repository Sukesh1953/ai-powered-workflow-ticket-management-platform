import os
import json
import re

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarize_text(text):

    prompt = f"""
Analyze the ticket and return ONLY valid JSON.

{{
  "summary":"",
  "priority":"",
  "category":"",
  "department":"",
  "resolution":""
}}

Rules:
- priority must be Critical, High, Medium, or Low
- category should be short
- department should be short
- resolution should be short

Ticket:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    ai_output = response.choices[0].message.content

    try:
        match = re.search(r"\{.*\}", ai_output, re.DOTALL)

        if match:
            data = json.loads(match.group())

            return {
                "summary": data.get("summary", ""),
                "priority": data.get("priority", "Medium"),
                "category": data.get("category", "General"),
                "department": data.get("department", "Support"),
                "resolution": data.get("resolution", "")
            }

    except Exception:
        pass

    return {
        "summary": ai_output[:200],
        "priority": "Medium",
        "category": "General",
        "department": "Support",
        "resolution": "Manual investigation required"
    }