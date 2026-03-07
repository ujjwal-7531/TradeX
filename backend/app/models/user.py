from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    virtual_balance = Column(DECIMAL(15, 2), default=1000000.00, nullable=False)
    full_name = Column(String(255), nullable=True)
    profile_picture_url = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    portfolio = relationship("Portfolio", back_populates="user", uselist=False)
    transactions = relationship("Transaction", back_populates="user")
    holdings = relationship("Holding", back_populates="user")
    watchlists = relationship("Watchlist", back_populates="user")
