from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from app.core.database import get_session
from app.modules.admin.schemas import NationalKPIs, TalentHotspot, LiveEventTelemetry
from app.modules.admin.analytics import get_national_kpis, get_talent_hotspots, get_live_telemetry

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get("/analytics/kpi", response_model=NationalKPIs)
def kpis(session: Session = Depends(get_session)):
    return get_national_kpis(session)

@router.get("/analytics/hotspots", response_model=List[TalentHotspot])
def hotspots(session: Session = Depends(get_session)):
    return get_talent_hotspots(session)

@router.get("/events/live/{event_id}", response_model=LiveEventTelemetry)
def live_event(event_id: int, session: Session = Depends(get_session)):
    return get_live_telemetry(session, event_id)
