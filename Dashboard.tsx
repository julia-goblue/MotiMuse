import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProgressRing from "./ProgressRing";
import BottomNav from "./BottomNav";

export default function Dashboard() {
  const navigation = useNavigation<any>();

  const practiceMinutes = 47;
  const goalMinutes = 60;
  const progress = Math.round((practiceMinutes / goalMinutes) * 100);

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
            <Text>💰 105</Text>
          </View>
          <View style={styles.statBox}>
            <Text>⭐ 9</Text>
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
    backgroundColor: "#1C7C6D",
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
