from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
import csv
import io

from app.database import SessionLocal
from app.core.dependencies import get_current_user_id

from app.schemas.settings import AccountSettingsRequest
from app.models.portfolio import Portfolio
from app.models.holding import Holding
from app.models.transaction import Transaction
from app.models.stock import Stock


router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.get("/ping")
def settings_ping():
    return {"message": "settings route working"}

@router.post("/account")
def update_account_settings(
    data: AccountSettingsRequest,
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

    # ================================
    # OPTION B: CHANGE CASH BALANCE
    # ================================
    if data.action == "CHANGE_CASH":
        portfolio.cash_balance = data.new_balance
        db.commit()
        db.refresh(portfolio)

        return {
            "message": "Cash balance updated successfully",
            "new_balance": portfolio.cash_balance
        }

    # ================================
    # OPTION A: RESET EVERYTHING
    # ================================
    if data.action == "RESET_ALL":

        # ---- confirmation checks ----
        if data.confirm is not True or data.keyword != "RESET":
            raise HTTPException(
                status_code=400,
                detail="Reset confirmation failed"
            )

        # ---- fetch transactions ----
        transactions = (
            db.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .order_by(Transaction.created_at)
            .all()
        )

        # ---- generate CSV ----
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            "Date",
            "Stock",
            "Type",
            "Quantity",
            "Price",
            "Total",
            "PNL"
        ])

        for tx in transactions:
            total_amount = tx.quantity * tx.price

            writer.writerow([
                tx.created_at,
                tx.stock.symbol,
                tx.trade_type,
                tx.quantity,
                float(tx.price),
                float(total_amount)
            ])


        csv_data = output.getvalue()
        output.close()

        # ---- destructive operations ----
        db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).delete()

        db.query(Holding).filter(
            Holding.user_id == user_id
        ).delete()

        portfolio.cash_balance = data.new_balance

        db.commit()

        # ---- return CSV file ----
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=transactions_backup.csv"
            }
        )

    # ================================
    # INVALID ACTION
    # ================================
    raise HTTPException(
        status_code=400,
        detail="Invalid action"
    )