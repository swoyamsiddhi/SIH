from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DimensionExplanation(BaseModel):
    score: float
    metric: str
    raw_value: float
    unit: str
    benchmark_group: str
    calculation_method: str

class AthleteDNAResponse(BaseModel):
    athlete_id: int
    data_completeness: float
    calculation_version: str
    updated_at: datetime
    
    dimensions: Dict[str, Optional[float]]
    explanations: Dict[str, DimensionExplanation]
    missing_dimensions: List[str]

    class Config:
        from_attributes = True

class SportMatchResponse(BaseModel):
    sport_id: int
    sport_name: str
    suitability_score: float
    confidence_score: float
    strengths: List[str]
    development_gaps: List[str]
    explanation: Dict[str, Any]
    calculation_version: str

    class Config:
        from_attributes = True
