import type { HeatmapCell } from "../components/StreakHeatmap";

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_logged_days: number;
  has_checked_in_today: boolean;
  last_checkin_date: string | null;
  today_date: string;
  streak_freezes_available: number;
  streak_freezes_used: number;
  freeze_applied_today: boolean;
  checkin_dates: string[];
  milestone_badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    threshold: number;
    category: string;
  }>;
}

export const calculateStreakStats = (dates: string[]): StreakData => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const uniqueDates = Array.from(new Set(dates.filter(Boolean))).sort();

  const hasToday = uniqueDates.includes(todayStr);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Compute current streak by walking backward from today
  const checkDate = new Date(today);
  if (!hasToday) {
    // Check if logged yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split("T")[0];
    if (uniqueDates.includes(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Compute longest streak in history
  let prevDate: Date | null = null;
  for (const dStr of uniqueDates) {
    const d = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = d;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  const totalLogged = uniqueDates.length;

  const milestone_badges = [
    { id: "badge-1", name: "First Step", description: "Logged your first day of learning", icon: "Seedling", unlocked: totalLogged >= 1, threshold: 1, category: "checkin" },
    { id: "badge-7", name: "Week Warrior", description: "Achieved a continuous 7-day streak", icon: "Flame", unlocked: longestStreak >= 7, threshold: 7, category: "streak" },
    { id: "badge-14", name: "Fortnight Focus", description: "Maintained focus for 14 continuous days", icon: "Zap", unlocked: longestStreak >= 14, threshold: 14, category: "streak" },
    { id: "badge-30", name: "Monthly Master", description: "Achieved a full 30-day streak milestone", icon: "Trophy", unlocked: longestStreak >= 30, threshold: 30, category: "streak" },
    { id: "badge-50", name: "Half Century", description: "50 consecutive days of non-stop learning", icon: "Award", unlocked: longestStreak >= 50, threshold: 50, category: "streak" },
    { id: "badge-100", name: "Bootcamp Legend", description: "Hit the elite 100-day streak mark!", icon: "Crown", unlocked: longestStreak >= 100, threshold: 100, category: "streak" },
  ];

  return {
    current_streak: currentStreak,
    longest_streak: longestStreak,
    total_logged_days: totalLogged,
    has_checked_in_today: hasToday,
    last_checkin_date: uniqueDates[uniqueDates.length - 1] || null,
    today_date: todayStr,
    streak_freezes_available: 1,
    streak_freezes_used: 0,
    freeze_applied_today: false,
    checkin_dates: uniqueDates,
    milestone_badges,
  };
};

export const generateLocalHeatmap = (checkinDates: string[], daysCount: number = 180): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  const today = new Date();
  const dateSet = new Set(checkinDates);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = i === 0;
    const isCompleted = dateSet.has(dateStr);

    cells.push({
      date: dateStr,
      status: isCompleted ? "completed" : isToday ? "today_pending" : "missed",
      level: isCompleted ? 3 : 0,
      is_today: isToday,
      day_of_week: daysOfWeek[d.getDay()],
      month: months[d.getMonth()],
    });
  }

  return cells;
};
