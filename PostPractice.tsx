import React, { useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getDatabase, ref, runTransaction } from "firebase/database";
import { getDatabase, ref, update, increment } from 'firebase/database';
import { app } from "./firebaseConfig";

const PostPractice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { seconds = 0 } = route.params ?? {};

  const minutesPracticed = Math.floor(seconds / 60);
  

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

    // Save minutes to database
  useEffect(() => {
    const savePractice = async () => {
        try {
            const db = getDatabase(app);
            const userStatsRef = ref(db, 'userStats/testUser1');
            await update(userStatsRef, {
            minutesPracticedToday: increment(minutesPracticed),
            });
        } catch (err) {
            console.error("Failed to save practice minutes:", err);
        }
        };

    savePractice();
  }, []);

  // // Save minutes + rewards to Firestore and Realtime DB (dashboard/shop + weekly chart)
  // useEffect(() => {
  //   const savePractice = async () => {
  //     const earnedDollars = Math.floor(minutesPracticed * 0.8);
  //     const earnedStars = Math.max(1, Math.floor(minutesPracticed / 10));

  //     try {
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  //       if (user) {
  //         const db = getFirestore();
  //         const userRef = doc(db, "users", user.uid);
  //         await updateDoc(userRef, {
  //           minutesPracticedToday: increment(minutesPracticed),
  //         });
  //       }

  //       const rtdb = getDatabase(app);
  //       const userStatsRef = ref(rtdb, "userStats/testUser1");
  //       const dayIndex = (new Date().getDay() + 6) % 7; // Mon=0 .. Sun=6
  //       const key = String(dayIndex);

  //       await runTransaction(userStatsRef, (current) => {
  //         const next = current != null ? { ...current } : {};
  //         next.minutesPracticedToday = (next.minutesPracticedToday ?? 0) + minutesPracticed;
  //         next.currentEarnings = (next.currentEarnings ?? 0) + earnedDollars;
  //         next.totalStars = (next.totalStars ?? 0) + earnedStars;

  //         const prevWeek = next.weeklyMinutes && typeof next.weeklyMinutes === "object"
  //           ? { ...next.weeklyMinutes }
  //           : { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
  //         next.weeklyMinutes = { ...prevWeek, [key]: (prevWeek[key] ?? 0) + minutesPracticed };

  //         return next;
  //       });
  //     } catch (err) {
  //       console.error("Failed to save practice:", err);
  //     }
  //   };

  //   savePractice();
  // }, [minutesPracticed]);

  const handleClaimRewards = () => {
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/avatar.png")}
        style={styles.avatar}
      />

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      <Text style={styles.minutesLabel}>minutes played</Text>

      <Text style={styles.message}>
        Wow! That was beautiful!{"\n"}Musey seems to have really{"\n"}enjoyed your music.
      </Text>

      <View style={styles.rewardsRow}>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>$ {Math.floor(minutesPracticed * 0.8)}</Text>
        </View>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>★ {Math.max(1, Math.floor(minutesPracticed / 10))}</Text>
        </View>
      </View>

      <Pressable style={styles.claimButton} onPress={handleClaimRewards}>
        <Text style={styles.claimText}>Claim Rewards</Text>
      </Pressable>
    </View>
  );
};

export default PostPractice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  avatar: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  timerBox: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  timerText: {
    color: "#EAFBB1",
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: 2,
  },
  minutesLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a3a33",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
  },
  rewardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  rewardBox: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  claimButton: {
    backgroundColor: "#6EF2B2",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginTop: 8,
  },
  claimText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a33",
  },
});