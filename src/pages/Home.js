import React, { useEffect, useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [filaments, setFilaments] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch("/filaments.json")
      .then((res) => res.json())
      .then((data) => {
        setFilaments(data);
        // wyciągamy unikalne tagi
        const tags = [...new Set(data.flatMap((f) => f.tags))];
        setAllTags(tags);
      });
  }, []);

  const filtered = filaments.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = tag ? f.tags.includes(tag) : true;
    return matchSearch && matchTag;
  });

  return (
    <div className="container">
      <SearchBar
        search={search}
        setSearch={setSearch}
        tag={tag}
        setTag={setTag}
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
