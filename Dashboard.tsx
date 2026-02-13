import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import ProgressRing from "./ProgressRing";

export default function Dashboard() {
  const practiceMinutes = 47;
  const goalMinutes = 60;
  const progress = Math.round((practiceMinutes / goalMinutes) * 100);

  const weekData = [20, 40, 25, 30, 60, 15, 35];

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

      {/* Weekly Bars (Simple custom bars, no libs) */}
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
      <TouchableOpacity style={styles.practiceButton}>
        <Text style={styles.practiceText}>Let’s Practice!</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
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
    width: 20,
    alignItems: "center",
  },
  bar: {
    width: 18,
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
