from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, TIMESTAMP, text
from app.database import Base

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
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
