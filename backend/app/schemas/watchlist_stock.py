from pydantic import BaseModel

class WatchlistStockAdd(BaseModel):
    symbol: str
