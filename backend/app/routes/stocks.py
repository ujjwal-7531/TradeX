from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import SessionLocal
from app.models.stock import Stock
from typing import List

router = APIRouter(prefix="/stocks", tags=["Stocks"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/search")
def search_stocks(
    q: str = Query(..., min_length=1), 
    db: Session = Depends(get_db)
):
    """
    Search stocks by symbol (starting with query) or name (containing query).
    Returns top 10 matches for a fast UI response.
    """
    # Alphabetical matching: 
    # 1. Symbols that start with the query (e.g., 'RE' -> 'RELIANCE')
    # 2. Names that contain the query anywhere
    stocks = db.query(Stock).filter(
        or_(
            Stock.symbol.ilike(f"{q}%"),
            Stock.name.ilike(f"%{q}%")
        )
    ).order_by(Stock.symbol.asc()).limit(10).all()

    return [
        {
            "symbol": s.symbol, 
            "name": s.name, 
            "exchange": s.exchange
        } for s in stocks
    ]