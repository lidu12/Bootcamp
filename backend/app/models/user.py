from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    bio = Column(Text, nullable=True, default="")
    timezone = Column(String, default="UTC", nullable=False)
    preferred_theme = Column(String, default="emerald-bloom", nullable=False)
    is_dark_mode = Column(Boolean, default=True, nullable=False)
    streak_freezes_available = Column(Integer, default=1, nullable=False)
    streak_freezes_used = Column(Integer, default=0, nullable=False)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    checkins = relationship("DailyCheckin", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("ProjectSubmission", back_populates="user", cascade="all, delete-orphan")
