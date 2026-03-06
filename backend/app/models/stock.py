from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    exchange = Column(String(20), default='NSE', nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    watchlists = relationship("Watchlist", secondary="watchlist_stocks", back_populates="stocks") 
    transactions = relationship("Transaction", back_populates="stock")
    holdings = relationship("Holding", back_populates="stock")