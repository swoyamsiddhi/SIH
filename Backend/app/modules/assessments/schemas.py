from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AssessmentSyncRequest(BaseModel):
    type_id: str
    device_id: Optional[str] = None
    started_at: datetime
    completed_at: datetime
    client_timestamp: datetime
    raw_data_reference: Optional[str] = None # Expected S3 URL after direct upload

class AssessmentResponse(BaseModel):
    id: str
    athlete_id: int
    type_id: str
    status: str
    sync_version: int

    class Config:
        from_attributes = True

class AssessmentResultResponse(BaseModel):
    verification_status: str
    verification_score: float
    confidence_score: float
    metrics: Dict[str, Any]

    class Config:
        from_attributes = True
