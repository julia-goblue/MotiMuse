import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "./BottomNav";

const Timer = () => {
  const navigation = useNavigation<any>();
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEndPractice = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    navigation.goBack();
  };


  const [activeTab, setActiveTab] = useState<
    "home" | "music" | "box" | "profile"
  >("home");

  const handleTabPress = (tab: "home" | "music" | "box" | "profile") => {
    setActiveTab(tab);

    if (tab === "home") {
      navigation.navigate("Dashboard");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Timer</Text>

      <Text style={styles.timerText}>{formatTime()}</Text>

      <Pressable style={styles.endButton} onPress={handleEndPractice}>
        <Text style={styles.endText}>End Practice</Text>
      </Pressable>

      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />

    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  timerText: {
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 40,
  },
  endButton: {
    backgroundColor: "#C94C4C",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  endText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
