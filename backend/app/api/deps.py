from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import verify_token
from app.core.security import hash_password
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_default_user(db: Session) -> User:
    """Returns or creates a default local user so no login/signup is required."""
    user = db.query(User).filter(User.username == "developer").first()
    if not user:
        user = User(
            email="dev@devbloom.local",
            username="developer",
            hashed_password=hash_password("localdev123"),
            bio="Full-Stack & AI Engineering Bootcamp Learner",
            timezone="UTC",
            preferred_theme="emerald-bloom",
            is_dark_mode=True,
            streak_freezes_available=1,
            streak_freezes_used=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Returns authenticated user if token provided, otherwise falls back to default local user."""
    if not token:
        return get_default_user(db)

    payload = verify_token(token)
    if not payload or "sub" not in payload:
        return get_default_user(db)

    user_id = payload["sub"]
    try:
        user_id_int = int(user_id)
        user = db.query(User).filter(User.id == user_id_int).first()
        if user:
            return user
    except ValueError:
        pass

    return get_default_user(db)
