import pytest
from pydantic import ValidationError
from app.schemas.submission import ProjectSubmissionCreate

def test_valid_github_repo_urls():
    valid_urls = [
        "https://github.com/torvalds/linux",
        "http://github.com/facebook/react",
        "https://www.github.com/user/my-bootcamp-project",
        "https://github.com/devbloom/tracker-app/",
    ]
    for url in valid_urls:
        sub = ProjectSubmissionCreate(day_number=1, repo_url=url, description="Test project")
        assert sub.repo_url == url.strip()

def test_invalid_github_repo_url():
    invalid_urls = [
        "https://gitlab.com/user/project",
        "not-a-url",
        "https://google.com",
    ]
    for url in invalid_urls:
        with pytest.raises(ValidationError):
            ProjectSubmissionCreate(day_number=1, repo_url=url, description="Test project")
