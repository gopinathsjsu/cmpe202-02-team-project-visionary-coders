"""
Enhanced Natural Language Search Service
Parses natural language queries to structured search filters
Supports: keywords, categories, price ranges, sorting preferences
Falls back to heuristic parsing if OpenAI API is unavailable
"""

import os
import re
import json
from typing import List, Optional, Dict, Any
from functools import lru_cache

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_REQUEST_TIMEOUT = 5.0  # seconds


def heuristic_parse(question: str) -> Dict[str, Any]:
    """
    Fallback heuristic parser for natural language queries.
    Used when OpenAI API is unavailable or as a baseline approach.
    
    Args:
        question: Natural language query string
        
    Returns:
        Dictionary with keys: keywords, category, min_price, max_price, sort_by
    """
    q = question.lower().strip()
    filters = {
        "keywords": [],
        "category": None,
        "min_price": None,
        "max_price": None,
        "sort_by": "recent"
    }

    # ===== PRICE EXTRACTION =====
    
    # 1. Extract explicit price ranges (e.g., "between $20 and $50")
    price_range_match = re.search(r"between\s+\$?(\d+(?:\.\d{2})?)\s+(?:and|to)\s+\$?(\d+(?:\.\d{2})?)", q)
    if price_range_match:
        filters["min_price"] = float(price_range_match.group(1))
        filters["max_price"] = float(price_range_match.group(2))
        q = re.sub(re.escape(price_range_match.group(0)), "", q)
    else:
        # 2. Extract upper price limits (e.g., "under $50", "less than 100")
        max_price_match = re.search(r"(?:under|less than|below|max|up to)\s+\$?(\d+(?:\.\d{2})?)", q)
        if max_price_match:
            filters["max_price"] = float(max_price_match.group(1))
            q = re.sub(re.escape(max_price_match.group(0)), "", q, count=1)
        
        # 3. Extract lower price limits (e.g., "over $50", "more than 100")
        min_price_match = re.search(r"(?:over|more than|above|min|starting from)\s+\$?(\d+(?:\.\d{2})?)", q)
        if min_price_match:
            filters["min_price"] = float(min_price_match.group(1))
            q = re.sub(re.escape(min_price_match.group(0)), "", q, count=1)

    # 4. Handle price adjectives
    adjective_prices = {
        r"\bcheap\b": 50.0,
        r"\baffordable\b": 100.0,
        r"\binexpensive\b": 75.0,
        r"\bbudget\b": 60.0,
    }
    
    for pattern, price in adjective_prices.items():
        if re.search(pattern, q):
            if filters["max_price"] is None:  # Don't override explicit price
                filters["max_price"] = price
            q = re.sub(pattern, "", q)

    # Handle "expensive" or "luxury" (min price instead)
    luxury_patterns = [r"\bexpensive\b", r"\bluxury\b", r"\bhigh-end\b"]
    for pattern in luxury_patterns:
        if re.search(pattern, q):
            if filters["min_price"] is None:
                filters["min_price"] = 500.0
            q = re.sub(pattern, "", q)

    # ===== CATEGORY EXTRACTION =====
    
    category_keywords = {
        # Textbooks
        "textbook": "textbooks",
        "textbooks": "textbooks",
        "book": "textbooks",
        "books": "textbooks",
        "novel": "textbooks",
        "course": "textbooks",
        
        # Gadgets & Electronics
        "laptop": "gadgets",
        "computer": "gadgets",
        "pc": "gadgets",
        "desktop": "gadgets",
        "monitor": "gadgets",
        "phone": "gadgets",
        "smartphone": "gadgets",
        "iphone": "gadgets",
        "android": "gadgets",
        "ipad": "gadgets",
        "tablet": "gadgets",
        "calculator": "gadgets",
        "headphone": "gadgets",
        "headphones": "gadgets",
        "earphone": "gadgets",
        "earphones": "gadgets",
        "speaker": "gadgets",
        "electronic": "gadgets",
        "electronics": "gadgets",
        "device": "gadgets",
        "gadget": "gadgets",
        "keyboard": "gadgets",
        "mouse": "gadgets",
        
        # Furniture
        "furniture": "furniture",
        "chair": "furniture",
        "desk": "furniture",
        "table": "furniture",
        "bed": "furniture",
        "couch": "furniture",
        "sofa": "furniture",
        "shelf": "furniture",
        "shelves": "furniture",
        "cabinet": "furniture",
        "drawer": "furniture",
        "bookcase": "furniture",
        
        # Clothing
        "clothing": "clothing",
        "clothes": "clothing",
        "jacket": "clothing",
        "shirt": "clothing",
        "hoodie": "clothing",
        "sweatshirt": "clothing",
        "pants": "clothing",
        "jeans": "clothing",
        "shorts": "clothing",
        "dress": "clothing",
        "shoes": "clothing",
        "sneakers": "clothing",
        "boots": "clothing",
        "socks": "clothing",
        "hat": "clothing",
        "cap": "clothing",
        "coat": "clothing",
        "sweater": "clothing",
        
        # Sports
        "sport": "sports",
        "sports": "sports",
        "ball": "sports",
        "basketball": "sports",
        "soccer": "sports",
        "volleyball": "sports",
        "football": "sports",
        "racket": "sports",
        "tennis": "sports",
        "yoga": "sports",
        "mat": "sports",
        "dumbbell": "sports",
        "weights": "sports",
        "bicycle": "sports",
        "bike": "sports",
        "skateboard": "sports",
        "equipment": "sports",
        
        # Essentials
        "essential": "essentials",
        "essentials": "essentials",
        "lamp": "essentials",
        "light": "essentials",
        "kettle": "essentials",
        "fridge": "essentials",
        "refrigerator": "essentials",
        "fan": "essentials",
        "heater": "essentials",
        "microwave": "essentials",
        "toaster": "essentials",
        "blender": "essentials",
        "pillow": "essentials",
        "blanket": "essentials",
        "bedding": "essentials",
        "towel": "essentials",
    }
    
    found_category = None
    for keyword, category in category_keywords.items():
        if re.search(r"\b" + keyword + r"\b", q):
            found_category = category
            break
    filters["category"] = found_category

    # ===== SORT PREFERENCE EXTRACTION =====
    
    sort_patterns = {
        r"(?:newest|recent|latest|new)": "recent",
        r"(?:cheapest|lowest|low-price|price.*low)": "price_asc",
        r"(?:most expensive|highest|high-price|price.*high)": "price_desc",
    }
    
    for pattern, sort_type in sort_patterns.items():
        if re.search(pattern, q):
            filters["sort_by"] = sort_type
            break

    # ===== KEYWORD EXTRACTION =====
    
    # Remove common stop words and special characters
    stop_words = {
        "i", "me", "my", "myself",
        "you", "your", "yours", "yourself",
        "he", "him", "his", "himself",
        "she", "her", "hers", "herself",
        "it", "its", "itself",
        "we", "us", "our", "ours", "ourselves",
        "they", "them", "their", "theirs", "themselves",
        "what", "which", "who", "whom", "why", "how",
        "a", "an", "and", "or", "but", "not", "no",
        "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did",
        "the", "this", "that", "these", "those",
        "want", "need", "looking", "for", "with", "in", "on", "at", "to",
        "buy", "get", "find", "search", "seek",
        "item", "items", "product", "products", "stuff", "thing", "things",
        "listing", "listings", "post", "posts", "ad", "ads",
        "price", "cost", "money", "cash", "dollar", "dollars", "bucks",
        "new", "used", "cheap", "affordable", "expensive", "luxury",
        "please", "thanks", "thank", "hi", "hello",
    }
    
    # Split on non-alphanumeric characters
    words = re.split(r"[^a-z0-9]+", q.lower())
    
    # Filter: min length 2, not in stop words
    filtered_keywords = [
        w for w in words 
        if len(w) >= 2 and w not in stop_words and w.strip()
    ]
    
    # Extract course codes (e.g., cmpe202, cs101, math201)
    codes = re.findall(r"[a-z]{2,4}\d{2,4}", q.lower())
    
    # Combine codes and keywords, remove duplicates, limit to 5
    all_keywords = list(dict.fromkeys(codes + filtered_keywords))[:5]
    
    filters["keywords"] = all_keywords
    
    return filters


