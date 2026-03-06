from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import timezone
import io
import csv
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

@router.get("/export/csv")
def export_transactions_csv(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    query = (
        db.query(Transaction, Stock.symbol)
        .join(Stock, Stock.id == Transaction.stock_id)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.created_at.asc()) # Oldest to newest for tax reporting
    )

    transactions = query.all()

    # Create an in-memory string buffer
    output = io.StringIO()
    # Create the CSV writer
    writer = csv.writer(output)

    # Write the header row
    writer.writerow([
        "Transaction ID", 
        "Date", 
        "Action", 
        "Symbol", 
        "Quantity", 
        "Execution Price (INR)",
        "Total Value (INR)"
    ])

    # Write the data rows
    for txn, symbol in transactions:
        total_value = float(txn.quantity) * float(txn.price)
        date_str = txn.created_at.strftime("%Y-%m-%d %H:%M:%S")
        
        writer.writerow([
            txn.id,
            date_str,
            txn.trade_type,
            symbol,
            txn.quantity,
            float(txn.price),
            total_value
        ])

    # Reset the pointer of the buffer to the beginning
    output.seek(0)

    # Return as a StreamingResponse so the browser directly downloads it as a file
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=TradeX_Tax_Report.csv"
    return response

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
            "created_at": txn.created_at.replace(tzinfo=timezone.utc).isoformat()

        })

    return result
