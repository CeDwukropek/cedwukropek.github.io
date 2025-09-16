import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./FilamentDetails.css";
import { useFilament } from "../hooks/useFilaments";
import FilamentUsageChart from "../components/FilamentUsageChart";
import { useLogs } from "../hooks/useLogs"; // przykład

function FilamentDetail() {
  const { id } = useParams();
  const { logs } = useLogs(); // pobieramy logi globalnie
  const [copied, setCopied] = useState(null);
  const { filament, note, setNote, openSections, setOpenSections } =
    useFilament(id);

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

  // Kolejność wyświetlania ustawień (reszta w oryginalnej kolejności)
  const SETTINGS_ORDER = [
    "Filament Details",
    "Printer Settings",
    "Printing Speeds",
    "Retraction",
    "Ironing",
  ];

  // Przygotuj sekcje ustawień w odpowiedniej kolejności
  const orderedSettings = [];
  const seen = new Set();

  if (filament.settings) {
    // najpierw te zdefiniowane w SETTINGS_ORDER
    SETTINGS_ORDER.forEach((section) => {
      if (filament.settings[section]) {
        orderedSettings.push([section, filament.settings[section]]);
        seen.add(section);
      }
    });

    // potem wszystkie pozostałe w oryginalnej kolejności
    Object.entries(filament.settings).forEach(([section, settings]) => {
      if (!seen.has(section)) {
        orderedSettings.push([section, settings]);
      }
    });
  }

  // Kolejność tagów (zachowujemy Twój system)
  const groupOrder = ["material", "type", "brand", "color", "features"];
  let sortedTags = [];
  if (filament.tags) {
    groupOrder.forEach((group) => {
      if (filament.tags[group]) {
        sortedTags = sortedTags.concat(
          filament.tags[group].map((tag) => ({ group, tag }))
        );
      }
    });
    Object.entries(filament.tags).forEach(([group, tags]) => {
      if (!groupOrder.includes(group)) {
        sortedTags = sortedTags.concat(tags.map((tag) => ({ group, tag })));
      }
    });
  }

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        ← Powrót
      </Link>

      <h2 className="filament-name">{filament.name}</h2>

      <div className="tags-container">
        {sortedTags.map(({ group, tag }) => (
          <span key={`${group}-${tag}`} className={`tag ${group}`}>
            {tag}
          </span>
        ))}
      </div>

      <FilamentUsageChart filament={filament} logs={logs} />

      <div className="info-grid">
        <p>
          <b>Typ:</b> {sortedTags[0]?.tag} {sortedTags[1]?.tag}
        </p>
        <p>
          <b>Dostępność:</b>{" "}
          <span
            className={`quantity ${
              filament.quantity > 1000
                ? "superior"
                : filament.quantity >= 500
                ? "high"
                : filament.quantity >= 250
                ? "medium"
                : filament.quantity > 100
                ? "low"
                : "extremlyLow"
            }`}
          >
            {filament.quantity}g
          </span>
        </p>
        <p>
          <b>Kolor: </b>
          {sortedTags[3]?.tag}
        </p>
      </div>

      <h3 className="section-title">Ustawienia druku:</h3>
      <div className="settings-grid">
        {orderedSettings.map(([section, settings]) => (
          <div key={section} className="settings-card">
            <h4
              className="collapsible-header"
              onClick={() => toggleSection(section)}
            >
              <span className="capitalize">{section}</span>
              <span>{openSections[section] ? "▲" : "▼"}</span>
            </h4>

            <div
              className={`collapsible-content ${
                openSections[section] ? "open" : ""
              }`}
            >
              <ul>
                {Object.entries(settings).map(([key, val]) => (
                  <li key={key} className="setting-item">
                    <span className="setting-key">{key}:</span>
                    <span
                      className="setting-value"
                      onClick={() => copyValue(key, val)}
                    >
                      {val}
                      {copied === key && (
                        <span className="tooltip">Skopiowano!</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="buy-link-container">
        <a href={filament.buyLink} target="_blank" rel="noreferrer">
          Kup ten filament
        </a>
      </div>

      <h3 className="section-title">Twoje notatki:</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="notes-textarea"
      />
      <button onClick={saveNote} className="save-button">
        Zapisz
      </button>
    </div>
  );
}

export default FilamentDetail;
