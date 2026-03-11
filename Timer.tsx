import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "./firebaseConfig";
import {getChosenAvatar} from "./Store"


const Timer = () => {
  const navigation = useNavigation<any>();
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [text, setText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);

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
  
          setEquippedHat(data.equippedHat ?? null);
  
        } 
      }, (databaseError) => {
        // 5. Handle any errors during the data fetch
        console.error("Error fetching user stats:", databaseError);
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
  
  const avatar = getChosenAvatar(equippedHat);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Timer</Text>

      <Image
        source={avatar}
        style={{ width: 200, height: 200 }}
      />

      {/* <TextInput
        style={styles.title}
        placeholder="What piece?"
        value={text}
        onChangeText={setText}
      /> */}

      <Text style={styles.timerText}>{formatTime()}</Text>

      <View style={styles.layout}>
        <Pressable style={styles.endButton} onPress={handlePause}>
          <Text style={styles.endText}>{paused ? "Resume" : "Pause"}</Text>
        </Pressable>

        <Pressable style={styles.endButton} onPress={handleEndPractice}>
          <Text style={styles.endText}>End</Text>
        </Pressable>
      </View>
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