@lru_cache(maxsize=128)
def _cached_nl_parse(question: str) -> str:
    """
    Cached wrapper for OpenAI API call to avoid redundant requests
    """
    return _call_openai_api(question)


def _call_openai_api(question: str) -> Dict[str, Any]:
    """
    Call OpenAI API to parse natural language query.
    
    Args:
        question: Natural language query
        
    Returns:
        Dictionary with structured filters
    """
    try:
        import httpx
        
        prompt = f"""Extract search filters from this user query: "{question}"

Return ONLY valid JSON (no markdown formatting, no code blocks, no explanation):
{{
    "keywords": ["specific", "relevant", "keywords"],
    "category": "category_value_or_null", 
    "min_price": number_or_null,
    "max_price": number_or_null,
    "sort_by": "recent_or_price_direction"
}}

Valid categories: textbooks, gadgets, essentials, furniture, clothing, sports

Requirements:
1. Extract specific keywords that describe what the user wants. Remove generic words like "items", "products", "stuff", "looking for", "need", "want", "search".
2. If user mentions a category, include it. Category must be one of the valid values.
3. For price: extract both min and max if specified. For "cheap", set max_price to 50. For "expensive", set min_price to 500.
4. For sorting: "recent" (default), "price_asc" (low to high), "price_desc" (high to low).
5. Limit keywords to 3-5 most relevant terms. Include course codes (cmpe202, etc.) if present.
6. Preserve numeric codes and technical terms in keywords.

Examples:
Input: "cheap laptop under $500"
Output: {{"keywords": ["laptop"], "category": "gadgets", "min_price": null, "max_price": 500, "sort_by": "recent"}}

Input: "textbook for cmpe202 under $30"
Output: {{"keywords": ["cmpe202", "textbook"], "category": "textbooks", "min_price": null, "max_price": 30, "sort_by": "recent"}}

Input: "affordable furniture between $100 and $300, cheapest first"
Output: {{"keywords": ["furniture"], "category": "furniture", "min_price": 100, "max_price": 300, "sort_by": "price_asc"}}

Input: "newest gadgets"
Output: {{"keywords": ["gadgets"], "category": "gadgets", "min_price": null, "max_price": null, "sort_by": "recent"}}
"""
        
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0,
            "max_tokens": 200
        }
        
        with httpx.Client(timeout=OPENAI_REQUEST_TIMEOUT) as client:
            response = client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data
            )
            response.raise_for_status()
            
            content = response.json()["choices"][0]["message"]["content"].strip()
            
            # Remove markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            # Parse JSON
            result = json.loads(content)
            
            # Validate and clean keywords
            keywords = result.get("keywords", [])
            if not isinstance(keywords, list):
                keywords = []
            
            generic_words = {
                "item", "items", "product", "products", "stuff", "thing",
                "things", "listing", "listings", "post", "posts", "ad",
                "ads", "search", "find", "get", "look", "looking"
            }
            
            filtered_keywords = [
                k.lower().strip()
                for k in keywords
                if isinstance(k, str) and k.lower().strip() not in generic_words
            ]
            
            # Parse category
            category = result.get("category")
            if isinstance(category, str):
                category = category.lower().strip()
            else:
                category = None
            
            # Parse prices (ensure they are valid numbers)
            min_price = result.get("min_price")
            max_price = result.get("max_price")
            
            if min_price is not None:
                try:
                    min_price = float(min_price)
                except (ValueError, TypeError):
                    min_price = None
            
            if max_price is not None:
                try:
                    max_price = float(max_price)
                except (ValueError, TypeError):
                    max_price = None
            
            # Parse sort preference
            sort_by = result.get("sort_by", "recent")
            if sort_by not in ["recent", "price_asc", "price_desc"]:
                sort_by = "recent"
            
            return {
                "keywords": filtered_keywords,
                "category": category if category else None,
                "min_price": min_price,
                "max_price": max_price,
                "sort_by": sort_by
            }
            
    except httpx.TimeoutException:
        print(f"OpenAI API timeout for query: {question}")
        raise
    except json.JSONDecodeError as e:
        print(f"OpenAI response JSON parse error: {e}")
        raise
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise


