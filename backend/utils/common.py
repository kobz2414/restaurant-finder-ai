import json
import re

def extract_json_from_markdown(markdown_text: str) -> dict:
    try:
        cleaned = re.sub(r"```json|```", "", markdown_text).strip()
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Failed to decode JSON:", e)
        return {}