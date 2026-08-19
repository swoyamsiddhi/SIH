from typing import Optional
from pydantic import BaseModel

class AthleteCreate(BaseModel):
    name: str
    age: int
    location: Optional[str] = None
    school: Optional[str] = None
    primary_sport: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    dominant_side: Optional[str] = None

class AthleteResponse(AthleteCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
