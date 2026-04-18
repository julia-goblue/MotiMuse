import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getDatabase, ref, runTransaction } from "firebase/database";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { app } from "./firebaseConfig";
import { getChosenAvatar } from "./Store";
import { applyPracticeSession, applyPostPracticeStats } from "./practiceSession";
import {
  achievementById,
  getNewlyUnlockedAchievementIds,
} from "./achievements";
import AchievementUnlockedModal, {
  UnlockedAchievementItem,
} from "./AchievementUnlockedModal";

const PostPractice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { seconds = 0 } = route.params ?? {};

  const minutesPracticed = Math.floor(seconds / 60);

  const [equippedHat, setEquippedHat] = useState<string | null>(null);
  const [practiceSaveState, setPracticeSaveState] = useState<
    "idle" | "saving" | "done" | "error"
  >("idle");
  const [firstPracticeOfDay, setFirstPracticeOfDay] = useState(false);
  const [newAchievements, setNewAchievements] = useState<
    UnlockedAchievementItem[] | null
  >(null);
  
     useEffect(() => {
    
        //    (e.g., if you're using Firebase Auth, you'd use `auth.currentUser.uid`)
        // const db = getDatabase(app);
        // const userStatsRef = ref(db, 'userStats/testUser1');
        const auth = getAuth(app);
        const user = auth.currentUser;
        const db = getDatabase(app);
        const userStatsRef = ref(db, `userStats/${user?.uid}`);
    
        // 3. Attach a listener using onValue.
        //    This function will be called immediately with the initial data,
        //    and again every time the data at 'userStats/testUser1' changes.
        const unsubscribe = onValue(userStatsRef, (snapshot) => {
          if (snapshot.exists()) { // Check if data exists at the path
            const data = snapshot.val();
            console.log("Fetched data:", data); // Log the data to see what you received
    
            setEquippedHat(data.equippedHat ?? null);
    
          } 
        }, (databaseError) => {
          // 5. Handle any errors during the data fetch
          console.error("Error fetching user stats:", databaseError);
        });
    
        // 6. Return a cleanup function.
        //    This is crucial for real-time listeners to prevent memory leaks.
        //    When the component unmounts (is removed from the screen),
        //    this function will be called to detach the listener.
        return () => {
          console.log("Detaching Firebase listener.");
          unsubscribe();
        };
      }, []);
    
  const avatar = getChosenAvatar(equippedHat);
  
  

  // const formatTime = () => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  // };

  const formatTime = () => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

  //   // Save minutes to database
  // useEffect(() => {
  //   const savePractice = async () => {
  //       try {
  //           // const db = getDatabase(app);
  //           // const userStatsRef = ref(db, 'userStats/testUser1');

  //           const auth = getAuth(app);
  //           const user = auth.currentUser;
  //           const db = getDatabase(app);
  //           const userStatsRef = ref(db, `userStats/${user?.uid}`);
  //           await update(userStatsRef, {
  //           minutesPracticedToday: increment(minutesPracticed),
  //           secondsPracticedToday: increment(seconds),
  //           [`weeklyMinutes/${String((new Date().getDay() + 6) % 7)}`]: increment(minutesPracticed),
  //           });
  //       } catch (err) {
  //           console.error("Failed to save practice minutes:", err);
  //       }
  //       };

  //   savePractice();
  // }, []);

  const savePractice = useCallback(async () => {
    setPracticeSaveState("saving");
    const earnedDollars = Math.floor(minutesPracticed * 10);
    const earnedStars = Math.max(1, Math.floor(minutesPracticed / 10));

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      const rtdb = getDatabase(app);
      const userStatsRef = ref(rtdb, `userStats/${user?.uid}`);

      let firstToday = false;
      let unlockedIds: string[] = [];
      await runTransaction(userStatsRef, (current) => {
        const now = new Date();
        const prevAchievements = (
          current as Record<string, unknown> | null
        )?.achievements;
        const { next, firstPracticeOfCalendarDay } = applyPracticeSession(
          current as Record<string, unknown> | null,
          {
            minutesPracticed,
            secondsPracticed: seconds,
            earnedDollars,
            earnedStars,
            now,
          }
        );
        applyPostPracticeStats(current as Record<string, unknown> | null, next, {
          now,
          firstPracticeOfCalendarDay,
          minutesPracticed,
          secondsPracticed: seconds,
        });
        unlockedIds = getNewlyUnlockedAchievementIds(
          prevAchievements,
          next.achievements
        );
        firstToday = firstPracticeOfCalendarDay;
        return next;
      });
      setFirstPracticeOfDay(firstToday);
      if (unlockedIds.length > 0) {
        setNewAchievements(
          unlockedIds.map((id) => ({
            id,
            title: achievementById(id)?.title ?? id,
          }))
        );
      }
      setPracticeSaveState("done");
    } catch (err) {
      console.error("Failed to save practice:", err);
      setPracticeSaveState("error");
    }
  }, [minutesPracticed, seconds]);

  useEffect(() => {
    savePractice();
  }, [savePractice]);

  const handlePrimaryPress = () => {
    if (practiceSaveState === "error") {
      savePractice();
      return;
    }
    if (practiceSaveState !== "done") return;
    if (firstPracticeOfDay) {
      navigation.navigate("Streak");
    } else {
      navigation.navigate("MainTabs");
    }
  };

  return (
    <View style={styles.container}>
      <AchievementUnlockedModal
        visible={newAchievements !== null && newAchievements.length > 0}
        items={newAchievements ?? []}
        onDismiss={() => setNewAchievements(null)}
      />
      <Image
        source={avatar}
        style={styles.avatar}
      />

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      {/* <Text style={styles.minutesLabel}>minutes played</Text> */}
      <Text style={styles.minutesLabel}>
        {Math.floor(seconds / 60) === 0 ? "seconds played" : "minutes played"}
      </Text>

      <Text style={styles.message}>
        Wow! That was beautiful!{"\n"}Musey seems to have really{"\n"}enjoyed your music.
      </Text>

      <View style={styles.rewardsRow}>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>$ {Math.floor(minutesPracticed * 10)}</Text>
        </View>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>★ {Math.max(1, Math.floor(minutesPracticed / 10))}</Text>
        </View>
      </View>

      <Pressable
        style={[
          styles.claimButton,
          practiceSaveState === "saving" && styles.claimButtonDisabled,
        ]}
        onPress={handlePrimaryPress}
        disabled={practiceSaveState === "saving"}
      >
        <Text style={styles.claimText}>
          {practiceSaveState === "saving"
            ? "Saving…"
            : practiceSaveState === "error"
            ? "Try again"
            : "Claim Rewards"}
        </Text>
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
  claimButtonDisabled: {
    opacity: 0.55,
  },
  claimText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a33",
  },
});