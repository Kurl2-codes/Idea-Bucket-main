from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union, Any

class Settings(BaseSettings):
    PROJECT_NAME: str = "IdeaBucket Backend"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str
    REDIS_URL: str = "redis://redis:6379"
    DATABASE_NAME: str = "ideabucket"

    # S3 Object Storage
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_BUCKET_NAME: str
    S3_ENDPOINT: str
    S3_REGION: str

    # Gemini
    GEMINI_API_KEY: str
    SECRET_KEY: str = "debug-secret-key"
    
    # Allow passing as comma-separated string or list
    CORS_ORIGINS: Any = ["http://localhost:3000", "http://localhost:8000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        env_file = (".env", "../.env")
        case_sensitive = True
        extra = "ignore"

settings = Settings()
