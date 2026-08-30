from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.checkin import DailyCheckin
from app.models.submission import ProjectSubmission
from app.schemas.user import UserOut, UserUpdate, UserThemeUpdate, PublicProfileOut
from app.core.streak_logic import compute_streak_stats

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/profile", response_model=UserOut)
@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
@router.patch("/profile", response_model=UserOut)
@router.patch("/me", response_model=UserOut)
def update_user_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.username is not None and user_in.username.strip():
        new_username = user_in.username.strip()
        # Check if username is already taken by another user
        existing = db.query(User).filter(User.username == new_username, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="This username is already taken by another user.")
        current_user.username = new_username
        
    if user_in.bio is not None:
        current_user.bio = user_in.bio
    if user_in.timezone is not None:
        current_user.timezone = user_in.timezone
    if user_in.preferred_theme is not None:
        current_user.preferred_theme = user_in.preferred_theme
    if user_in.is_dark_mode is not None:
        current_user.is_dark_mode = user_in.is_dark_mode

    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/theme", response_model=UserOut)
def update_user_theme(
    theme_in: UserThemeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.preferred_theme = theme_in.preferred_theme
    current_user.is_dark_mode = theme_in.is_dark_mode
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/public/{username}", response_model=PublicProfileOut)
def get_public_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    checkins = db.query(DailyCheckin.checkin_date).filter(DailyCheckin.user_id == user.id).all()
    checkin_dates = [c[0] for c in checkins]

    streak_stats = compute_streak_stats(checkin_dates, user.timezone)
    total_projects = db.query(ProjectSubmission).filter(ProjectSubmission.user_id == user.id).count()

    return PublicProfileOut(
        id=user.id,
        username=user.username,
        bio=user.bio or "",
        created_at=user.created_at,
        current_streak=streak_stats["current_streak"],
        longest_streak=streak_stats["longest_streak"],
        total_logged_days=streak_stats["total_logged_days"],
        total_projects=total_projects,
        preferred_theme=user.preferred_theme,
        is_dark_mode=user.is_dark_mode
    )
