from datetime import datetime, timedelta, timezone
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import (
    UserRegister, UserLogin, PasswordResetRequest, PasswordResetConfirm, Token
)
from app.schemas.user import UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="A user with this email address already exists.")

    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This username is already taken.")

    user = User(
        email=user_in.email.lower(),
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        timezone=user_in.timezone or "UTC"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """OAuth2 compatible token login for Swagger UI"""
    user = db.query(User).filter(User.email == form_data.username.lower()).first()
    if not user:
        user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username/email or password.")

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/password-reset/request")
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:
        token = str(uuid.uuid4())
        user.reset_token = token
        user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        db.commit()
        return {
            "message": "Password reset token generated. In a production environment, an email would be sent.",
            "demo_reset_token": token # Provided for demo/testing convenience
        }
    return {"message": "If an account with that email exists, password reset instructions have been sent."}

@router.post("/password-reset/confirm")
def confirm_password_reset(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user or not user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
    
    # Check expiry with timezone aware datetime
    now_utc = datetime.now(timezone.utc)
    token_expires = user.reset_token_expires
    if token_expires.tzinfo is None:
        token_expires = token_expires.replace(tzinfo=timezone.utc)
        
    if now_utc > token_expires:
        raise HTTPException(status_code=400, detail="Reset token has expired.")

    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {"message": "Password updated successfully. You can now log in with your new password."}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
