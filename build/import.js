// File needed to update the storage system, as previous one was just JSON file.
// Was too lazy to rewrite every single filament to Firebase :D
// Hope you won't need it tho.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import filaments from "./filaments.json" with { type: "json" };
import firebaseConfig from "./config/firebase.json" with { type: "json" };
// ❗ To use u need to add type: "module" in package.json
// ❗ and install firebase npm i firebase

// 🔑 Firebase configuration
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadData() {
  for (const filament of filaments) {
    await setDoc(doc(db, "filaments", filament.id), filament);
    console.log(`✅ Dodano: ${filament.name}`);
  }
}

uploadData();
