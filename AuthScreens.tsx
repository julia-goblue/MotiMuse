import React, { useState } from "react";

import { auth, db } from "./firebaseConfig";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type Nav = any;

// ===== IMAGE (adjust if needed) =====
const LOGIN_IMAGE = require("./assets/login.png");

// =====================================================
// LOGIN SCREEN
// =====================================================

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    try {
      if (!email || !password) {
        console.log("Missing email or password");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("MainTabs");
    } catch (error: any) {
      console.log("Login error:", error?.message ?? error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Graphic */}
          <Image source={LOGIN_IMAGE} style={styles.hero} resizeMode="contain" />

          {/* Title */}
          <Text style={styles.title}>MotiMuse</Text>
          <Text style={styles.subtitle}>Transform practice into play!</Text>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#7AAEA3"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#7AAEA3"
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={handleSignIn}>
              <Text style={styles.primaryText}>Sign In</Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don’t have an account? </Text>
              <Pressable onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.switchLink}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// SIGN UP SCREEN
// =====================================================

export function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // async function handleSignUp() {
  //   try {
  //     if (!name || !email || !password) {
  //       console.log("Missing fields");
  //       return;
  //     }

  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );

  //     const user = userCredential.user;

  //     await addDoc(collection(db, "users"), {
  //       uid: user.uid,
  //       name,
  //       email,
  //       createdAt: new Date(),
  //     });

  //     navigation.replace("ProfileInfo");
  //   } catch (error: any) {
  //     console.log("Signup error:", error?.message ?? error);
  //   }
  // }

  async function handleSignUp() {
    try {
      if (!name || !email || !password) {
        console.log("Missing fields");
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const user = userCredential.user;
  
      // Fire-and-forget the Firestore write — don't let it block navigation
      addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      }).catch((err) => console.log("Firestore write failed:", err));
  
      // Navigate regardless of Firestore success
      navigation.navigate("ProfileInfo");
  
    } catch (error: any) {
      // This now only catches auth errors
      console.log("Signup error:", error?.message ?? error);
      alert("Sign up failed: " + (error?.message ?? "Unknown error"));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { marginTop: 40 }]}>Create Account</Text>

          <View style={styles.form}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#7AAEA3"
              autoCapitalize="words"
              style={styles.input}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#7AAEA3"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#7AAEA3"
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={handleSignUp}>
              <Text style={styles.primaryText}>Create Account</Text>
            </Pressable>

{/* <Pressable
  style={styles.primaryButton}
  onPress={() => {
    console.log("TEST NAV");
    navigation.replace("ProfileInfo");
  }}
></Pressable>? */}

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.switchLink}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const BRAND = "#1F7A6B";
const BORDER = "#2E8B7E";

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
    paddingBottom: 40,
    alignItems: "center",
  },

  hero: {
    width: "100%",
    height: 220,
    marginTop: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: BRAND,
    marginTop: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: BRAND,
    opacity: 0.85,
    marginTop: 6,
    marginBottom: 28,
    textAlign: "center",
  },

  form: {
    width: "100%",
    marginTop: 6,
  },

  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: BORDER,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },

  forgotWrap: {
    alignSelf: "flex-start",
    marginTop: -6,
    marginBottom: 18,
  },
  forgot: {
    color: BRAND,
    fontSize: 14,
  },

  primaryButton: {
    backgroundColor: BRAND,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    flexWrap: "wrap",
  },
  switchText: {
    color: "#5F6F6B",
  },
  switchLink: {
    color: BRAND,
    fontWeight: "600",
  },
});