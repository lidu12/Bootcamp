import csv
import io
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.checkin import DailyCheckin
from app.models.submission import ProjectSubmission

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/csv")
def export_history_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submissions = db.query(ProjectSubmission).filter(
        ProjectSubmission.user_id == current_user.id
    ).order_by(ProjectSubmission.day_number.asc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Submission ID", "Day Number", "GitHub Repository URL", "Description", "Submitted Date", "Created At UTC"])

    for sub in submissions:
        writer.writerow([
            sub.id,
            sub.day_number,
            sub.repo_url,
            sub.description,
            sub.submitted_date,
            sub.created_at.isoformat()
        ])

    output.seek(0)
    filename = f"devbloom_submissions_{current_user.username}.csv"
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/json")
def export_history_json(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkins = db.query(DailyCheckin).filter(DailyCheckin.user_id == current_user.id).all()
    submissions = db.query(ProjectSubmission).filter(ProjectSubmission.user_id == current_user.id).all()

    data = {
        "user": {
            "username": current_user.username,
            "email": current_user.email,
            "timezone": current_user.timezone,
            "created_at": current_user.created_at.isoformat()
        },
        "checkins": [
            {
                "id": c.id,
                "checkin_date": c.checkin_date,
                "note": c.note,
                "created_at": c.created_at.isoformat()
            } for c in checkins
        ],
        "submissions": [
            {
                "id": s.id,
                "day_number": s.day_number,
                "repo_url": s.repo_url,
                "description": s.description,
                "submitted_date": s.submitted_date,
                "created_at": s.created_at.isoformat()
            } for s in submissions
        ]
    }

    filename = f"devbloom_data_{current_user.username}.json"
    json_bytes = json.dumps(data, indent=2).encode("utf-8")
    return Response(
        content=json_bytes,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
