import React, { useState, useRef, useEffect } from "react";

function SearchBar({ search, setSearch, selectedTags, setSelectedTags, groupedTags }) {
  const [openGroup, setOpenGroup] = useState(null);
  const containerRef = useRef(null);
  // Wyczyść wszystkie filtry
  const clearAll = () => {
    setSelectedTags([]);
  };

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  // Toggle dla grupy (jeśli coś zaznaczone -> usuń, jeśli nic -> włącz wszystkie)
  const toggleGroupSelection = (groupName, groupTags) => {
    const selectedInGroup = selectedTags.filter((t) => t.group === groupName);
    if (selectedInGroup.length > 0) {
      // coś zaznaczone → czyścimy grupę
      setSelectedTags(selectedTags.filter((t) => t.group !== groupName));
    } else {
      // nic zaznaczone → zaznaczamy wszystkie
      const newSelections = [...groupTags].map((tag) => ({ group: groupName, tag }));
      setSelectedTags([...selectedTags, ...newSelections]);
    }
  };
  const handleTagToggle = (groupName, tag) => {
    // Check if the tag from this group is already selected.
    const exists = selectedTags.some(
      (t) => t.group === groupName && t.tag === tag
    );
    if (exists) {
      setSelectedTags(selectedTags.filter((t) => !(t.group === groupName && t.tag === tag)));
    } else {
      setSelectedTags([...selectedTags, { group: groupName, tag }]);
    }
  };

  // Zamknij dropdown po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render dropdowna dla każdej grupy
  const renderTagGroup = (groupName, groupTags) => {
    if (!groupTags || groupTags.size === 0) return null;
    // Calculate how many filters are selected in the current group.
    const count = selectedTags.filter((t) => t.group === groupName).length;
    return (
      <div key={groupName} className="dropdown-group">
        <button
          className={`dropdown-toggle ${openGroup === groupName ? "open" : ""}`}
          onClick={() => toggleGroup(groupName)}
        >
          {groupName}
          {count > 0 && (
            <span className="selected-count">
              {count}
            </span>
          )}
        </button>

        {openGroup === groupName && (
          <div className="dropdown-content">
            {[...groupTags].map((tag) => (
              <label key={tag} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedTags.some((t) => t.group === groupName && t.tag === tag)}
                  onChange={() => handleTagToggle(groupName, tag)}
                />
                {tag}
              </label>
            ))}
            <button
              className="toggle-group-btn"
              onClick={(e) => {
                e.stopPropagation(); // nie zamykaj dropdownu
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
        {Object.entries(groupedTags).map(([groupName, groupTags]) =>
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
