from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    avg_price = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="holdings")
    stock = relationship("Stock", back_populates="holdings")
