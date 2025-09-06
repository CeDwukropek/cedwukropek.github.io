import React, { useEffect, useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [filaments, setFilaments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => setFilaments(data));
  }, []);

  // 🔹 Automatycznie grupujemy wszystkie tagi
  const groupedTags = filaments.reduce((acc, filament) => {
    Object.entries(filament.tags || {}).forEach(([group, tags]) => {
      if (!acc[group]) acc[group] = new Set();
      tags.forEach((tag) => acc[group].add(tag));
    });
    return acc;
  }, {});

  // 🔹 Filtrowanie filamentów
  const filtered = filaments.filter((filament) => {
    const matchSearch = filament.name.toLowerCase().includes(search.toLowerCase());

    const filamentTags = Object.values(filament.tags || {}).flat();
    const matchTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => filamentTags.includes(tag))
        : true;

    return matchSearch && matchTags;
  });

  return (
    <div className="container">
      <SearchBar
        search={search}
        setSearch={setSearch}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        groupedTags={groupedTags}
      />

      <div className="grid">
        {filtered.map((f) => (
          <FilamentCard key={f.id} filament={f} />
        ))}
      </div>
    </div>
  );
}

export default Home;
