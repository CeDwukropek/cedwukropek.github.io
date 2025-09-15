import { formatRelativeDate } from "../utils/date";
import { db } from "../config/firebase";
import { collection, updateDoc, doc } from "firebase/firestore";

function Log({ id, quantity, time, filaments }) {
  const filament = filaments.find((f) => f.id === id);
  const name = filament ? filament.name : `id: ${id}`;

  const formattedTime = formatRelativeDate(time);

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

    // TODO firebase db update

    // przekazanie do Home.js → tam aktualizujemy logi i filaments
  };

  return (
    <div className="log">
      <small className={quantity < 0 ? "minus" : "plus"}>{quantity}g</small>
      <small>{name}</small>
      <small className="date">{formattedTime}</small>
      <button className="delete-button" onClick={handleDelete}>
        usuń
      </button>
    </div>
  );
}

export default Log;
