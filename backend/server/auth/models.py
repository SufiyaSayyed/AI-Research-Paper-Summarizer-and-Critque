from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    username: str
    email: EmailStr
    access_token: str
    token_type: str = "bearer"
    
class RefreshTokenResponse(BaseModel):
    access_token: str