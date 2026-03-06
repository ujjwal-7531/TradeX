from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from decimal import Decimal, ROUND_HALF_UP

from app.database import SessionLocal
from app.models.portfolio import Portfolio
from app.models.holding import Holding
from app.models.stock import Stock
from app.core.price_service import get_stock_price
from app.core.dependencies import get_current_user_id


router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/summary")
def portfolio_summary(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(
    Portfolio.user_id == user_id
    ).first()

    if not portfolio:
        raise HTTPException(
            status_code=404,
            detail="Portfolio not found"
        )
        
    holdings = db.query(Holding).filter(
        Holding.user_id == user_id
    ).all()
    
    total_invested = Decimal("0.00")
    total_current_value = Decimal("0.00")

    if not holdings:
        return {
            "cash_balance": portfolio.cash_balance,
            "total_invested": total_invested,
            "current_value": total_current_value,
            "total_unrealized_pnl": total_invested,
            "net_worth": portfolio.cash_balance,
            "holdings": []
        }

    # 1. Fetch all stock details in ONE query
    stock_ids = [h.stock_id for h in holdings]
    stocks = db.query(Stock).filter(Stock.id.in_(stock_ids)).all()
    stock_map = {s.id: s for s in stocks}

    # 2. Fetch all live prices in ONE API call (bulk)
    symbols = [s.symbol for s in stocks]
    from app.utils.market_data import get_live_prices
    live_prices = get_live_prices(symbols)

    holdings_data = []
    
    for holding in holdings:
        stock = stock_map.get(holding.stock_id)

        if not stock:
            continue  # safety guard
        
        # Use bulk fetched price, fallback to 0
        current_price = Decimal(str(live_prices.get(stock.symbol, 0.0)))
        
        quantity = holding.quantity
        avg_price = holding.avg_price

        invested_value = (avg_price * quantity).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        current_value = (current_price * quantity).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        unrealized_pnl = (current_value - invested_value).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        
        if invested_value > 0:
            pnl_percent = (unrealized_pnl / invested_value * 100).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
        else:
            pnl_percent = Decimal("0.00")
            
        total_invested += invested_value
        total_current_value += current_value
        holdings_data.append({
            "symbol": stock.symbol,
            "name": stock.name,
            "quantity": quantity,
            "avg_price": avg_price,
            "current_price": current_price,
            "invested_value": invested_value,
            "current_value": current_value,
            "unrealized_pnl": unrealized_pnl,
            "pnl_percent": pnl_percent
        })
        
    total_unrealized_pnl = (total_current_value - total_invested).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )

    net_worth = (portfolio.cash_balance + total_current_value).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP
    )
    
    return {
        "cash_balance": portfolio.cash_balance,
        "total_invested": total_invested,
        "current_value": total_current_value,
        "total_unrealized_pnl": total_unrealized_pnl,
        "net_worth": net_worth,
        "holdings": holdings_data
    }

@router.get("/trends")
def portfolio_trends(
    symbols: list[str] = Query(default=[]),
    user_id: int = Depends(get_current_user_id)
):
    from app.utils.market_data import get_sparkline_data
    if not symbols:
        return {}
        
    return get_sparkline_data(symbols, days=7)
