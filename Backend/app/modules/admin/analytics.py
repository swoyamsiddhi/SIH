from sqlmodel import Session, select
from sqlalchemy import func
from datetime import datetime, timedelta

from app.modules.athletes.models import Athlete
from app.modules.assessments.models import Assessment, AssessmentResult
from app.modules.scouts.models import ScoutAlert
from app.modules.events.models import Event, EventRegistration
from app.modules.athlete_dna.models import SportPotential
from app.modules.growth.models import GrowthRecord

def get_national_kpis(session: Session):
    # Total athletes assessed (number of unique athletes with an assessment)
    athletes_assessed = session.exec(select(func.count(func.distinct(Assessment.athlete_id)))).first() or 0
    
    # Active athletes (in the last 90 days)
    ninety_days_ago = datetime.utcnow() - timedelta(days=90)
    active_athletes = session.exec(select(func.count(func.distinct(Assessment.athlete_id))).where(Assessment.started_at >= ninety_days_ago)).first() or 0
    
    # High potential (from scout alerts)
    high_potential = session.exec(select(func.count(func.distinct(ScoutAlert.athlete_id))).where(ScoutAlert.type == "HIGH_POTENTIAL_PROFILE")).first() or 0
    
    # Events conducted
    events = session.exec(select(func.count(Event.id))).first() or 0
    
    # Assessments today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    assessments_today = session.exec(select(func.count(Assessment.id)).where(Assessment.started_at >= today)).first() or 0
    
    # Regions covered (based on parsing state from location string: 'City, State')
    locations = session.exec(select(Athlete.location)).all()
    states = set()
    for loc in locations:
        if loc:
            parts = loc.split(',')
            if len(parts) > 1:
                states.add(parts[-1].strip())
            else:
                states.add(parts[0].strip())
    regions_covered = len(states)
    
    return {
        "athletes_assessed": athletes_assessed,
        "active_athletes": active_athletes,
        "high_potential": high_potential,
        "events": events,
        "assessments_today": assessments_today,
        "regions_covered": regions_covered
    }

def get_talent_hotspots(session: Session):
    # For now, we group by 'location' string as 'City, State'
    locations = session.exec(select(Athlete.location)).all()
    unique_locations = set([l for l in locations if l])
    
    hotspots = []
    for loc in unique_locations:
        parts = loc.split(',')
        district = parts[0].strip()
        state = parts[1].strip() if len(parts) > 1 else district
        
        athletes_in_loc = session.exec(select(Athlete).where(Athlete.location == loc)).all()
        athlete_ids = [a.id for a in athletes_in_loc]
        
        if not athlete_ids:
            continue
            
        # Top Sport: Most common sport potential in this location
        potentials = session.exec(select(SportPotential).where(SportPotential.athlete_id.in_(athlete_ids))).all()
        sport_counts = {}
        from app.modules.athlete_dna.models import SportProfile
        for p in potentials:
            sp = session.get(SportProfile, p.sport_profile_id)
            sp_name = sp.name if sp else "Unknown"
            sport_counts[sp_name] = sport_counts.get(sp_name, 0) + 1
        
        top_sport = "Mixed"
        if sport_counts:
            top_sport = max(sport_counts, key=sport_counts.get)
            
        # Growth velocity: average of improvement_percentage for athletes in this location
        growth_records = session.exec(select(GrowthRecord).where(GrowthRecord.athlete_id.in_(athlete_ids))).all()
        avg_growth = 0
        if growth_records:
            total_growth = sum([gr.improvement_percentage for gr in growth_records if gr.improvement_percentage])
            avg_growth = round(total_growth / len(growth_records), 1)
            
        hotspots.append({
            "district": district,
            "state": state,
            "sport": top_sport,
            "athletes": len(athlete_ids),
            "growth": avg_growth
        })
        
    hotspots.sort(key=lambda x: x["growth"], reverse=True)
    return hotspots

def get_live_telemetry(session: Session, event_id: int):
    # Checked In
    checked_in = session.exec(select(func.count(EventRegistration.id)).where(EventRegistration.event_id == event_id).where(EventRegistration.status == "CHECKED_IN")).first() or 0
    
    # Assessments Completed
    assessments_completed = session.exec(select(func.count(Assessment.id)).where(Assessment.event_id == event_id).where(Assessment.status == "SYNCED")).first() or 0
    
    # Testing Now
    currently_testing = session.exec(select(func.count(Assessment.id)).where(Assessment.event_id == event_id).where(Assessment.status == "PENDING")).first() or 0
    
    # High Potential Detected during this event
    # We find athletes registered for this event who have a high potential alert generated recently
    # For a precise event attribution, we check if the assessment that caused the alert was tied to this event.
    # To simplify, we count athletes in this event who have a high potential alert.
    athlete_ids = session.exec(select(EventRegistration.athlete_id).where(EventRegistration.event_id == event_id)).all()
    high_potential_detected = session.exec(select(func.count(func.distinct(ScoutAlert.athlete_id))).where(ScoutAlert.athlete_id.in_(athlete_ids)).where(ScoutAlert.type == "HIGH_POTENTIAL_PROFILE")).first() or 0
    
    # Top athlete
    top_athlete = None
    if athlete_ids:
        from app.modules.athlete_dna.models import SportProfile
        potentials = session.exec(select(SportPotential).where(SportPotential.athlete_id.in_(athlete_ids)).order_by(SportPotential.suitability_score.desc())).all()
        if potentials:
            best_pot = potentials[0]
            ath = session.get(Athlete, best_pot.athlete_id)
            sp = session.get(SportProfile, best_pot.sport_profile_id)
            if ath and sp:
                top_athlete = {
                    "id": ath.user_id,
                    "athlete_id": ath.id,
                    "name": ath.name,
                    "sport": sp.name,
                    "potential": best_pot.suitability_score
                }
            
    return {
        "checked_in": checked_in,
        "assessments_completed": assessments_completed,
        "currently_testing": currently_testing,
        "high_potential_detected": high_potential_detected,
        "top_athlete": top_athlete
    }
