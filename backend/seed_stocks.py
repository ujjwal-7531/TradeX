import pandas as pd
from app.database import SessionLocal
from app.models.stock import Stock
from app.models.watchlist import Watchlist

def seed():
    db = SessionLocal()
    try:
        # Load CSV: 1st col is symbol, 2nd is name
        df = pd.read_csv("all_companies.csv")
        df.columns = ['symbol', 'name']

        # Get existing symbols to avoid duplicates
        existing = {s[0] for s in db.query(Stock.symbol).all()}
        
        new_entries = []
        for _, row in df.iterrows():
            sym = str(row['symbol']).strip().upper()
            if sym not in existing:
                new_entries.append(Stock(
                    symbol=sym,
                    name=str(row['name']).strip(),
                    exchange="NSE/BSE" # Default value
                ))
                existing.add(sym)

        if new_entries:
            db.bulk_save_objects(new_entries)
            db.commit()
            print(f"✅ Successfully added {len(new_entries)} stocks.")
        else:
            print("ℹ️ No new stocks found to add.")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()