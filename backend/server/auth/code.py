# backend/auth_app.py
from fastapi import Header
import os
import hashlib
from datetime import datetime, timedelta
from uuid import uuid4
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Response, Cookie, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError
import motor.motor_asyncio
from bson import ObjectId

# Load config from env
SECRET_KEY = os.getenv("JWT_SECRET", "change-me-to-a-long-random-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_EXPIRE_DAYS", 7))
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "authdb")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
users = db["users"]  # collection

app = FastAPI(title="Auth Demo")

# --- Models ---


class SignUpRequest(BaseModel):
    email: EmailStr
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- Utility functions ---


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_access_token(sub: str, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": str(sub), "type": "access"}
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(sub: str, expires_delta: Optional[timedelta] = None):
    jti = str(uuid4())
    expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    payload = {"sub": str(sub), "jti": jti, "type": "refresh",
               "exp": expire, "iat": datetime.utcnow()}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expire


async def get_user_by_email(email: str):
    u = await users.find_one({"email": email})
    return u


async def get_user_by_id(user_id: str):
    u = await users.find_one({"_id": ObjectId(user_id)})
    return u

# --- Routes ---


@app.post("/auth/signup", response_model=TokenResponse)
async def signup(payload: SignUpRequest, response: Response):
    if await get_user_by_email(payload.email):
        raise HTTPException(400, "Email already registered")
    hashed = hash_password(payload.password)
    user_doc = {
        "email": payload.email,
        "username": payload.username,
        "password_hash": hashed,
        "created_at": datetime.utcnow(),
        # refresh_tokens is a list of dicts: {jti, token_hash, expires, created_at, meta}
        "refresh_tokens": []
    }
    res = await users.insert_one(user_doc)
    user_id = str(res.inserted_id)

    access = create_access_token(user_id)
    refresh_token, jti, expire = create_refresh_token(user_id)
    # store hashed refresh token
    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"refresh_tokens": {"jti": jti, "token_hash": _hash_token(refresh_token),
                                      "expires": expire, "created_at": datetime.utcnow()}}}
    )
    # Set httpOnly cookie for refresh token
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="lax",
                        max_age=int((expire - datetime.utcnow()).total_seconds()))
    return {"access_token": access}


@app.post("/auth/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), response: Response = None):
    # OAuth2PasswordRequestForm gives .username and .password; we will use username as email
    user = await get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    user_id = str(user["_id"])
    access = create_access_token(user_id)
    refresh_token, jti, expire = create_refresh_token(user_id)
    # optional: track multiple refresh tokens for devices
    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"refresh_tokens": {"jti": jti, "token_hash": _hash_token(refresh_token),
                                      "expires": expire, "created_at": datetime.utcnow()}}}
    )
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="lax",
                        max_age=int((expire - datetime.utcnow()).total_seconds()))
    return {"access_token": access}


@app.post("/auth/refresh", response_model=TokenResponse)
async def refresh_token(request: Request, response: Response):
    # refresh token delivered via httpOnly cookie
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        raise HTTPException(401, "No refresh token")
    try:
        payload = jwt.decode(refresh, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(401, "Invalid token type")
        user_id = payload["sub"]
        jti = payload.get("jti")
    except JWTError:
        raise HTTPException(401, "Invalid refresh token")
    # find the matching hash in DB
    hashed = _hash_token(refresh)
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(401, "User not found")
    # check stored tokens list
    stored = None
    for t in user.get("refresh_tokens", []):
        if t["jti"] == jti and t["token_hash"] == hashed:
            stored = t
            break
    if not stored:
        # possible token reuse attack
        # Optionally: clear all refresh tokens for this user and force re-login
        raise HTTPException(401, "Refresh token not recognized")
    # check expiry
    if datetime.utcnow() > stored["expires"]:
        raise HTTPException(401, "Refresh token expired")
    # rotate: create new refresh + access, replace the old stored token
    access = create_access_token(user_id)
    new_refresh, new_jti, new_expire = create_refresh_token(user_id)
    await users.update_one(
        {"_id": ObjectId(user_id), "refresh_tokens.jti": jti},
        {"$set": {"refresh_tokens.$.jti": new_jti,
                  "refresh_tokens.$.token_hash": _hash_token(new_refresh),
                  "refresh_tokens.$.expires": new_expire,
                  "refresh_tokens.$.created_at": datetime.utcnow()}}
    )
    response.set_cookie("refresh_token", new_refresh, httponly=True, secure=True, samesite="lax",
                        max_age=int((new_expire - datetime.utcnow()).total_seconds()))
    return {"access_token": access}


@app.post("/auth/logout")
async def logout(request: Request, response: Response):
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        response.delete_cookie("refresh_token")
        return {"msg": "logged out"}
    try:
        payload = jwt.decode(refresh, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        jti = payload.get("jti")
    except JWTError:
        # clear cookie anyway
        response.delete_cookie("refresh_token")
        return {"msg": "logged out"}
    # remove that refresh token from DB
    await users.update_one({"_id": ObjectId(user_id)}, {"$pull": {"refresh_tokens": {"jti": jti}}})
    response.delete_cookie("refresh_token")
    return {"msg": "logged out"}

# Protected route example


async def get_current_user(authorization: str = Header(...)):
    # Expect "Bearer <token>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Invalid auth header")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(401, "Not an access token")
        user_id = payload["sub"]
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(401, "User not found")
    return user


@app.get("/protected/me")
async def me(current_user=Depends(get_current_user)):
    return {"email": current_user["email"], "username": current_user["username"]}
