from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class AthleteBase(SQLModel):
    user_id: int = Field(foreign_key="users.id", unique=True)
    name: str
    age: int
    location: Optional[str] = None
    school: Optional[str] = None
    primary_sport: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    dominant_side: Optional[str] = None # Right/Left

class Athlete(AthleteBase, table=True):
    __tablename__ = "athletes"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
