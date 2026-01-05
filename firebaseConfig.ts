import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDMEz_hbxYQAsmUo3af1TBRfdj3-lCLl38",
  authDomain: "raahidost-70797.firebaseapp.com",
  databaseURL: "https://raahidost-70797-default-rtdb.firebaseio.com",
  projectId: "raahidost-70797",
  storageBucket: "raahidost-70797.firebasestorage.app",
  messagingSenderId: "559001567757",
  appId: "1:559001567757:web:30e288ceaa3e7218130b44",
  measurementId: "G-3EL5H6H8W2"
};

// Make sure we don't reinitialize if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);

// Platform specific auth
let auth;

if (Platform.OS === 'web') {
  // On web just use getAuth with default browser persistence
  auth = getAuth(app);
} else {
  // On native use AsyncStorage
  const { getReactNativePersistence } = require('firebase/auth/react-native');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
