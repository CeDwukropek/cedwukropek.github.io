import { useState } from "react";
import FilamentCard from "../components/FilamentCard";
import SearchBar from "../components/SearchBar";
import { useFilaments } from "../hooks/useFilaments";
import { useLogs } from "../hooks/useLogs";
import Logs from "../components/Logs";

function Home() {
  // Get filament data from the hook
  const { filaments } = useFilaments();
  // Get logs data from the hook
  const { logs } = useLogs();
  // Search query
  const [search, setSearch] = useState("");
  // Selected tags for filtering
  const [selectedTags, setSelectedTags] = useState([]);

  const selectedByGroup = selectedTags.reduce((acc, { group, tag }) => {
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  const filtered = filaments.filter((filament) => {
    const matchSearch = filament.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchTags = Object.entries(selectedByGroup).every(
      ([group, filterTags]) => {
        if (!filament.tags || !filament.tags[group]) return false;
        return filterTags.some((tag) => filament.tags[group].includes(tag));
      }
    );

    return (
      matchSearch &&
      (Object.keys(selectedByGroup).length > 0 ? matchTags : true)
    );
  });

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
      <div className="container inline">
        <div className="grid">
          {filtered.map((f) => (
            <FilamentCard key={f.id} filament={f} />
          ))}
        </div>
        <Logs data={logs} filaments={filaments} />
      </div>
    </div>
  );
}

export default Home;
