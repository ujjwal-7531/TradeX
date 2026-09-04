import yfinance as yf
import concurrent.futures
from functools import lru_cache
import time
import json

from app.core.redis_client import redis_client

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
    Fetches live prices for a list of symbols. 
    Leverages Redis in-memory cache (30s TTL) for < 2ms speedups,
    falling back to concurrent ThreadPoolExecutor for cache misses.
    """
    if not symbols:
        return {}

    price_dict = {}
    missing_symbols = []

    # 1. Try fetching from Redis cache first
    if redis_client:
        try:
            for sym in symbols:
                cached_price = redis_client.get(f"stock_price:{sym}")
                if cached_price is not None:
                    price_dict[sym] = float(cached_price)
                else:
                    missing_symbols.append(sym)
        except Exception as e:
            print(f"Redis cache lookup error: {e}")
            missing_symbols = list(symbols)
    else:
        missing_symbols = list(symbols)

    # If all requested symbols were found in Redis cache, return immediately!
    if not missing_symbols:
        return price_dict

    # 2. Fetch missing symbols concurrently via ThreadPoolExecutor
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(20, len(missing_symbols))) as executor:
            results = executor.map(fetch_single_price, missing_symbols)
            
            for sym, price in results:
                price_dict[sym] = price
                # Store freshly fetched price in Redis with a 60-second (1 min) TTL
                if redis_client and price > 0:
                    try:
                        redis_client.set(f"stock_price:{sym}", str(price), ex=60)
                    except Exception as err:
                        print(f"Redis cache set error for {sym}: {err}")
                        
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

def fetch_historical_chart_data(sym: str, period: str = "1mo"):
    """
    Fetches historical chart data. 
    Leverages Upstash Redis cache (1 hour TTL / 3600s) for ultra-fast distributed lookups.
    """
    cache_key = f"stock_chart:{sym}:{period}"
    
    # 1. Try fetching from Redis cache
    if redis_client:
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            print(f"Redis chart lookup error for {sym}: {e}")

    # 2. Cache miss: Fetch from yfinance
    try:
        ticker = yf.Ticker(f"{sym}.NS")
        hist = ticker.history(period=period)
        if hist.empty:
            return []
            
        data = []
        for d, row in hist.iterrows():
            data.append({
                "date": d.strftime("%Y-%m-%d"),
                "price": round(float(row['Close']), 2)
            })

        # Store fetched chart in Redis with a 3600-second (1 hour) TTL
        if redis_client and data:
            try:
                redis_client.set(cache_key, json.dumps(data), ex=3600)
            except Exception as err:
                print(f"Redis chart set error for {sym}: {err}")

        return data
    except Exception as e:
        print(f"Error fetching chart data for {sym}: {e}")
        return []