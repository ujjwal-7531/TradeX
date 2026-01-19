def get_stock_price(symbol: str) -> float:
    """
    Returns delayed/mock stock price.
    This is a placeholder for real market data.
    """

    mock_prices = {
        "TCS": 3500.0,
        "INFY": 1450.0,
        "RELIANCE": 2500.0,
        "HDFCBANK": 1600.0,
        "ICICIBANK": 950.0
    }

    price = mock_prices.get(symbol.upper())

    if price is None:
        raise ValueError("Price not available")

    return price
