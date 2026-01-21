from pydantic import BaseModel, Field

class BuyStockRequest(BaseModel):
    symbol: str = Field(..., example="TCS")
    quantity: int = Field(..., gt=0, example=10)
class SellStockRequest(BaseModel):
    symbol: str
    quantity: int
