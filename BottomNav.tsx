import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type TabKey = "home" | "music" | "shirt" | "profile";

type Props = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

export default function BottomNav({ activeTab, onTabPress }: Props) {
  const iconColor = (tab: TabKey) => (activeTab === tab ? "#111" : "#444");

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.pill}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onTabPress("home")}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={26} color={iconColor("home")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onTabPress("music")}
          activeOpacity={0.8}
        >
          <Ionicons name="musical-notes-outline" size={26} color={iconColor("music")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onTabPress("shirt")}
          activeOpacity={0.8}
        >
          <Ionicons name="shirt-outline" size={26} color={iconColor("shirt")} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onTabPress("profile")}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={26} color={iconColor("profile")} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18, // lifts it up a bit like your screenshot
    alignItems: "center",
  },
  pill: {
    width: "86%",
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EAFBB1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,

    // soft shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
