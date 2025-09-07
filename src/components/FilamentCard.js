import React from "react";
import { Link } from "react-router-dom";
import { tagGroupMapping } from "../utils/tagGroupMapping";


function FilamentCard({ filament }) {
  // Group tags by group based on the mapping.
  const groupedTags = (filament.tags || []).reduce((acc, tag) => {
    const group = tagGroupMapping[tag] || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  // Define the desired order for groups.
  const groupOrder = ["material", "type", "brand", "color", "features", "other"];

  // Extract the temperature from the settings.
  const temperature =
    filament.settings &&
    filament.settings["Printer Settings"] &&
    filament.settings["Printer Settings"].temperature;

  const bedTemperature =
    filament.settings &&
    filament.settings["Printer Settings"] &&
    filament.settings["Printer Settings"].bed;

  return (
    <div className="card">
      <h3>
        <Link to={`/filament/${filament.id}`}>{filament.name}</Link>
      </h3>
      {temperature && (
        <div className="temperature">
          {temperature}/{bedTemperature}
        </div>
      )}
      <div className="tags">
        {groupOrder.map(
          (group) =>
            groupedTags[group] &&
            groupedTags[group].map((tag) => (
              <span key={tag} className={`tag ${group}`}>
                {tag}
              </span>
            ))
        )}
      </div>
    </div>
  );
}

export default FilamentCard;
