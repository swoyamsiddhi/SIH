from typing import Dict, Any, Optional

# Configurable weights for the Scout Review Score
SCOUT_REVIEW_WEIGHTS = {
    "sport_potential": 0.5,
    "dna_completeness": 0.2,
    "growth_trend": 0.3
}

TREND_SCORES = {
    "improving": 1.0,
    "stable": 0.5,
    "insufficient_data": 0.3,
    "declining": 0.0
}

def calculate_scout_review_score(
    sport_potential: Optional[float], 
    dna_dimensions_count: int, 
    growth_trend: Optional[str]
) -> float:
    """
    Calculates the deterministic SCOUT REVIEW SCORE based on measurable evidence.
    Max score is 100.
    """
    if sport_potential is None:
        sport_potential = 0.0
        
    # Completeness (assume 8 is max dimensions)
    dna_completeness_score = min(dna_dimensions_count / 8.0, 1.0) * 100.0
    
    # Trend score
    trend_val = TREND_SCORES.get(growth_trend or "insufficient_data", 0.0)
    trend_score = trend_val * 100.0
    
    final_score = (
        (sport_potential * SCOUT_REVIEW_WEIGHTS["sport_potential"]) +
        (dna_completeness_score * SCOUT_REVIEW_WEIGHTS["dna_completeness"]) +
        (trend_score * SCOUT_REVIEW_WEIGHTS["growth_trend"])
    )
    
    return round(final_score, 2)
