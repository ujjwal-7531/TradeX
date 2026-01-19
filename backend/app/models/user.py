from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    virtual_balance = Column(DECIMAL(15, 2), default=1000000.00, nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)
