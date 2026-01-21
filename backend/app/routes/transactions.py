from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.core.dependencies import get_current_user_id

from app.models.transaction import Transaction
from app.models.stock import Stock


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @router.get("")
@router.get("")
def get_transactions(
    limit: int = 20,
    offset: int = 0,
    type: str | None = None,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            Transaction,
            Stock.symbol
        )
        .join(Stock, Stock.id == Transaction.stock_id)
        .filter(Transaction.user_id == user_id)
    )

    if type:
        query = query.filter(Transaction.trade_type == type.upper())

    transactions = (
        query
        .order_by(Transaction.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )


    result = []

    for txn, symbol in transactions:
        result.append({
            "symbol": symbol,
            "trade_type": txn.trade_type,
            "quantity": txn.quantity,
            "price": txn.price,
            "total_value": txn.total_value,
            "created_at": txn.created_at
        })

    return result
