from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_session
from app.core.security import verify_password, get_password_hash, create_access_token
from .models import User
from .schemas import UserCreate, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.exec(select(User).where(User.email == user_in.email)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
