import React from "react";
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

const TEAL = "#1a6b5a";
const LIGHT_YELLOW = "#EAFBB1";

export default function PracticeIntro() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.line1}>Musey wants to hear your music.</Text>
      <Text style={styles.line2}>Let's play!</Text>

      <View style={styles.characterWrap}>
        <Image
          source={require("./assets/avatar.png")}
          style={styles.character}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() =>
          navigation.navigate("MainTabs", { screen: "Timer" })
        }
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
