import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export type UnlockedAchievementItem = { id: string; title: string };

type Props = {
  visible: boolean;
  items: UnlockedAchievementItem[];
  onDismiss: () => void;
};

export default function AchievementUnlockedModal({
  visible,
  items,
  onDismiss,
}: Props) {
  const plural = items.length > 1;

  return (
    <Modal
      visible={visible && items.length > 0}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <View style={styles.card}>
          <View style={styles.iconRing}>
            <Ionicons name="trophy" size={40} color="#C9A227" />
          </View>
          <Text style={styles.kicker}>
            {plural ? "Achievements unlocked!" : "Achievement unlocked!"}
          </Text>
          <Text style={styles.subKicker}>
            {plural
              ? "Keep up the great work."
              : "Nice work — you earned a new badge."}
          </Text>
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={items.length > 4}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.listRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#1a6b5a"
                  style={styles.listCheck}
                />
                <Text style={styles.listTitle}>{item.title}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.btn} onPress={onDismiss}>
            <Text style={styles.btnText}>Awesome!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#F7FBF9",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#6EF2B2",
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#1a6b5a",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  iconRing: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EAFBB1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E4D89A",
  },
  kicker: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a6b5a",
    textAlign: "center",
    marginBottom: 6,
  },
  subKicker: {
    fontSize: 15,
    color: "#4a6b62",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  listScroll: {
    maxHeight: 220,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 4,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C8E8D8",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  listCheck: {
    marginRight: 10,
  },
  listTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1a3a33",
  },
  btn: {
    backgroundColor: "#1a6b5a",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
