import os
import json
from typing import List, Union
from pydantic import field_validator, ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Devbloom"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "devbloom_secret_jwt_key_change_in_production_32bytes_minimum"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    DATABASE_URL: str = "sqlite:///./devbloom.db"
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    model_config = ConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",")]
        return v

settings = Settings()
