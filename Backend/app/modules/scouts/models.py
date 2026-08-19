from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from datetime import datetime

class ScoutAlert(SQLModel, table=True):
    __tablename__ = "scout_alerts"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_id: int = Field(foreign_key="athletes.id")
    scout_id: Optional[int] = Field(default=None, foreign_key="users.id") # Null for organization alerts
    organization_id: Optional[str] = Field(default=None, index=True) # e.g. "XYZ Sports Academy"
    alert_type: str = Field(index=True) # HIGH_POTENTIAL_PROFILE, RISING_PERFORMANCE
    sport: str = Field(index=True)
    reasons: List[str] = Field(sa_column=Column(JSON))
    read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShortlistAthleteLink(SQLModel, table=True):
    __tablename__ = "shortlist_athlete_link"
    shortlist_id: int = Field(foreign_key="shortlists.id", primary_key=True)
    athlete_id: int = Field(foreign_key="athletes.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Shortlist(SQLModel, table=True):
    __tablename__ = "shortlists"
    id: Optional[int] = Field(default=None, primary_key=True)
    scout_id: int = Field(foreign_key="users.id", index=True)
    name: str
    sport: str
    age_group: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
