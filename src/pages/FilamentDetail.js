import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function FilamentDetail() {
  const { id } = useParams();
  const [filament, setFilament] = useState(null);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(null);
  const [openSections, setOpenSections] = useState({}); // <- nowe

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => {
        const f = data.find((item) => item.id === id);
        setFilament(f);
        setNote(localStorage.getItem(`note-${id}`) || "");

        if (f?.settings) {
          // ustawiamy wszystkie sekcje jako otwarte
          const allOpen = Object.keys(f.settings).reduce((acc, section) => {
            acc[section] = true;
            return acc;
          }, {});
          setOpenSections(allOpen);
        }
      });
  }, [id]);

  const saveNote = () => {
    localStorage.setItem(`note-${id}`, note);
  };

  const copyValue = (key, val) => {
    const number = val.toString().match(/\d+(\.\d+)?/)?.[0] || val;
    navigator.clipboard.writeText(number);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!filament) return <p>Ładowanie...</p>;

  // Define the desired order for groups.
  const groupOrder = ["material", "type", "brand", "color", "features"];

  // Flatten the tags object into an array with group information.
  let sortedTags = [];
  if (filament.tags) {
    // First, add tags from groups in order.
    groupOrder.forEach((group) => {
      if (filament.tags[group]) {
        sortedTags = sortedTags.concat(
          filament.tags[group].map((tag) => ({ group, tag }))
        );
      }
    });
    // Then, add any remaining groups not defined in groupOrder.
    Object.entries(filament.tags).forEach(([group, tags]) => {
      if (!groupOrder.includes(group)) {
        sortedTags = sortedTags.concat(tags.map((tag) => ({ group, tag })));
      }
    });
  }

  return (
    <div className="detail">
      <Link to="/">← Powrót</Link>
      <h2>{filament.name}</h2>
      <div className="tags">
        {sortedTags.map(({ group, tag }) => (
          <span key={`${group}-${tag}`} className={`tag ${group}`}>
            {tag}
          </span>
        ))}
      </div>
      <p>
        <b>Typ:</b> {filament.type}
      </p>
      <p>
        <b>Dostępność:</b>{" "}
        <span
          className={
            filament.quantity >= 1000
              ? "high"
              : filament.quantity >= 300
              ? "medium"
              : "low"
          }
        >
          {filament.quantity}g
        </span>
      </p>
      <h3>Ustawienia druku:</h3>
      {Object.entries(filament.settings).map(([section, settings]) => (
        <div key={section} className="settings-section">
          <h4 className="collapsible" onClick={() => toggleSection(section)}>
            {section} {openSections[section] ? "▲" : "▼"}
          </h4>
          {openSections[section] && (
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
          )}
        </div>
      ))}
      <a href={filament.buyLink} target="_blank" rel="noreferrer">
        Kup ten filament
      </a>
      <h3>Twoje notatki:</h3>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <button onClick={saveNote}>Zapisz</button>
    </div>
  );
}

export default FilamentDetail;
