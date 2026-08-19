from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import json

from app.core.database import get_session
from app.modules.events.models import Event, EventRegistration
from app.modules.events.schemas import EventCreate, EventResponse, RegistrationRequest, RegistrationResponse
from app.modules.athletes.models import Athlete

router = APIRouter(prefix="/api/v1/events", tags=["events"])

@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, session: Session = Depends(get_session)):
    db_event = Event(
        name=event.name,
        organization_id=event.organization_id,
        organizer_name=event.organizer_name,
        location=event.location,
        date=event.date,
        min_age=event.min_age,
        max_age=event.max_age,
        capacity=event.capacity,
        sports_json=json.dumps(event.sports),
        assessments_json=json.dumps(event.assessments),
        status="UPCOMING"
    )
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    
    return EventResponse(
        id=db_event.id,
        name=db_event.name,
        organization_id=db_event.organization_id,
        organizer_name=db_event.organizer_name,
        location=db_event.location,
        date=db_event.date,
        min_age=db_event.min_age,
        max_age=db_event.max_age,
        capacity=db_event.capacity,
        status=db_event.status,
        sports=json.loads(db_event.sports_json),
        assessments=json.loads(db_event.assessments_json),
        registered_count=0,
        created_at=db_event.created_at
    )

@router.get("/", response_model=List[EventResponse])
def get_events(session: Session = Depends(get_session)):
    events = session.exec(select(Event)).all()
    res = []
    for ev in events:
        registered_count = len(session.exec(select(EventRegistration).where(EventRegistration.event_id == ev.id)).all())
        res.append(EventResponse(
            id=ev.id,
            name=ev.name,
            organization_id=ev.organization_id,
            organizer_name=ev.organizer_name,
            location=ev.location,
            date=ev.date,
            min_age=ev.min_age,
            max_age=ev.max_age,
            capacity=ev.capacity,
            status=ev.status,
            sports=json.loads(ev.sports_json),
            assessments=json.loads(ev.assessments_json),
            registered_count=registered_count,
            created_at=ev.created_at
        ))
    return res

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, session: Session = Depends(get_session)):
    ev = session.get(Event, event_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
        
    registered_count = len(session.exec(select(EventRegistration).where(EventRegistration.event_id == ev.id)).all())
    return EventResponse(
        id=ev.id,
        name=ev.name,
        organization_id=ev.organization_id,
        organizer_name=ev.organizer_name,
        location=ev.location,
        date=ev.date,
        min_age=ev.min_age,
        max_age=ev.max_age,
        capacity=ev.capacity,
        status=ev.status,
        sports=json.loads(ev.sports_json),
        assessments=json.loads(ev.assessments_json),
        registered_count=registered_count,
        created_at=ev.created_at
    )

@router.post("/{event_id}/register", response_model=RegistrationResponse)
def register_athlete(event_id: int, req: RegistrationRequest, session: Session = Depends(get_session)):
    ev = session.get(Event, event_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
        
    athlete = session.get(Athlete, req.athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
        
    # Check duplicate
    existing = session.exec(select(EventRegistration).where(EventRegistration.event_id == event_id).where(EventRegistration.athlete_id == athlete.id)).first()
    if existing:
        if existing.status != "CANCELLED":
            raise HTTPException(status_code=400, detail="Athlete already registered")
        else:
            # Re-register
            existing.status = "REGISTERED"
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing
            
    # Check eligibility
    if ev.status not in ["UPCOMING", "LIVE"]:
        raise HTTPException(status_code=400, detail="Event is no longer open for registration")
        
    if ev.min_age and athlete.age < ev.min_age:
        raise HTTPException(status_code=400, detail="Athlete is too young for this event")
        
    if ev.max_age and athlete.age > ev.max_age:
        raise HTTPException(status_code=400, detail="Athlete is too old for this event")
        
    # Check capacity
    registered_count = len(session.exec(select(EventRegistration).where(EventRegistration.event_id == ev.id).where(EventRegistration.status != "CANCELLED")).all())
    status = "REGISTERED"
    if registered_count >= ev.capacity:
        status = "WAITLIST"
        
    reg = EventRegistration(
        event_id=event_id,
        athlete_id=athlete.id,
        status=status
    )
    session.add(reg)
    session.commit()
    session.refresh(reg)
    return reg

@router.post("/{event_id}/checkin", response_model=RegistrationResponse)
def checkin_athlete(event_id: int, req: RegistrationRequest, session: Session = Depends(get_session)):
    reg = session.exec(select(EventRegistration).where(EventRegistration.event_id == event_id).where(EventRegistration.athlete_id == req.athlete_id)).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
        
    if reg.status == "CHECKED_IN":
        raise HTTPException(status_code=400, detail="Already checked in")
        
    if reg.status != "REGISTERED":
        raise HTTPException(status_code=400, detail="Cannot check in (status is {})".format(reg.status))
        
    reg.status = "CHECKED_IN"
    reg.checked_in_at = datetime.utcnow()
    session.add(reg)
    session.commit()
    session.refresh(reg)
    return reg
