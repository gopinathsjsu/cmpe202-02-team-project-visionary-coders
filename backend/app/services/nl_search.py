import os
from typing import List

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Simple heuristic fallback
def heuristic_keywords(question: str) -> List[str]:
    q = question.lower()
    # pull out course codes like cmpe202
    import re
    codes = re.findall(r"[a-z]{2,4}\s?\d{2,3}", q)
    words = [w for w in re.split(r"[^a-z0-9]+", q) if len(w) >= 3]
    return list(dict.fromkeys(codes + words))[:5]

def nl_to_keywords(question: str) -> List[str]:
    if not OPENAI_API_KEY:
        return heuristic_keywords(question)

    # Try OpenAI, fall back on heuristic if anything goes wrong
    try:
        import httpx, json
        prompt = f"Extract 3-5 short search keywords for a campus marketplace query. Query: '{question}'. Return as a JSON array of strings."
        headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type":"application/json"}
        data = {"model": "gpt-4o-mini", "messages":[{"role":"user","content": prompt}], "temperature": 0}
        r = httpx.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data, timeout=10)
        r.raise_for_status()
        text = r.json()["choices"][0]["message"]["content"]
        # Best effort JSON parse
        import json, re
        m = re.search(r"\[(.*?)\]", text, re.S)
        if m:
            arr = json.loads("[" + m.group(1) + "]")
            return [str(x) for x in arr][:5]
        return heuristic_keywords(question)
    except Exception:
        return heuristic_keywords(question)
