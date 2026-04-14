import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "./firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { floatingTabBarTopFromBottom } from "./tabBarMetrics";

const auth = getAuth(app);
const db = getDatabase(app);

/** Habit & retention achievements — unlock flags live at `userStats/{uid}/achievements/{id}` */
const ACHIEVEMENTS: { id: string; title: string; description: string }[] = [
  { id: "first_step", title: "First step", description: "Complete your first practice session." },
  { id: "goal_met", title: "Goal met", description: "Hit your daily goal once." },
  { id: "three_day_rhythm", title: "Three-day rhythm", description: "Practice on three different days." },
  { id: "week_of_showing_up", title: "Week of showing up", description: "Practice seven days in a row." },
  { id: "streak_starter", title: "Streak starter", description: "Reach a 7-day streak." },
  { id: "streak_keeper", title: "Streak keeper", description: "Reach a 30-day streak." },
  { id: "perfect_week", title: "Perfect week", description: "Hit your daily goal every day Mon–Sun." },
  { id: "bounce_back", title: "Bounce back", description: "Practice three days in a row after a week away." },
  { id: "habit_stack", title: "Habit stack", description: "Four weeks in a row with at least five practice days each." },
  { id: "milestone_minutes", title: "Milestone minutes", description: "Reach 50 hours of lifetime practice." },
];

/** Space between the bottom of the Log out button and the top of the tab bar. */
const GAP_ABOVE_TAB = 10;
/** Approximate Log out row height (padding + text + border). */
const LOGOUT_ROW_HEIGHT = 54;
/** Extra scroll space inside achievements so the last card clears the logout row. */
const SCROLL_PAD_BELOW_ACHIEVEMENTS = 58;

