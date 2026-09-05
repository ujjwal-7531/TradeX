import time
from decimal import Decimal
from app.utils.market_data import get_live_prices, clean_float, fetch_single_price

# Cache expiry time in seconds
CACHE_TTL = 30

_price_cache = {}


def _fetch_price_from_api(symbol: str) -> Decimal:
    """
    Fetch stock price from external API via our yfinance utility.
    """
    print(f"[PRICE API CALL] Fetching live price for {symbol}")

    prices = get_live_prices([symbol])
    price = prices.get(symbol, 0.0)

    # Fallback to single fetch if bulk returned 0.0
    if price <= 0.0:
        _, price = fetch_single_price(symbol)

    if price <= 0.0:
        raise ValueError(f"Failed to fetch a valid price for {symbol}. Market might be inaccessible.")

    return Decimal(str(round(price, 2)))


def get_stock_price(symbol: str) -> Decimal:
    """
    Get stock price with in-memory caching.
    """
    symbol = symbol.upper()
    now = time.time()

    # 1️⃣ Check cache
    if symbol in _price_cache:
        cached = _price_cache[symbol]
        age = now - cached["timestamp"]

        if age < CACHE_TTL and cached["price"] > 0:
            print(f"[CACHE HIT] Using cached price for {symbol}")
            return cached["price"]

    # 2️⃣ Cache miss → fetch fresh price
    print(f"[CACHE MISS] Fetching new price for {symbol}")
    price = _fetch_price_from_api(symbol)

    # 3️⃣ Update cache
    _price_cache[symbol] = {
        "price": price,
        "timestamp": now
    }

    return price
