from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class DailyCheckinCreate(BaseModel):
    checkin_date: Optional[str] = None # Defaults to user local date if omitted
    note: Optional[str] = ""

class DailyCheckinOut(BaseModel):
    id: int
    user_id: int
    checkin_date: str
    note: Optional[str] = ""
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HeatmapCellOut(BaseModel):
    date: str
    status: str # completed, missed, today_pending, future
    level: int
    is_today: bool
    day_of_week: str
    month: str

class StreakSummaryOut(BaseModel):
    current_streak: int
    longest_streak: int
    total_logged_days: int
    has_checked_in_today: bool
    last_checkin_date: Optional[str] = None
    today_date: str
    streak_freezes_available: int = 1
    streak_freezes_used: int = 0
    freeze_applied_today: bool = False
    milestone_badges: List[dict]
