from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Dict, Any
import json
from app.core.database import get_session
from app.modules.auth.models import User
from app.modules.athletes.routes import get_current_user
from .models import AthleteDNA, DNADimensionSource, SportPotential, SportProfile
from .schemas import AthleteDNAResponse, DimensionExplanation, SportMatchResponse

router = APIRouter(prefix="/athletes/me", tags=["athlete_dna"])

@router.get("/dna", response_model=AthleteDNAResponse)
def get_my_dna(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    dna = session.exec(select(AthleteDNA).where(AthleteDNA.athlete_id == current_user.id)).first()
    if not dna:
        raise HTTPException(status_code=404, detail="Athlete DNA not yet calculated")
        
    sources = session.exec(select(DNADimensionSource).where(DNADimensionSource.athlete_dna_id == dna.id)).all()
    
    dimensions = {
        "speed": dna.speed,
        "power": dna.power,
        "agility": dna.agility,
        "endurance": dna.endurance,
        "reaction": dna.reaction,
        "flexibility": dna.flexibility,
        "balance": dna.balance,
        "movement_quality": dna.movement_quality
    }
    
    missing_dimensions = [k for k, v in dimensions.items() if v is None]
    
    explanations = {}
    for s in sources:
        explanations[s.dimension] = DimensionExplanation(
            score=s.normalized_value,
            metric=s.metric,
            raw_value=s.raw_value,
            unit=s.unit,
            benchmark_group=s.benchmark_group,
            calculation_method=s.calculation_method
        )
        
    return AthleteDNAResponse(
        athlete_id=dna.athlete_id,
        data_completeness=dna.data_completeness,
        calculation_version=dna.calculation_version,
        updated_at=dna.updated_at,
        dimensions=dimensions,
        explanations=explanations,
        missing_dimensions=missing_dimensions
    )

@router.get("/sport-potential", response_model=List[SportMatchResponse])
def get_my_sport_potential(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    potentials = session.exec(select(SportPotential).where(SportPotential.athlete_id == current_user.id).order_by(SportPotential.suitability_score.desc())).all()
    
    results = []
    for pot in potentials:
        profile = session.get(SportProfile, pot.sport_profile_id)
        results.append(SportMatchResponse(
            sport_id=pot.sport_profile_id,
            sport_name=profile.name if profile else "Unknown",
            suitability_score=pot.suitability_score,
            confidence_score=pot.confidence_score,
            strengths=json.loads(pot.strengths_json),
            development_gaps=json.loads(pot.development_gaps_json),
            explanation=json.loads(pot.explanation_json),
            calculation_version=pot.calculation_version
        ))
        
    return results
