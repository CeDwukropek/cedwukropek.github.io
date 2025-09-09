// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import config from "./config.json" with { type: "json" };

const app = initializeApp(config);

export const db = getFirestore(app);

