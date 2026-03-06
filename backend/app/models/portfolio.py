from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    cash_balance = Column(
        DECIMAL(15, 2),
        nullable=False,
        default=1000000.00
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="portfolio")
