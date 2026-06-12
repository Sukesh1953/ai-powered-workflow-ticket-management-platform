import requests
import json
import re


def summarize_text(text):

    prompt = f"""
Analyze the ticket and return ONLY valid JSON.

{{
    "summary": "",
    "priority": "",
    "category": "",
    "department": "",
    "resolution": ""
}}

Rules:
- priority must be Critical, High, Medium, or Low
- category should be short
- department should be short
- resolution should be a short troubleshooting suggestion

Ticket:
{text}
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    ai_output = result["response"].strip()

    try:

        # Extract JSON even if model adds extra text
        match = re.search(r"\{.*\}", ai_output, re.DOTALL)

        if match:

            parsed_json = json.loads(match.group())

            return {
                "summary": parsed_json.get(
                    "summary",
                    "No summary"
                ),
                "priority": parsed_json.get(
                    "priority",
                    "Medium"
                ),
                "category": parsed_json.get(
                    "category",
                    "General"
                ),
                "department": parsed_json.get(
                    "department",
                    "Support Team"
                ),
                "resolution": parsed_json.get(
                    "resolution",
                    "No resolution suggested"
                )
            }

    except Exception as e:

        print("JSON Parse Error:", e)

    return {
        "summary": ai_output[:200],
        "priority": "Medium",
        "category": "General",
        "department": "Support Team",
        "resolution": "Manual investigation required"
    }