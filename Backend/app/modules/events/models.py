from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class EventBase(SQLModel):
    name: str
    organization_id: str
    organizer_name: str
    location: str
    date: datetime
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    capacity: int
    status: str = Field(default="UPCOMING") # UPCOMING, LIVE, PAST
    sports_json: str = Field(default="[]") # JSON list of eligible sports
    assessments_json: str = Field(default="[]") # JSON list of assessment names/IDs

class Event(EventBase, table=True):
    __tablename__ = "events"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EventRegistrationBase(SQLModel):
    event_id: int = Field(foreign_key="events.id")
    athlete_id: int = Field(foreign_key="athletes.id")
    status: str = Field(default="REGISTERED") # REGISTERED, CHECKED_IN, CANCELLED, WAITLIST

class EventRegistration(EventRegistrationBase, table=True):
    __tablename__ = "event_registrations"
    id: Optional[int] = Field(default=None, primary_key=True)
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    checked_in_at: Optional[datetime] = None
