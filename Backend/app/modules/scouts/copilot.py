import re
from typing import Dict, Any

def parse_natural_language_query(query: str) -> Dict[str, Any]:
    """
    Deterministic NLP parser that maps natural language strings into structured filters.
    Avoids LLM hallucinations by using regex and keyword mapping.
    """
    filters = {}
    explanation_parts = []
    
    query_lower = query.lower()
    
    # Age extraction (e.g., U18, Under 18, 16-18)
    u_match = re.search(r'u(\d+)', query_lower)
    under_match = re.search(r'under\s*(\d+)', query_lower)
    range_match = re.search(r'(\d+)\s*-\s*(\d+)', query_lower)
    
    if range_match:
        filters["min_age"] = int(range_match.group(1))
        filters["max_age"] = int(range_match.group(2))
        explanation_parts.append(f"Age between {filters['min_age']} and {filters['max_age']}")
    elif u_match:
        filters["max_age"] = int(u_match.group(1))
        explanation_parts.append(f"Age Under {filters['max_age']}")
    elif under_match:
        filters["max_age"] = int(under_match.group(1))
        explanation_parts.append(f"Age Under {filters['max_age']}")
        
    # Sport extraction
    sports = {
        "sprint": "Sprinting",
        "football": "Football",
        "basketball": "Basketball",
        "badminton": "Badminton",
        "long jump": "Long Jump"
    }
    for kw, actual_sport in sports.items():
        if kw in query_lower:
            filters["sport"] = actual_sport
            explanation_parts.append(f"Sport is {actual_sport}")
            break
            
    # Trend / Performance extraction
    if "improving" in query_lower or "rising" in query_lower or "better" in query_lower:
        filters["growth_trend"] = "improving"
        explanation_parts.append("Growth trend is improving")
    elif "stable" in query_lower or "consistent" in query_lower:
        filters["growth_trend"] = "stable"
        explanation_parts.append("Growth trend is stable")
        
    # Potential extraction
    if re.search(r'(strong|high)\s*(?:[a-z\s]*)\s*potential', query_lower):
        filters["min_potential"] = 85.0
        explanation_parts.append("High sport potential (>= 85.0)")
        
    # Verification
    if "verified" in query_lower or "legit" in query_lower:
        filters["verified_only"] = True
        explanation_parts.append("Only verified assessments")
        
    explanation = "Parsed filters: " + ", ".join(explanation_parts) if explanation_parts else "No specific filters detected, returning general search."
    
    return {
        "filters": filters,
        "explanation": explanation
    }
