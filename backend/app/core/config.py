from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "IdeaBucket Backend"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str
    DATABASE_NAME: str = "ideabucket"

    # S3 Object Storage
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_BUCKET_NAME: str
    S3_ENDPOINT: str
    S3_REGION: str

    # Gemini
    GEMINI_API_KEY: str
    SECRET_KEY: str = "your-secret-key-keep-it-secret"
    
    CORS_ORIGINS: str = "*"

    class Config:
        env_file = (".env", "../.env")
        case_sensitive = True
        extra = "ignore"

settings = Settings()
