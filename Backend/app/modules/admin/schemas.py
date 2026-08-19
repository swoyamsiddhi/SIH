from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class NationalKPIs(BaseModel):
    athletes_assessed: int
    active_athletes: int
    high_potential: int
    events: int
    assessments_today: int
    regions_covered: int

class TalentHotspot(BaseModel):
    district: str
    state: str
    sport: str
    athletes: int
    growth: float

class LiveEventTelemetry(BaseModel):
    checked_in: int
    assessments_completed: int
    currently_testing: int
    high_potential_detected: int
    top_athlete: Optional[Dict[str, Any]]
