import logging
from datetime import datetime, timedelta
from sqlmodel import Session, select
from app.core.database import engine, SQLModel
from app.core.security import get_password_hash
from app.modules.auth.models import User
from app.modules.athletes.models import Athlete
from app.modules.growth.models import GrowthRecord, PersonalBest
from app.modules.assessments.models import AssessmentType, Assessment, AssessmentResult
from app.modules.hardware.models import HardwareKit
from app.modules.athlete_dna.models import SportProfile, SportRequirement, NormativeReference
from app.modules.athlete_dna.calculator import process_and_save_athlete_dna
from app.modules.athlete_dna.matcher import calculate_sport_matching
from app.modules.growth.calculator import process_growth_for_athlete
from app.modules.scouts.alerts import evaluate_scout_rules
from app.modules.events.models import Event, EventRegistration
import json


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_db():
    logger.info("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    logger.info("Creating all tables...")
    SQLModel.metadata.create_all(engine)

def seed_users(session: Session) -> dict:
    logger.info("Seeding Demo Users...")
    users = {}
    roles = ["ATHLETE", "COACH", "SCOUT", "EVENT_ORGANIZER", "ADMIN", "SAI_ADMIN"]
    
    for role in roles:
        email = f"demo_{role.lower()}@khelnet.in"
        user = User(
            email=email,
            hashed_password=get_password_hash("password123"),
            role=role,
            organization_id="XYZ Sports Academy" if role == "SCOUT" else None,
            is_active=True
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        users[role] = user
        logger.info(f"Created user: {email} / password123")
        
    return users

def seed_cohort(session: Session, users: dict):
    logger.info("Seeding Diverse Athlete Cohort...")
    
    athletes_data = [
        {"name": "Neeraj", "age": 17, "location": "Chennai", "primary": "Sprinting", "trend": "improving"},
        {"name": "Rahul", "age": 18, "location": "Bengaluru", "primary": "Football", "trend": "stable"},
        {"name": "Vikram", "age": 16, "location": "Pune", "primary": "Basketball", "trend": "declining"},
        {"name": "Arjun", "age": 17, "location": "Delhi", "primary": "Sprinting", "trend": "insufficient"},
    ]
    
    created_athletes = []
    
    for i, data in enumerate(athletes_data):
        # Create user for athlete (except Neeraj who uses the demo athlete)
        if data["name"] == "Neeraj":
            user_id = users["ATHLETE"].id
        else:
            email = f"demo_athlete_{i}@khelnet.in"
            u = User(email=email, hashed_password=get_password_hash("password123"), role="ATHLETE", is_active=True)
            session.add(u)
            session.commit()
            session.refresh(u)
            user_id = u.id
            
        athlete = Athlete(
            user_id=user_id,
            name=data["name"],
            age=data["age"],
            location=data["location"],
            primary_sport=data["primary"],
            height_cm=175 + i,
            weight_kg=65 + i
        )
        session.add(athlete)
        session.commit()
        session.refresh(athlete)
        created_athletes.append((athlete, data["trend"]))
        
    logger.info("Seeding Assessment Types...")
    t = AssessmentType(id="vertical-jump", name="Vertical Jump", category="Physical", measures="Leg Power")
    session.add(t)
    session.commit()

    logger.info("Seeding Longitudinal Assessments...")
    
    for athlete, trend in created_athletes:
        num_assessments = 3
        if trend == "insufficient":
            num_assessments = 1
            
        base_jump = 40.0
        
        for i in range(num_assessments):
            days_ago = (num_assessments - i - 1) * 30
            date = datetime.utcnow() - timedelta(days=days_ago)
            
            a = Assessment(
                athlete_id=athlete.id,
                type_id="vertical-jump",
                device_id="KIT-001",
                started_at=date,
                completed_at=date,
                client_timestamp=date,
                status="SYNCED"
            )
            session.add(a)
            session.commit()
            session.refresh(a)
            
            # calculate score based on trend
            score = base_jump
            if trend == "improving":
                score = base_jump + (i * 3.5) # 40, 43.5, 47
            elif trend == "declining":
                score = base_jump - (i * 2.0) # 40, 38, 36
            elif trend == "stable":
                score = base_jump + (i * 0.1) # 40, 40.1, 40.2
                
            res = AssessmentResult(
                assessment_id=a.id,
                verification_status="VERIFIED",
                verification_score=95.0,
                confidence_score=90.0,
                model_version="v2.1",
                metrics={"average_height_cm": score} # mapped for calculator
            )
            session.add(res)
            session.commit()
            
    return [a[0] for a in created_athletes]

def seed_hardware(session: Session):
    logger.info("Seeding Hardware Kits...")
    kits = [
        HardwareKit(device_id="KIT-001", status="ACTIVE", assigned_to_org="SAI NCOE", battery_level=87, firmware_version="v1.2.0", last_sync=datetime.utcnow() - timedelta(minutes=5)),
        HardwareKit(device_id="KIT-002", status="INACTIVE", assigned_to_org="Delhi Athletics Club", battery_level=12, firmware_version="v1.1.9", last_sync=datetime.utcnow() - timedelta(days=2)),
        HardwareKit(device_id="KIT-003", status="ACTIVE", assigned_to_org="Haryana Sports School", battery_level=95, firmware_version="v1.2.0", last_sync=datetime.utcnow() - timedelta(minutes=15)),
        HardwareKit(device_id="KIT-004", status="MAINTENANCE", assigned_to_org="SAI Patiala", battery_level=0, firmware_version="v1.0.0", last_sync=datetime.utcnow() - timedelta(days=30)),
        HardwareKit(device_id="KIT-005", status="ACTIVE", assigned_to_org="Unassigned", battery_level=100, firmware_version="v1.2.1", last_sync=datetime.utcnow()),
    ]
    for kit in kits:
        session.add(kit)
    session.commit()


def seed_events(session: Session, athletes: list):
    logger.info("Seeding Events...")
    
    live_event = Event(
        name="Khelo Talent Hunt — Chennai",
        organization_id="XYZ Sports Academy",
        organizer_name="SAI Regional Sports Complex",
        location="Chennai, Tamil Nadu",
        date=datetime.utcnow(),
        capacity=500,
        status="LIVE",
        sports_json=json.dumps(["Sprinting", "Football"]),
        assessments_json=json.dumps(["Vertical Jump"])
    )
    upcoming_event = Event(
        name="National U-18 Trials",
        organization_id="SAI",
        organizer_name="SAI New Delhi",
        location="New Delhi, Delhi",
        date=datetime.utcnow() + timedelta(days=15),
        capacity=1000,
        status="UPCOMING",
        sports_json=json.dumps(["Sprinting", "Basketball"]),
        assessments_json=json.dumps(["Vertical Jump"])
    )
    past_event = Event(
        name="School Sports Assessment",
        organization_id="CBSE",
        organizer_name="CBSE Kanchipuram",
        location="Kanchipuram, Tamil Nadu",
        date=datetime.utcnow() - timedelta(days=20),
        capacity=200,
        status="PAST",
        sports_json=json.dumps(["Sprinting", "Badminton"]),
        assessments_json=json.dumps(["Vertical Jump", "Shuttle Run"])
    )
    session.add(live_event)
    session.add(upcoming_event)
    session.add(past_event)
    session.commit()
    session.refresh(live_event)
    
    # Register all seeded athletes to the LIVE event and CHECK them in
    for a in athletes:
        reg = EventRegistration(
            event_id=live_event.id,
            athlete_id=a.id,
            status="CHECKED_IN",
            checked_in_at=datetime.utcnow()
        )
        session.add(reg)
    session.commit()
    
    return live_event.id

def seed_normative_references(session: Session):
    logger.info("Seeding Normative References (Eurofit/Standard Prototype)...")
    norms = [
        # Vertical Jump (Power)
        NormativeReference(metric="vertical_jump_cm", age_group_min=15, age_group_max=18, sex="M", mean_value=45.0, std_dev=12.0, source="Eurofit Protocol (Adapted)", sample_size=1000, population_description="European Youth"),
        NormativeReference(metric="vertical_jump_cm", age_group_min=15, age_group_max=18, sex="F", mean_value=35.0, std_dev=9.0, source="Eurofit Protocol (Adapted)", sample_size=1000, population_description="European Youth"),
        # Squat Form (Movement)
        NormativeReference(metric="squat_form_score", age_group_min=0, age_group_max=99, sex="M", mean_value=70.0, std_dev=15.0, source="FMS (Adapted Baseline)", sample_size=500, population_description="General Athletic Population"),
        NormativeReference(metric="squat_form_score", age_group_min=0, age_group_max=99, sex="F", mean_value=72.0, std_dev=14.0, source="FMS (Adapted Baseline)", sample_size=500, population_description="General Athletic Population"),
        # Pushup (Endurance)
        NormativeReference(metric="pushup_max_reps", age_group_min=15, age_group_max=18, sex="M", mean_value=30.0, std_dev=15.0, source="ACSM Guidelines", sample_size=800, population_description="Youth Athletes"),
        NormativeReference(metric="pushup_max_reps", age_group_min=15, age_group_max=18, sex="F", mean_value=20.0, std_dev=12.0, source="ACSM Guidelines", sample_size=800, population_description="Youth Athletes"),
    ]
    for n in norms:
        session.add(n)
    session.commit()

def seed_sports(session: Session):
    logger.info("Seeding Sport Profiles...")
    sprint = SportProfile(name="Sprinting", description="100m, 200m and 400m dash")
    football = SportProfile(name="Football", description="Association Football (Soccer)")
    session.add(sprint)
    session.add(football)
    session.commit()
    session.refresh(sprint)
    session.refresh(football)
    
    reqs = [
        SportRequirement(sport_profile_id=sprint.id, dimension="power", weight=0.4, preferred_range_min=60.0, preferred_range_max=100.0, evidence_source="High correlation between CMJ peak power and 10m/20m acceleration phase (Sleivert & Taing, 2004)"),
        SportRequirement(sport_profile_id=sprint.id, dimension="endurance", weight=0.2, preferred_range_min=50.0, preferred_range_max=100.0, evidence_source="Anaerobic capacity requirement for 400m sprint maintenance"),
        SportRequirement(sport_profile_id=football.id, dimension="movement_quality", weight=0.3, preferred_range_min=60.0, preferred_range_max=100.0, evidence_source="High biomechanical efficiency required for repetitive high-intensity COD actions (Gabbett, 2010)"),
        SportRequirement(sport_profile_id=football.id, dimension="endurance", weight=0.4, preferred_range_min=70.0, preferred_range_max=100.0, evidence_source="9-12km total distance covered per match requiring high Yo-Yo IR1 test scores (Krustrup et al., 2003)"),
        SportRequirement(sport_profile_id=football.id, dimension="power", weight=0.2, preferred_range_min=50.0, preferred_range_max=100.0, evidence_source="Explosive jump power needed for aerial duels and short sprints (Stølen et al., 2005)"),
    ]
    for r in reqs:
        session.add(r)
    session.commit()

def run_seed():
    reset_db()
    with Session(engine) as session:
        users = seed_users(session)
        athletes = seed_cohort(session, users)
        seed_normative_references(session)
        seed_sports(session)
        seed_hardware(session)
        
        live_event_id = seed_events(session, athletes)
        
        logger.info("Linking assessments to live event...")
        for athlete in athletes:
            # Tie the most recent assessment to the live event
            assessments = session.exec(select(Assessment).where(Assessment.athlete_id == athlete.id).order_by(Assessment.started_at.desc())).all()
            if assessments:
                latest = assessments[0]
                latest.event_id = live_event_id
                session.add(latest)
        session.commit()
        
        for athlete in athletes:
            logger.info(f"Running engines for {athlete.name}...")
            process_and_save_athlete_dna(session, athlete.id)
            calculate_sport_matching(session, athlete.id)
            process_growth_for_athlete(session, athlete.id)
            evaluate_scout_rules(session, athlete.id)
        
        logger.info("Database Seeding Complete! ✅")

if __name__ == "__main__":
    run_seed()
