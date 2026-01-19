from pydantic import BaseModel

class WatchlistCreate(BaseModel):
    name: str
