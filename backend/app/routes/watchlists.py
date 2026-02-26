from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.watchlist import Watchlist
from app.models.stock import Stock
from app.models.watchlist_stock import WatchlistStock
from app.schemas.watchlist_stock import WatchlistStockAdd
from app.schemas.watchlist import WatchlistCreate
from app.core.dependencies import get_current_user_id
from app.core.price_service import get_stock_price
from app.utils.market_data import get_live_prices #

router = APIRouter(prefix="/watchlists", tags=["Watchlists"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# 1. ACTUAL GET ROUTE: Fetch all watchlists for the logged-in user
@router.get("", response_model=List[dict])
def get_all_watchlists(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Just fetch data, no body required!
    watchlists = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
    return [{"id": w.id, "name": w.name} for w in watchlists]

# 2. ACTUAL POST ROUTE: Create a new watchlist with the 10-limit check
@router.post("", response_model=dict)
def create_watchlist(
    data: WatchlistCreate, # Body is allowed here
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Enforce the 10-watchlist limit
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
    data: dict, # Expecting {"symbol": "AAPL"} from the frontend
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # 1. Security check: Does this watchlist belong to the logged-in user?
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id, 
        Watchlist.user_id == user_id
    ).first()
    
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    # 2. Find the stock in your 'stocks' table
    symbol = data.get("symbol", "").upper()
    stock = db.query(Stock).filter(Stock.symbol == symbol).first()

    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found in database")

    # 3. Check for duplicates (don't add the same stock twice)
    if stock in watchlist.stocks:
        raise HTTPException(status_code=400, detail="Stock is already in this watchlist")

    # 4. Create the link
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
    # 1. Verify the watchlist exists and belongs to the user
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id, 
        Watchlist.user_id == user_id
    ).first()
    
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    # 2. Find the stock by its symbol
    stock = db.query(Stock).filter(Stock.symbol == symbol.upper()).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found in database")

    # 3. Remove the connection
    if stock in watchlist.stocks:
        watchlist.stocks.remove(stock)
        db.commit()
        return {"message": f"Successfully removed {symbol} from watchlist"}
    
    raise HTTPException(status_code=400, detail="Stock not found in this watchlist")

@router.get("/{watchlist_id}")
def get_watchlist_details(watchlist_id: int, db: Session = Depends(get_db)):
    watchlist = db.query(Watchlist).filter(Watchlist.id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    # 1. Get symbols from the watchlist
    symbols = [stock.symbol for stock in watchlist.stocks]
    
    # 2. Fetch the actual prices from our new utility
    live_prices = get_live_prices(symbols)

    # 3. Build the response list
    stocks_with_prices = []
    for stock in watchlist.stocks:
        stocks_with_prices.append({
            "id": stock.id,
            "symbol": stock.symbol,
            "name": stock.name,
            "exchange": stock.exchange,
            "price": live_prices.get(stock.symbol, 0.0) # Use the real price here!
        })

    return {
        "id": watchlist.id,
        "name": watchlist.name,
        "stocks": stocks_with_prices
    }
    
# 3. NEW: Delete Entire Watchlist
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

    # This will remove the watchlist. (Note: Ensure your DB schema has 
    # cascade delete on watchlist_stocks, or delete them manually first)
    db.delete(watchlist)
    db.commit()
    return {"message": "Watchlist deleted successfully"}


