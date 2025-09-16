import { initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
// Replace the "config.json" with your own config file.
// Remember to have two similar "config.json" files:
// 1. One in the same directory as this script for this script to read.
// 2. One in the "public/config" directory of your web project to allow the web app to read it.
// TODO change this weird issue, no need to have two files lol.
import config from "./config.json" with { type: "json" };

const app = initializeApp(config);

export const db = initializeFirestore(app, {
    // Enable offline data persistance with in-memory cache
    // (data will be lost when the page is refreshed or closed)
    // For persistent cache, consider using IndexedDB or LocalStorage
    // TODO change to persistent cache in future
    // Still does not generate as much reads as without cache
  localCache: memoryLocalCache(),
});
