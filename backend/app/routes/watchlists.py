from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.watchlist import Watchlist
from app.models.stock import Stock
from app.schemas.watchlist import WatchlistCreate
from app.core.dependencies import get_current_user_id
from app.utils.market_data import get_live_prices

router = APIRouter(prefix="/watchlists", tags=["Watchlists"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=List[dict])
def get_all_watchlists(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlists = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
    return [{"id": w.id, "name": w.name} for w in watchlists]


@router.post("", response_model=dict)
def create_watchlist(
    data: WatchlistCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    count = db.query(Watchlist).filter(Watchlist.user_id == user_id).count()
    if count >= 10:
        raise HTTPException(status_code=400, detail="Maximum limit of 10 watchlists reached.")

    watchlist = Watchlist(name=data.name, user_id=user_id)
    db.add(watchlist)
    db.commit()
    db.refresh(watchlist)
    
    return {"id": watchlist.id, "name": watchlist.name}


@router.post("/{watchlist_id}/stocks")
def add_stock_to_watchlist(
    watchlist_id: int,
    data: dict,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id, 
        Watchlist.user_id == user_id
    ).first()
    
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    symbol = data.get("symbol", "").upper()
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol is required")

    stock = db.query(Stock).filter(Stock.symbol == symbol).first()

    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found in database")

    if stock in watchlist.stocks:
        raise HTTPException(status_code=400, detail="Stock is already in this watchlist")

    watchlist.stocks.append(stock)
    db.commit()

    return {"message": f"Successfully added {symbol} to {watchlist.name}"}


@router.delete("/{watchlist_id}/stocks/{symbol}")
def remove_stock_from_watchlist(
    watchlist_id: int, 
    symbol: str, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id, 
        Watchlist.user_id == user_id
    ).first()
    
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found in database")

    if stock in watchlist.stocks:
        watchlist.stocks.remove(stock)
        db.commit()
        return {"message": f"Successfully removed {symbol} from watchlist"}
    
    raise HTTPException(status_code=400, detail="Stock not found in this watchlist")


@router.get("/{watchlist_id}")
def get_watchlist_details(
    watchlist_id: int, 
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == user_id
    ).first()
    
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    symbols = [stock.symbol for stock in watchlist.stocks]
    live_prices = get_live_prices(symbols)

    stocks_with_prices = []
    for stock in watchlist.stocks:
        stocks_with_prices.append({
            "id": stock.id,
            "symbol": stock.symbol,
            "name": stock.name,
            "exchange": stock.exchange,
            "price": live_prices.get(stock.symbol, 0.0)
        })

    return {
        "id": watchlist.id,
        "name": watchlist.name,
        "stocks": stocks_with_prices
    }
    

@router.delete("/{watchlist_id}")
def delete_watchlist(
    watchlist_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id, 
        Watchlist.user_id == user_id
    ).first()

    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    db.delete(watchlist)
    db.commit()
    return {"message": "Watchlist deleted successfully"}
