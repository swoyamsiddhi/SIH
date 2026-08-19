from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class EventCreate(BaseModel):
    name: str
    organization_id: str
    organizer_name: str
    location: str
    date: datetime
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    capacity: int
    sports: List[str] = []
    assessments: List[str] = []

class EventResponse(BaseModel):
    id: int
    name: str
    organization_id: str
    organizer_name: str
    location: str
    date: datetime
    min_age: Optional[int]
    max_age: Optional[int]
    capacity: int
    status: str
    sports: List[str]
    assessments: List[str]
    registered_count: int = 0
    created_at: datetime

class RegistrationRequest(BaseModel):
    athlete_id: int

class RegistrationResponse(BaseModel):
    event_id: int
    athlete_id: int
    status: str
    registered_at: datetime
    checked_in_at: Optional[datetime]
