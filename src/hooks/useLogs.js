import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export function useLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "logs");

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // sortowanie: najnowsze (większy timestamp) na górze
      data.sort((a, b) => b.time.seconds - a.time.seconds);
      setLogs(data);
    });

    return () => unsubscribe();
  }, []);
  return { logs };
}