export default function Profile() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  /** Screen-bottom inset to the bottom edge of the Log out button (above floating tab). */
  const logoutBottomOffset =
    insets.bottom + floatingTabBarTopFromBottom() + GAP_ABOVE_TAB;
  const [name, setName] = useState("");
  const [goalMinutes, setGoalMinutes] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameLoading, setNameLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [achievementUnlocks, setAchievementUnlocks] = useState<
    Record<string, boolean>
  >({});

  // Wait for Firebase Auth to resolve
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        setNameLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to RTDB only once uid is available
  useEffect(() => {
    if (!uid) return;

    const userStatsRef = ref(db, `userStats/${uid}`);
    const unsubscribe = onValue(
      userStatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name ?? "");
          setGoalMinutes(String(data.dailyGoalMinutes ?? 20));
          const raw = data.achievements;
          setAchievementUnlocks(
            raw && typeof raw === "object" && !Array.isArray(raw)
              ? (raw as Record<string, boolean>)
              : {}
          );
        } else {
          setGoalMinutes("20");
          setAchievementUnlocks({});
        }
        setNameLoading(false);
      },
      (e) => {
        console.error("Failed to load stats:", e);
        setNameLoading(false);
      }
    );
    return () => unsubscribe();
  }, [uid]);

  const handleSaveName = async () => {
    const trimmed = name.trim();
    setEditingName(false);
    if (!trimmed || !uid) return;
    setSaving(true);
    try {
      await update(ref(db, `userStats/${uid}`), { name: trimmed });
    } catch (e) {
      console.error("Failed to save name:", e);
    }
    setSaving(false);
  };

  const handleSaveGoal = async () => {
    const num = parseInt(goalMinutes, 10);
    const value = isNaN(num) ? 20 : Math.min(999, Math.max(1, num));
    setGoalMinutes(String(value));
    setEditingGoal(false);
    if (!uid) return;
    setSaving(true);
    try {
      await update(ref(db, `userStats/${uid}`), { dailyGoalMinutes: value });
    } catch (e) {
      console.error("Failed to save goal:", e);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (e) {
      console.error("Logout failed:", e);
    }
    setLoggingOut(false);
  };

  if (nameLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1a6b5a" />
      </View>
    );
  }

  const unlockedCount = ACHIEVEMENTS.filter(
    (a) => achievementUnlocks[a.id]
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={styles.layer}>
          <View
            style={[
              styles.mainColumn,
              {
                paddingBottom: logoutBottomOffset + LOGOUT_ROW_HEIGHT,
              },
            ]}
          >
          <View style={styles.profileTop}>
          <Text style={styles.title}>Profile</Text>

          {/* <Pressable
            style={styles.tempStreakBtn}
            onPress={() => navigation.navigate("Streak")}
          >
            <Text style={styles.tempStreakBtnText}>Temporary: open Streak screen</Text>
          </Pressable> */}

          <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          {editingName ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#7AAEA3"
                autoFocus
                onSubmitEditing={handleSaveName}
              />
              <Pressable style={styles.saveBtn} onPress={handleSaveName} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? "…" : "Save"}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.valueRow} onPress={() => setEditingName(true)}>
              <Text style={styles.value}>{name.trim() || "Tap to add name"}</Text>
              <Text style={styles.editHint}>Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Daily goal (minutes)</Text>
          {editingGoal ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={goalMinutes}
                onChangeText={setGoalMinutes}
                placeholder="e.g. 20"
                placeholderTextColor="#7AAEA3"
                keyboardType="number-pad"
                autoFocus
                onSubmitEditing={handleSaveGoal}
              />
              <Pressable style={styles.saveBtn} onPress={handleSaveGoal} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? "…" : "Save"}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.valueRow} onPress={() => setEditingGoal(true)}>
              <Text style={styles.value}>{goalMinutes} min</Text>
              <Text style={styles.editHint}>Edit</Text>
            </Pressable>
          )}
        </View>
          </View>

          <View style={styles.achievementsBox}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Achievements</Text>
              <Text style={styles.achievementsCount}>
                {unlockedCount} / {ACHIEVEMENTS.length}
              </Text>
            </View>
            <Text style={styles.achievementsSub}>
              Build habits and check back as you progress.
            </Text>
            <ScrollView
              style={styles.achievementsScroll}
              contentContainerStyle={[
                styles.achievementsScrollContent,
                { paddingBottom: SCROLL_PAD_BELOW_ACHIEVEMENTS },
              ]}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              {ACHIEVEMENTS.map((a) => {
                const unlocked = achievementUnlocks[a.id] === true;
                return (
                  <View
                    key={a.id}
                    style={[
                      styles.achievementCard,
                      !unlocked && styles.achievementCardLocked,
                    ]}
                  >
                    <View style={styles.achievementTextCol}>
                      <Text
                        style={[
                          styles.achievementName,
                          !unlocked && styles.achievementNameLocked,
                        ]}
                      >
                        {a.title}
                      </Text>
                      <Text style={styles.achievementDesc}>{a.description}</Text>
                    </View>
                    <Text
                      style={[
                        styles.achievementBadge,
                        unlocked && styles.achievementBadgeUnlocked,
                      ]}
                    >
                      {unlocked ? "Done" : "Locked"}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          </View>

          <Pressable
            style={[
              styles.logoutBtn,
              styles.logoutBtnFloating,
              { bottom: logoutBottomOffset },
              loggingOut && styles.logoutBtnDisabled,
            ]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <Text style={styles.logoutBtnText}>
              {loggingOut ? "Logging out…" : "Log out"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  kav: {
    flex: 1,
    minHeight: 0,
  },
  layer: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },
  mainColumn: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  profileTop: {
    flexShrink: 0,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a6b5a",
    marginBottom: 32,
    textAlign: "center",
  },
  tempStreakBtn: {
    backgroundColor: "#E8F4F1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#40796E",
    borderStyle: "dashed",
    marginBottom: 24,
  },
  tempStreakBtnText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#40796E",
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7FBF9",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EAFBB1",
  },
  value: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a6b5a",
  },
  editHint: {
    fontSize: 14,
    color: "#7AAEA3",
    fontWeight: "600",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#F7FBF9",
    borderWidth: 2,
    borderColor: "#2E8B7E",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a6b5a",
  },
  saveBtn: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  achievementsBox: {
    flex: 1,
    minHeight: 0,
    marginTop: 4,
    marginBottom: 4,
    padding: 12,
    paddingBottom: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#EAFBB1",
    backgroundColor: "#F7FBF9",
  },
  achievementsScroll: {
    flex: 1,
    minHeight: 0,
  },
  achievementsScrollContent: {
    paddingBottom: 4,
  },
  achievementsHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a6b5a",
  },
  achievementsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7AAEA3",
  },
  achievementsSub: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F7FBF9",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EAFBB1",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  achievementCardLocked: {
    opacity: 0.72,
    borderColor: "#E5EED8",
  },
  achievementTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a6b5a",
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: "#3d6b62",
  },
  achievementDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  achievementBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7AAEA3",
    marginTop: 2,
  },
  achievementBadgeUnlocked: {
    color: "#1a6b5a",
  },
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C45C5C",
    alignItems: "center",
    backgroundColor: "#FFF8F8",
  },
  logoutBtnFloating: {
    position: "absolute",
    left: 24,
    right: 24,
  },
  logoutBtnDisabled: {
    opacity: 0.6,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B84444",
  },
});