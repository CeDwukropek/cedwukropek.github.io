import React from "react";
import { Link } from "react-router-dom";


function FilamentCard({ filament }) {
  const temperature =
    filament.settings?.["Printer Settings"]?.temperature || "";
  const bedTemperature =
    filament.settings?.["Printer Settings"]?.bed || "";

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
        sortedTags = sortedTags.concat(
          tags.map((tag) => ({ group, tag }))
        );
      }
    });
  }

  return (
    <div className="card">
      <h3>
        <Link to={`/filament/${filament.id}`}>{filament.name}</Link>
      </h3>
      {temperature && (
        <div className="temperature">
          {temperature} / {bedTemperature}
        </div>
      )}
      <div className="tags">
        {sortedTags.map(({ group, tag }) => (
          <span key={`${group}-${tag}`} className={`tag ${group}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FilamentCard;
