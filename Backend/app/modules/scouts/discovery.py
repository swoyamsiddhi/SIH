import logging
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from sqlalchemy import func, or_
from datetime import datetime
import app.modules.athlete_dna.models

from app.modules.athletes.models import Athlete
from app.modules.athlete_dna.models import SportPotential, AthleteDNA
from app.modules.growth.models import GrowthRecord
from app.modules.assessments.models import Assessment, AssessmentResult
from app.modules.scouts.schemas import ScoutDiscoveryFilters
from app.modules.scouts.ranking import calculate_scout_review_score

logger = logging.getLogger(__name__)

def discover_athletes(session: Session, filters: ScoutDiscoveryFilters, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Core engine for Scout Discovery using strict PostgreSQL queries.
    Applies structured filters without generating arbitrary data.
    """
    # Start base query with Athlete
    query = select(Athlete)
    
    # 1. Age & Location filters
    if filters.min_age is not None:
        query = query.where(Athlete.age >= filters.min_age)
    if filters.max_age is not None:
        query = query.where(Athlete.age <= filters.max_age)
    if filters.location:
        query = query.where(Athlete.location.ilike(f"%{filters.location}%"))
        
    # 2. Join and filter SportPotential if sport or potential filters are provided
    if filters.sport or filters.min_potential is not None:
        query = query.join(SportPotential)
        if filters.sport:
            query = query.join(app.modules.athlete_dna.models.SportProfile)
            query = query.where(app.modules.athlete_dna.models.SportProfile.name == filters.sport)
        if filters.min_potential is not None:
            query = query.where(SportPotential.suitability_score >= filters.min_potential)
            
    # 3. Join and filter GrowthTrend if provided
    if filters.growth_trend:
        query = query.join(GrowthRecord).where(GrowthRecord.trend == filters.growth_trend)
        
    # 4. Join Assessment verification if verified_only is requested
    if filters.verified_only:
        # We enforce that the athlete must have at least one verified AssessmentResult
        query = query.join(Assessment).join(AssessmentResult).where(
            AssessmentResult.verification_status == "VERIFIED"
        )
        
    # Execute query, distinct to avoid duplicate rows from joins
    query = query.distinct().limit(limit).offset(offset)
    athletes = session.exec(query).all()
    
    # Build detailed response using actual data points for Review Score
    results = []
    for ath in athletes:
        # Fetch the most relevant sport potential
        potentials = session.exec(select(SportPotential).where(SportPotential.athlete_id == ath.id).order_by(SportPotential.suitability_score.desc())).all()
        target_potential = potentials[0] if potentials else None
        
        # If sport filter is used, ensure we use that specific sport's potential for scoring
        if filters.sport:
            for p in potentials:
                sp = session.get(app.modules.athlete_dna.models.SportProfile, p.sport_profile_id)
                if sp and sp.name == filters.sport:
                    target_potential = p
                    break
                    
        # Fetch DNA dimensions to calculate data completeness
        dna_records = session.exec(select(AthleteDNA).where(AthleteDNA.athlete_id == ath.id)).all()
        dna_count = len(dna_records)
        
        # Fetch latest Growth Trend to populate the summary
        latest_growth = session.exec(select(GrowthRecord).where(GrowthRecord.athlete_id == ath.id).order_by(GrowthRecord.recorded_at.desc())).first()
        trend_val = latest_growth.trend if latest_growth else None
        
        # Fetch verification status
        latest_res = session.exec(
            select(AssessmentResult)
            .join(Assessment)
            .where(Assessment.athlete_id == ath.id)
            .order_by(Assessment.started_at.desc())
        ).first()
        verif_score = latest_res.verification_score if latest_res else None
        
        review_score = calculate_scout_review_score(
            sport_potential=target_potential.suitability_score if target_potential else None,
            dna_dimensions_count=dna_count,
            growth_trend=trend_val
        )
        
        ath_dict = {
            "athlete": ath,
            "sport_potential": target_potential.suitability_score if target_potential else None,
            "growth_trend": trend_val,
            "verification_score": verif_score,
            "scout_review_score": review_score
        }
        results.append(ath_dict)
        
    # Sort results by the calculated scout_review_score descending
    results.sort(key=lambda x: x["scout_review_score"] or 0, reverse=True)
    return results
