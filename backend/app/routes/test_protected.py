from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user_id

router = APIRouter(prefix="/test", tags=["Test"])

@router.get("/protected")
def protected_route(user_id: int = Depends(get_current_user_id)):
    return {
        "message": "You have accessed a protected route",
        "user_id": user_id
    }
