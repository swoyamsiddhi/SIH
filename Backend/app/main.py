from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, text
from app.core.config import settings
from app.core.database import get_session
from app.modules.auth.routes import router as auth_router
from app.modules.athletes.routes import router as athletes_router
from app.modules.assessments.routes import router as assessments_router
from app.modules.hardware.routes import router as hardware_router
from app.modules.athlete_dna.routes import router as dna_router
from app.modules.growth.routes import router as growth_router
from app.modules.scouts.routes import router as scouts_router
from app.modules.events.routes import router as events_router
from app.modules.admin.routes import router as admin_router

app = FastAPI(
    title="KHEL-NET API",
    description="Backend API for AI-Powered Sports Talent Assessment",
    version="1.0.0",
)

if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth_router, prefix="/api/v1")
app.include_router(athletes_router, prefix="/api/v1")
app.include_router(assessments_router, prefix="/api/v1")
app.include_router(hardware_router, prefix="/api/v1")
app.include_router(dna_router, prefix="/api/v1")
app.include_router(growth_router, prefix="/api/v1")
app.include_router(scouts_router, prefix="/api/v1")
app.include_router(events_router)
app.include_router(admin_router)

@app.get("/health")
def health_check(session: Session = Depends(get_session)):
    status_data = {
        "status": "ok",
        "version": app.version,
        "database": "disconnected",
        "redis": "disconnected",
        "ai": "available"
    }
    try:
        session.exec(text("SELECT 1"))
        status_data["database"] = "connected"
    except Exception:
        pass
    
    # In a full deployment, we would also ping Redis here.
    return status_data
