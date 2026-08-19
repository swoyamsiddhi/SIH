from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.modules.athletes.schemas import AthleteResponse
from app.modules.scouts.models import ScoutAlert, Shortlist

class ScoutDashboardStats(BaseModel):
    athletes_assessed: int
    high_potential: int
    new_alerts: int
    upcoming_events: int

class ScoutDiscoveryFilters(BaseModel):
    sport: Optional[str] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    location: Optional[str] = None
    min_potential: Optional[float] = None
    growth_trend: Optional[str] = None
    verified_only: bool = False
    
class ScoutAthleteResponse(BaseModel):
    athlete: AthleteResponse
    sport_potential: Optional[float] = None
    growth_trend: Optional[str] = None
    verification_score: Optional[float] = None
    scout_review_score: Optional[float] = None

class CopilotQueryRequest(BaseModel):
    query: str

class CopilotQueryResponse(BaseModel):
    filters: ScoutDiscoveryFilters
    explanation: str

class ShortlistCreate(BaseModel):
    name: str
    sport: str
    age_group: str
    
class ShortlistResponse(BaseModel):
    id: int
    name: str
    sport: str
    age_group: str
    scout_id: int
    created_at: datetime
    athletes: List[AthleteResponse] = []
