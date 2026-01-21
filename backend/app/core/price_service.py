# import time
# from decimal import Decimal

# # how long a cached price is valid (seconds)
# CACHE_TTL = 30

# # in-memory cache
# _price_cache = {}


# def _fetch_price_from_api(symbol: str) -> Decimal:
#     """
#     Actual API call to fetch stock price.
#     This is your existing logic (Finnhub / Yahoo / etc).
#     """
#     # IMPORTANT: keep your existing API call here
#     # Example placeholder:
#     price = 3500.00  # replace with real API result
#     return Decimal(str(price))


# def get_stock_price(symbol: str) -> Decimal:
#     symbol = symbol.upper()
#     now = time.time()

#     # 1️⃣ Check cache
#     if symbol in _price_cache:
#         cached = _price_cache[symbol]
#         age = now - cached["timestamp"]

#         if age < CACHE_TTL:
#             return cached["price"]

#     # 2️⃣ Cache miss or expired → fetch fresh
#     price = _fetch_price_from_api(symbol)

#     # 3️⃣ Update cache
#     _price_cache[symbol] = {
#         "price": price,
#         "timestamp": now
#     }
    
#     print("CACHE HIT:", symbol)
#     print("CACHE MISS:", symbol)

#     return price

import time
from decimal import Decimal

# Cache expiry time in seconds (change anytime)
CACHE_TTL = 30

# In-memory cache structure
# {
#   "TCS": {
#       "price": Decimal("3500.25"),
#       "timestamp": 1700000000.0
#   }
# }
_price_cache = {}


def _fetch_price_from_api(symbol: str) -> Decimal:
    """
    Fetch stock price from external API.
    Replace the placeholder logic with Finnhub / Yahoo later.
    """
    print(f"[PRICE API CALL] Fetching price for {symbol}")

    # TODO: Replace this with real API call
    price = 3500.00  

    return Decimal(str(price))


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

        if age < CACHE_TTL:
            print(f"[CACHE HIT] Using cached price for {symbol}")
            return cached["price"]

        print(f"[CACHE EXPIRED] Cache expired for {symbol}")

    # 2️⃣ Cache miss → fetch fresh price
    print(f"[CACHE MISS] Fetching new price for {symbol}")
    price = _fetch_price_from_api(symbol)

    # 3️⃣ Update cache
    _price_cache[symbol] = {
        "price": price,
        "timestamp": now
    }

    return price

