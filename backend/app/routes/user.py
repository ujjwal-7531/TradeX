from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserUpdate
from app.core.dependencies import get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=UserProfileResponse)
def get_user_profile(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/me", response_model=UserProfileResponse)
def update_user_profile(
    user_update: UserUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    
    if user_update.profile_picture_url is not None:
        user.profile_picture_url = user_update.profile_picture_url

    db.commit()
    db.refresh(user)
    return user
