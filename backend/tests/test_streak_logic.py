from datetime import datetime, timedelta, date
from app.core.streak_logic import compute_streak_stats, generate_calendar_heatmap, get_user_local_date

def test_empty_checkins():
    stats = compute_streak_stats([], tz_name="UTC")
    assert stats["current_streak"] == 0
    assert stats["longest_streak"] == 0
    assert stats["total_logged_days"] == 0
    assert stats["has_checked_in_today"] is False

def test_consecutive_days_streak():
    today = get_user_local_date("UTC")
    d1 = (today - timedelta(days=2)).strftime("%Y-%m-%d")
    d2 = (today - timedelta(days=1)).strftime("%Y-%m-%d")
    d3 = today.strftime("%Y-%m-%d")

    stats = compute_streak_stats([d1, d2, d3], tz_name="UTC")
    assert stats["current_streak"] == 3
    assert stats["longest_streak"] == 3
    assert stats["total_logged_days"] == 3
    assert stats["has_checked_in_today"] is True

def test_missed_day_resets_streak_to_zero():
    today = get_user_local_date("UTC")
    # Checked in 3 days ago and 2 days ago, but missed yesterday and today
    d1 = (today - timedelta(days=3)).strftime("%Y-%m-%d")
    d2 = (today - timedelta(days=2)).strftime("%Y-%m-%d")

    stats = compute_streak_stats([d1, d2], tz_name="UTC")
    assert stats["current_streak"] == 0
    assert stats["longest_streak"] == 2
    assert stats["total_logged_days"] == 2
    assert stats["has_checked_in_today"] is False

def test_yesterday_checkin_maintains_active_streak():
    today = get_user_local_date("UTC")
    d1 = (today - timedelta(days=2)).strftime("%Y-%m-%d")
    d2 = (today - timedelta(days=1)).strftime("%Y-%m-%d")

    # Checked in yesterday, today hasn't checked in yet -> streak should still be 2!
    stats = compute_streak_stats([d1, d2], tz_name="UTC")
    assert stats["current_streak"] == 2
    assert stats["longest_streak"] == 2
    assert stats["has_checked_in_today"] is False

def test_timezone_specific_date():
    today_utc = get_user_local_date("UTC")
    today_tokyo = get_user_local_date("Asia/Tokyo")
    assert isinstance(today_utc, date)
    assert isinstance(today_tokyo, date)

def test_heatmap_generation():
    today = get_user_local_date("UTC")
    d1 = today.strftime("%Y-%m-%d")
    cells = generate_calendar_heatmap([d1], days_count=30, tz_name="UTC")
    assert len(cells) == 30
    last_cell = cells[-1]
    assert last_cell["date"] == d1
    assert last_cell["status"] == "completed"
    assert last_cell["is_today"] is True
