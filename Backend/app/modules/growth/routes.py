from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.core.database import get_session
from app.modules.auth.models import User
from app.modules.auth.routes import get_current_user
from app.modules.athletes.models import Athlete
from .models import GrowthRecord, PersonalBest
from .schemas import GrowthRecordResponse, PersonalBestResponse, GrowthSummaryResponse

router = APIRouter(prefix="/athletes", tags=["growth"])

def get_athlete(user_id: int, session: Session) -> Athlete:
    athlete = session.exec(select(Athlete).where(Athlete.user_id == user_id)).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete

@router.get("/me/growth/history", response_model=List[GrowthRecordResponse])
def get_my_growth_history(
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    athlete = get_athlete(current_user.id, session)
    records = session.exec(
        select(GrowthRecord)
        .where(GrowthRecord.athlete_id == athlete.id)
        .order_by(GrowthRecord.recorded_at.desc())
    ).all()
    return records

@router.get("/me/personal-bests", response_model=List[PersonalBestResponse])
def get_my_personal_bests(
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    athlete = get_athlete(current_user.id, session)
    pbs = session.exec(
        select(PersonalBest).where(PersonalBest.athlete_id == athlete.id)
    ).all()
    return pbs

@router.get("/me/growth/summary", response_model=GrowthSummaryResponse)
def get_my_growth_summary(
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    athlete = get_athlete(current_user.id, session)
    
    # Get latest record per metric
    records = session.exec(
        select(GrowthRecord)
        .where(GrowthRecord.athlete_id == athlete.id)
        .order_by(GrowthRecord.recorded_at.desc())
    ).all()
    
    latest_per_metric = {}
    for r in records:
        if r.metric not in latest_per_metric:
            latest_per_metric[r.metric] = r
            
    recent_records = list(latest_per_metric.values())
    
    improving = sum(1 for r in recent_records if r.trend == "improving")
    stable = sum(1 for r in recent_records if r.trend == "stable")
    declining = sum(1 for r in recent_records if r.trend == "declining")
    
    pbs = session.exec(
        select(PersonalBest).where(PersonalBest.athlete_id == athlete.id)
    ).all()
    
    return GrowthSummaryResponse(
        athlete_id=athlete.id,
        metrics_tracked=len(recent_records),
        improving_metrics=improving,
        stable_metrics=stable,
        declining_metrics=declining,
        recent_records=recent_records,
        personal_bests=pbs
    )
