import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FilamentDetail from "./pages/FilamentDetail";
import Header from "./components/Header";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filament/:id" element={<FilamentDetail />} />
      </Routes>
    </div>
  );
}

export default App;
