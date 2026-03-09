import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type Nav = any;

const BRAND = "#1F7A6B";
const BORDER = "#2E8B7E";

export function ProfileInfoScreen() {
  const navigation = useNavigation<Nav>();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [dob, setDob] = useState("");


  const handleDobChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length >= 3 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    setDob(formatted);
  };
  const canContinue = first && last && dob;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Profile Information</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#7AAEA3"
              value={first}
              onChangeText={setFirst}
              style={styles.input}
            />

            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#7AAEA3"
              value={last}
              onChangeText={setLast}
              style={styles.input}
            />
{/* 
            <TextInput
              placeholder="Date of Birth (MM/DD/YYYY)"
              placeholderTextColor="#7AAEA3"
              value={dob}
              onChangeText={setDob}
              style={styles.input}
            /> */}

<TextInput
  placeholder="Date of Birth (MM/DD/YYYY)"
  placeholderTextColor="#7AAEA3"
  value={dob}
  onChangeText={handleDobChange}
  style={styles.input}
  keyboardType="numeric"
  maxLength={10}
/>
          </View>
        </ScrollView>

        <Pressable
          style={[styles.bottomButton, !canContinue && styles.disabled]}
          disabled={!canContinue}
          onPress={() =>
            navigation.navigate("Welcome", { firstName: first })
          }
        >
          <Text style={styles.bottomButtonText}>Continue</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


export function WelcomeScreen({ route }: any) {
  const navigation = useNavigation<Nav>();
  const firstName = route?.params?.firstName ?? "there";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrap}>
        <Text style={styles.welcomeTop}>Nice to meet you,</Text>
        <Text style={styles.welcomeName}>{firstName}!</Text>
        <Text style={styles.welcomeSub}>
          Let’s get to know you a little more
        </Text>
      </View>

      <Pressable
        style={styles.bottomButton}
        onPress={() => navigation.navigate("PracticeMinutes")}
      >
        <Text style={styles.bottomButtonText}>Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export function PracticeMinutesScreen() {
  const navigation = useNavigation<Nav>();
  const [minutes, setMinutes] = useState("");

  const canContinue = Number(minutes) > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerWrap}>
          <Text style={styles.headerCenter}>
            How many minutes a day{"\n"}do you want to practice?
          </Text>

          <TextInput
            placeholder="e.g. 15"
            placeholderTextColor="#7AAEA3"
            keyboardType="number-pad"
            value={minutes}
            onChangeText={setMinutes}
            style={[styles.input, { marginTop: 30, width: "60%" }]}
          />
        </View>

        <Pressable
          style={[styles.bottomButton, !canContinue && styles.disabled]}
          disabled={!canContinue}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.bottomButtonText}>Finish</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF9",
  },
  inner: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: BRAND,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  headerCenter: {
    fontSize: 24,
    fontWeight: "700",
    color: BRAND,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  form: {
    gap: 16,
  },

  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: BORDER,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  welcomeTop: {
    fontSize: 22,
    color: BRAND,
    marginBottom: 6,
  },
  welcomeName: {
    fontSize: 30,
    fontWeight: "700",
    color: BRAND,
    marginBottom: 16,
  },
  welcomeSub: {
    fontSize: 18,
    color: BRAND,
    opacity: 0.85,
    textAlign: "center",
  },

  bottomButton: {
    backgroundColor: BRAND,
    height: 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  bottomButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.4,
  },
});