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
  // Filament data from Firestore
  const [filament, setFilament] = useState(null);
  // User note for this filament, stored in localStorage
  const [note, setNote] = useState("");
  // Which settings sections are open
  const [openSections, setOpenSections] = useState({});
  if (!id) return;

  // Referencja do dokumentu
  const docRef = doc(db, "filaments", id);

  // Subskrypcja zamiast getDoc
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const f = { id: docSnap.id, ...docSnap.data() };
        setFilament(f);

        // Załaduj notatkę z LocalStorage
        setNote(localStorage.getItem(`note-${id}`) || "");

        if (f.settings) {
          // Otwórz wszystkie sekcje domyślnie
          const allOpen = Object.keys(f.settings).reduce((acc, section) => {
            acc[section] = true;
            return acc;
          }, {});
          setOpenSections(allOpen);
        }
      } else {
        setFilament(null);
      }
      // cleanup – odpinamy subskrypcję przy zmianie id / unmount
      return () => unsubscribe();
    },
    [id]
  );
  return { filament, note, setNote, openSections, setOpenSections };
}
