import logging
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
from datetime import datetime, timedelta
import json
from sqlalchemy import func

from app.modules.assessments.models import AssessmentResult, Assessment
from app.modules.athlete_dna.models import SportPotential, SportProfile
from app.modules.growth.models import GrowthRecord
from app.modules.scouts.models import ScoutAlert

logger = logging.getLogger(__name__)

# Configurable thresholds
THRESHOLDS = {
    "HIGH_POTENTIAL": {
        "min_match_score": 85.0,
        "min_confidence": 70.0
    },
    "RISING_PERFORMANCE": {
        "required_trend": "improving",
        "min_data_points": 3
    }
}

def evaluate_scout_rules(session: Session, athlete_id: int):
    """
    Evaluates athlete data against scout rules and generates ScoutAlerts if criteria are met.
    This should be called as a Celery task after Growth calculations.
    """
    logger.info(f"Evaluating scout rules for athlete {athlete_id}")
    
    potentials = session.exec(select(SportPotential).where(SportPotential.athlete_id == athlete_id)).all()
    growth_records = session.exec(select(GrowthRecord).where(GrowthRecord.athlete_id == athlete_id)).all()
    
    # Check verification status
    latest_assessment = session.exec(
        select(Assessment)
        .where(Assessment.athlete_id == athlete_id)
        .order_by(Assessment.started_at.desc())
        .limit(1)
    ).first()
    
    is_verified = False
    if latest_assessment:
        latest_result = session.exec(select(AssessmentResult).where(AssessmentResult.assessment_id == latest_assessment.id)).first()
        if latest_result and latest_result.verification_status == "VERIFIED" and latest_result.verification_score >= 80.0:
            is_verified = True
            
    alerts_to_create = []
    
    # Rule 1: HIGH_POTENTIAL_PROFILE
    for potential in potentials:
        sport_profile = session.get(SportProfile, potential.sport_profile_id)
        sport_name = sport_profile.name if sport_profile else "Unknown Sport"
        if (potential.suitability_score >= THRESHOLDS["HIGH_POTENTIAL"]["min_match_score"] and 
            potential.confidence_score >= THRESHOLDS["HIGH_POTENTIAL"]["min_confidence"] and 
            is_verified):
            
            reasons = [
                f"Strong {sport_name} alignment ({potential.suitability_score}%)",
                "Verified assessment data",
                f"High confidence score ({potential.confidence_score}%)"
            ]
            alerts_to_create.append({
                "type": "HIGH_POTENTIAL_PROFILE",
                "sport": sport_name,
                "reasons": reasons
            })
            
    # Rule 2: RISING_PERFORMANCE
    # Find any metric that has minimum data points and is improving
    improving_metrics = []
    for gr in growth_records:
        if gr.trend == THRESHOLDS["RISING_PERFORMANCE"]["required_trend"] and gr.data_points_count >= THRESHOLDS["RISING_PERFORMANCE"]["min_data_points"]:
            improving_metrics.append(gr.metric)
            
    if improving_metrics and is_verified:
        # Just use the primary sport from the highest potential if available, or default
        primary_sport = "General"
        if potentials:
            best_pot = max(potentials, key=lambda x: x.suitability_score)
            sp = session.get(SportProfile, best_pot.sport_profile_id)
            if sp: primary_sport = sp.name
            
        reasons = [
            f"Consistent improvement in {len(improving_metrics)} metrics ({', '.join(improving_metrics[:3])})",
            f"At least {THRESHOLDS['RISING_PERFORMANCE']['min_data_points']} data points verified",
            "Positive growth trajectory"
        ]
        alerts_to_create.append({
            "type": "RISING_PERFORMANCE",
            "sport": primary_sport,
            "reasons": reasons
        })
        
    # Apply Idempotency and Insert
    cutoff_date = datetime.utcnow() - timedelta(days=30)
    
    for alert_data in alerts_to_create:
        # Check if identical alert exists in last 30 days
        existing = session.exec(
            select(ScoutAlert)
            .where(ScoutAlert.athlete_id == athlete_id)
            .where(ScoutAlert.alert_type == alert_data["type"])
            .where(ScoutAlert.sport == alert_data["sport"])
            .where(ScoutAlert.created_at >= cutoff_date)
        ).first()
        
        if not existing:
            new_alert = ScoutAlert(
                athlete_id=athlete_id,
                alert_type=alert_data["type"],
                sport=alert_data["sport"],
                reasons=alert_data["reasons"],
                organization_id="GLOBAL", # Default to global/system-wide visibility for now, or specific orgs if configured
                scout_id=None
            )
            session.add(new_alert)
            logger.info(f"Generated {alert_data['type']} alert for athlete {athlete_id}")
            
    session.commit()
