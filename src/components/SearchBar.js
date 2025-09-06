import React from "react";

function SearchBar({ search, setSearch, selectedTags, setSelectedTags, allTags }) {
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Szukaj filamentu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="tag-filter">
        {allTags.sort().map((tag) => (
          <button
            key={tag}
            className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
