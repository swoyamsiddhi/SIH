from celery import Celery
import os

# Allow overriding Redis URL via environment variable
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "khelnet_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.modules.scouts.worker"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
