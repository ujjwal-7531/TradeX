# TradeX – Virtual Stock Trading Platform

TradeX is a full-stack virtual stock trading platform built for learning and simulation purposes.  
It allows users to trade stocks using virtual money based on real-time or delayed market prices, track portfolio performance, and analyze transaction history.

---

## 🚀 Features

### Authentication & Security
- User signup and login using JWT authentication
- Secure password hashing
- Token-based protected APIs

### Portfolio Management
- Virtual cash balance (configurable)
- Automatic portfolio creation on signup
- Portfolio summary with unrealized profit/loss

### Trading System
- Buy and sell stocks using market orders
- No fractional shares (Indian market rules)
- Average price calculation for holdings
- Realized P&L on sell transactions

### Holdings & Transactions
- Per-stock holdings with quantity and average price
- Complete transaction history (BUY / SELL)
- Pagination and filtering for transaction history

### Price Engine
- Centralized price service
- In-memory price caching to reduce API calls
- Easily switchable to real market APIs (Finnhub / Yahoo Finance)

### Settings & Account Control
- Change virtual cash balance
- Full account reset with:
  - CSV export of transaction history
  - Double confirmation for safety

---

## 🛠 Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL
- JWT Authentication
- Pydantic
- Uvicorn

### Frontend (Planned)
- React
- Vite
- Axios

---

## 🗄 Database Design (High Level)

- users
- portfolios
- stocks
- holdings
- transactions
- watchlists

Relational schema with foreign keys and constraints to ensure data consistency.

---

## ▶️ Running the Backend

### Prerequisites
- Python 3.10+
- MySQL
- Virtual environment

### Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
