import { formatRelativeDate } from "../utils/date";
import { db } from "../config/firebase";
import { updateDoc, doc, increment } from "firebase/firestore";

function Log({ logId, filamentId, quantity, time, filaments }) {
  const filament = filaments.find((f) => f.id === filamentId);
  const name = filament ? filament.name : `id: ${filamentId}`;

  console.log("filament :>> ", filament);
  console.log("log :>> ", logId);

  const formattedTime = formatRelativeDate(time);

  const handleDeleteLog = async (filamentID, logID) => {
    const failed = handleDelete();
    try {
      // 1. add successful quantity to filament
      const filamentRef = doc(db, "filaments", filamentID);
      const logRef = doc(db, "logs", logID);

      await updateDoc(filamentRef, {
        quantity: increment(-failed),
      });

      await updateDoc(logRef, {
        quantity: increment(-failed),
      });
    } catch (err) {
      console.error("Błąd przy usuwaniu logu:", err);
    }
  };

  const handleDelete = () => {
    let percent = prompt("Ile % wydruku się udało? (0-100)", "0");

    if (percent === null) return; // kliknięto Anuluj
    percent = parseInt(percent);

    if (isNaN(percent) || percent < 0 || percent > 100) {
      alert("Podaj poprawną wartość od 0 do 100.");
      return;
    }

    // obliczanie części poprawnej i nieudanej
    const successful = Math.round((quantity * percent) / 100);
    const failed = quantity - successful;

    return failed;
  };

  return (
    <div className="log">
      <small className={quantity < 0 ? "minus" : "plus"}>{quantity}g</small>
      <small>{name}</small>
      <small className="date">{formattedTime}</small>
      <button
        className="delete-button"
        onClick={() => handleDeleteLog(filamentId, logId)}
      >
        <small>usuń</small>
      </button>
    </div>
  );
}

export default Log;
