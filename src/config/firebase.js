// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import config from "./config.json" with { type: "json" };

const app = initializeApp(config);

export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});
