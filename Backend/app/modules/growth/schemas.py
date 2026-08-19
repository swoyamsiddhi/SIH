from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class GrowthRecordResponse(BaseModel):
    id: int
    metric: str
    raw_value: float
    unit: str
    assessment_id: Optional[int]
    recorded_at: datetime
    previous_value: Optional[float]
    improvement_absolute: Optional[float]
    improvement_percentage: Optional[float]
    trend: Optional[str]
    data_points_count: int

class PersonalBestResponse(BaseModel):
    id: int
    metric: str
    value: float
    unit: str
    assessment_id: Optional[int]
    recorded_at: datetime

class GrowthSummaryResponse(BaseModel):
    athlete_id: int
    metrics_tracked: int
    improving_metrics: int
    stable_metrics: int
    declining_metrics: int
    recent_records: List[GrowthRecordResponse]
    personal_bests: List[PersonalBestResponse]
