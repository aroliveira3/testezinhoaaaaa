from app.models.user import UserCreate, UserResponse
from app.database import SessionLocal
from app.database.models import User as DBUser
from typing import List

class UserService:
    def __init__(self):
        self.db = SessionLocal()

    def create_user(self, user: UserCreate) -> UserResponse:
        db_user = DBUser(name=user.name, email=user.email, password=user.password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return UserResponse.from_orm(db_user)

    def get_all_users(self) -> List[UserResponse]:
        users = self.db.query(DBUser).all()
        return [UserResponse.from_orm(user) for user in users]

    def get_user_by_id(self, user_id: int) -> UserResponse:
        user = self.db.query(DBUser).filter(DBUser.id == user_id).first()
        if user:
            return UserResponse.from_orm(user)
        return None
