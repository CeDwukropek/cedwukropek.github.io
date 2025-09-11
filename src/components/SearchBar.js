import { useState, useRef, useEffect } from "react";

function SearchBar({
  search,
  setSearch,
  selectedTags,
  setSelectedTags,
  groupedTags,
}) {
  const [openGroup, setOpenGroup] = useState(null);
  const containerRef = useRef(null);

  // constant group order
  const GROUP_ORDER = ["material", "brand", "type", "color", "features"];

  // clear all filters
  const clearAll = () => {
    setSelectedTags([]);
  };

  // toggle dropdown group
  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  // toggle select/deselect all in group
  const toggleGroupSelection = (groupName, groupTags) => {
    const selectedInGroup = selectedTags.filter((t) => t.group === groupName);
    if (selectedInGroup.length > 0) {
      setSelectedTags(selectedTags.filter((t) => t.group !== groupName));
    } else {
      const newSelections = [...groupTags].map((tag) => ({
        group: groupName,
        tag,
      }));
      setSelectedTags([...selectedTags, ...newSelections]);
    }
  };

  // toggle individual tag
  const handleTagToggle = (groupName, tag) => {
    const exists = selectedTags.some(
      (t) => t.group === groupName && t.tag === tag
    );
    if (exists) {
      setSelectedTags(
        selectedTags.filter((t) => !(t.group === groupName && t.tag === tag))
      );
    } else {
      setSelectedTags([...selectedTags, { group: groupName, tag }]);
    }
  };

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // render a single tag group dropdown
  const renderTagGroup = (groupName, groupTags) => {
    if (!groupTags || groupTags.size === 0) return null;

    const count = selectedTags.filter((t) => t.group === groupName).length;

    // sorting tags alphabetically within the group
    const sortedTags = [...groupTags].sort((a, b) =>
      a.localeCompare(b, "pl", { sensitivity: "base" })
    );

    return (
      <div key={groupName} className="dropdown-group">
        <button
          className={`dropdown-toggle ${openGroup === groupName ? "open" : ""}`}
          onClick={() => toggleGroup(groupName)}
        >
          {groupName}
          {count > 0 && <span className="selected-count">{count}</span>}
        </button>

        {openGroup === groupName && (
          <div className="dropdown-content">
            {sortedTags.map((tag) => (
              <label key={tag} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedTags.some(
                    (t) => t.group === groupName && t.tag === tag
                  )}
                  onChange={() => handleTagToggle(groupName, tag)}
                />
                {tag}
              </label>
            ))}
            <button
              className="toggle-group-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroupSelection(groupName, groupTags);
              }}
            >
              {count > 0 ? "Wyczyść grupę" : "Zaznacz wszystkie"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- 🔑 Group Order logic ---
  const orderedGroups = [
    // 1. first the defined groups in constant order
    ...GROUP_ORDER.filter((g) => groupedTags[g]).map((g) => [
      g,
      groupedTags[g],
    ]),

    // 2. rest of the groups, sorded alphabetically
    ...Object.entries(groupedTags)
      .filter(([g]) => !GROUP_ORDER.includes(g))
      .sort(([a], [b]) => a.localeCompare(b, "pl", { sensitivity: "base" })),
  ];

  return (
    <div ref={containerRef} className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Szukaj filamentu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="dropdown-filter">
        {orderedGroups.map(([groupName, groupTags]) =>
          renderTagGroup(groupName, groupTags)
        )}
        <div className="filters-header">
          <button className="clear-all-btn" onClick={clearAll}>
            Wyczyść filtry
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
