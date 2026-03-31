import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DARK_TEAL = "#40796E";
const MINT = "#9FF2B8";
const DIVIDER = "#E8E8E8";

const WEEK_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Streak() {
  const streakDays = 7;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.main}>
          <View style={styles.heroRow}>
            <Text style={styles.heroNumber}>{streakDays}</Text>
            <Ionicons name="flame" size={72} color={MINT} style={styles.flame} />
          </View>

          <View style={styles.weekRow}>
            {WEEK_LABELS.map((label) => (
              <View key={label} style={styles.dayCell}>
                <Text style={styles.dayLabel}>{label}</Text>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={16} color={DARK_TEAL} />
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.headline}>
            You're on a{" "}
            <Text style={styles.headlineBold}>{streakDays} day</Text> streak!
          </Text>
          <Text style={styles.subtext}>
            Practice every day to build your streak.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <View style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  heroNumber: {
    fontSize: 88,
    fontWeight: "700",
    color: DARK_TEAL,
    lineHeight: 96,
  },
  flame: {
    marginLeft: 4,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingHorizontal: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: DARK_TEAL,
    marginBottom: 8,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: DARK_TEAL,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    color: DARK_TEAL,
    lineHeight: 26,
  },
  headlineBold: {
    fontWeight: "700",
  },
  subtext: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "400",
    color: DARK_TEAL,
    opacity: 0.85,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: DARK_TEAL,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
