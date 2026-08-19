from typing import Optional, Dict
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "ATHLETE"

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True
