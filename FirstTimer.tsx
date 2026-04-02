import React, { useEffect, useRef, useState } from "react";
import { Image, View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "./firebaseConfig";
import { getChosenEgg } from "./Egg";
import { getAuth } from "firebase/auth";

const WaveBar = ({ delay, isPlaying }: { delay: number; isPlaying: boolean }) => {
  const anim = useRef(new Animated.Value(0.3)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Start the loop
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 400 + delay * 50, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 400 + delay * 50, useNativeDriver: true }),
        ])
      );
      loopRef.current = loop;
      timeoutRef.current = setTimeout(() => loop.start(), delay * 80);
    } else {
      // Pause — stop loop and snap back to rest position
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      loopRef.current?.stop();
      Animated.timing(anim, { toValue: 0.3, duration: 200, useNativeDriver: true }).start();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      loopRef.current?.stop();
    };
  }, [isPlaying]); // re-runs whenever isPlaying flips

  return (
    <Animated.View
      style={{
        width: 8,
        height: 60,
        backgroundColor: "#6EF2B2",
        borderRadius: 4,
        marginHorizontal: 3,
        transform: [{ scaleY: anim }],
      }}
    />
  );
};

const FirstTimer = () => {
  const navigation = useNavigation<any>();
  const [seconds, setSeconds] = useState(300);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [museyColor, setMuseyColor] = useState<string | null>(null);

  useEffect(() => {
    // const db = getDatabase(app);
    // const userStatsRef = ref(db, "userStats/testUser1");

    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getDatabase(app);
    const userStatsRef = ref(db, `userStats/${user?.uid}`);
    const unsubscribe = onValue(userStatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMuseyColor(data.museyColor ?? null);
      }
    });
    return () => unsubscribe();
  }, []);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handlePause = () => {
    if (paused) { startTimer(); setPaused(false); }
    else { if (intervalRef.current) clearInterval(intervalRef.current); setPaused(true);}
  };

  const handleEndPractice = () => { //TODO This needs to change, so they don't end till Musey is hatched
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigation.navigate("Hatching");
  };//TODO handle end practice only when 5min is up

  const avatar = getChosenEgg(museyColor);//TODO getChosenEgg
  const barHeights = [0.5, 0.8, 1, 0.6, 0.9, 0.7, 1, 0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.8];

  if(seconds == 0) handleEndPractice();

  return (
    <View style={styles.container}>
      <Text style={styles.pieceTitle}>Practice to hatch Musey</Text>

      <Image source={avatar} style={styles.avatar} />

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      <Text style={styles.timerLabel}>minutes</Text>

      <View style={styles.waveform}>
        {barHeights.map((_, i) => (
          <WaveBar key={i} delay={i} isPlaying={!paused}/>
        ))}
      </View>
      

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={handlePause}>
          <Text style={styles.buttonText}>{paused ? "Resume" : "Pause"}</Text>
        </Pressable>
        {/* <Pressable style={styles.button} onPress={handleEndPractice}>
          <Text style={styles.buttonText}>End</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

export default FirstTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  pieceTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a6b5a",
    marginBottom: 16,
  },
  timerBox: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 6,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#EAFBB1",
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    marginBottom: 32,
  },
  characterArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 280,
    // marginBottom: 40,
    position: "relative",
  },
  avatar: {
    width: 200,
    height: 200,
  },
  bubbleRight: {
    position: "absolute",
    top: 10,
    right: 16,
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: 180,
  },
  bubbleTextDark: {
    color: "#EAFBB1",
    fontSize: 13,
    fontWeight: "600",
  },
  bubbleLeft: {
    position: "absolute",
    bottom: 20,
    left: 16,
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: 180,
  },
  bubbleTextLight: {
    color: "#EAFBB1",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
  },
  button: {
    backgroundColor: "#EAFBB1",
    // marginTop: 100,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a3a33",
  },
});