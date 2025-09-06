import React from "react";
import { Link } from "react-router-dom";

function Header({ darkMode, setDarkMode }) {
  return (
    <header>
      <Link to="/"><h1>📦 Moja Biblioteka Filamentów</h1></Link>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Jasny tryb" : "🌙 Ciemny tryb"}
      </button>
    </header>
  );
}

export default Header;
