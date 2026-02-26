import yfinance as yf

def get_live_prices(symbols):
    if not symbols:
        return {}

    formatted_symbols = [f"{s}.NS" for s in symbols]
    price_dict = {}

    try:
        # Fetching data for all tickers
        for sym in symbols:
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
                
                price_dict[sym] = round(float(price), 2) if price else 0.0
                print(f"DEBUG: {sym} price is {price_dict[sym]}") # Check your terminal for this!
                
            except Exception as e:
                print(f"Error for {sym}: {e}")
                price_dict[sym] = 0.0
                
        return price_dict
    except Exception as e:
        print(f"Global Error: {e}")
        return {s: 0.0 for s in symbols}