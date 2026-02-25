import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getReactNativePersistence } from "firebase/auth/react-native";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0bAbLROn_1kHsAaxQtxukfh6TB9Rox1g",
  authDomain: "motimuse-441.firebaseapp.com",
  databaseURL: "https://motimuse-441-default-rtdb.firebaseio.com",
  projectId: "motimuse-441",
  storageBucket: "motimuse-441.firebasestorage.app",
  messagingSenderId: "387961612611",
  appId: "1:387961612611:web:b92f4505a6626825dd27f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth (with React Native persistence)
const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

const database = getDatabase(app);



export { app, database, auth, db, storage };
