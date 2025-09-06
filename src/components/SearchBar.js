import React, { useState, useRef, useEffect } from "react";

function SearchBar({ search, setSearch, selectedTags, setSelectedTags, allTags }) {
  // Track only one open group at a time
  const [openGroup, setOpenGroup] = useState(null);
  const containerRef = useRef(null);

  const toggleGroup = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
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
    return (
      <div key={groupName} className="dropdown-group">
        <button
          className={`dropdown-toggle ${openGroup === groupName ? "open" : ""}`}
          onClick={() => toggleGroup(groupName)}
        >
          {groupName}
        </button>
        {openGroup === groupName && (
          <div className="dropdown-content">
            {[...groupTags].map((tag) => (
              <label key={tag} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                {tag}
              </label>
            ))}
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
      </div>
    </div>
  );
}

export default SearchBar;
