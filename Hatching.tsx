import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getDatabase, ref, runTransaction } from "firebase/database";
import { getDatabase, ref, update, increment, onValue, runTransaction } from 'firebase/database';
import { app } from "./firebaseConfig";
import {getChosenAvatar} from "./Store"

export function getMuseyColor(museyColor: string | null) {
  const avatars: Record<string, any> = {
    P: require("./assets/p_avatar.png"),
    B: require("./assets/b_avatar.png"),
    G: require("./assets/g_avatar.png"),
  };

  if (!museyColor) {
    return require("./assets/g_egg.png");
  }

  return avatars[museyColor];
}

const Hatching = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { seconds = 0 } = route.params ?? {};
  const minutesPracticed = 5;
  const [museyColor, setMuseyColor] = useState<string | null>(null);
  
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
    
            setMuseyColor(data.museyColor ?? null);
    
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
    
  const avatar = getMuseyColor(museyColor);


  // Save minutes + rewards to Firestore and Realtime DB (dashboard/shop + weekly chart)
  useEffect(() => {
    const savePractice = async () => {
      // used to be * 0.8 but for testing * 3
      const earnedDollars = 50;
      const earnedStars = 1;

      try {
        const auth = getAuth(app);
        const user = auth.currentUser;

        const rtdb = getDatabase(app);
        const userStatsRef = ref(rtdb, `userStats/${user?.uid}`);
        const dayIndex = (new Date().getDay() + 6) % 7; // Mon=0 .. Sun=6
        const key = String(dayIndex);

        await runTransaction(userStatsRef, (current) => {
          const next = current != null ? { ...current } : {};
          next.minutesPracticedToday = (next.minutesPracticedToday ?? 0) + minutesPracticed;
          next.currentEarnings = (next.currentEarnings ?? 0) + earnedDollars;
          next.totalStars = (next.totalStars ?? 0) + earnedStars;

          const prevWeek = next.weeklyMinutes && typeof next.weeklyMinutes === "object"
            ? { ...next.weeklyMinutes }
            : { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
          next.weeklyMinutes = { ...prevWeek, [key]: (prevWeek[key] ?? 0) + minutesPracticed };

          return next;
        });
      } catch (err) {
        console.error("Failed to save practice:", err);
      }
    };

    savePractice();
  }, [minutesPracticed]);

  const handleClaimRewards = () => {
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.container}>
      <Image
        source={avatar}
        style={styles.avatar}
      />

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      {/* <Text style={styles.minutesLabel}>minutes played</Text> */}
      <Text style={styles.minutesLabel}>
        {Math.floor(300 / 60) === 0 ? "seconds played" : "minutes played"}
      </Text>

      <Text style={styles.message}>
        You hatched Musey!{"\n"}Musey really enjoyed your music.{"\n"}Play more music for Musey soon.
      </Text>

      <View style={styles.rewardsRow}>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>$ {Math.floor(minutesPracticed * 10)}</Text>
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

export default Hatching;

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