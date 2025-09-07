import React, { useEffect, useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [filaments, setFilaments] = useState([]);
  const [search, setSearch] = useState("");
  // change from single tag to multiple selectedTags
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => {
        setFilaments(data);
        // extract unique tags
        const tags = [...new Set(data.flatMap((f) => f.tags))];
        setAllTags(tags);
      });
  }, []);

  // Adjust filtering if switching to multiple tag filtering.
  const filtered = filaments.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    // if any tags are selected, filament must include all selected tags
    const matchTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => f.tags.includes(tag))
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
        allTags={allTags}
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
