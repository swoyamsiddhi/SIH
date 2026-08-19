import logging
from app.celery_app import celery_app
from app.core.database import engine
from sqlmodel import Session
from app.modules.scouts.alerts import evaluate_scout_rules

logger = logging.getLogger(__name__)

@celery_app.task
def evaluate_scout_rules_task(athlete_id: int):
    """
    Celery task that runs the scout rule engine asynchronously.
    """
    logger.info(f"Celery task started: evaluate_scout_rules_task for athlete {athlete_id}")
    try:
        with Session(engine) as session:
            evaluate_scout_rules(session, athlete_id)
        logger.info(f"Celery task completed: evaluate_scout_rules_task for athlete {athlete_id}")
        return {"status": "success", "athlete_id": athlete_id}
    except Exception as e:
        logger.error(f"Error in evaluate_scout_rules_task: {e}")
        raise
