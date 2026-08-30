from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    bio: Optional[str] = ""
    timezone: str = "UTC"
    preferred_theme: str = "emerald-bloom"
    is_dark_mode: bool = True
    streak_freezes_available: int = 1
    streak_freezes_used: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    preferred_theme: Optional[str] = None
    is_dark_mode: Optional[bool] = None

class UserThemeUpdate(BaseModel):
    preferred_theme: str
    is_dark_mode: bool = True

class PublicProfileOut(BaseModel):
    id: int
    username: str
    bio: Optional[str] = ""
    created_at: datetime
    current_streak: int
    longest_streak: int
    total_logged_days: int
    total_projects: int
    preferred_theme: str
    is_dark_mode: bool

    model_config = ConfigDict(from_attributes=True)
