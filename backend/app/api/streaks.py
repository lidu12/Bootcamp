from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.checkin import DailyCheckin
from app.schemas.streak import DailyCheckinCreate, DailyCheckinOut, StreakSummaryOut, HeatmapCellOut
from app.core.streak_logic import compute_streak_stats, generate_calendar_heatmap, get_user_local_date

router = APIRouter(prefix="/streaks", tags=["streaks"])

def get_milestone_badges(total_days: int, longest_streak: int) -> List[dict]:
    badges = [
        {
            "id": "badge-1",
            "name": "First Step",
            "description": "Logged your first day of learning",
            "icon": "Seedling",
            "unlocked": total_days >= 1,
            "threshold": 1,
            "category": "checkin"
        },
        {
            "id": "badge-7",
            "name": "Week Warrior",
            "description": "Achieved a continuous 7-day streak",
            "icon": "Flame",
            "unlocked": longest_streak >= 7,
            "threshold": 7,
            "category": "streak"
        },
        {
            "id": "badge-14",
            "name": "Fortnight Focus",
            "description": "Maintained focus for 14 continuous days",
            "icon": "Zap",
            "unlocked": longest_streak >= 14,
            "threshold": 14,
            "category": "streak"
        },
        {
            "id": "badge-30",
            "name": "Monthly Master",
            "description": "Achieved a full 30-day streak milestone",
            "icon": "Trophy",
            "unlocked": longest_streak >= 30,
            "threshold": 30,
            "category": "streak"
        },
        {
            "id": "badge-50",
            "name": "Half Century",
            "description": "50 consecutive days of non-stop learning",
            "icon": "Award",
            "unlocked": longest_streak >= 50,
            "threshold": 50,
            "category": "streak"
        },
        {
            "id": "badge-100",
            "name": "Bootcamp Legend",
            "description": "Hit the elite 100-day streak mark!",
            "icon": "Crown",
            "unlocked": longest_streak >= 100,
            "threshold": 100,
            "category": "streak"
        },
    ]
    return badges

@router.post("/checkin", response_model=DailyCheckinOut, status_code=status.HTTP_201_CREATED)
def log_checkin(
    checkin_in: Optional[DailyCheckinCreate] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = checkin_in.note if checkin_in and checkin_in.note else ""
    
    if checkin_in and checkin_in.checkin_date:
        date_str = checkin_in.checkin_date
    else:
        local_date = get_user_local_date(current_user.timezone)
        date_str = local_date.strftime("%Y-%m-%d")

    existing = db.query(DailyCheckin).filter(
        DailyCheckin.user_id == current_user.id,
        DailyCheckin.checkin_date == date_str
    ).first()

    if existing:
        if note:
            existing.note = note
            db.commit()
            db.refresh(existing)
        return existing

    checkin = DailyCheckin(
        user_id=current_user.id,
        checkin_date=date_str,
        note=note
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    return checkin

@router.get("/summary", response_model=StreakSummaryOut)
def get_streak_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkins = db.query(DailyCheckin.checkin_date).filter(
        DailyCheckin.user_id == current_user.id
    ).all()
    checkin_dates = [c[0] for c in checkins]

    stats = compute_streak_stats(
        checkin_dates,
        current_user.timezone,
        current_user.streak_freezes_available,
        current_user.streak_freezes_used
    )
    badges = get_milestone_badges(stats["total_logged_days"], stats["longest_streak"])

    return StreakSummaryOut(
        current_streak=stats["current_streak"],
        longest_streak=stats["longest_streak"],
        total_logged_days=stats["total_logged_days"],
        has_checked_in_today=stats["has_checked_in_today"],
        last_checkin_date=stats["last_checkin_date"],
        today_date=stats["today_date"],
        streak_freezes_available=stats["streak_freezes_available"],
        streak_freezes_used=stats["streak_freezes_used"],
        freeze_applied_today=stats["freeze_applied_today"],
        milestone_badges=badges
    )

@router.get("/heatmap", response_model=List[HeatmapCellOut])
def get_heatmap(
    days: int = 180,
    username: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = current_user
    if username:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    checkins = db.query(DailyCheckin.checkin_date).filter(
        DailyCheckin.user_id == user.id
    ).all()
    checkin_dates = [c[0] for c in checkins]

    heatmap_cells = generate_calendar_heatmap(checkin_dates, days_count=days, tz_name=user.timezone)
    return heatmap_cells
