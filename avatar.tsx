import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";
import {getChosenAvatar} from "./Store"

const auth = getAuth(app);
const db = getDatabase(app);

export default function avatar() {
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [stars, setStars] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);
  const [ownedHats, setOwnedHats] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("Hats");
  const [uid, setUid] = useState<string | null>(null);

  // Wait for Firebase Auth to resolve
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to RTDB only once uid is available
  useEffect(() => {
    if (!uid) return;

    const userStatsRef = ref(db, `userStats/${uid}`);
    const unsubscribe = onValue(userStatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setEarnings(data.currentEarnings ?? 0);
        setStars(data.totalStars ?? 0);
        setEquippedHat(data.equippedHat ?? null);
        setOwnedHats(data.ownedHats ?? {});
      } else {
        setEarnings(0);
        setStars(0);
      }
    });
    return () => unsubscribe();
  }, [uid]);

  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statText}>$ {earnings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>★ {stars}</Text>
          </View>
        </View>
      </View>

      {/* Big Avatar */}
      <View style={styles.ringContainer}>
        <Image
          source={getChosenAvatar(equippedHat)}
          style={styles.big_img}
        />
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.buttonText}>{"Leave"}</Text>
        </Pressable>
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
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  tabScroll: {
  flexDirection: "row",
  marginTop: 11,
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
  statText: {
    fontWeight: "600",
    color: "#333",
  },
  ringContainer: {
    height: 140,
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
  practiceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  mainStore: {
    //backgroundColor: "#c3bfbf",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    gap: 7,
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
    gap: 5,
  },
  itemButton: {
    //backgroundColor: "#299564",
    alignItems: "center",
    margin: 0,
    width: 80,
    height: 80,
  },
  hat_img: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  selected_hat: { //when hats have transparent background and want selection shadow
    width: 90,
    height: 90,
    resizeMode: "contain",
    shadowColor: "#76b9d3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6, 
    elevation: 8, //added for Android
  },
  big_img: {
    width: 250,
    height: 250,
    resizeMode: "contain",
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
