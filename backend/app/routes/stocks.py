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