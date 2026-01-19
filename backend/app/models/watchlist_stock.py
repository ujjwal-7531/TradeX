from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, text
from app.database import Base

class WatchlistStock(Base):
    __tablename__ = "watchlist_stocks"

    id = Column(Integer, primary_key=True)
    watchlist_id = Column(Integer, ForeignKey("watchlists.id"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
