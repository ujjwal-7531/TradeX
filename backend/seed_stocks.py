from app.database import SessionLocal, engine
from app.models.stock import Stock

# Sample Nifty data - You can expand this list or import a CSV
INITIAL_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "exchange": "NSE"},
    {"symbol": "TCS", "name": "Tata Consultancy Services Ltd.", "exchange": "NSE"},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "exchange": "NSE"},
    {"symbol": "INFY", "name": "Infosys Ltd.", "exchange": "NSE"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd.", "exchange": "NSE"},
    {"symbol": "SBIN", "name": "State Bank of India", "exchange": "NSE"},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel Ltd.", "exchange": "NSE"},
    {"symbol": "ITC", "name": "ITC Ltd.", "exchange": "NSE"},
    {"symbol": "WIPRO", "name": "Wipro Ltd.", "exchange": "NSE"},
    {"symbol": "HINDALCO", "name": "Hindalco Industries Ltd.", "exchange": "NSE"},
]

def seed():
    db = SessionLocal()
    try:
        for s_data in INITIAL_STOCKS:
            # Check if stock already exists to avoid duplicates
            exists = db.query(Stock).filter(Stock.symbol == s_data["symbol"]).first()
            if not exists:
                stock = Stock(**s_data)
                db.add(stock)
        db.commit()
        print("Successfully seeded initial stocks!")
    except Exception as e:
        print(f"Error seeding stocks: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()