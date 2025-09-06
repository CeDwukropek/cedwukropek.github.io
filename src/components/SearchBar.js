import React, { useState, useRef, useEffect } from "react";

// Define groups of tags. Adjust the tags in each group per your needs.
const tagGroups = {
  "Material": ["PLA"],
  "Type": ["Basic"],
  "Brand": ["Anycubic", "Plexwire"],
  "Color": ["White", "Gray", "Black", "Czerwony", "Zielony", "Błekitny"],
  "Features": ["Ironing", "No-Ironing", "Shiny", "Test"]
};

function SearchBar({ search, setSearch, selectedTags, setSelectedTags, allTags }) {
  // Track only one open group at a time
  const [openGroup, setOpenGroup] = useState(null);
  const containerRef = useRef(null);

  const toggleGroup = (groupName) => {
    if (openGroup === groupName) {
      setOpenGroup(null);
    } else {
      setOpenGroup(groupName);
    }
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Detect clicks outside the dropdown container and close any open dropdown.
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

  // Render a dropdown for each tag group.
  const renderTagGroup = (groupName, groupTags) => {
    const availableTags = groupTags.filter((tag) => allTags.includes(tag));
    if (availableTags.length === 0) return null;
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
            {availableTags.map((tag) => (
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
        {Object.entries(tagGroups).map(([groupName, groupTags]) =>
          renderTagGroup(groupName, groupTags)
        )}
      </div>
    </div>
  );
}

export default SearchBar;
