import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Check, Flame } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";
import {
  addDays,
  effectiveMinutesPracticedToday,
  effectiveSecondsPracticedToday,
  reconcileStreak,
  toLocalYMD,
  UserStatsForStreak,
} from "./practiceSession";

const DARK_TEAL = "#40796E";
const MINT = "#9FF2B8";
const DIVIDER = "#E8E8E8";

const WEEK_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const auth = getAuth(app);
const db = getDatabase(app);

function startOfWeekSunday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = x.getDay();
  x.setDate(x.getDate() - dow);
  return x;
}

/** Mon=0 .. Sun=6 — matches PostPractice / Dashboard */
function mondayIndexFromDate(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Any logged practice counts (≥1 min or ≥1 sec today; ≥1 min on past days in weekly buckets). */
function practicedOnCalendarDay(
  cellDate: Date,
  today: Date,
  stats: UserStatsForStreak
): boolean {
  const cellY = toLocalYMD(cellDate);
  const todayY = toLocalYMD(today);
  const wm = stats.weeklyMinutes ?? {};
  const key = String(mondayIndexFromDate(cellDate));

  if (cellY > todayY) return false;
  if (cellY === todayY) {
    const mins = effectiveMinutesPracticedToday(stats, today);
    const secs = effectiveSecondsPracticedToday(stats, today);
    return mins >= 1 || secs >= 1;
  }
  return (wm[key] ?? 0) >= 1;
}

export default function Streak() {
  const navigation = useNavigation<any>();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStatsForStreak | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      if (!u) setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) {
      setStats(null);
      return;
    }
    const r = ref(db, `userStats/${uid}`);
    const off = onValue(
      r,
      (snap) => {
        setStats(snap.exists() ? (snap.val() as UserStatsForStreak) : {});
        setLoading(false);
        setNow(new Date());
      },
      () => setLoading(false)
    );
    return () => off();
  }, [uid]);

  const reconcile = useMemo(() => {
    if (!stats) return null;
    return reconcileStreak(stats, now);
  }, [stats, now]);

  useEffect(() => {
    if (!uid || !stats || !reconcile) return;
    const curS = stats.streakCount ?? 0;
    const curL = stats.lastStreakQualifyDate ?? null;
    const nextL = reconcile.persistLast ?? null;
    const needWrite =
      reconcile.persistStreak !== curS || nextL !== curL;
    if (!needWrite) return;
    update(ref(db, `userStats/${uid}`), {
      streakCount: reconcile.persistStreak,
      lastStreakQualifyDate: reconcile.persistLast,
    }).catch((e) => console.error("Streak persist failed:", e));
  }, [uid, stats, reconcile]);

  const weekCells = useMemo(() => {
    if (!stats) {
      return WEEK_LABELS.map((label) => ({
        label,
        state: "future" as const,
        done: false,
      }));
    }
    const sun = startOfWeekSunday(now);
    return WEEK_LABELS.map((label, i) => {
      const cellDate = addDays(sun, i);
      const cellY = toLocalYMD(cellDate);
      const todayY = toLocalYMD(now);
      let state: "past" | "today" | "future";
      if (cellY > todayY) state = "future";
      else if (cellY === todayY) state = "today";
      else state = "past";
      const done = practicedOnCalendarDay(cellDate, now, stats);
      return { label, state, done };
    });
  }, [stats, now]);

  const streakDays = reconcile?.displayStreak ?? 0;

  const dayPhrase =
    streakDays === 1 ? "1 day" : `${streakDays} days`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.main}>
          {loading ? (
            <ActivityIndicator size="large" color={DARK_TEAL} style={styles.loader} />
          ) : (
            <>
              <View style={styles.heroRow}>
                <Text style={styles.heroNumber}>{streakDays}</Text>
                <Flame size={72} color={MINT} style={styles.flame} fill={MINT} />
              </View>

              <View style={styles.weekRow}>
                {weekCells.map((cell) => (
                  <View key={cell.label} style={styles.dayCell}>
                    <Text style={styles.dayLabel}>{cell.label}</Text>
                    <View
                      style={[
                        styles.checkCircle,
                        cell.state === "future" && styles.checkCircleFuture,
                        !cell.done && cell.state !== "future" && styles.checkCircleEmpty,
                      ]}
                    >
                      {cell.done ? (
                        <Check size={16} color={DARK_TEAL} />
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>

              {streakDays === 0 ? (
                <Text style={styles.headline}>
                  Meet your daily goal to start a streak.
                </Text>
              ) : (
                <Text style={styles.headline}>
                  You're on a{" "}
                  <Text style={styles.headlineBold}>{dayPhrase}</Text> streak!
                </Text>
              )}
              <Text style={styles.subtext}>
                Practice every day to build your streak.
              </Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <Pressable
            style={styles.continueButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  loader: {
    marginVertical: 48,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  heroNumber: {
    fontSize: 88,
    fontWeight: "700",
    color: DARK_TEAL,
    lineHeight: 96,
  },
  flame: {
    marginLeft: 4,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingHorizontal: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: DARK_TEAL,
    marginBottom: 8,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: DARK_TEAL,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleFuture: {
    borderColor: "#C8D5D2",
    backgroundColor: "#F5F8F7",
  },
  checkCircleEmpty: {
    backgroundColor: "transparent",
  },
  headline: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    color: DARK_TEAL,
    lineHeight: 26,
  },
  headlineBold: {
    fontWeight: "700",
  },
  subtext: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "400",
    color: DARK_TEAL,
    opacity: 0.85,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: DARK_TEAL,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
