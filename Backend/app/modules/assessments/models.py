from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON, Column
from datetime import datetime
import uuid

class AssessmentType(SQLModel, table=True):
    __tablename__ = "assessment_types"
    id: str = Field(primary_key=True) # e.g., 'vertical-jump'
    name: str
    category: str
    measures: str

class AssessmentBase(SQLModel):
    athlete_id: int = Field(foreign_key="athletes.id")
    type_id: str = Field(foreign_key="assessment_types.id")
    event_id: Optional[int] = Field(default=None, foreign_key="events.id")
    device_id: Optional[str] = None
    started_at: datetime
    completed_at: datetime
    client_timestamp: datetime
    raw_data_reference: Optional[str] = None # S3 URL for video/IMU zip
    status: str = Field(default="PENDING") # PENDING, SYNCING, SYNCED, FAILED
    sync_version: int = Field(default=1)

class Assessment(AssessmentBase, table=True):
    __tablename__ = "assessments"
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    server_timestamp: datetime = Field(default_factory=datetime.utcnow)

class AssessmentResultBase(SQLModel):
    assessment_id: str = Field(foreign_key="assessments.id", unique=True)
    verification_status: str # VERIFIED, REJECTED, FLAGGED
    verification_score: float
    confidence_score: float
    model_version: str
    metrics: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

class AssessmentResult(AssessmentResultBase, table=True):
    __tablename__ = "assessment_results"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
