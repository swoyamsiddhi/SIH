import pytest
from app.modules.scouts.ranking import calculate_scout_review_score
from app.modules.scouts.copilot import parse_natural_language_query

def test_calculate_scout_review_score():
    # Test perfect athlete
    score1 = calculate_scout_review_score(sport_potential=100.0, dna_dimensions_count=8, growth_trend="improving")
    assert score1 == 100.0 # 50 + 20 + 30
    
    # Test insufficient data athlete
    score2 = calculate_scout_review_score(sport_potential=None, dna_dimensions_count=2, growth_trend="insufficient_data")
    assert score2 == 14.0 # 0 + 5.0 (2/8 * 20) + 9.0 (0.3 * 30)
    
    # Test declining athlete
    score3 = calculate_scout_review_score(sport_potential=80.0, dna_dimensions_count=4, growth_trend="declining")
    assert score3 == 50.0 # 40.0 + 10.0 + 0.0

def test_copilot_parser():
    q1 = "Find U18 athletes with strong sprint potential and improving performance."
    res1 = parse_natural_language_query(q1)["filters"]
    assert res1.get("max_age") == 18
    assert res1.get("sport") == "Sprinting"
    assert res1.get("growth_trend") == "improving"
    assert res1.get("min_potential") == 85.0
    
    q2 = "I need a verified football player under 16 with stable results"
    res2 = parse_natural_language_query(q2)["filters"]
    assert res2.get("sport") == "Football"
    assert res2.get("max_age") == 16
    assert res2.get("growth_trend") == "stable"
    assert res2.get("verified_only") is True
    
    q3 = "Show me athletes in age group 14-16 for basketball"
    res3 = parse_natural_language_query(q3)["filters"]
    assert res3.get("min_age") == 14
    assert res3.get("max_age") == 16
    assert res3.get("sport") == "Basketball"
