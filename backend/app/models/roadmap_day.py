from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserDayProgress(Base):
    __tablename__ = "user_day_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "day_number", name="uix_user_day"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False) # 1 to 180
    is_completed = Column(Boolean, default=True, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User")
