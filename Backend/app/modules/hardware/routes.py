from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.core.database import get_session
from app.modules.auth.models import User
from app.modules.athletes.routes import get_current_user
from .models import HardwareKit
from .schemas import HardwareKitCreate, HardwareKitResponse, HardwareSyncRequest

router = APIRouter(prefix="/hardware", tags=["hardware"])

@router.post("/", response_model=HardwareKitResponse)
def register_kit(kit_in: HardwareKitCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # In production, check if user is ADMIN or SAI_ADMIN
    if current_user.role not in ["ADMIN", "SAI_ADMIN"]:
        raise HTTPException(status_code=403, detail="Not authorized to register hardware")
        
    existing = session.exec(select(HardwareKit).where(HardwareKit.device_id == kit_in.device_id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Device ID already registered")
        
    kit = HardwareKit(**kit_in.model_dump())
    session.add(kit)
    session.commit()
    session.refresh(kit)
    return kit

@router.post("/heartbeat")
def hardware_heartbeat(sync_req: HardwareSyncRequest, session: Session = Depends(get_session)):
    """
    Endpoint for the ESP32 / Android Gateway to ping status
    Does not require user auth, might require device-specific API key in prod.
    """
    kit = session.exec(select(HardwareKit).where(HardwareKit.device_id == sync_req.device_id)).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Device not found")
        
    kit.last_sync = datetime.utcnow()
    kit.battery_level = sync_req.battery_level
    kit.firmware_version = sync_req.firmware_version
    kit.status = "ACTIVE"
    
    session.add(kit)
    session.commit()
    return {"status": "ok", "message": "Heartbeat recorded"}

@router.get("/", response_model=list[HardwareKitResponse])
def get_all_hardware(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["ADMIN", "SAI_ADMIN"]:
        raise HTTPException(status_code=403, detail="Not authorized to view all hardware")
    
    kits = session.exec(select(HardwareKit)).all()
    return kits
