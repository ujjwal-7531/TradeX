from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.portfolio import Portfolio

load_dotenv()

security = HTTPBearer(auto_error=False)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db)
) -> int:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )

    token = credentials.credentials

    try:
        # 1. Unverified decode to inspect claims (Clerk vs legacy JWT)
        unverified_claims = jwt.get_unverified_claims(token)
        
        # Check if this is a Clerk Session Token (contains 'sub' claim with 'user_...')
        sub = unverified_claims.get("sub")
        
        if sub and (isinstance(sub, str) and (sub.startswith("user_") or "@" in sub)):
            clerk_id = sub
            # Retrieve email or fallback identifier from claims
            email = unverified_claims.get("email") or unverified_claims.get("primary_email") or f"{clerk_id}@clerk.user"
            name = unverified_claims.get("full_name") or unverified_claims.get("name") or "Trader"
            
            # Check DB for existing user by clerk_id or email
            user = db.query(User).filter(
                (User.clerk_id == clerk_id) | (User.email == email)
            ).first()

            if not user:
                # First-time Clerk login: Auto-provision user & initial portfolio
                user = User(
                    email=email,
                    clerk_id=clerk_id,
                    full_name=name
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                # Initialize paper trading portfolio
                portfolio = Portfolio(user_id=user.id)
                db.add(portfolio)
                db.commit()
            elif not user.clerk_id:
                # Link existing email account to Clerk ID
                user.clerk_id = clerk_id
                db.commit()

            return user.id

        # 2. Legacy JWT validation fallback
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int | None = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {e}"
        )
