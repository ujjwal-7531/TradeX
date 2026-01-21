from sqlalchemy import Column, Integer, ForeignKey, String, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)

    trade_type = Column(String(10), nullable=False)  # BUY / SELL
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(15, 2), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False)

    # ✅ ADD THIS
    stock = relationship("Stock")
