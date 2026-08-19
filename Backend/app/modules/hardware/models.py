from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class HardwareKitBase(SQLModel):
    device_id: str = Field(unique=True, index=True) # e.g., 'KIT-001'
    status: str = Field(default="INACTIVE") # ACTIVE, INACTIVE, MAINTENANCE
    assigned_to_org: Optional[str] = None
    last_sync: Optional[datetime] = None
    battery_level: Optional[int] = None
    firmware_version: Optional[str] = None

class HardwareKit(HardwareKitBase, table=True):
    __tablename__ = "hardware_kits"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
