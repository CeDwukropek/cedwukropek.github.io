import { useState, useEffect } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../config/firebase";

// Hook do całej kolekcji
export function useFilaments() {
  const [filaments, setFilaments] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "filaments");

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilaments(data);
    });

    return () => unsubscribe();
  }, []);
  return { filaments };
}

// Hook do pojedynczego dokumentu
export function useFilament(id) {
  const [filament, setFilament] = useState(null);
  const [note, setNote] = useState("");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (!id) return; // bezpieczny guard wewnątrz efektu

    const docRef = doc(db, "filaments", id);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const f = { id: docSnap.id, ...docSnap.data() };
        setFilament(f);

        // Ładowanie notatki z localStorage
        setNote(localStorage.getItem(`note-${id}`) || "");

        if (f.settings) {
          const allOpen = Object.keys(f.settings).reduce((acc, section) => {
            acc[section] = true;
            return acc;
          }, {});
          setOpenSections(allOpen);
        }
      } else {
        setFilament(null);
      }
    });

    // cleanup przy zmianie id albo unmount
    return () => unsubscribe();
  }, [id]);

  return { filament, note, setNote, openSections, setOpenSections };
}
