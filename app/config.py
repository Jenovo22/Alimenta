"""Application configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment."""
    
    # JWT Configuration
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # Database URLs
    database_url: str = "sqlite:///./feature_flags.db"
    donations_db_url: str = "sqlite:///./donations.db"
    
    # Gemini API
    gemini_api_key: str = ""
    gemini_base_url: str = "https://generativelanguage.googleapis.com"
    gemini_model: str = "gemini-2.0-flash"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
