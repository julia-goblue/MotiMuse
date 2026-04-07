import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { db, app } from "./firebaseConfig";
import {getChosenAvatar} from "./Store"
import { getAuth } from "firebase/auth";

const TEAL = "#1a6b5a";
const LIGHT_YELLOW = "#EAFBB1";

export function getChosenEgg(museyColor: string | null) {
  const eggs: Record<string, any> = {
    P: require("./assets/p_egg.png"),
    B: require("./assets/b_egg.png"),
    G: require("./assets/g_egg.png"),
  };

  if (!museyColor) {
    return require("./assets/g_egg.png");
  }

  return eggs[museyColor];
}

export default function Egg() {
  const navigation = useNavigation<any>();
  const [museyColor, setMuseyColor] = useState<string | null>(null);

  

  useEffect(() => {

    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getDatabase(app);
    const userStatsRef = ref(db, `userStats/${user?.uid}`);

    const unsubscribe = onValue(userStatsRef, (snapshot) => {
      if (snapshot.exists()) { // Check if data exists at the path
        const data = snapshot.val();
        console.log("Fetched data:", data); 
        if (data.museyColor) {
          setMuseyColor(data.museyColor); // restore previously chosen color
        }

      } 
    }, (databaseError) => {
      // 5. Handle any errors during the data fetch
      console.error("Error fetching user stats:", databaseError);
    });

    return () => {
      console.log("Detaching Firebase listener.");
      unsubscribe();
    };
  }, []);

  const handleMuseyColor = (eggColor: string) => {
    setMuseyColor(eggColor);

    const auth = getAuth(app);
    const user = auth.currentUser;
    const db = getDatabase(app);
    set(ref(db, `userStats/${user?.uid}/museyColor`), eggColor);
  };

   //const avatar = getChosenAvatar(equippedHat);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.line2}>Select your egg!</Text>
      <Text style={styles.line1}>The more you practice, the faster they grow! They’re here to listen to your music and help you play</Text>

      <View style={styles.characterWrap}>
        <TouchableOpacity style={styles.character} onPress={() => handleMuseyColor("P")}>
          <Image source={require("./assets/p_egg.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.character} onPress={() => handleMuseyColor("G")}>
          <Image source={require("./assets/g_egg.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.character} onPress={() => handleMuseyColor("B")}>
          <Image source={require("./assets/b_egg.png")}/>
        </TouchableOpacity>
      </View>

      <Pressable
        style={styles.startButton}
        // onPress={() =>
        //   navigation.navigate("MainTabs", { screen: "Timer" })
        // }
        onPress={() => navigation.navigate("FirstTimer")}
      >
        <Text style={styles.startButtonText}>Start!</Text>
      </Pressable>
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
    marginBottom: 55,
    fontWeight: "500",
  },
  line2: {
    fontSize: 28,
    fontWeight: "700",
    color: TEAL,
    textAlign: "center",
    marginBottom: 10,
  },
  characterWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    marginBottom: 100,
  },
  character: {
    width: 110,
    height: 110,
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
  startButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: TEAL,
  },
});
