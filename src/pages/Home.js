import React, { useEffect, useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";
import { tagGroupMapping } from "../utils/tagGroupMapping";

function Home() {
  const [filaments, setFilaments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => setFilaments(data));
  }, []);

  // Updated filtering logic
  const filtered = filaments.filter((filament) => {
    const matchSearch = filament.name.toLowerCase().includes(search.toLowerCase());

    // Create a mapping for filament tags (by group based on our mapping)
    // We assume filament.tags is an object: { groupName: [tag1, tag2, ...] }
    const filamentTagsByGroup = {};
    Object.entries(filament.tags || {}).forEach(([group, tags]) => {
      filamentTagsByGroup[group] = new Set(tags);
    });

    // Group the selected tags by their group (using the same tagGroupMapping)
    const selectedByGroup = {};
    selectedTags.forEach((tag) => {
      const group = tagGroupMapping[tag];
      if (group) {
        if (!selectedByGroup[group]) selectedByGroup[group] = [];
        selectedByGroup[group].push(tag);
      }
    });

    // For each group in which a filter is selected, the filament must match AT LEAST ONE tag.
    const matchTags = Object.entries(selectedByGroup).every(([group, tags]) => {
      const filamentSet = filamentTagsByGroup[group];
      return filamentSet ? tags.some((t) => filamentSet.has(t)) : false;
    });

    return matchSearch && matchTags;
  });

  // For the SearchBar, you can rebuild your groupedTags as before (if needed)...
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
