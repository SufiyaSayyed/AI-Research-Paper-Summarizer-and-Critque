from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    MONGO_URI: str
    DB_NAME: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    PINECONE_ENV: str
    GOOGLE_API_KEY: str
    UPLOAD_DIR: Path
    IMAGE_DIR: Path

    class Config:
        env_file = ".env"


settings = Settings()
