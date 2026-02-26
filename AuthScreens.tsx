import React, { useState } from "react";
import { auth, db } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

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

function OrDivider() {
  return (
    <View style={styles.orRow}>
      <View style={styles.orLine} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.orLine} />
    </View>
  );
}

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        
        {/* <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <View style={styles.statsRow}>
          </View>
        </View> */}

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log In</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />

          <Pressable style={styles.linkBtn} onPress={() => {}}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
            try {
              await signInWithEmailAndPassword(auth, email, password);
              navigation.navigate("Dashboard");
            } catch (error: any) {
              console.log(error.message);
            }
          }}
          style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>New here?</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.switchLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <View style={styles.statsRow}>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign Up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Julia"
            placeholderTextColor="#888"
            autoCapitalize="words"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            onPress={async () => {
              try {
                // 1️Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(
                  auth,
                  email,
                  password
                );

                const user = userCredential.user;

                // Add user to Firestore
                await addDoc(collection(db, "users"), {
                  uid: user.uid,
                  name: name,
                  email: email,
                  createdAt: new Date(),
                });

                // Navigate
                navigation.navigate("Dashboard");

              } catch (error: any) {
                console.log(error.message);
              }
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>Create Account</Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.switchLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // matches Dashboard container
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  // matches Dashboard header
  header: {
    marginHorizontal: 10,
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
    backgroundColor: "#EAFBB1", // same as Dashboard statBox
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 8,
    marginTop: 40, // keeps the same "floating pill" feel
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // card that fits your soft UI
  card: {
    marginTop: 26,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EDEDED",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDEDED",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
  },

  linkBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  linkText: {
    color: "#20826c", // same as practiceButton
    fontWeight: "600",
  },

  // matches Dashboard practiceButton
  primaryButton: {
    backgroundColor: "#20826c",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },
  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  switchText: {
    color: "#666",
    fontWeight: "600",
  },
  switchLink: {
    color: "#20826c",
    fontWeight: "600",
  },
});