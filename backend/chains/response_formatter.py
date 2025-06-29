from langchain_google_genai import ChatGoogleGenerativeAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    temperature=0.3,
    max_output_tokens=400  # limit Gemini's output size
)

def format_with_gemini(question, headers, rows, max_rows=10):
    if not rows:
        return json.dumps({
            "summary": "No data available for this query.",
            "table": {"headers": headers, "rows": []},
            "graph_suggestion": {"type": "none", "labels": [], "values": []}
        }, indent=2)

    # Trim rows to avoid huge input
    trimmed_rows = rows[:max_rows]

    table_csv = "\n".join(
        [", ".join(headers)] + [", ".join(map(str, row)) for row in trimmed_rows]
    )

    prompt = f"""
You are a data assistant. Analyze the CSV table below and return structured insights in valid JSON.

## User Query:
{question}

## Table (CSV):
{table_csv}

## Format (always follow this):
{{
  "summary": "...",
  "table": {{
    "headers": [...],
    "rows": [...]
  }},
  "graph_suggestion": {{
    "type": "bar_chart" | "line_chart" | "pie_chart" | "doughnut_chart" | "none",
    "labels": [...],
    "values": [...]
  }}
}}

- Use only the provided data.
- No markdown, no extra commentary.
    """.strip()

    try:
        response = llm.invoke(prompt).content.strip()

        if response.startswith("```json"):
            response = response.replace("```json", "").replace("```", "").strip()

        json.loads(response)  # Validate

        return response

    except Exception as e:
        return json.dumps({
            "summary": "⚠️ Gemini response could not be parsed.",
            "table": {"headers": headers, "rows": trimmed_rows},
            "graph_suggestion": {"type": "none", "labels": [], "values": []},
            "error": str(e)
        }, indent=2)
