from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    exchange = Column(String(20), nullable=False)

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    watchlists = relationship("Watchlist", secondary="watchlist_stocks", back_populates="stocks") 