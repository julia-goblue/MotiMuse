import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { app } from "./firebaseConfig";

const HAT_PRICE = 15;
const auth = getAuth(app);
const db = getDatabase(app);

const HAT_IMAGES: Record<string, any> = {
  OB: require("./assets/OB_hat.png"),
  BB: require("./assets/BB_hat.png"),
  GB: require("./assets/GB_hat.png"),
  PB: require("./assets/PB_hat.png"),
  OG: require("./assets/OG_hat.png"),
  BG: require("./assets/BG_hat.png"),
  GG: require("./assets/GG_hat.png"),
  PG: require("./assets/PG_hat.png"),
  OC: require("./assets/OC_hat.png"),
  BC: require("./assets/BC_hat.png"),
  GC: require("./assets/GC_hat.png"),
  PC: require("./assets/PC_hat.png"),
};

const HAT_IDS = Object.keys(HAT_IMAGES);

const HAT_NAMES: Record<string, string> = {
  OB: "Orange Cap",
  BB: "Berry Cap",
  GB: "Mint Cap",
  PB: "Plum Cap",
  OG: "Sunset Hat",
  BG: "Sky Hat",
  GG: "Lime Hat",
  PG: "Top Hat",
  OC: "Ocean Cap",
  BC: "Cowboy Hat",
  GC: "Forest Cap",
  PC: "Violet Cap",
};

const CATEGORIES: {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "Hats", label: "Hats", icon: "ellipse-outline" },
  { key: "Bowties", label: "Bowties", icon: "link-outline" },
  { key: "Suits", label: "Suits", icon: "shirt-outline" },
  { key: "Held", label: "Held", icon: "sparkles-outline" },
  { key: "Extras", label: "Extras", icon: "diamond-outline" },
];

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

