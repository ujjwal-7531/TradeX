from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, text
from app.database import Base

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
