from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, TIMESTAMP, text
from app.database import Base

class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)

    quantity = Column(Integer, nullable=False)
    avg_price = Column(DECIMAL(10, 2), nullable=False)

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
