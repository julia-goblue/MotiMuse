import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  progress: number; // 0–100
  minutes: number;
  seconds: number;  // was: minutes: number
}

export default function ProgressRing({ progress, minutes }: Props) {
  const radius = 90;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // const mins = Math.floor(seconds / 60);
  // const secs = seconds % 60;
  // const timeLabel = mins > 0 ? `${mins}:${secs < 10 ? "0" : ""}${secs}` : `${secs}s`;
  // const unitLabel = mins > 0 ? "minutes" : "seconds";

  return (
    <View style={styles.container}>
      <Svg width={220} height={220}>
        {/* Background Ring */}
        <Circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#EAFBB1"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Ring */}
        <Circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#6EF2B2"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin="110,110"
        />
      </Svg>

      {/* Center Text */}
      <View style={styles.centerText}>
        <Text style={styles.minutes}>{minutes}</Text>
        <Text style={styles.label}>minutes</Text>

        {/* <Text style={styles.minutes}>{timeLabel}</Text>
        <Text style={styles.label}>{unitLabel}</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
  },
  minutes: {
    fontSize: 45,
    fontWeight: "700",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
});
