from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.core.dependencies import get_current_user_id
from app.core.price_service import get_stock_price

from app.models.stock import Stock
from app.models.portfolio import Portfolio
from app.models.holding import Holding
from app.schemas.trade import BuyStockRequest
from app.schemas.trade import SellStockRequest
from decimal import Decimal


router = APIRouter(prefix="/trade", tags=["Trading"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/buy")
def buy_stock(
    data: BuyStockRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
    
):
    symbol = data.symbol.upper()
    stock = db.query(Stock).filter(
        Stock.symbol == symbol
    ).first()

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )
        
    price = price = Decimal(str(get_stock_price(symbol)))


    if price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid stock price"
        )

    portfolio = db.query(Portfolio).filter(
    Portfolio.user_id == user_id
    ).first()

    if not portfolio:
        raise HTTPException(
            status_code=500,
            detail="Portfolio not found"
        )
    
    total_cost = price * data.quantity

    if portfolio.cash_balance < total_cost:
        raise HTTPException(
            status_code=400,
            detail="Insufficient balance"
        )

    holding = db.query(Holding).filter(
        Holding.user_id == user_id,
        Holding.stock_id == stock.id
    ).first()
    
    if not holding:
        holding = Holding(
            user_id=user_id,
            stock_id=stock.id,
            quantity=data.quantity,
            avg_price=price
        )

        db.add(holding)
        
    else:
        old_qty = holding.quantity
        old_avg = holding.avg_price

        new_qty = old_qty + data.quantity

        new_avg = (
            (old_qty * old_avg) + (data.quantity * price)
        ) / new_qty

        holding.quantity = new_qty
        holding.avg_price = new_avg

    portfolio.cash_balance -= total_cost
    db.commit()

    return {
        "message": "Buy order executed",
        "symbol": symbol,
        "quantity": data.quantity,
        "price": price,
        "total_cost": total_cost,
        "remaining_balance": portfolio.cash_balance
    }

@router.post("/sell")
def sell_stock(
    data: SellStockRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    symbol = data.symbol.upper()

    stock = db.query(Stock).filter(
        Stock.symbol == symbol
    ).first()

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    holding = db.query(Holding).filter(
        Holding.user_id == user_id,
        Holding.stock_id == stock.id
    ).first()

    if not holding:
        raise HTTPException(
            status_code=400,
            detail="You do not own this stock"
        )

    if data.quantity > holding.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient quantity to sell"
        )
        
    sell_price = Decimal(str(get_stock_price(symbol)))

    if sell_price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid stock price"
        )
        
    portfolio = db.query(Portfolio).filter(
        Portfolio.user_id == user_id
    ).first()

    if not portfolio:
        raise HTTPException(
            status_code=500,
            detail="Portfolio not found"
        )
        
    sell_value = sell_price * data.quantity

    realized_pnl = (
        sell_price - holding.avg_price
    ) * data.quantity
    
    portfolio.cash_balance += sell_value

    if holding.quantity > data.quantity:
        holding.quantity -= data.quantity
    else:
        db.delete(holding)

    db.commit()

    return {
        "message": "Sell order executed",
        "symbol": symbol,
        "quantity_sold": data.quantity,
        "sell_price": sell_price,
        "sell_value": sell_value,
        "realized_pnl": realized_pnl,
        "remaining_balance": portfolio.cash_balance
    }

