import hashlib
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from ..config.config import settings
from ..config.db import users_collection
from jose import jwt, JWTError
from uuid import uuid4
from bson import ObjectId


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    verification = pwd_context.verify(plain, hashed)
    print("Password verification: ", verification)
    return pwd_context.verify(plain, hashed)

def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def create_access_token(sub:str, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": str(sub), "type": "access"}
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(sub: str, expires_delta: Optional[timedelta] = None):
    jti = str(uuid4())
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    payload = {"sub": str(sub), "jti": jti, "type": "refresh", "exp": expire, "iat": datetime.now(timezone.utc)}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti, expire

def get_user_by_email(email: str):
    user = users_collection.find_one({"email": email})
    print("user: ", user)
    return user

def get_user_by_id(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user