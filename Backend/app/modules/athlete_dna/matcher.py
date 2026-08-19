from typing import List, Dict, Tuple
from sqlmodel import Session, select
from .models import AthleteDNA, SportProfile, SportRequirement, SportPotential
import json

def calculate_sport_matching(session: Session, athlete_id: int):
    """Calculates sport matching based on AthleteDNA and SportProfile requirements"""
    dna = session.exec(select(AthleteDNA).where(AthleteDNA.athlete_id == athlete_id)).first()
    if not dna:
        return []
        
    profiles = session.exec(select(SportProfile)).all()
    results = []
    
    # Extract athlete DNA dict (only keeping valid dimensions)
    dna_dict = {
        'speed': (dna.speed, dna.speed_confidence),
        'power': (dna.power, dna.power_confidence),
        'agility': (dna.agility, dna.agility_confidence),
        'endurance': (dna.endurance, dna.endurance_confidence),
        'reaction': (dna.reaction, dna.reaction_confidence),
        'flexibility': (dna.flexibility, dna.flexibility_confidence),
        'balance': (dna.balance, dna.balance_confidence),
        'movement_quality': (dna.movement_quality, dna.movement_quality_confidence)
    }
    
    valid_dna = {k: v for k, v in dna_dict.items() if v[0] is not None}
    
    for profile in profiles:
        reqs = session.exec(select(SportRequirement).where(SportRequirement.sport_profile_id == profile.id)).all()
        if not reqs:
            continue
            
        total_weight = 0.0
        matched_weight = 0.0
        score = 0.0
        
        lowest_sensor_confidence = 100.0
        
        strengths = []
        gaps = []
        evidences = []
        
        for req in reqs:
            total_weight += req.weight
            
            # If the athlete has this dimension
            if req.dimension in valid_dna:
                athlete_val, athlete_conf = valid_dna[req.dimension]
                matched_weight += req.weight
                
                # Propagate lowest sensor confidence
                if athlete_conf and athlete_conf < lowest_sensor_confidence:
                    lowest_sensor_confidence = athlete_conf
                
                # How well does the athlete fit the preferred range?
                if athlete_val >= req.preferred_range_min:
                    score += req.weight
                    strengths.append(f"Strong {req.dimension} alignment (measured: {athlete_val:.1f} Z-Score)")
                else:
                    partial = (athlete_val / req.preferred_range_min) * req.weight
                    score += partial
                    gaps.append(f"Low {req.dimension} (measured {athlete_val:.1f} Z-Score, prefers > {req.preferred_range_min})")
                
                evidences.append(f"{req.dimension}: {req.evidence_source}")
            else:
                gaps.append(f"Missing {req.dimension} data, which is required for {profile.name}")
                
        if total_weight == 0:
            continue
            
        # Suitability is based ONLY on the dimensions we actually have data for
        if matched_weight > 0:
            suitability_score = (score / matched_weight) * 100
        else:
            suitability_score = 0.0
            
        # Confidence is how much of the sport's requirements we actually tested
        # MULTIPLIED by the lowest sensor confidence of the used metrics
        coverage_confidence = (matched_weight / total_weight)
        final_confidence = (coverage_confidence * lowest_sensor_confidence) if matched_weight > 0 else 0.0
        
        # Build explanation
        explanation = {
            "message": f"Your physical profile is more compatible with {profile.name}." if suitability_score >= 70 else f"Your physical profile has developmental gaps for {profile.name}.",
            "calculation_logic": "compatibility_model",
            "matched_weight": matched_weight,
            "total_weight": total_weight,
            "scientific_evidence": evidences
        }
        
        potential = SportPotential(
            athlete_id=athlete_id,
            sport_profile_id=profile.id,
            suitability_score=suitability_score,
            confidence_score=final_confidence,
            strengths_json=json.dumps(strengths),
            development_gaps_json=json.dumps(gaps),
            explanation_json=json.dumps(explanation)
        )
        results.append(potential)
        
    # Save results to DB
    old_pots = session.exec(select(SportPotential).where(SportPotential.athlete_id == athlete_id)).all()
    for op in old_pots:
        session.delete(op)
    session.commit()
    
    for r in results:
        session.add(r)
    session.commit()
    
    return results
