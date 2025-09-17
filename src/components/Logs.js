import { useState, useEffect } from "react";
import Log from "./Log";
import "./Logs.css";

function Logs({ data, filaments }) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // Responsywne wykrywanie
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (isMobile) {
    return (
      <div>
        {/* FAB */}
        <button className="fab" onClick={() => setOpen(!open)}>
          {open ? "✖" : "📜"}
        </button>

        {open && (
          <div className="logsDropdown">
            {data.map((el) => (
              <Log key={el.id} log={el} filaments={filaments} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className="logsSidebar">
      <h4>Logi</h4>
      {data.map((el) => (
        <Log key={el.id} log={el} filaments={filaments} />
      ))}
    </div>
  );
}

export default Logs;
