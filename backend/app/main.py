from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.test_protected import router as test_router
from app.models.stock import Stock
from app.models.watchlist import Watchlist
from app.models.watchlist_stock import WatchlistStock
from app.routes.watchlists import router as watchlists_router


app = FastAPI(title="Virtual Trading Platform")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(test_router)
app.include_router(watchlists_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