export default function Store() {
  const [selectedHat, setSelectedHat] = useState<string | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [stars, setStars] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);
  const [ownedHats, setOwnedHats] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("Hats");
  const [viewMode, setViewMode] = useState<"shop" | "closet">("closet");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);
    });
    return () => unsubscribe();
  }, []);

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
      setEquippedHat(selectedHat); 
      try {
        const userStatsRef = ref(db, `userStats/${uid}`);
        await runTransaction(userStatsRef, (current) => {
          if (!current) return current;
          return { ...current, equippedHat: selectedHat };
        });
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

  const previewHat = !selectedHat ? equippedHat : selectedHat;
  const previewAvatar = getChosenAvatar(previewHat);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Shop</Text>
            <View style={styles.headerAvatarWrap}>
              <Image source={getChosenAvatar(equippedHat)} style={styles.headerAvatar} />
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCapsule}>
              <Ionicons name="bag-handle-outline" size={16} color="#333" />
              <Text style={styles.statText}>{earnings}</Text>
            </View>
            <View style={styles.statCapsule}>
              <Ionicons name="star" size={16} color="#333" />
              <Text style={styles.statText}>{stars}</Text>
            </View>
          </View>
        </View> */}

   {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Store</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statText}>$ {earnings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>★ {stars}</Text>
          </View>
        </View>
      </View>

        <View style={styles.modeToggle}>
          <Pressable
            style={[styles.modePill, viewMode === "shop" && styles.modePillActive]}
            onPress={() => setViewMode("shop")}
          >
            <Ionicons
              name="gift-outline"
              size={18}
              color={viewMode === "shop" ? "#1a6b5a" : "#666"}
            />
            <Text style={[styles.modePillText, viewMode === "shop" && styles.modePillTextActive]}>
              Shop
            </Text>
          </Pressable>
          <Pressable
            style={[styles.modePill, viewMode === "closet" && styles.modePillActive]}
            onPress={() => setViewMode("closet")}
          >
            <Ionicons
              name="shirt-outline"
              size={18}
              color={viewMode === "closet" ? "#1a6b5a" : "#666"}
            />
            <Text style={[styles.modePillText, viewMode === "closet" && styles.modePillTextActive]}>
              Closet
            </Text>
          </Pressable>
        </View>

        <View style={styles.previewFrame}>
          <Image source={previewAvatar} style={styles.previewAvatar} />
          <View style={styles.equippedSlot}>
            {equippedHat ? (
              <Image source={HAT_IMAGES[equippedHat]} style={styles.equippedHatThumb} />
            ) : (
              <View style={styles.equippedPlaceholder} />
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.key;
            const isHats = cat.key === "Hats";
            return (
              <Pressable
                key={cat.key}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                  !isHats && styles.categoryPillDisabled,
                ]}
                onPress={() => isHats && setActiveTab(cat.key)}
                disabled={!isHats}
              >
                <Ionicons
                  name={cat.icon}
                  size={15}
                  color={isActive ? "#FFFFFF" : "#666"}
                />
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {activeTab === "Hats" ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {HAT_IDS.map((id) => {
              const selected = selectedHat === id;
              const wearing = equippedHat === id;
              return (
                <TouchableOpacity
                  key={id}
                  activeOpacity={0.85}
                  style={[styles.itemCard, selected && styles.itemCardSelected]}
                  onPress={() => handleSelectHat(id)}
                >
                  <Image source={HAT_IMAGES[id]} style={styles.cardHatImg} />
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {HAT_NAMES[id] ?? id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>More styles coming soon.</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <View style={styles.purchased}>
            <Text style={styles.priceText}>{selectedHat ? "$ " + HAT_PRICE : "Select an item!"}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.purchase,
              (!canAfford && !ownedHats[selectedHat ?? ""]) || purchasing
                ? styles.purchaseDisabled
                : null,
            ]}
            onPress={handlePurchase}
            disabled={purchasing || (!ownedHats[selectedHat ?? ""] && !canAfford)}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
          <Text style={styles.purchaseText}>
            {equippedHat === selectedHat && selectedHat !== null
              ? "Equipped"
              : ownedHats[selectedHat ?? ""]
              ? "Equip"
              : purchasing
              ? "..."
              : canAfford
              ? "Purchase"
              : "Not enough"}
          </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 8,
  },
   header: {
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a6b5a",
    textAlign: "center",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  statText: {
    fontWeight: "600",
    color: "#333",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F0F5F3",
  },
  headerAvatar: {
    width: 36,
    height: 36,
    resizeMode: "cover",
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "700",
  //   color: "#1a6b5a",
  // },
  // statsRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 8,
  // },
  statCapsule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EAFBB1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  // statText: {
  //   fontWeight: "700",
  //   color: "#333",
  //   fontSize: 15,
  // },
  modeToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  modePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#F3F4F0",
    borderWidth: 1.5,
    borderColor: "#E5E6E0",
  },
  modePillActive: {
    backgroundColor: "#FFF9DC",
    borderColor: "#E8DCA8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  modePillText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
  },
  modePillTextActive: {
    color: "#1a6b5a",
  },
  previewFrame: {
    borderWidth: 2,
    borderColor: "#B8D9C8",
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#FAFDFB",
  },
  previewAvatar: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  equippedSlot: {
    marginTop: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ECEEEA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8DCD6",
  },
  equippedHatThumb: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  equippedPlaceholder: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D4CC",
  },
  categoryScroll: {
    gap: 10,
    paddingBottom: 14,
    paddingRight: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#EEF0EC",
  },
  categoryPillActive: {
    backgroundColor: "#1a6b5a",
  },
  categoryPillDisabled: {
    opacity: 0.5,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },
  categoryPillTextActive: {
    color: "#FFFFFF",
  },
  cardsRow: {
    gap: 12,
    paddingVertical: 4,
    paddingRight: 8,
  },
  itemCard: {
    width: 152,
    backgroundColor: "#FFFCF3",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#E8D78A",
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  itemCardSelected: {
    borderColor: "#1a6b5a",
    backgroundColor: "#F4FBF8",
  },
  cardHatImg: {
    width: 88,
    height: 88,
    resizeMode: "contain",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2a2a2a",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  cardSubtitleWearing: {
    color: "#1a6b5a",
    fontWeight: "700",
  },
  comingSoon: {
    paddingVertical: 36,
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
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
    alignItems: "center",
  },
});
