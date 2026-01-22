from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.test_protected import router as test_router
from app.models.stock import Stock
from app.models.watchlist import Watchlist
from app.models.watchlist_stock import WatchlistStock
from app.routes.watchlists import router as watchlists_router
from app.models.portfolio import Portfolio
from app.models.holding import Holding
from app.routes.trade import router as trade_router
from app.routes.portfolio import router as portfolio_router
from app.routes.transactions import router as transactions_router
from app.routes.settings import router as settings_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="backend")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(test_router)
app.include_router(watchlists_router)
app.include_router(trade_router)
app.include_router(portfolio_router)
app.include_router(transactions_router)
app.include_router(settings_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
