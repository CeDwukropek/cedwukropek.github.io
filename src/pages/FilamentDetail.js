import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function FilamentDetail() {
  const { id } = useParams();
  const [filament, setFilament] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => {
        const f = data.find((item) => item.id === id);
        setFilament(f);
        setNote(localStorage.getItem(`note-${id}`) || "");
      });
  }, [id]);

  const saveNote = () => {
    localStorage.setItem(`note-${id}`, note);
  };

  if (!filament) return <p>Ładowanie...</p>;

  return (
    <div className="detail">
      <Link to="/">← Powrót</Link>
      <h2>{filament.name}</h2>
      <p><b>Typ:</b> {filament.type}</p>
      <p><b>Kolor:</b> {filament.color}</p>
      <h3>Ustawienia druku:</h3>
      <ul>
        {Object.entries(filament.settings).map(([key, val]) => (
          <li key={key}>{key}: {val}</li>
        ))}
      </ul>
      <a href={filament.buyLink} target="_blank" rel="noreferrer">Kup ten filament</a>
      
      <h3>Twoje notatki:</h3>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <button onClick={saveNote}>Zapisz</button>
    </div>
  );
}

export default FilamentDetail;
