from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

    class Config:
        from_attributes = True
