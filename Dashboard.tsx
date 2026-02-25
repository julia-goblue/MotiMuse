import React, { useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, onValue } from 'firebase/database';
import { db, app } from './firebaseConfig';
import { useNavigation } from "@react-navigation/native";
import ProgressRing from "./ProgressRing";
import BottomNav from "./BottomNav";

export default function Dashboard() {
  const navigation = useNavigation<any>();

  const practiceMinutes = 47;
  const goalMinutes = 60;
  const progress = Math.round((practiceMinutes / goalMinutes) * 100);

  const [earnings, setEarnings] = useState(0); 
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setEarnings(data.currentEarnings || 0); // Use || 0 as a fallback if the key doesn't exist
        setStars(data.totalStars || 0);
        setLoading(false); // Data has been loaded
      } else {
        console.log("No data available at 'userStats/testUser1'");
        setEarnings(0);
        setStars(0);
        setLoading(false); // Loading complete, but no data
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
  }, []); // The empty dependency array `[]` means this effect runs ONLY ONCE after the initial render.
  
  


  const weekData = [20, 40, 25, 30, 60, 15, 35];

  const [activeTab, setActiveTab] = useState<
    "home" | "music" | "box" | "profile"
  >("home");

  const handleTabPress = (tab: "home" | "music" | "box" | "profile") => {
    setActiveTab(tab);

    if (tab === "music") {
      navigation.navigate("Timer");
    }
    if (tab === "box") {
      navigation.navigate("Store");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text>💰 {earnings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text>⭐ {stars}</Text>
          </View>
        </View>
      </View>

      {/* Progress Ring */}
      <View style={styles.ringContainer}>
        <ProgressRing progress={progress} minutes={practiceMinutes} />
      </View>

      {/* Weekly Bars */}
      <View style={styles.barContainer}>
        {weekData.map((m, i) => (
          <View key={i} style={styles.barWrapper}>
            <View style={[styles.bar, { height: m * 2 }]} />
          </View>
        ))}
      </View>

      <Text style={styles.avgText}>
        Average practice session this week: 54 minutes
      </Text>

      {/* Practice Button */}
      <Pressable
        onPress={() => navigation.navigate("Timer")}
        style={styles.practiceButton}
      >
        <Text style={styles.practiceText}>Let’s Practice!</Text>
      </Pressable>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
  },
  statBox: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
    marginTop: 40,
  },
  ringContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    marginTop: 10,
  },
  barWrapper: {
    width: 55,
    alignItems: "center",
  },
  bar: {
    width: 30,
    backgroundColor: "#6EF2B2",
    borderRadius: 6,
  },
  avgText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
  practiceButton: {
    backgroundColor: "#20826c",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  practiceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
