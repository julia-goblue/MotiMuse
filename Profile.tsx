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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { app } from "./firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";

const auth = getAuth(app);
const db = getDatabase(app);

export default function Profile() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [goalMinutes, setGoalMinutes] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameLoading, setNameLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

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
        } else {
          setGoalMinutes("20");
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={styles.body}>
          <Text style={styles.title}>Profile</Text>

          <Pressable
            style={styles.tempStreakBtn}
            onPress={() => navigation.navigate("Streak")}
          >
            <Text style={styles.tempStreakBtnText}>Temporary: open Streak screen</Text>
          </Pressable>

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

          <Text style={styles.footer}>
            Your daily goal is used for the practice ring on the dashboard.
          </Text>

          <Pressable
            style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
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
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  body: {
    flex: 1,
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
  footer: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 20,
  },
  logoutBtn: {
    marginTop: 28,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C45C5C",
    alignItems: "center",
    backgroundColor: "#FFF8F8",
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