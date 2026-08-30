from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional
import re

GITHUB_URL_REGEX = r"^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/)?$"

class ProjectSubmissionCreate(BaseModel):
    day_number: int = Field(..., ge=1, le=1000)
    repo_url: str
    description: Optional[str] = ""

    @field_validator("repo_url")
    @classmethod
    def validate_github_url(cls, v: str) -> str:
        v = v.strip()
        if not re.match(GITHUB_URL_REGEX, v, re.IGNORECASE):
            if "github.com/" not in v.lower():
                raise ValueError("Must be a valid GitHub repository URL (e.g. https://github.com/username/repository)")
        return v

class ProjectSubmissionUpdate(BaseModel):
    day_number: Optional[int] = Field(None, ge=1, le=1000)
    repo_url: Optional[str] = None
    description: Optional[str] = None

    @field_validator("repo_url")
    @classmethod
    def validate_github_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if "github.com/" not in v.lower():
            raise ValueError("Must be a valid GitHub repository URL")
        return v

class ProjectSubmissionOut(BaseModel):
    id: int
    user_id: int
    day_number: int
    repo_url: str
    description: Optional[str] = ""
    submitted_date: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
