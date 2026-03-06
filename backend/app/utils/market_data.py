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

def fetch_single_sparkline(sym, days=7):
    """Worker function to fetch historical close prices for a symbol."""
    try:
        ticker = yf.Ticker(f"{sym}.NS")
        # Fetch a few extra days to account for weekends and holidays
        hist = ticker.history(period=f"{days + 5}d")
        
        if hist.empty:
            return sym, []
            
        # Extract just the Close prices, rounded to 2 decimals
        closes = [round(float(price), 2) for price in hist['Close']]
        
        # Return only the last `days` number of prices
        return sym, closes[-days:]
        
    except Exception as e:
        print(f"Error for sparkline {sym}: {e}")
        return sym, []

def get_sparkline_data(symbols, days=7):
    """
    Fetches historical closing prices concurrently for a list of symbols.
    Returns a dictionary mapping symbols to arrays of historical prices.
    """
    if not symbols:
        return {}
        
    sparkline_dict = {}
    
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            # We use a lambda to pass the `days` argument to the worker
            results = executor.map(lambda sym: fetch_single_sparkline(sym, days), symbols)
            
            for sym, prices in results:
                if prices: # Only add if we successfully got data
                    sparkline_dict[sym] = prices
                    
        return sparkline_dict
    except Exception as e:
        print(f"Global Error in fetching sparklines: {e}")
        return {s: [] for s in symbols}