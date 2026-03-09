import React, { useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDatabase, ref, update, increment } from 'firebase/database';
import { app } from './firebaseConfig';

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

    // Save coins to database
  useEffect(() => {
    const saveCoins = async () => {
        try {
            const db = getDatabase(app);
            const userStatsRef = ref(db, 'userStats/testUser1');
            await update(userStatsRef, {
            currentEarnings: increment(Math.floor(minutesPracticed * 2)),
            });
        } catch (err) {
            console.error("Failed to save coins:", err);
        }
        };

    saveCoins();
  }, []);


      // Save stars to database
  useEffect(() => {
    const saveStars = async () => {
        try {
            const db = getDatabase(app);
            const userStatsRef = ref(db, 'userStats/testUser1');
            await update(userStatsRef, {
            totalStars: increment(Math.max(1, Math.floor(minutesPracticed / 1))),
            });
        } catch (err) {
            console.error("Failed to save stars:", err);
        }
        };

    saveStars();
  }, []);

  const handleClaimRewards = () => {
    navigation.navigate("Dashboard");
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
          <Text style={styles.rewardText}>$ {Math.floor(minutesPracticed * 2)}</Text>
        </View>
        <View style={styles.rewardBox}>
          <Text style={styles.rewardText}>★ {Math.max(1, Math.floor(minutesPracticed / 1))}</Text>
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