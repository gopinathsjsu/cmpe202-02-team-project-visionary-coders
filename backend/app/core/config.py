from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os


class Settings(BaseSettings):
    SECRET_KEY: str = Field("dev-secret-change-me")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = Field(default="sqlite:///./db.sqlite3")
    MEDIA_DIR: str = Field(default="./media")
    OPENAI_API_KEY: Optional[str] = None  # compatible with Python 3.9

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
os.makedirs(settings.MEDIA_DIR, exist_ok=True)
