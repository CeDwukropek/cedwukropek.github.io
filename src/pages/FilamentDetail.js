import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function FilamentDetail() {
  const { id } = useParams();
  const [filament, setFilament] = useState(null);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(null); // przechowuje klucz ustawienia które skopiowaliśmy

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

  const copyValue = (key, val) => {
    const number = val.toString().match(/\d+(\.\d+)?/)?.[0] || val;
    navigator.clipboard.writeText(number);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500); // tooltip znika po 1.5s
  };

  if (!filament) return <p>Ładowanie...</p>;

  return (
    <div className="detail">
      <Link to="/">← Powrót</Link>
      <h2>{filament.name}</h2>
      <p><b>Typ:</b> {filament.type}</p>
      <p><b>Kolor:</b> {filament.color}</p>
      <h3>Ustawienia druku:</h3>
      {Object.entries(filament.settings).map(([section, settings]) => (
        <div key={section} className="settings-section">
          <h4>{section}</h4>
          <ul>
            {Object.entries(settings).map(([key, val]) => (
              <li key={key}>
                {key}:{" "}
                <span
                  className="copyable"
                  onClick={() => copyValue(key, val)}
                >
                  {val}
                </span>
                {copied === key && (
                  <span className="tooltip">Skopiowano!</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <a href={filament.buyLink} target="_blank" rel="noreferrer">
        Kup ten filament
      </a>
      <h3>Twoje notatki:</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={saveNote}>Zapisz</button>
    </div>
  );
}

export default FilamentDetail;
