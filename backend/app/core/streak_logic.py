from datetime import datetime, date, timedelta, timezone
from typing import List, Set, Dict, Any
import zoneinfo

def get_user_local_date(tz_name: str = "UTC") -> date:
    """Returns today's date in the user's specified timezone."""
    try:
        tz = zoneinfo.ZoneInfo(tz_name)
        return datetime.now(tz).date()
    except Exception:
        return datetime.now(timezone.utc).date()

def compute_streak_stats(
    checkin_date_strings: List[str],
    tz_name: str = "UTC",
    streak_freezes_available: int = 0,
    streak_freezes_used: int = 0
) -> Dict[str, Any]:
    """
    Computes current streak, longest streak, and stats given a list of YYYY-MM-DD checkin dates.
    Applies Duolingo-style streak freeze protection if user missed 1 day and has freezes available.
    """
    if not checkin_date_strings:
        today_local = get_user_local_date(tz_name)
        return {
            "current_streak": 0,
            "longest_streak": 0,
            "total_logged_days": 0,
            "has_checked_in_today": False,
            "last_checkin_date": None,
            "today_date": today_local.strftime("%Y-%m-%d"),
            "streak_freezes_available": streak_freezes_available,
            "streak_freezes_used": streak_freezes_used,
            "freeze_applied_today": False,
        }

    valid_dates: Set[date] = set()
    for ds in checkin_date_strings:
        try:
            valid_dates.add(datetime.strptime(ds, "%Y-%m-%d").date())
        except ValueError:
            continue

    if not valid_dates:
        today_local = get_user_local_date(tz_name)
        return {
            "current_streak": 0,
            "longest_streak": 0,
            "total_logged_days": 0,
            "has_checked_in_today": False,
            "last_checkin_date": None,
            "today_date": today_local.strftime("%Y-%m-%d"),
            "streak_freezes_available": streak_freezes_available,
            "streak_freezes_used": streak_freezes_used,
            "freeze_applied_today": False,
        }

    sorted_dates = sorted(list(valid_dates))
    today_local = get_user_local_date(tz_name)
    yesterday_local = today_local - timedelta(days=1)
    day_before_yesterday = today_local - timedelta(days=2)
    today_str = today_local.strftime("%Y-%m-%d")

    has_checked_in_today = today_local in valid_dates
    has_checked_in_yesterday = yesterday_local in valid_dates

    freeze_applied_today = False

    # Check if user needs a streak freeze (missed yesterday, but logged day before yesterday)
    effective_valid_dates = set(valid_dates)
    if not has_checked_in_today and not has_checked_in_yesterday:
        if day_before_yesterday in valid_dates and streak_freezes_available > 0:
            effective_valid_dates.add(yesterday_local)
            has_checked_in_yesterday = True
            freeze_applied_today = True

    # Calculate Current Streak
    current_streak = 0
    if has_checked_in_today or has_checked_in_yesterday:
        scan_date = today_local if has_checked_in_today else yesterday_local
        while scan_date in effective_valid_dates:
            current_streak += 1
            scan_date -= timedelta(days=1)
    else:
        current_streak = 0

    # Calculate Longest Streak in history
    longest_streak = 0
    temp_streak = 0
    prev_date = None

    for d in sorted(list(effective_valid_dates)):
        if prev_date is None:
            temp_streak = 1
        elif d == prev_date + timedelta(days=1):
            temp_streak += 1
        elif d > prev_date + timedelta(days=1):
            temp_streak = 1
        
        if temp_streak > longest_streak:
            longest_streak = temp_streak
        prev_date = d

    if current_streak > longest_streak:
        longest_streak = current_streak

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_logged_days": len(valid_dates),
        "has_checked_in_today": has_checked_in_today,
        "last_checkin_date": sorted_dates[-1].strftime("%Y-%m-%d"),
        "today_date": today_str,
        "streak_freezes_available": streak_freezes_available - (1 if freeze_applied_today else 0),
        "streak_freezes_used": streak_freezes_used + (1 if freeze_applied_today else 0),
        "freeze_applied_today": freeze_applied_today,
    }

def generate_calendar_heatmap(checkin_date_strings: List[str], days_count: int = 180, tz_name: str = "UTC") -> List[Dict[str, Any]]:
    checkin_set = set(checkin_date_strings)
    today_local = get_user_local_date(tz_name)
    start_date = today_local - timedelta(days=days_count - 1)

    heatmap_cells = []
    curr_date = start_date
    while curr_date <= today_local:
        date_str = curr_date.strftime("%Y-%m-%d")
        if date_str in checkin_set:
            status = "completed"
            level = 3
        elif curr_date == today_local:
            status = "today_pending"
            level = 0
        else:
            status = "missed"
            level = 0

        heatmap_cells.append({
            "date": date_str,
            "status": status,
            "level": level,
            "is_today": (curr_date == today_local),
            "day_of_week": curr_date.strftime("%a"),
            "month": curr_date.strftime("%b"),
        })
        curr_date += timedelta(days=1)

    return heatmap_cells
