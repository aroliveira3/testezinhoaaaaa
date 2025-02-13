from fastapi import APIRouter, HTTPException
from typing import List
from app.models.user import User, UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()
service = UserService()

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate):
    created_user = service.create_user(user)
    if not created_user:
        raise HTTPException(status_code=400, detail="User creation failed")
    return created_user

@router.get("/", response_model=List[UserResponse])
def get_users():
    return service.get_all_users()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    user = service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
