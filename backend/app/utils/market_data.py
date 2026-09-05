import yfinance as yf
import concurrent.futures
import time
import json
import math

from app.core.redis_client import redis_client

def clean_float(val, default=0.0):
    """Converts val to float and ensures it is not None, NaN, or Inf."""
    if val is None:
        return default
    try:
        f_val = float(val)
        if math.isnan(f_val) or math.isinf(f_val):
            return default
        return round(f_val, 2)
    except (ValueError, TypeError):
        return default

def fetch_single_price(sym):
    """Worker function to fetch a single stock's price safely."""
    try:
        ticker = yf.Ticker(f"{sym}.NS")
        price = None
        
        # 1. Try fast_info first
        try:
            price = ticker.fast_info.get('last_price')
        except Exception:
            price = None
            
        # 2. Fallback: If Live price is None, 0, or NaN, get recent Close
        if price is None or clean_float(price, 0.0) <= 0.0:
            hist = ticker.history(period="7d")
            if not hist.empty and 'Close' in hist:
                valid_closes = hist['Close'].dropna()
                if not valid_closes.empty:
                    price = valid_closes.iloc[-1]
        
        val = clean_float(price, 0.0)
        return sym, val
        
    except Exception as e:
        print(f"Error fetching price for {sym}: {e}")
        return sym, 0.0

def get_live_prices(symbols):
    """
    Fetches live prices for a list of symbols. 
    Leverages Redis in-memory cache (60s TTL) for < 2ms speedups,
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
                    cf = clean_float(cached_price, 0.0)
                    if cf > 0:
                        price_dict[sym] = cf
                    else:
                        missing_symbols.append(sym)
                else:
                    missing_symbols.append(sym)
        except Exception as e:
            print(f"Redis cache lookup error: {e}")
            missing_symbols = list(symbols)
    else:
        missing_symbols = list(symbols)

    if not missing_symbols:
        return price_dict

    # 2. Fetch missing symbols concurrently via ThreadPoolExecutor
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(20, len(missing_symbols))) as executor:
            results = executor.map(fetch_single_price, missing_symbols)
            
            for sym, price in results:
                cf = clean_float(price, 0.0)
                price_dict[sym] = cf
                # Store freshly fetched price in Redis with a 60-second (1 min) TTL
                if redis_client and cf > 0:
                    try:
                        redis_client.set(f"stock_price:{sym}", str(cf), ex=60)
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
        hist = ticker.history(period=f"{days + 7}d")
        
        if hist.empty or 'Close' not in hist:
            return sym, []
            
        closes = []
        for price in hist['Close']:
            cf = clean_float(price, None)
            if cf is not None and cf > 0:
                closes.append(cf)
        
        if not closes:
            return sym, []
            
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
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(20, len(symbols))) as executor:
            results = executor.map(lambda sym: fetch_single_sparkline(sym, days), symbols)
            
            for sym, prices in results:
                if prices:
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
        if hist.empty or 'Close' not in hist:
            return []
            
        data = []
        for d, row in hist.iterrows():
            p = clean_float(row['Close'], None)
            if p is not None and p > 0:
                data.append({
                    "date": d.strftime("%Y-%m-%d"),
                    "price": p
                })

        if redis_client and data:
            try:
                redis_client.set(cache_key, json.dumps(data), ex=3600)
            except Exception as err:
                print(f"Redis chart set error for {sym}: {err}")

        return data
    except Exception as e:
        print(f"Error fetching chart data for {sym}: {e}")
        return []