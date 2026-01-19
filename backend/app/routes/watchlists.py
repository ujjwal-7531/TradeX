from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.watchlist import Watchlist
from app.models.stock import Stock
from app.models.watchlist_stock import WatchlistStock
from app.schemas.watchlist_stock import WatchlistStockAdd
from app.schemas.watchlist import WatchlistCreate
from app.core.dependencies import get_current_user_id
from app.core.price_service import get_stock_price

router = APIRouter(prefix="/watchlists", tags=["Watchlists"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("")
def create_watchlist(
    data: WatchlistCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlist = Watchlist(
        name=data.name,
        user_id=user_id
    )

    db.add(watchlist)
    db.commit()
    db.refresh(watchlist)

    return {
        "id": watchlist.id,
        "name": watchlist.name
    }



@router.post("/{watchlist_id}/stocks")
def add_stock_to_watchlist(
    watchlist_id: int,
    data: WatchlistStockAdd,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    watchlist = db.query(Watchlist).filter(
        Watchlist.id == watchlist_id,
        Watchlist.user_id == user_id
    ).first()

    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    stock = db.query(Stock).filter(
        Stock.symbol == data.symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    exists = db.query(WatchlistStock).filter(
        WatchlistStock.watchlist_id == watchlist_id,
        WatchlistStock.stock_id == stock.id
    ).first()

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Stock already in watchlist"
        )

    watchlist_stock = WatchlistStock(
        watchlist_id=watchlist_id,
        stock_id=stock.id
    )

    db.add(watchlist_stock)
    db.commit()

    return {"message": "Stock added to watchlist"}


@router.delete("/{watchlist_id}/stocks/{symbol}")
def remove_stock_from_watchlist(
    watchlist_id: int,
    symbol: str,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    stock = db.query(Stock).filter(
        Stock.symbol == symbol.upper()
    ).first()

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    record = db.query(WatchlistStock).filter(
        WatchlistStock.watchlist_id == watchlist_id,
        WatchlistStock.stock_id == stock.id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Stock not in watchlist"
        )

    db.delete(record)
    db.commit()

    return {"message": "Stock removed from watchlist"}


@router.get("/{watchlist_id}")
def get_watchlist(
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

    stocks = (
        db.query(Stock)
        .join(WatchlistStock, WatchlistStock.stock_id == Stock.id)
        .filter(WatchlistStock.watchlist_id == watchlist_id)
        .all()
    )

    result = []
    for stock in stocks:
        price = get_stock_price(stock.symbol)
        result.append({
            "symbol": stock.symbol,
            "name": stock.name,
            "price": price
        })

    return {
        "watchlist": watchlist.name,
        "stocks": result
    }
