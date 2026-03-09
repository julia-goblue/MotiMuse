import React, { useEffect, useRef, useState } from "react";
import { Image, TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "./BottomNav";

const Timer = () => {
  const navigation = useNavigation<any>();
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [text, setText] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePause = () => {
    if (paused) {
      startTimer();
      setPaused(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPaused(true);
    }
  };

  const handleEndPractice = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigation.navigate("PostPractice", { seconds });
  };

  const [activeTab, setActiveTab] = useState<"home" | "music" | "box" | "profile">("home");

  const handleTabPress = (tab: "home" | "music" | "box" | "profile") => {
    setActiveTab(tab);
    if (tab === "home") navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Timer</Text>

      <Image
        source={require('./assets/avatar.png')}
        style={{ width: 200, height: 200 }}
      />

      <TextInput
        style={styles.title}
        placeholder="What piece?"
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.timerText}>{formatTime()}</Text>

      <View style={styles.layout}>
        <Pressable style={styles.endButton} onPress={handlePause}>
          <Text style={styles.endText}>{paused ? "Resume" : "Pause"}</Text>
        </Pressable>

        <Pressable style={styles.endButton} onPress={handleEndPractice}>
          <Text style={styles.endText}>End</Text>
        </Pressable>
      </View>

      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  layout: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    marginBottom: 20,
  },
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
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  endText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});