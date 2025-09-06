import React from "react";

function SearchBar({ search, setSearch, tag, setTag, allTags }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Szukaj filamentu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">-- Filtruj po tagu --</option>
        {allTags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
