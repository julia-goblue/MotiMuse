import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "./firebaseConfig";
import {getChosenAvatar} from "./Store"
import { getAuth } from "firebase/auth";

const TEAL = "#1a6b5a";
const LIGHT_YELLOW = "#EAFBB1";

export default function PracticeIntro() {
  const navigation = useNavigation<any>();
  const [equippedHat, setEquippedHat] = useState<string | null>(null);

  

  useEffect(() => {

    //    (e.g., if you're using Firebase Auth, you'd use `auth.currentUser.uid`)
    // const db = getDatabase(app);
    // const userStatsRef = ref(db, 'userStats/testUser1');

    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getDatabase(app);
    const userStatsRef = ref(db, `userStats/${user?.uid}`);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.line1}>Musey wants to hear your music.</Text>
      <Text style={styles.line2}>Let's play!</Text>

      <View style={styles.characterWrap}>
        <Image
           source={avatar}
          style={styles.character}
          resizeMode="contain"
        />
      </View>

          <View style={styles.buttonRow}>
      <Pressable
        style={styles.startButton}
        // onPress={() =>
        //   navigation.navigate("MainTabs", { screen: "Timer" })
        // }
        onPress={() => navigation.navigate("Timer")}
      >
        <Text style={styles.startButtonText}>Start</Text>
      </Pressable>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.startButtonText}>Back</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  line1: {
    fontSize: 18,
    color: TEAL,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  line2: {
    fontSize: 28,
    fontWeight: "700",
    color: TEAL,
    textAlign: "center",
    marginBottom: 40,
  },
  characterWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 280,
  },
  character: {
    width: 220,
    height: 220,
  },
    buttonRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 24,
  },
  startButton: {
    backgroundColor: LIGHT_YELLOW,
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 14,
    marginBottom: 48,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backButton: {
     backgroundColor: LIGHT_YELLOW,
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 14,
    marginBottom: 48,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: TEAL,
  },
});