def nl_to_query(question: str) -> Dict[str, Any]:
    """
    Convert natural language query to structured search filters.
    
    First attempts OpenAI API if available and not timing out,
    falls back to heuristic parsing if API fails or is unavailable.
    
    Args:
        question: Natural language query string
        
    Returns:
        Dictionary with keys:
            - keywords: list of search keywords
            - category: category filter or None
            - min_price: minimum price or None
            - max_price: maximum price or None
            - sort_by: "recent", "price_asc", or "price_desc"
    """
    
    # If no API key configured, use heuristic parsing
    if not OPENAI_API_KEY:
        print("OpenAI API key not configured, using heuristic parsing")
        return heuristic_parse(question)
    
    try:
        # Try OpenAI API first
        result = _call_openai_api(question)
        print(f"OpenAI API parsed: {question} -> {result}")
        return result
        
    except Exception as e:
        # Fallback to heuristic parsing
        print(f"Falling back to heuristic parsing due to: {e}")
        return heuristic_parse(question)


# Additional utility functions

def validate_filters(filters: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and sanitize filter dictionary
    """
    validated = {
        "keywords": [],
        "category": None,
        "min_price": None,
        "max_price": None,
        "sort_by": "recent"
    }
    
    # Validate keywords
    if "keywords" in filters and isinstance(filters["keywords"], list):
        validated["keywords"] = [k for k in filters["keywords"] if isinstance(k, str)]
    
    # Validate category
    if "category" in filters and isinstance(filters["category"], str):
        validated["category"] = filters["category"].lower()
    
    # Validate prices
    for price_key in ["min_price", "max_price"]:
        if price_key in filters:
            try:
                price = float(filters[price_key])
                if price >= 0:
                    validated[price_key] = price
            except (ValueError, TypeError):
                pass
    
    # Validate sort_by
    if "sort_by" in filters and filters["sort_by"] in ["recent", "price_asc", "price_desc"]:
        validated["sort_by"] = filters["sort_by"]
    
    return validated


def format_query_string(filters: Dict[str, Any]) -> str:
    """
    Format filters dictionary to human-readable string for logging
    """
    parts = []
    
    if filters.get("keywords"):
        parts.append(f"keywords: {', '.join(filters['keywords'])}")
    if filters.get("category"):
        parts.append(f"category: {filters['category']}")
    if filters.get("min_price"):
        parts.append(f"min: ${filters['min_price']}")
    if filters.get("max_price"):
        parts.append(f"max: ${filters['max_price']}")
    if filters.get("sort_by") != "recent":
        parts.append(f"sort: {filters['sort_by']}")
    
    return " | ".join(parts) if parts else "no filters"
