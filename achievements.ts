/**
 * Habit & retention achievements — unlock flags live at `userStats/{uid}/achievements/{id}`.
 */
export const ACHIEVEMENTS: { id: string; title: string; description: string }[] = [
  {
    id: "first_step",
    title: "First step",
    description: "Complete your first practice session.",
  },
  {
    id: "goal_met",
    title: "Goal met",
    description: "Hit your daily goal once.",
  },
  {
    id: "three_day_rhythm",
    title: "Three-day rhythm",
    description: "Practice on three different days.",
  },
  {
    id: "week_of_showing_up",
    title: "Week of showing up",
    description: "Practice seven days in a row.",
  },
  {
    id: "streak_starter",
    title: "Streak starter",
    description: "Reach a 7-day streak.",
  },
  {
    id: "streak_keeper",
    title: "Streak keeper",
    description: "Reach a 30-day streak.",
  },
  {
    id: "perfect_week",
    title: "Perfect week",
    description: "Hit your daily goal every day Mon–Sun.",
  },
  {
    id: "bounce_back",
    title: "Bounce back",
    description: "Practice three days in a row after a week away.",
  },
  {
    id: "habit_stack",
    title: "Habit stack",
    description: "Four weeks in a row with at least five practice days each.",
  },
  {
    id: "milestone_minutes",
    title: "Milestone minutes",
    description: "Reach 50 hours of lifetime practice.",
  },
];

export type AchievementInputs = {
  totalSessions: number;
  goalMetEver: boolean;
  practiceDaysCount: number;
  streak: number;
  perfectWeek: boolean;
  bounceBack: boolean;
  habitStackConsecutiveWeeks: number;
  lifetimeMinutes: number;
};

/**
 * Merges unlock flags into `next.achievements` (never clears an existing true).
 */
export function mergeAchievementFlags(
  next: Record<string, unknown>,
  i: AchievementInputs
): void {
  const a: Record<string, boolean> = {
    ...((next.achievements as Record<string, boolean>) || {}),
  };
  const unlock = (id: string, cond: boolean) => {
    if (cond) a[id] = true;
  };

  unlock("first_step", i.totalSessions >= 1);
  unlock("goal_met", i.goalMetEver);
  unlock("three_day_rhythm", i.practiceDaysCount >= 3);
  unlock("week_of_showing_up", i.streak >= 7);
  unlock("streak_starter", i.streak >= 7);
  unlock("streak_keeper", i.streak >= 30);
  unlock("perfect_week", i.perfectWeek);
  unlock("bounce_back", i.bounceBack);
  unlock("habit_stack", i.habitStackConsecutiveWeeks >= 4);
  unlock("milestone_minutes", i.lifetimeMinutes >= 50 * 60);

  next.achievements = a;
}

function normalizeAchievementMap(raw: unknown): Record<string, boolean> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as Record<string, boolean>;
}

/** IDs that became true in `next` but were not true in `prev` (new unlocks this write). */
export function getNewlyUnlockedAchievementIds(
  prevRaw: unknown,
  nextRaw: unknown
): string[] {
  const prev = normalizeAchievementMap(prevRaw);
  const next = normalizeAchievementMap(nextRaw);
  return ACHIEVEMENTS.filter(
    (a) => next[a.id] === true && prev[a.id] !== true
  ).map((a) => a.id);
}

export function achievementById(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
