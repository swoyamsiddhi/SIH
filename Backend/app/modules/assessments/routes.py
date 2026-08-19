from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from app.core.database import get_session
from app.modules.athletes.routes import get_current_user
from app.modules.auth.models import User
from app.modules.athletes.models import Athlete
from .models import Assessment, AssessmentType, AssessmentResult
from .schemas import AssessmentSyncRequest, AssessmentResponse, AssessmentResultResponse

router = APIRouter(prefix="/assessments", tags=["assessments"])

def process_assessment_task(assessment_id: str):
    # This simulates the Celery AI Pipeline processing.
    # In full production, this would dispatch to Celery.
    print(f"Mock Celery AI Pipeline processing for {assessment_id}")
    pass

@router.post("/sync", response_model=AssessmentResponse)
def sync_assessment(
    sync_req: AssessmentSyncRequest, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    athlete = session.exec(select(Athlete).where(Athlete.user_id == current_user.id)).first()
    if not athlete:
        raise HTTPException(status_code=400, detail="User has no athlete profile")
    
    # Verify assessment type exists
    atype = session.exec(select(AssessmentType).where(AssessmentType.id == sync_req.type_id)).first()
    if not atype:
        raise HTTPException(status_code=400, detail="Invalid assessment type")
    
    assessment = Assessment(**sync_req.model_dump(), athlete_id=athlete.id, status="SYNCED")
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    
    # Trigger AI Pipeline worker (FastAPI Background Task for now, later Celery)
    background_tasks.add_task(process_assessment_task, str(assessment.id))
    
    return assessment

@router.get("/{id}/result", response_model=AssessmentResultResponse)
def get_assessment_result(
    id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    athlete = session.exec(select(Athlete).where(Athlete.user_id == current_user.id)).first()
    assessment = session.exec(select(Assessment).where(Assessment.id == id)).first()
    
    if not assessment or (athlete and assessment.athlete_id != athlete.id):
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    result = session.exec(select(AssessmentResult).where(AssessmentResult.assessment_id == id)).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not yet processed")
        
    return result
