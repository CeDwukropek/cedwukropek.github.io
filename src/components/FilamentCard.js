import React from "react";
import { Link } from "react-router-dom";

function FilamentCard({ filament }) {
  return (
    <div className="card">
      <h3><Link to={`/filament/${filament.id}`}>{filament.name}</Link></h3>
      <p>Typ: {filament.type} | Kolor: {filament.color}</p>
      <div className="tags">
        {filament.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default FilamentCard;
