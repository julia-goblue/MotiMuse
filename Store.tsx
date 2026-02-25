import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BottomNav from "./BottomNav";

export default function Store() {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<
      "home" | "music" | "box" | "profile"
    >("home");
  
    const handleTabPress = (tab: "home" | "music" | "box" | "profile") => {
      setActiveTab(tab);
  
       if (tab === "music") {
        navigation.navigate("Timer");
      }
    };

  const st_colors = ["SUNSET", "OCEAN", "BUBBLEGUM", "EARTH"]; // hat color variants

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Store</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text>💰 105</Text>
          </View>
          <View style={styles.statBox}>
            <Text>⭐ 9</Text>
          </View>
        </View>
      </View>

      {/* Big Avatar */}
      <View style={styles.ringContainer}>
        <Image source={require("./assets/motimuse.png")} style={styles.practiceText} />
      </View>

      {/* Store Block */}
      <View style={styles.mainStore}>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.storeRow}> {/* Row of color variants */}
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemButton}>
            <Text style={styles.practiceText}>Hat1</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Shop Button or home bar */}
      {/* Bottom Nav */}
            <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
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
  practiceButton: {
    backgroundColor: "#1C7C6D",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  practiceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  mainStore: {
    backgroundColor: "#c3bfbf",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  itemButton: {
    backgroundColor: "#1C7C6D",
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    width: 20,
    height: 20,
  },
});
