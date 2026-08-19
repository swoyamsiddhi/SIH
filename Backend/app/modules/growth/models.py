from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class GrowthRecord(SQLModel, table=True):
    __tablename__ = "growth_records"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_id: int = Field(foreign_key="athletes.id")
    metric: str
    raw_value: float
    unit: str
    assessment_id: Optional[int] = Field(default=None, foreign_key="assessment_results.id")
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
    
    previous_value: Optional[float] = None
    improvement_absolute: Optional[float] = None
    improvement_percentage: Optional[float] = None
    trend: Optional[str] = None # improving, stable, declining, insufficient_data
    data_points_count: int = 1

class PersonalBest(SQLModel, table=True):
    __tablename__ = "personal_bests"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_id: int = Field(foreign_key="athletes.id")
    metric: str
    value: float
    unit: str
    assessment_id: Optional[int] = Field(default=None, foreign_key="assessment_results.id")
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
