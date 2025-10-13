from fastapi import APIRouter, HTTPException, Depends, Response, Cookie, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from .models import SignUpRequest, TokenResponse, LoginRequest
from .auth_utils import get_user_by_email, get_user_by_id, hash_password, verify_password, create_refresh_token, create_access_token, _hash_token
from ..config.db import users_collection
from ..config.config import settings
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from jose import jwt, JWTError

# Creates a router for authentication-related routes, all starting with /auth.
# security = HTTPBasic() → sets up HTTP Basic authentication handler.
router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBasic()

# This function runs when authentication is required.
# users_collection.find_one(...) → looks for a matching user in MongoDB.
# If user doesn’t exist OR password verification fails → return 401 Unauthorized.
# If valid → return a dict with the username, email, user_id.

def authenticate(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    
    token = auth_header.split(" ")[1]
    
    try: 
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Inavalid token type")
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Create user.")
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized access. Invalid credentials.")
    return {
        "user_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
        }

@router.post("/new-signup", response_model=TokenResponse)
def signup(payload: SignUpRequest, response: Response):
    if get_user_by_email(payload.email):
        raise HTTPException(400, "Email already registered")
    hashed = hash_password(payload.password)
    user_doc = {
        "email": payload.email,
        "username": payload.username,
        "password_hash": hashed,
        "created_at": datetime.now(timezone.utc),
        "refresh_tokens": []
    }
    res = users_collection.insert_one(user_doc)
    user_id = str(res.inserted_id)

    access_tk = create_access_token(user_id)
    refresh_token, jti, expire = create_refresh_token(user_id)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {
            "refresh_tokens": {
                "jti": jti,
                "token_hash": _hash_token(refresh_token),
                "expires": expire,
                "created_at": datetime.now(timezone.utc)
            }
        }}
    )
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False,
                        samesite="lax", max_age=int((expire - datetime.now(timezone.utc)).total_seconds()))
    return {
        "username": payload.username,
        "email": payload.email,
        "access_token": access_tk
    }


@router.post("/new-login", response_model=TokenResponse)
def login(payload: LoginRequest, response: Response):
    print("payload: ", payload)
    user = get_user_by_email(payload.email)
    print("user details: ", user)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    user_id = str(user["_id"])
    access_tk = create_access_token(user_id)
    refresh_token, jti, expire = create_refresh_token(user_id)
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {
            "refresh_tokens": {
                "jti": jti,
                "token_hash": _hash_token(refresh_token),
                "expires": expire,
                "created_at": datetime.now(timezone.utc)
            }
        }}
    )
    print("refresh_token", refresh_token)
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False, samesite="lax",
                        max_age=int((expire - datetime.now(timezone.utc)).total_seconds()))

    return {
        "access_token": access_tk,
        "username": user["username"],
        "email": user["email"]
    }


@router.post("/new-logout")
def logout(request: Request, response: Response):
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        response.delete_cookie("refresh_token")
        return {"msg": "user logged out"}

    try:
        payload = jwt.decode(refresh, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        user_id = payload["sub"]
        jti = payload.get("jti")

    except JWTError:
        response.delete_cookie("refresh_token")

    users_collection.update_one({"_id": ObjectId(user_id)}, {"$pull": {"refresh_tokens": {"jti": jti}}})
    response.delete_cookie("refresh_token")
    return {"msg": "user logged out"}


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: Request, response: Response):
    # refresh token delivered via HttpOnly cookie
    print("request of refresh: ", request)
    refresh = request.cookies.get("refresh_token")
    print("refresh token: ", refresh)
    if not refresh:
        raise HTTPException(401, "No refresh token")
    try:
        payload = jwt.decode(refresh, settings.SECRET_KEY,
                             algorithms=[settings.ALGORITHM])
        if payload .get("type") != "refresh":
            raise HTTPException(401, "Invalid token type")
        user_id = payload["sub"]
        jti = payload.get("jti")
    except JWTError:
        raise HTTPException(401, "Invalid refresh token")

    # find the matching hash in DB
    hashed = _hash_token(refresh)
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(401, "User not found")

    # check stored tokens list
    stored = None
    for t in user.get("refresh_tokens", []):
        if t["jti"] == jti and t["token_hash"] == hashed:
            stored = t
            print("stored: ", stored)
            break
    if not stored:
        # possible token reuse attack
        raise HTTPException(401, "Refresh token expired")
    
    expires = stored["expires"]
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
        
    # check expiry
    if datetime.now(timezone.utc) > expires:
        raise HTTPException(401, "Refresh token expired")

    # rotate + create new refresh + access, replace old stored token
    access_tk = create_access_token(user_id)
    new_refresh, new_jti, new_expire = create_refresh_token(user_id)
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {
            "refresh_tokens": {
                "jti": new_jti,
                "token_hash": _hash_token(new_refresh),
                "expires": new_expire,
                "created_at": datetime.now(timezone.utc)
            }
        }}
    )
    response.set_cookie("refresh_token", new_refresh, httponly=True, secure=False, samesite="lax", max_age=int(
        (new_expire - datetime.now(timezone.utc)).total_seconds()))
    return {
        "access_token": access_tk,
        "username": user["username"],
        "email": user["email"]
        }
