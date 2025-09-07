import React, { useEffect, useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [filaments, setFilaments] = useState([]);
  const [search, setSearch] = useState("");
  // selectedTags: Array of objects like { group: "Color", tag: "Red" }
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => setFilaments(data));
  }, []);

  // Group selectedTags by group.
  const selectedByGroup = selectedTags.reduce((acc, { group, tag }) => {
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  const filtered = filaments.filter((filament) => {
    const matchSearch = filament.name.toLowerCase().includes(search.toLowerCase());
    // For each group filter, filament must have at least one of the tags in that group.
    const matchTags = Object.entries(selectedByGroup).every(([group, filterTags]) => {
      if (!filament.tags || !filament.tags[group]) return false;
      return filterTags.some((tag) => filament.tags[group].includes(tag));
    });

    // Only apply tag filtering if some tags are selected.
    return matchSearch && (Object.keys(selectedByGroup).length > 0 ? matchTags : true);
  });

  // Build groupedTags for the SearchBar component.
  const groupedTags = filaments.reduce((acc, filament) => {
    Object.entries(filament.tags || {}).forEach(([group, tags]) => {
      if (!acc[group]) acc[group] = new Set();
      tags.forEach((tag) => acc[group].add(tag));
    });
    return acc;
  }, {});

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
