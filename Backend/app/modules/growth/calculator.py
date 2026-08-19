from sqlmodel import Session, select
from app.modules.assessments.models import AssessmentResult, Assessment
from app.modules.growth.models import GrowthRecord, PersonalBest
from typing import Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

# Define direction for metrics
HIGHER_IS_BETTER = ["average_height_cm", "pushups_count", "squats_count"]
LOWER_IS_BETTER = ["sprint_time_s", "shuttle_time_s"]

def _is_better(metric: str, new_val: float, old_val: float) -> bool:
    if metric in HIGHER_IS_BETTER:
        return new_val > old_val
    if metric in LOWER_IS_BETTER:
        return new_val < old_val
    return False # Unknown metric direction

def _calculate_trend(metric: str, values: list[float]) -> Tuple[str, str]:
    """
    Returns (trend, confidence) based on list of historical values (chronological).
    """
    if len(values) < 2:
        return "insufficient_data", "LOW"
    
    # 2 observations: simple comparison
    if len(values) == 2:
        is_imp = _is_better(metric, values[1], values[0])
        is_same = values[1] == values[0]
        if is_same:
            return "stable", "LOW"
        return "improving" if is_imp else "declining", "LOW"
        
    # 3+ observations: simple linear slope or recent majority
    # For simplicity, compare first to last, and check if middle points follow trend
    first = values[0]
    last = values[-1]
    
    is_imp = _is_better(metric, last, first)
    if last == first:
        return "stable", "MEDIUM" if len(values) < 5 else "HIGH"
        
    return "improving" if is_imp else "declining", "MEDIUM" if len(values) < 5 else "HIGH"

def process_growth_for_athlete(session: Session, athlete_id: int):
    """
    Recalculates all GrowthRecords and PersonalBests for the athlete.
    """
    logger.info(f"Calculating Growth Trajectory for Athlete {athlete_id}")
    
    # Fetch all verified assessment results for the athlete, sorted chronologically
    rows = session.exec(
        select(AssessmentResult, Assessment)
        .join(Assessment)
        .where(Assessment.athlete_id == athlete_id)
        .order_by(Assessment.started_at.asc())
    ).all()
    
    # Clear existing growth data for clean recalculation
    existing_growth = session.exec(select(GrowthRecord).where(GrowthRecord.athlete_id == athlete_id)).all()
    for g in existing_growth:
        session.delete(g)
        
    existing_pbs = session.exec(select(PersonalBest).where(PersonalBest.athlete_id == athlete_id)).all()
    for pb in existing_pbs:
        session.delete(pb)
        
    session.commit()
    
    # Group results by metric
    metrics_history = {}
    
    for res, assessment in rows:
        if not res.metrics:
            continue
        
        for metric, value in res.metrics.items():
            # Skip non-numeric or metadata
            if not isinstance(value, (int, float)):
                continue
            
            if metric not in metrics_history:
                metrics_history[metric] = []
                
            history = metrics_history[metric]
            prev_value = history[-1]['value'] if history else None
            
            # Improvement calculations
            imp_abs = None
            imp_pct = None
            if prev_value is not None:
                imp_abs = value - prev_value
                if prev_value != 0:
                    imp_pct = round((imp_abs / prev_value) * 100, 2)
                    
            history.append({
                'value': value,
                'assessment_id': res.id,
                'date': assessment.started_at,
                'imp_abs': imp_abs,
                'imp_pct': imp_pct
            })
            
    # Now generate GrowthRecords and PersonalBests
    for metric, history in metrics_history.items():
        best_val = history[0]['value']
        best_entry = history[0]
        
        values_only = []
        
        for i, entry in enumerate(history):
            values_only.append(entry['value'])
            trend, confidence = _calculate_trend(metric, values_only)
            
            # Check PB
            if i > 0 and _is_better(metric, entry['value'], best_val):
                best_val = entry['value']
                best_entry = entry
                
            gr = GrowthRecord(
                athlete_id=athlete_id,
                metric=metric,
                raw_value=entry['value'],
                unit="unit", # Can be mapped if needed
                assessment_id=entry['assessment_id'],
                recorded_at=entry['date'],
                previous_value=history[i-1]['value'] if i > 0 else None,
                improvement_absolute=entry['imp_abs'],
                improvement_percentage=entry['imp_pct'],
                trend=trend,
                data_points_count=len(values_only)
            )
            session.add(gr)
            
        # Save PB
        pb = PersonalBest(
            athlete_id=athlete_id,
            metric=metric,
            value=best_val,
            unit="unit",
            assessment_id=best_entry['assessment_id'],
            recorded_at=best_entry['date']
        )
        session.add(pb)
        
    session.commit()
    logger.info(f"Growth calculation complete for Athlete {athlete_id}")
