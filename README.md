# TradeX

## Description
TradeX is a comprehensive paper trading platform designed to simulate exactly how real stock market mechanics function without risking real capital. The application provides users with an initial virtual balance to execute buy and sell orders based on live market pricing. It is built using a modern architecture with a React frontend natively integrating with a high-performance FastAPI back-end. The platform emphasizes strong security, optimal server-caching mechanisms, and a highly responsive user experience. 

## Technical Stack
- Frontend: React (Vite), TailwindCSS, Recharts
- Backend: Python, FastAPI, SQLAlchemy, yfinance
- Database: MySQL (Cloud TiDB architecture)
- Authentication: JWT, bcrypt, PyOTP, Secure SMTP 

## Core Functionalities

### Authentication and Account Security
- Secure user registration and login workflows using cryptographic password hashing.
- Strict email validation requiring users to manually verify their accounts using 6-digit Time-Based One-Time Passwords (OTPs) sent via SMTP.
- Account recovery flow allowing verified users to securely reconstruct their passwords if forgotten.
- Automated client-side image compression that mathematically resizes profile pictures to optimize database storage prior to upload.

### Market Data and Charting
- Real-time stock querying directly pulling current market valuations.
- Comprehensive market charts built entirely through native browser SVGs, completely bypassing sluggish third-party iFrame widgets.
- Scalable timeline integration empowering users to adjust chart viewing parameters across 1-Week, 1-Month, 1-Year, 3-Year, and 5-Year macro horizons.
- Deep performance preservation leveraging compound server-side LRU hashing and transient JavaScript Object memory caches to achieve zero-latency chart re-loading.
- Silent background polling mechanism to iteratively update live pricing on active Watchlists without triggering interface disruption or page refreshes.

### Portfolio and Transaction Management
- Functional paper trading execution prioritizing absolute mathematical consistency (e.g. validating sufficient cash limits before processing a 'Buy', confirming asset ownership constraints prior to a 'Sell').
- Centralized portfolio dashboard accurately representing total capital invested, dynamic current valuation mapping, and percentage-based unrealized profit and loss trackers.
- Persistent transaction ledger maintaining a permanent record of all account activity.
- Deep-level database manipulation functionality allowing users to export their entire transaction ledger as a CSV backup prior to wiping their account data gracefully.
