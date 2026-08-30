from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class DailyCheckin(Base):
    __tablename__ = "daily_checkins"
    __table_args__ = (
        UniqueConstraint("user_id", "checkin_date", name="uix_user_checkin_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    checkin_date = Column(String, nullable=False, index=True) # YYYY-MM-DD
    note = Column(String, nullable=True, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="checkins")
