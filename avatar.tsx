import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";

const HAT_PRICE = 15;
const auth = getAuth(app);
const db = getDatabase(app);

export function getChosenAvatar(selectedHat: string | null) {
  const avatars: Record<string, any> = {
    OB: require("./assets/OB_guy.png"),
    BB: require("./assets/BB_guy.png"),
    GB: require("./assets/GB_guy.png"),
    PB: require("./assets/PB_guy.png"),
    OG: require("./assets/OG_guy.png"),
    BG: require("./assets/BG_guy.png"),
    GG: require("./assets/GG_guy.png"),
    PG: require("./assets/PG_guy.png"),
    OC: require("./assets/OC_guy.png"),
    BC: require("./assets/BC_guy.png"),
    GC: require("./assets/GC_guy.png"),
    PC: require("./assets/PC_guy.png"),
  };

  if (!selectedHat) {
    return require("./assets/Avatar 1.png");
  }

  return avatars[selectedHat];
}

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

  const handleSelectHat = (hatId: string) => {
    setSelectedHat(hatId);
  };

  const handlePurchase = async () => {
    if (!selectedHat || !uid) return;

    if (ownedHats[selectedHat]) {
      try {
        const userStatsRef = ref(db, `userStats/${uid}`);
        await runTransaction(userStatsRef, (current) => {
          if (!current) return current;
          return { ...current, equippedHat: selectedHat };
        });
        setSelectedHat(null);
      } catch (e) {
        Alert.alert("Failed to equip", "Something went wrong.");
      }
      return;
    }

    if (earnings < HAT_PRICE) {
      Alert.alert("Not enough", `You need ${HAT_PRICE} to buy this item.`);
      return;
    }
    setPurchasing(true);
    try {
      const userStatsRef = ref(db, `userStats/${uid}`);
      await runTransaction(userStatsRef, (current) => {
        if (!current) {
          current = { currentEarnings: 0, totalStars: 0 };
        }
        const currentEarnings = current.currentEarnings ?? 0;
        if (currentEarnings < HAT_PRICE) return current;
        return {
          ...current,
          currentEarnings: currentEarnings - HAT_PRICE,
          ownedHats: { ...(current.ownedHats || {}), [selectedHat]: true },
          equippedHat: selectedHat,
        };
      });
      setSelectedHat(equippedHat);
    } catch (e) {
      console.error("Purchase failed:", e);
      Alert.alert("Purchase failed", "Something went wrong. Try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const canAfford = earnings >= HAT_PRICE;

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
          source={getChosenAvatar(!selectedHat ? equippedHat : selectedHat)}
          style={styles.big_img}
        />
      </View>
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
  purchase: {
    backgroundColor: "#299564",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
    width: 175,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseDisabled: {
    backgroundColor: "#999",
    opacity: 0.8,
  },
  purchaseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  purchased: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 8,
    width: 175,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
   buttonRow: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
  },
});
