from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    role: str = Field(default="ATHLETE") # ATHLETE, COACH, SCOUT, EVENT_ORGANIZER, ADMIN, SAI_ADMIN
    organization_id: Optional[str] = Field(default=None, index=True)
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
