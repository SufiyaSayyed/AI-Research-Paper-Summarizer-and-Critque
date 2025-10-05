import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed_pw: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_pw.encode("utf-8"))