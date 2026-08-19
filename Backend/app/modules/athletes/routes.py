from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.database import get_session
from app.core.config import settings
from app.modules.auth.models import User
from .models import Athlete, ScoutAlert
from .schemas import AthleteCreate, AthleteResponse

router = APIRouter(prefix="/athletes", tags=["athletes"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/", response_model=AthleteResponse)
def create_athlete(athlete_in: AthleteCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    existing = session.exec(select(Athlete).where(Athlete.user_id == current_user.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Athlete profile already exists for this user")
    
    athlete = Athlete(**athlete_in.model_dump(), user_id=current_user.id)
    session.add(athlete)
    session.commit()
    session.refresh(athlete)
    return athlete

@router.get("/me", response_model=AthleteResponse)
def get_my_profile(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    athlete = session.exec(select(Athlete).where(Athlete.user_id == current_user.id)).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")
    return athlete




@router.get("/me/scout-alerts")
def get_scout_alerts(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    athlete = session.exec(select(Athlete).where(Athlete.user_id == current_user.id)).first()
    alerts = session.exec(select(ScoutAlert).where(ScoutAlert.athlete_id == athlete.id)).all()
    return [{
        "id": a.id, "scoutName": a.scout_name, "organization": a.organization, 
        "message": a.message, "read": a.read, "timestamp": a.timestamp
    } for a in alerts]

