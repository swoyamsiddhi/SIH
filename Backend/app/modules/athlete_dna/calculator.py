from typing import List, Dict, Optional, Tuple
from sqlmodel import Session, select
from app.modules.athletes.models import Athlete
from app.modules.assessments.models import AssessmentResult, Assessment, AssessmentType
from .models import AthleteDNA, DNADimensionSource, NormativeReference
from datetime import date
import json

def calculate_z_score(value: float, mean: float, std_dev: float) -> float:
    """Calculates Z-Score and converts it to a 0-100 scale"""
    if std_dev == 0:
        return 50.0
    z = (value - mean) / std_dev
    # Map Z-score -3 to +3 to 0-100 scale. Z=0 becomes 50.
    score = (z * 16.66) + 50
    return max(0.0, min(100.0, score))

def _get_latest_result(session: Session, athlete_id: int, type_name: str) -> Optional[AssessmentResult]:
    # Find latest verified assessment of a given type
    statement = (
        select(AssessmentResult)
        .join(Assessment)
        .join(AssessmentType)
        .where(Assessment.athlete_id == athlete_id)
        .where(AssessmentType.name == type_name)
        .where(AssessmentResult.verification_score >= 80)
        .order_by(AssessmentResult.created_at.desc())
    )
    return session.exec(statement).first()

def _get_normative_reference(session: Session, metric: str, age: int, sex: str) -> Optional[NormativeReference]:
    statement = (
        select(NormativeReference)
        .where(NormativeReference.metric == metric)
        .where(NormativeReference.age_group_min <= age)
        .where(NormativeReference.age_group_max >= age)
        .where(NormativeReference.sex == sex)
    )
    return session.exec(statement).first()

def calculate_athlete_dna(session: Session, athlete: Athlete) -> Tuple[AthleteDNA, List[DNADimensionSource]]:
    """Calculates Athlete DNA from verified assessment results using Normative References."""
    
    # Calculate age
    age = athlete.age if getattr(athlete, 'age', None) else 16
    sex = getattr(athlete, 'gender', 'M') # Default to M if not present

    vjump = _get_latest_result(session, athlete.id, "Vertical Jump")
    squat = _get_latest_result(session, athlete.id, "Squat")
    pushup = _get_latest_result(session, athlete.id, "Push-up")
    
    dna = AthleteDNA(athlete_id=athlete.id)
    sources = []
    
    dimensions_found = 0
    total_dimensions = 8
    
    # POWER (derived from Vertical Jump)
    if vjump and vjump.metrics:
        metrics = vjump.metrics
        if 'average_height_cm' in metrics:
            val = metrics['average_height_cm']
            confidence = metrics.get('confidence_score', 85.0) # From sensor fusion verification
            
            ref = _get_normative_reference(session, "vertical_jump_cm", age, sex)
            if ref:
                score = calculate_z_score(val, mean=ref.mean_value, std_dev=ref.std_dev)
                dna.power = score
                dna.power_confidence = confidence
                dimensions_found += 1
                sources.append(DNADimensionSource(
                    dimension="power",
                    metric="vertical_jump_cm",
                    raw_value=val,
                    unit="cm",
                    normalized_value=score,
                    benchmark_group=f"Age {ref.age_group_min}-{ref.age_group_max} {ref.sex}",
                    source_assessment_id=vjump.assessment_id,
                    calculation_method=f"z-score (mean={ref.mean_value}, std={ref.std_dev}) source: {ref.source}"
                ))

    # MOVEMENT & BALANCE (derived from Squat Form Score)
    if squat and squat.metrics:
        metrics = squat.metrics
        if 'form_analysis' in metrics and 'form_score' in metrics['form_analysis']:
            val = metrics['form_analysis']['form_score']
            confidence = metrics.get('confidence_score', 80.0)
            
            ref = _get_normative_reference(session, "squat_form_score", age, sex)
            mean = ref.mean_value if ref else 70.0
            std = ref.std_dev if ref else 15.0
            
            score = calculate_z_score(val, mean=mean, std_dev=std)
            dna.movement_quality = score
            dna.movement_quality_confidence = confidence
            dna.balance = score * 0.9 
            dna.balance_confidence = confidence * 0.9
            dimensions_found += 2
            
            sources.append(DNADimensionSource(
                dimension="movement_quality",
                metric="form_score",
                raw_value=val,
                unit="score",
                normalized_value=score,
                benchmark_group="Eurofit/Standard" if ref else "Fallback Baseline",
                source_assessment_id=squat.assessment_id,
                calculation_method=f"z-score (mean={mean}, std={std})"
            ))

    # ENDURANCE (derived from Push-up max reps)
    if pushup and pushup.metrics_json:
        metrics = json.loads(pushup.metrics_json)
        if 'rep_count' in metrics:
            val = metrics['rep_count']
            confidence = metrics.get('confidence_score', 90.0)
            
            ref = _get_normative_reference(session, "pushup_max_reps", age, sex)
            mean = ref.mean_value if ref else 30.0
            std = ref.std_dev if ref else 15.0
            
            score = calculate_z_score(val, mean=mean, std_dev=std)
            dna.endurance = score
            dna.endurance_confidence = confidence
            dimensions_found += 1
            sources.append(DNADimensionSource(
                dimension="endurance",
                metric="max_reps",
                raw_value=val,
                unit="reps",
                normalized_value=score,
                benchmark_group="Eurofit/Standard" if ref else "Fallback Baseline",
                source_assessment_id=pushup.assessment_id,
                calculation_method=f"z-score (mean={mean}, std={std})"
            ))
            
    dna.data_completeness = dimensions_found / total_dimensions
    
    return dna, sources

def process_and_save_athlete_dna(session: Session, athlete_id: int):
    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        return None
        
    dna, sources = calculate_athlete_dna(session, athlete)
    
    old_dna = session.exec(select(AthleteDNA).where(AthleteDNA.athlete_id == athlete_id)).first()
    if old_dna:
        old_sources = session.exec(select(DNADimensionSource).where(DNADimensionSource.athlete_dna_id == old_dna.id)).all()
        for src in old_sources:
            session.delete(src)
        session.delete(old_dna)
        session.commit()
        
    session.add(dna)
    session.commit()
    session.refresh(dna)
    
    for source in sources:
        source.athlete_dna_id = dna.id
        session.add(source)
        
    session.commit()
    return dna
