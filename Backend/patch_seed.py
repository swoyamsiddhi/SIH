import re

with open("c:/Users/Prithish/OneDrive/Desktop/SIH-hackathon-main/backend/app/seed.py", "r") as f:
    content = f.read()

# 1. Add imports
imports_to_add = """from app.modules.events.models import Event, EventRegistration
import json
"""
content = content.replace("from app.modules.scouts.alerts import evaluate_scout_rules", 
                          "from app.modules.scouts.alerts import evaluate_scout_rules\n" + imports_to_add)


# 2. Add seed_events function
seed_events_func = """
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
"""
content = content.replace("def seed_sports(session: Session):", seed_events_func + "\ndef seed_sports(session: Session):")


# 3. Update run_seed
new_run_seed = """def run_seed():
    reset_db()
    with Session(engine) as session:
        users = seed_users(session)
        athletes = seed_cohort(session, users)
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
"""

# Replace the run_seed block
content = re.sub(r'def run_seed\(\):.*?logger\.info\("Database Seeding Complete!.*?\)', new_run_seed.strip(), content, flags=re.DOTALL)

with open("c:/Users/Prithish/OneDrive/Desktop/SIH-hackathon-main/backend/app/seed.py", "w", encoding="utf-8") as f:
    f.write(content)

