import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { app } from "./firebaseConfig";

const HAT_PRICE = 15;
const USER_STATS_PATH = "userStats/testUser1";

export default function Store() {
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [stars, setStars] = useState(0);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const rtdb = getDatabase(app);
    const userStatsRef = ref(rtdb, USER_STATS_PATH);
    const unsubscribe = onValue(userStatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setEarnings(data.currentEarnings ?? 0);
        setStars(data.totalStars ?? 0);
      } else {
        setEarnings(0);
        setStars(0);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSelectHat = (hatId: string) => {
    setSelectedHat(hatId);
  };

  const handlePurchase = async () => {
    if (!selectedHat) return;
    if (earnings < HAT_PRICE) {
      Alert.alert("Not enough", `You need ${HAT_PRICE} to buy this item.`);
      return;
    }
    setPurchasing(true);
    try {
      const rtdb = getDatabase(app);
      const userStatsRef = ref(rtdb, USER_STATS_PATH);
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
        };
      });
      setSelectedHat(null);
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
        <Text style={styles.title}>Store</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text>{"💰 " + earnings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text>{"⭐ " + stars}</Text>
          </View>
        </View>
      </View>

      {/* Big Avatar */}
      <View style={styles.ringContainer}>
        <Image source={require("./assets/motimuse.png")} style={styles.big_img}/>
      </View>

      {/* Store Block */}
      <View style={styles.mainStore}>
        <View style={styles.storeRow}>
          {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OB")}>
            <Image source={require("./assets/OB_hat.png")}
              style={[ styles.hat_img, selectedHat === "OB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BB")}>
            <Image source={require("./assets/BB_hat.png")}
              style={[ styles.hat_img, selectedHat === "BB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GB")}>
            <Image source={require("./assets/GB_hat.png")}
              style={[ styles.hat_img, selectedHat === "GB" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PB")}>
            <Image source={require("./assets/PB_hat.png")}
              style={[ styles.hat_img, selectedHat === "PB" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}>
          {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OG")}>
            <Image source={require("./assets/OG_hat.png")}
              style={[ styles.hat_img, selectedHat === "OG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BG")}>
            <Image source={require("./assets/BG_hat.png")}
              style={[ styles.hat_img, selectedHat === "BG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GG")}>
            <Image source={require("./assets/GG_hat.png")}
              style={[ styles.hat_img, selectedHat === "GG" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PG")}>
            <Image source={require("./assets/PG_hat.png")}
              style={[ styles.hat_img, selectedHat === "PG" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}>
          {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("OC")}>
            <Image source={require("./assets/OC_hat.png")}
              style={[ styles.hat_img, selectedHat === "OC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("BC")}>
            <Image source={require("./assets/BC_hat.png")}
              style={[ styles.hat_img, selectedHat === "BC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("GC")}>
            <Image source={require("./assets/GC_hat.png")}
              style={[ styles.hat_img, selectedHat === "GC" && styles.selected_hat ]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectHat("PC")}>
            <Image source={require("./assets/PC_hat.png")}
              style={[ styles.hat_img, selectedHat === "PC" && styles.selected_hat ]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        {selectedHat && (
          <View style={styles.purchased}>
            <Text style={styles.priceText}>{"💰 " + HAT_PRICE}</Text>
          </View>
        )}
        {selectedHat && (
          <TouchableOpacity
            style={[
              styles.purchase,
              (!canAfford || purchasing) && styles.purchaseDisabled,
            ]}
            onPress={handlePurchase}
            disabled={!canAfford || purchasing}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.purchaseText}>
                {canAfford ? "Purchase" : "Not enough"}
              </Text>
            )}
          </TouchableOpacity>
        )}
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
  ringContainer: {
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
