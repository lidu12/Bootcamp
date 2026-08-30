from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.submission import ProjectSubmission
from app.models.checkin import DailyCheckin
from app.schemas.submission import (
    ProjectSubmissionCreate, ProjectSubmissionUpdate, ProjectSubmissionOut
)
from app.core.streak_logic import get_user_local_date

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/", response_model=ProjectSubmissionOut, status_code=status.HTTP_201_CREATED)
def create_submission(
    sub_in: ProjectSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today_local = get_user_local_date(current_user.timezone)
    today_str = today_local.strftime("%Y-%m-%d")

    submission = ProjectSubmission(
        user_id=current_user.id,
        day_number=sub_in.day_number,
        repo_url=sub_in.repo_url.strip(),
        description=sub_in.description or "",
        submitted_date=today_str
    )
    db.add(submission)

    # Also automatically log a checkin for today if not already logged!
    existing_checkin = db.query(DailyCheckin).filter(
        DailyCheckin.user_id == current_user.id,
        DailyCheckin.checkin_date == today_str
    ).first()

    if not existing_checkin:
        checkin = DailyCheckin(
            user_id=current_user.id,
            checkin_date=today_str,
            note=f"Submitted Day {sub_in.day_number} project"
        )
        db.add(checkin)

    db.commit()
    db.refresh(submission)
    return submission

@router.get("/", response_model=List[ProjectSubmissionOut])
def get_submissions(
    day_number: Optional[int] = None,
    search: Optional[str] = None,
    sort_order: str = Query("desc", enum=["asc", "desc"]),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ProjectSubmission).filter(ProjectSubmission.user_id == current_user.id)

    if day_number is not None:
        query = query.filter(ProjectSubmission.day_number == day_number)
    
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (ProjectSubmission.repo_url.ilike(search_pattern)) |
            (ProjectSubmission.description.ilike(search_pattern))
        )

    if sort_order == "asc":
        query = query.order_by(asc(ProjectSubmission.day_number), asc(ProjectSubmission.created_at))
    else:
        query = query.order_by(desc(ProjectSubmission.day_number), desc(ProjectSubmission.created_at))

    return query.all()

@router.get("/{submission_id}", response_model=ProjectSubmissionOut)
def get_submission_detail(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(ProjectSubmission).filter(
        ProjectSubmission.id == submission_id,
        ProjectSubmission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Project submission not found")
    return submission

@router.put("/{submission_id}", response_model=ProjectSubmissionOut)
def update_submission(
    submission_id: int,
    sub_in: ProjectSubmissionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(ProjectSubmission).filter(
        ProjectSubmission.id == submission_id,
        ProjectSubmission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Project submission not found")

    if sub_in.day_number is not None:
        submission.day_number = sub_in.day_number
    if sub_in.repo_url is not None:
        submission.repo_url = sub_in.repo_url.strip()
    if sub_in.description is not None:
        submission.description = sub_in.description

    db.commit()
    db.refresh(submission)
    return submission

@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(ProjectSubmission).filter(
        ProjectSubmission.id == submission_id,
        ProjectSubmission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Project submission not found")

    db.delete(submission)
    db.commit()
    return None
