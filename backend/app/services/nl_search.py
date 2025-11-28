import os
import re
from typing import List, Optional, Dict, Any

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def heuristic_parse(question: str) -> Dict[str, Any]:
    q = question.lower()
    filters = {
        "keywords": [],
        "category": None,
        "max_price": None
    }

    # 1. Extract Price (e.g., "under $50", "less than 50", "cheap")
    price_match = re.search(r"(?:under|less than|below)\s?\$?(\d+)", q)
    if price_match:
        filters["max_price"] = float(price_match.group(1))
        q = q.replace(price_match.group(0), "") # Remove from query
    elif "cheap" in q:
        filters["max_price"] = 50.0
        q = q.replace("cheap", "")
    elif "expensive" in q:
        # Just a heuristic, maybe min_price would be better but keeping it simple
        pass 

    # 2. Extract Category
    categories = {
        "textbook": "textbooks", "book": "textbooks",
        "laptop": "gadgets", "phone": "gadgets", "ipad": "gadgets", "calculator": "gadgets", "headphone": "gadgets", "electronics": "gadgets",
        "furniture": "furniture", "chair": "furniture", "desk": "furniture", "table": "furniture",
        "clothing": "clothing", "jacket": "clothing", "shirt": "clothing", "hoodie": "clothing",
        "sport": "sports", "ball": "sports", "racket": "sports", "yoga": "sports",
        "lamp": "essentials", "kettle": "essentials", "fridge": "essentials"
    }
    
    found_category = None
    for key, val in categories.items():
        if key in q:
            found_category = val
            # Don't remove category keywords as they might be useful for title match
            break
    filters["category"] = found_category

    # 3. Extract Keywords
    # Remove common stop words
    stop_words = ["i", "want", "need", "looking", "for", "a", "an", "the", "with", "in", "on", "at", "to", "buy", "get", "find"]
    words = [w for w in re.split(r"[^a-z0-9]+", q) if len(w) >= 2 and w not in stop_words]
    
    # Add course codes if any (e.g., cmpe202)
    codes = re.findall(r"[a-z]{2,4}\s?\d{2,3}", q)
    
    filters["keywords"] = list(dict.fromkeys(codes + words))[:5]
    
    return filters

def nl_to_query(question: str) -> Dict[str, Any]:
    if not OPENAI_API_KEY:
        return heuristic_parse(question)

    try:
        import httpx
        import json
        
        prompt = f"""
        Extract search filters from this query: "{question}"
        Return JSON only:
        {{
            "keywords": ["list", "of", "specific_keywords"],
            "category": "enum_value_or_null", 
            "max_price": number_or_null
        }}
        Categories: textbooks, gadgets, essentials, furniture, clothing, sports.
        Rules:
        1. Exclude generic words like "items", "products", "stuff", "looking", "for", "need".
        2. If "cheap" is used, set max_price to 50 unless specified otherwise.
        3. If "expensive" is used, set min_price (not supported yet, so ignore).
        
        Example: "cheap laptop" -> {{"keywords": ["laptop"], "category": "gadgets", "max_price": 50}}
        Example: "cheap items" -> {{"keywords": [], "category": null, "max_price": 50}}
        """
        
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}", 
            "Content-Type": "application/json"
        }
        data = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0
        }
        
        # Use a short timeout to fallback quickly if API is slow
        with httpx.Client(timeout=5.0) as client:
            r = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
            r.raise_for_status()
            
            content = r.json()["choices"][0]["message"]["content"]
            
            # Clean up markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
                
            result = json.loads(content.strip())
            
            # Post-process: Force remove generic keywords even if AI includes them
            keywords = result.get("keywords", [])
            generic_words = {"item", "items", "product", "products", "stuff", "thing", "things", "listing", "listings"}
            filtered_keywords = [k for k in keywords if k.lower() not in generic_words]

            # Validate structure
            return {
                "keywords": filtered_keywords,
                "category": result.get("category"),
                "max_price": result.get("max_price")
            }
            
    except Exception as e:
        print(f"OpenAI Search failed: {e}")
        return heuristic_parse(question)
