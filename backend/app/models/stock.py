from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.database import Base
from datetime import datetime

# class Stock(Base):
#     __tablename__ = "stocks"

#     id = Column(Integer, primary_key=True, index=True)

#     symbol = Column(String(20), unique=True, nullable=False)   # TCS, INFY
#     name = Column(String(255), nullable=False)                 # Tata Consultancy Services
#     exchange = Column(String(20), nullable=False)              # NSE / BSE

#     created_at = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

# from sqlalchemy import Column, Integer, String, TIMESTAMP, text
# from app.database import Base

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
