from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class HardwareKitCreate(BaseModel):
    device_id: str
    assigned_to_org: Optional[str] = None

class HardwareKitResponse(BaseModel):
    id: int
    device_id: str
    status: str
    assigned_to_org: Optional[str]
    last_sync: Optional[datetime]
    battery_level: Optional[int]
    firmware_version: Optional[str]

    class Config:
        from_attributes = True

class HardwareSyncRequest(BaseModel):
    device_id: str
    battery_level: int
    firmware_version: str
