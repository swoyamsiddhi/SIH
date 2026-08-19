import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from app.db.database import get_session
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import User
from app.modules.athletes.models import Athlete
from app.modules.assessments.models import Assessment
from app.modules.scouts.models import ScoutAlert, Shortlist, ShortlistAthleteLink
from app.modules.scouts.schemas import (
    ScoutDashboardStats, 
    ScoutDiscoveryFilters,
    ScoutAthleteResponse,
    CopilotQueryRequest,
    CopilotQueryResponse,
    ShortlistCreate,
    ShortlistResponse
)
from app.modules.scouts.discovery import discover_athletes
from app.modules.scouts.copilot import parse_natural_language_query

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/scouts", tags=["Scouts"])

def require_scout_or_admin(user: User = Depends(get_current_user)):
    if user.role not in ["SCOUT", "ADMIN", "SAI_ADMIN"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access restricted to scouts and admins")
    return user

@router.get("/dashboard", response_model=ScoutDashboardStats)
def get_dashboard_stats(session: Session = Depends(get_session), user: User = Depends(require_scout_or_admin)):
    """Return mock or live stats for the scout dashboard based on real PostgreSQL data"""
    athletes_assessed = session.exec(select(Athlete)).all()
    # E.g. high potential is anyone with an alert type HIGH_POTENTIAL_PROFILE
    high_potential = session.exec(select(ScoutAlert).where(ScoutAlert.alert_type == "HIGH_POTENTIAL_PROFILE")).all()
    
    # Filter alerts by user's organization or specific assignment
    if user.role == "SCOUT":
        alerts_query = select(ScoutAlert).where(
            (ScoutAlert.scout_id == user.id) | 
            ((ScoutAlert.organization_id == user.organization_id) if user.organization_id else False) |
            (ScoutAlert.organization_id == "GLOBAL")
        )
    else:
        alerts_query = select(ScoutAlert) # Admins see all
        
    new_alerts = len(session.exec(alerts_query.where(ScoutAlert.read == False)).all())
    
    return ScoutDashboardStats(
        athletes_assessed=len(athletes_assessed),
        high_potential=len(set([a.athlete_id for a in high_potential])), # unique athletes
        new_alerts=new_alerts,
        upcoming_events=0 # Placeholder until Events module
    )

@router.post("/discover", response_model=List[ScoutAthleteResponse])
def search_discover_athletes(
    filters: ScoutDiscoveryFilters, 
    session: Session = Depends(get_session), 
    user: User = Depends(require_scout_or_admin)
):
    """Structured discovery query"""
    results = discover_athletes(session, filters)
    # The return format expects nested athlete structure matching ScoutAthleteResponse
    return results

@router.post("/copilot/parse", response_model=CopilotQueryResponse)
def copilot_parse_query(
    request: CopilotQueryRequest, 
    user: User = Depends(require_scout_or_admin)
):
    """Parses natural language query into structured filters"""
    parsed = parse_natural_language_query(request.query)
    return CopilotQueryResponse(
        filters=ScoutDiscoveryFilters(**parsed["filters"]),
        explanation=parsed["explanation"]
    )

@router.get("/alerts", response_model=List[dict]) # Simple dict response for now
def get_scout_alerts(session: Session = Depends(get_session), user: User = Depends(require_scout_or_admin)):
    if user.role == "SCOUT":
        query = select(ScoutAlert).where(
            (ScoutAlert.scout_id == user.id) | 
            ((ScoutAlert.organization_id == user.organization_id) if user.organization_id else False) |
            (ScoutAlert.organization_id == "GLOBAL")
        )
    else:
        query = select(ScoutAlert)
        
    alerts = session.exec(query.order_by(ScoutAlert.created_at.desc())).all()
    return alerts

@router.post("/shortlists", response_model=ShortlistResponse)
def create_shortlist(
    data: ShortlistCreate, 
    session: Session = Depends(get_session), 
    user: User = Depends(require_scout_or_admin)
):
    sl = Shortlist(
        scout_id=user.id,
        name=data.name,
        sport=data.sport,
        age_group=data.age_group
    )
    session.add(sl)
    session.commit()
    session.refresh(sl)
    return sl

@router.get("/shortlists", response_model=List[ShortlistResponse])
def list_shortlists(session: Session = Depends(get_session), user: User = Depends(require_scout_or_admin)):
    shortlists = session.exec(select(Shortlist).where(Shortlist.scout_id == user.id)).all()
    # Optionally load athletes per shortlist. For now return empty arrays for athletes.
    results = []
    for sl in shortlists:
        sl_dict = sl.dict()
        sl_dict["athletes"] = []
        
        links = session.exec(select(ShortlistAthleteLink).where(ShortlistAthleteLink.shortlist_id == sl.id)).all()
        for link in links:
            ath = session.get(Athlete, link.athlete_id)
            if ath:
                sl_dict["athletes"].append(ath)
                
        results.append(sl_dict)
    return results

@router.post("/shortlists/{shortlist_id}/athletes/{athlete_id}")
def add_athlete_to_shortlist(
    shortlist_id: int, 
    athlete_id: int, 
    session: Session = Depends(get_session), 
    user: User = Depends(require_scout_or_admin)
):
    sl = session.get(Shortlist, shortlist_id)
    if not sl or sl.scout_id != user.id:
        raise HTTPException(status_code=403, detail="Shortlist not found or access denied")
        
    existing = session.exec(select(ShortlistAthleteLink).where(
        ShortlistAthleteLink.shortlist_id == shortlist_id,
        ShortlistAthleteLink.athlete_id == athlete_id
    )).first()
    
    if not existing:
        link = ShortlistAthleteLink(shortlist_id=shortlist_id, athlete_id=athlete_id)
        session.add(link)
        session.commit()
    return {"status": "success"}

@router.get("/athletes/{athlete_id}", response_model=ScoutAthleteResponse)
def get_athlete_profile(
    athlete_id: int, 
    session: Session = Depends(get_session), 
    user: User = Depends(require_scout_or_admin)
):
    # Quick wrapper to reuse discover engine logic on single ID by providing no filters and manual check
    filters = ScoutDiscoveryFilters()
    all_results = discover_athletes(session, filters, limit=1000)
    for res in all_results:
        if res["athlete"].id == athlete_id:
            return res
            
    raise HTTPException(status_code=404, detail="Athlete not found or unauthorized")
