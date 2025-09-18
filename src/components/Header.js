import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

function Header({ darkMode, setDarkMode }) {
  return (
    <header>
      <Link to="/">
        <h1>
          📦 <span className="header">Biblioteka Filamentów</span>
        </h1>
      </Link>
      <DarkModeToggle
        isDarkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
    </header>
  );
}

export default Header;
