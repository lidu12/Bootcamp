from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRoadmapProgress(Base):
    __tablename__ = "user_roadmap_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "week_number", name="uix_user_week"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    week_number = Column(Integer, nullable=False) # 1 to 26
    is_completed = Column(Boolean, default=True, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User")
