from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from .models import SignUpRequest
from .auth_utils import hash_password, verify_password
from ..config.db import users_collection
from ..config.config import settings


pwd_context = Cryp







# Creates a router for authentication-related routes, all starting with /auth.
# security = HTTPBasic() → sets up HTTP Basic authentication handler.
router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBasic()

# This function runs when authentication is required.
# Depends(security) → FastAPI automatically extracts username/password from the HTTP Basic header.
# users_collection.find_one(...) → looks for a matching user in MongoDB.
# If user doesn’t exist OR password verification fails → return 401 Unauthorized.
# If valid → return a dict with the username.

def authenticate(credentials: HTTPBasicCredentials=Depends(security)):
    user=users_collection.find_one({"username": credentials.username})
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Create user.")
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Unauthorized acess. Invalid credentials.")
    return {"username": user["username"]}


# Method: POST /auth/signup (account creation endpoint)
# Input: A SignUpRequest object.
# First, checks if a user already exists. If yes → return 400 Bad Request.
# If new, hash password and inserts in DB.
# Returns a success message.

@router.post("/signup")
def signup(request: SignUpRequest):
    if users_collection.find_one({"username": request.username}):
        raise HTTPException(status_code=400, detail="User already exists")
    
    users_collection.insert_one({
        "username": request.username,
        "password": hash_password(request.password)
    })
    
    return {"message": "User created successfully!"}


# Method: GET /auth/login(login endpoint)
# user=Depends(authenticate) → before running login(), FastAPI calls authenticate().
# If authentication passes, returns the logged-in user’s username.
# doesn’t create a session or JWT. It just validates credentials.
@router.get("/login")
def login(user=Depends(authenticate)):
    return {"username": user["username"]}