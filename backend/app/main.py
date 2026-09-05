import os
from fastapi import FastAPI
from app.database import engine, Base
from app.routes.auth import router as auth_router
from app.routes.watchlists import router as watchlists_router
from app.routes.trade import router as trade_router
from app.routes.portfolio import router as portfolio_router
from app.routes.transactions import router as transactions_router
from app.routes.settings import router as settings_router
from app.routes.user import router as user_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes import stocks
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter

app = FastAPI(title="backend")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

Base.metadata.create_all(bind=engine)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    for url in frontend_url.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned and cleaned != "*":
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(watchlists_router)
app.include_router(trade_router)
app.include_router(portfolio_router)
app.include_router(transactions_router)
app.include_router(settings_router)
app.include_router(user_router)
app.include_router(stocks.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
