import { mergeAchievementFlags } from "./achievements";

/**
 * Local calendar YYYY-MM-DD for practice streaks / daily totals.
 */
export function toLocalYMD(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** YYYY-MM-DD of the Monday starting the local week (Mon–Sun). */
export function mondayYMDLocal(d: Date = new Date()): string {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = x.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  x.setDate(x.getDate() + offset);
  return toLocalYMD(x);
}

type StatsSlice = {
  minutesPracticedToday?: number;
  minutesPracticedTodayDate?: string | null;
  secondsPracticedToday?: number;
};

/** Minutes that count toward "today" when the stored date matches local today. */
export function effectiveMinutesPracticedToday(
  data: StatsSlice,
  now: Date = new Date()
): number {
  const todayStr = toLocalYMD(now);
  if (
    data.minutesPracticedTodayDate != null &&
    data.minutesPracticedTodayDate !== todayStr
  ) {
    return 0;
  }
  return data.minutesPracticedToday ?? 0;
}

export function effectiveSecondsPracticedToday(
  data: StatsSlice,
  now: Date = new Date()
): number {
  const todayStr = toLocalYMD(now);
  if (
    data.minutesPracticedTodayDate != null &&
    data.minutesPracticedTodayDate !== todayStr
  ) {
    return 0;
  }
  return data.secondsPracticedToday ?? 0;
}

export type ApplyPracticeOpts = {
  minutesPracticed: number;
  /** Session length in seconds (remainder after full minutes); persisted for today totals. */
  secondsPracticed?: number;
  earnedDollars: number;
  earnedStars: number;
  now?: Date;
};

/**
 * Merges a completed practice session into userStats (RTDB).
 * Resets minutes (and seconds) when the calendar day changes, then increments.
 * Returns whether this was the first positive-duration practice of that local day.
 */
export function applyPracticeSession(
  current: Record<string, unknown> | null,
  opts: ApplyPracticeOpts
): { next: Record<string, unknown>; firstPracticeOfCalendarDay: boolean } {
  const now = opts.now ?? new Date();
  const todayStr = toLocalYMD(now);
  const next: Record<string, unknown> =
    current != null ? { ...current } : {};

  const prevDate = next.minutesPracticedTodayDate as string | undefined | null;
  let baseMins = (next.minutesPracticedToday as number) ?? 0;
  let baseSecs = (next.secondsPracticedToday as number) ?? 0;
  if (prevDate !== todayStr) {
    baseMins = 0;
    baseSecs = 0;
  }
  const sessionSecs = opts.secondsPracticed ?? 0;
  const firstPracticeOfCalendarDay =
    (opts.minutesPracticed > 0 || sessionSecs > 0) &&
    baseMins === 0 &&
    baseSecs === 0;

  next.minutesPracticedToday = baseMins + opts.minutesPracticed;
  next.secondsPracticedToday = baseSecs + sessionSecs;
  next.minutesPracticedTodayDate = todayStr;

  next.currentEarnings =
    ((next.currentEarnings as number) ?? 0) + opts.earnedDollars;
  next.totalStars = ((next.totalStars as number) ?? 0) + opts.earnedStars;

  const dayIndex = (now.getDay() + 6) % 7;
  const key = String(dayIndex);
  const baseWeek: Record<string, number> = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  };
  const prevWeek: Record<string, number> =
    next.weeklyMinutes && typeof next.weeklyMinutes === "object"
      ? { ...baseWeek, ...(next.weeklyMinutes as Record<string, number>) }
      : { ...baseWeek };
  prevWeek[key] = (prevWeek[key] ?? 0) + opts.minutesPracticed;
  next.weeklyMinutes = prevWeek;

  const weekStart = mondayYMDLocal(now);
  if (next.practiceWeekStart !== weekStart) {
    next.weeklyPracticeTotal = 0;
    next.weeklySessionCount = 0;
  }
  next.practiceWeekStart = weekStart;
  const sessionLengthMinutes =
    opts.minutesPracticed + sessionSecs / 60;
  next.weeklyPracticeTotal =
    ((next.weeklyPracticeTotal as number) ?? 0) + sessionLengthMinutes;
  next.weeklySessionCount = ((next.weeklySessionCount as number) ?? 0) + 1;

  return { next, firstPracticeOfCalendarDay };
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** Whole calendar days from `a` to `b` (YYYY-MM-DD), non-negative when b >= a. */
export function calendarDaysBetweenYMD(a: string, b: string): number {
  const da = new Date(`${a}T12:00:00`);
  const db = new Date(`${b}T12:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** The seven local YYYY-MM-DD dates Mon → Sun for the week starting `weekMondayYMD`. */
export function mondayToSundayYMDs(weekMondayYMD: string): string[] {
  const base = new Date(`${weekMondayYMD}T12:00:00`);
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(toLocalYMD(d));
  }
  return out;
}

export type UserStatsForStreak = {
  minutesPracticedToday?: number;
  minutesPracticedTodayDate?: string | null;
  secondsPracticedToday?: number;
  dailyGoalMinutes?: number;
  weeklyMinutes?: Record<string, number>;
  streakCount?: number;
  lastStreakQualifyDate?: string | null;
};

export function practicedTodayForStreak(
  stats: UserStatsForStreak,
  now: Date = new Date()
): boolean {
  const mins = effectiveMinutesPracticedToday(stats, now);
  const secs = effectiveSecondsPracticedToday(stats, now);
  return mins >= 1 || secs >= 1;
}

export function practicedTodayMeetsGoal(
  stats: UserStatsForStreak,
  now: Date = new Date()
): boolean {
  const goalMin = stats.dailyGoalMinutes ?? 20;
  const mins = effectiveMinutesPracticedToday(stats, now);
  const secs = effectiveSecondsPracticedToday(stats, now);
  return mins * 60 + secs >= goalMin * 60;
}

export type ReconcileStreakResult = {
  displayStreak: number;
  persistStreak: number;
  persistLast: string | null;
};

export function reconcileStreak(
  stats: UserStatsForStreak,
  now: Date
): ReconcileStreakResult {
  const todayStr = toLocalYMD(now);
  const yesterdayStr = toLocalYMD(addDays(now, -1));
  const metToday = practicedTodayForStreak(stats, now);

  const last = stats.lastStreakQualifyDate ?? null;
  const stored = stats.streakCount ?? 0;

  let nextStreak = stored;
  let nextLast = last;

  if (metToday) {
    if (last === todayStr) {
      nextStreak = stored;
      nextLast = todayStr;
    } else if (last === yesterdayStr) {
      nextStreak = stored + 1;
      nextLast = todayStr;
    } else if (!last || last < yesterdayStr) {
      nextStreak = 1;
      nextLast = todayStr;
    } else if (last > todayStr) {
      nextStreak = 1;
      nextLast = todayStr;
    }
  } else {
    if (last && last < yesterdayStr) {
      nextStreak = 0;
      nextLast = null;
    } else {
      nextStreak = stored;
      nextLast = last;
    }
  }

  const displayStreak = Math.max(0, nextStreak);
  return {
    displayStreak,
    persistStreak: nextStreak,
    persistLast: nextLast,
  };
}

export type ApplyPostPracticeStatsOpts = {
  now: Date;
  firstPracticeOfCalendarDay: boolean;
  minutesPracticed: number;
  secondsPracticed: number;
};

/**
 * After `applyPracticeSession`, updates lifetime counters, streak, habit metadata,
 * and achievement flags in `next` (same RTDB transaction).
 */
export function applyPostPracticeStats(
  current: Record<string, unknown> | null,
  next: Record<string, unknown>,
  opts: ApplyPostPracticeStatsOpts
): void {
  const now = opts.now;
  const todayStr = toLocalYMD(now);
  const yesterdayStr = toLocalYMD(addDays(now, -1));
  const weekStart = mondayYMDLocal(now);
  const sessionSecs = opts.secondsPracticed ?? 0;
  const positive = opts.minutesPracticed > 0 || sessionSecs > 0;

  if (positive) {
    next.totalSessionsCompleted =
      ((next.totalSessionsCompleted as number) ?? 0) + 1;
    const sessionLen =
      opts.minutesPracticed + sessionSecs / 60;
    next.lifetimePracticeMinutes =
      ((next.lifetimePracticeMinutes as number) ?? 0) + sessionLen;
  }

  if (positive && opts.firstPracticeOfCalendarDay) {
    next.practiceDaysCount =
      ((current?.practiceDaysCount as number) ?? 0) + 1;
  }

  let hStart =
    (next.habitWeekStart as string | null | undefined) ??
    (current?.habitWeekStart as string | null | undefined) ??
    null;
  let habitDayKeys: Record<string, boolean> =
    next.habitWeekDayKeys &&
    typeof next.habitWeekDayKeys === "object" &&
    !Array.isArray(next.habitWeekDayKeys)
      ? { ...(next.habitWeekDayKeys as Record<string, boolean>) }
      : current?.habitWeekDayKeys &&
          typeof current.habitWeekDayKeys === "object" &&
          !Array.isArray(current.habitWeekDayKeys)
        ? { ...(current.habitWeekDayKeys as Record<string, boolean>) }
        : {};

  let habitStackStreak =
    (next.habitStackStreak as number) ??
    (current?.habitStackStreak as number) ??
    0;

  if (hStart !== weekStart) {
    if (hStart) {
      const prevCount = Object.keys(habitDayKeys).length;
      if (prevCount >= 5) {
        habitStackStreak += 1;
      } else {
        habitStackStreak = 0;
      }
    }
    habitDayKeys = {};
    hStart = weekStart;
  }

  if (positive && opts.firstPracticeOfCalendarDay) {
    habitDayKeys[todayStr] = true;
  }

  next.habitWeekStart = hStart;
  next.habitWeekDayKeys = habitDayKeys;
  next.habitStackStreak = habitStackStreak;

  const prevLastQualify =
    (current?.lastStreakQualifyDate ?? null) as string | null;
  const prevInComeback =
    (current?.inComebackAfterGap as boolean) ?? false;
  const prevComebackRun = (current?.comebackRun as number) ?? 0;

  if (positive && opts.firstPracticeOfCalendarDay) {
    const metToday = practicedTodayForStreak(next as UserStatsForStreak, now);
    if (!metToday) {
      next.comebackRun = prevComebackRun;
      next.inComebackAfterGap = prevInComeback;
    } else if (prevLastQualify === yesterdayStr) {
      if (prevInComeback) {
        next.comebackRun = Math.min(3, prevComebackRun + 1);
        next.inComebackAfterGap = true;
      } else {
        next.comebackRun = 0;
        next.inComebackAfterGap = false;
      }
    } else if (!prevLastQualify) {
      next.comebackRun = 0;
      next.inComebackAfterGap = false;
    } else {
      const gap = calendarDaysBetweenYMD(prevLastQualify, todayStr);
      if (gap >= 8) {
        next.comebackRun = 1;
        next.inComebackAfterGap = true;
      } else {
        next.comebackRun = 0;
        next.inComebackAfterGap = false;
      }
    }
  } else {
    next.comebackRun = prevComebackRun;
    next.inComebackAfterGap = prevInComeback;
  }

  const rec = reconcileStreak(next as UserStatsForStreak, now);
  next.streakCount = rec.persistStreak;
  next.lastStreakQualifyDate = rec.persistLast;

  let goalMetDates: Record<string, boolean> =
    next.goalMetDates &&
    typeof next.goalMetDates === "object" &&
    !Array.isArray(next.goalMetDates)
      ? { ...(next.goalMetDates as Record<string, boolean>) }
      : current?.goalMetDates &&
          typeof current.goalMetDates === "object" &&
          !Array.isArray(current.goalMetDates)
        ? { ...(current.goalMetDates as Record<string, boolean>) }
        : {};

  const metGoalNow = practicedTodayMeetsGoal(next as UserStatsForStreak, now);
  if (metGoalNow) {
    goalMetDates[todayStr] = true;
  }
  next.goalMetEver =
    ((current?.goalMetEver as boolean) ?? false) || metGoalNow;
  next.goalMetDates = goalMetDates;

  const weekYmDs = mondayToSundayYMDs(weekStart);
  const perfectWeek = weekYmDs.every((d) => goalMetDates[d] === true);

  const bounceBack =
    ((next.comebackRun as number) ?? 0) >= 3;

  mergeAchievementFlags(next, {
    totalSessions: (next.totalSessionsCompleted as number) ?? 0,
    goalMetEver: next.goalMetEver === true,
    practiceDaysCount:
      (next.practiceDaysCount as number) ??
      (current?.practiceDaysCount as number) ??
      0,
    streak: rec.persistStreak,
    perfectWeek,
    bounceBack,
    habitStackConsecutiveWeeks: habitStackStreak,
    lifetimeMinutes: (next.lifetimePracticeMinutes as number) ?? 0,
  });
}
