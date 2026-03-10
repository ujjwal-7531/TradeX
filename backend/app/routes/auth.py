from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, OTPVerify
from app.core.security import hash_password, verify_password, create_access_token
from app.models.portfolio import Portfolio
from app.services.email import send_welcome_email, send_otp_email
from app.core.limiter import limiter
from fastapi import Request
import random
import string
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
@limiter.limit("3/minute")
def signup(
    request: Request,
    user: UserCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = ''.join(random.choices(string.digits, k=6))
    otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    new_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        verification_otp=otp,
        otp_expires_at=otp_expires_at,
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    portfolio = Portfolio(
        user_id=new_user.id
    )

    db.add(portfolio)
    db.commit()

    # Trigger OTP email asynchronously
    background_tasks.add_task(send_otp_email, new_user.email, otp)

    return {"message": "User created successfully. Please verify your email."}


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user or not verify_password(
        user.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not db_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified"
        )

    access_token = create_access_token(
        data={"user_id": db_user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": db_user.email,
        "full_name": db_user.full_name,
        "profile_picture_url": db_user.profile_picture_url
    }

@router.post("/token")
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user or not verify_password(
        form_data.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not db_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified"
        )

    access_token = create_access_token(
        data={"user_id": db_user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/verify-otp")
def verify_otp(
    data: OTPVerify,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == data.email).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
        
    if db_user.is_verified:
        return {"message": "Email already verified"}
        
    if db_user.verification_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    # Make sure otp_expires_at is timezone-aware
    now = datetime.now(timezone.utc)
    # SQLAlchemy sometimes returns naive datetimes even for Timestamp with Timezone columns depending on DB dialect.
    # However since we store them with utcnow, treating them as naïve UTC or aware UTC usually works.
    if db_user.otp_expires_at and db_user.otp_expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    db_user.is_verified = True
    db_user.verification_otp = None
    db_user.otp_expires_at = None
    db.commit()
    
    background_tasks.add_task(send_welcome_email, db_user.email)
    
    return {"message": "Email verified successfully"}

from pydantic import EmailStr
from typing import Dict

@router.post("/resend-otp")
@limiter.limit("1/minute")
def resend_otp(
    request: Request,
    body: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = body.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    db_user = db.query(User).filter(User.email == email).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
        
    if db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email is already verified")
        
    otp = ''.join(random.choices(string.digits, k=6))
    otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    db_user.verification_otp = otp
    db_user.otp_expires_at = otp_expires_at
    db.commit()
    
    background_tasks.add_task(send_otp_email, db_user.email, otp)
    
    return {"message": "OTP resent successfully"}
