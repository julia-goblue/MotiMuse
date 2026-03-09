import React, { useState, useEffect } from "react";
import {
  Pressable,
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "./firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import ProgressRing from "./ProgressRing";

export default function Dashboard() {
  const navigation = useNavigation<any>();

  const [earnings, setEarnings] = useState(0);
  const [stars, setStars] = useState(0);
  const [minutesPracticedToday, setMinutes] = useState(0);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);
  const [weekData, setWeekData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const progress =
    dailyGoalMinutes > 0
      ? Math.min(100, Math.round((minutesPracticedToday / dailyGoalMinutes) * 100))
      : 0;



  useEffect(() => {

    //    (e.g., if you're using Firebase Auth, you'd use `auth.currentUser.uid`)
    const db = getDatabase(app);
    const userStatsRef = ref(db, 'userStats/testUser1');

    // 3. Attach a listener using onValue.
    //    This function will be called immediately with the initial data,
    //    and again every time the data at 'userStats/testUser1' changes.
    const unsubscribe = onValue(userStatsRef, (snapshot) => {
      if (snapshot.exists()) { // Check if data exists at the path
        const data = snapshot.val();
        console.log("Fetched data:", data); // Log the data to see what you received

        // 4. Update your component's state with the fetched data.
        //    Ensure the keys ('currentEarnings', 'totalStars') match your database structure.
        setEarnings(data.currentEarnings || 0);
        setStars(data.totalStars || 0);
        setMinutes(data.minutesPracticedToday || 0);
        setDailyGoalMinutes(data.dailyGoalMinutes || 20);
        const raw = data.weeklyMinutes;
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
          setWeekData([
            raw["0"] ?? 0, raw["1"] ?? 0, raw["2"] ?? 0, raw["3"] ?? 0,
            raw["4"] ?? 0, raw["5"] ?? 0, raw["6"] ?? 0,
          ]);
        } else if (Array.isArray(raw) && raw.length >= 7) {
          setWeekData(raw.slice(0, 7));
        } else {
          setWeekData([0, 0, 0, 0, 0, 0, 0]);
        }
        setLoading(false);
      } else {
        setEarnings(0);
        setStars(0);
        setMinutes(0);
        setDailyGoalMinutes(20);
        setWeekData([0, 0, 0, 0, 0, 0, 0]);
        setLoading(false);
      }
    }, (databaseError) => {
      // 5. Handle any errors during the data fetch
      console.error("Error fetching user stats:", databaseError);
      setLoading(false);
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

  const totalWeekMinutes = weekData.reduce((a, b) => a + b, 0);
  const daysWithPractice = weekData.filter((m) => m > 0).length;
  const avgSessionMinutes =
    daysWithPractice > 0 ? Math.round(totalWeekMinutes / daysWithPractice) : 0;
  const maxBar = Math.max(...weekData, 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('./assets/avatar.png')}
          style={{ width: 50, height: 50 }}
        />
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statText}>$ {earnings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>★ {stars}</Text>
          </View>
        </View>
      </View>

      {/* Today Title */}
      <Text style={styles.title}>Today</Text>

      {/* Progress Ring */}
      <View style={styles.ringContainer}>
        <ProgressRing progress={progress} minutes={minutesPracticedToday} />
      </View>

      {/* Weekly Bar Chart with Labels */}
      <View style={styles.chartContainer}>
        {/* Crown over best day */}
        <View style={styles.crownRow}>
          {weekData.map((m, i) => (
            <View key={i} style={styles.crownCell}>
              {m === Math.max(...weekData) && (
                // put crown icon here later
                <Text style={styles.crownIcon}></Text>
              )}
            </View>
          ))}
        </View>

        {/* Day labels */}
        <View style={[styles.labelRow, { marginBottom: 10 }]}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <Text key={i} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>

        {/* Bars */}
        <View style={styles.barContainer}>
          {weekData.map((m, i) => (
            <View key={i} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: maxBar > 0 ? Math.max((m / maxBar) * 120, 8) : 8 },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.avgText}>
        Average practice session this week:{" "}
        <Text style={styles.avgBold}>{avgSessionMinutes} minutes</Text>
      </Text>

      {/* Practice Button – switches to Timer tab */}
      <Pressable
        onPress={() => navigation.navigate("Timer")}
        style={styles.practiceButton}
      >
        <Text style={styles.practiceText}>Let's Practice!</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 36,
  },
  header: {
    marginHorizontal: 10,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a6b5a",
    textAlign: "center",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  statText: {
    fontWeight: "600",
    color: "#333",
  },
  ringContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  chartContainer: {
    marginTop: 4,
  },
  crownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  crownCell: {
    width: 32,
    alignItems: "center",
  },
  crownIcon: {
    fontSize: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayLabel: {
    width: 32,
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
  dateLabel: {
    width: 32,
    textAlign: "center",
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
    marginBottom: 6,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barWrapper: {
    width: 32,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 120,
  },
  bar: {
    width: 32,
    backgroundColor: "#6EF2B2",
    borderRadius: 6,
  },
  avgText: {
    textAlign: "center",
    marginTop: 12,
    color: "#666",
    fontSize: 13,
  },
  avgBold: {
    fontWeight: "700",
    color: "#333",
  },
  practiceButton: {
    backgroundColor: "#20826c",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 10,
  },
  practiceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});