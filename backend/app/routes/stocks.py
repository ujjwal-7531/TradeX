from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import SessionLocal
from app.models.stock import Stock
from typing import List
from app.core.dependencies import get_current_user_id

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
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id) # Keep this for security
):
    search_query = f"%{q}%"
    
    results = db.query(Stock).filter(
        or_(
            Stock.symbol.ilike(search_query), 
            Stock.name.ilike(search_query)
        )
    ).order_by(
        # Prioritize exact symbol matches first
        Stock.symbol.ilike(f"{q}%").desc(),
        Stock.symbol.asc()
    ).limit(10).all() # This is the limit you want

    return [
        {
            "symbol": s.symbol,
            "name": s.name,
            "exchange": s.exchange
        } for s in results
    ]

@router.get("/{symbol}/chart")
def get_native_chart_data(
    symbol: str, 
    period: str = Query("1mo", description="e.g. 1mo, 3mo, 1y"),
    user_id: int = Depends(get_current_user_id)
):
    from app.utils.market_data import fetch_historical_chart_data, get_ttl_hash
    # Update cache every 1 hour (3600 seconds)
    ttl = get_ttl_hash(3600)
    data = fetch_historical_chart_data(symbol, period, ttl)
    return {"symbol": symbol, "data": data}