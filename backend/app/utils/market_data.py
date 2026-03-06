import yfinance as yf
import concurrent.futures

def fetch_single_price(sym):
    """Worker function to fetch a single stock's price."""
    try:
        ticker = yf.Ticker(f"{sym}.NS")
        
        # 1. Try to get the very latest price (Live)
        price = ticker.fast_info.get('last_price')

        # 2. Fallback: If Live price is 0 (Weekend/Closed), get the last Close
        if price is None or price == 0:
            # Fetching last 5 days just to be safe and get the most recent Friday close
            hist = ticker.history(period="5d")
            if not hist.empty:
                price = hist['Close'].iloc[-1]
        
        val = round(float(price), 2) if price else 0.0
        return sym, val
        
    except Exception as e:
        print(f"Error for {sym}: {e}")
        return sym, 0.0

def get_live_prices(symbols):
    """
    Fetches live prices for a list of symbols concurrently, solving the N+1 
    sequential waiting problem and massively speeding up portfolio loading.
    """
    if not symbols:
        return {}

    price_dict = {}

    try:
        # Use ThreadPoolExecutor to fetch prices concurrently (max 20 at a time)
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            # executor.map will yield results as they complete
            results = executor.map(fetch_single_price, symbols)
            
            for sym, price in results:
                price_dict[sym] = price
                
        return price_dict
    except Exception as e:
        print(f"Global Error in fetching prices: {e}")
        return {s: 0.0 for s in symbols}