import { formatRelativeDate } from "../utils/date";
import { db } from "../config/firebase";
import { updateDoc, doc, increment } from "firebase/firestore";
import DeleteModal from "./DeleteModal.js";
import { useState } from "react";

function Log({ logId, filamentId, quantity, time, filaments }) {
  const [showModal, setShowModal] = useState(false);

  const filament = filaments.find((f) => f.id === filamentId);
  const name = filament ? filament.name : `id: ${filamentId}`;

  const formattedTime = formatRelativeDate(time);

  const handleDeleteLog = async (percent, filamentID, logID) => {
    // obliczanie części poprawnej i nieudanej
    quantity = Math.abs(quantity);
    const successful = ((quantity * percent) / 100).toFixed(2);
    const failed = quantity - successful;

    try {
      // 1. add successful quantity to filament
      const filamentRef = doc(db, "filaments", filamentID);
      const logRef = doc(db, "logs", logID);

      await updateDoc(filamentRef, {
        quantity: increment(successful),
      });

      await updateDoc(logRef, {
        quantity: increment(failed),
      });
    } catch (err) {
      console.error("Błąd przy usuwaniu logu:", err);
    }
  };

  return (
    <div className="log">
      <small className={quantity < 0 ? "minus" : "plus"}>{quantity}g</small>
      <small>{name}</small>
      <small className="date">{formattedTime}</small>
      {!showModal && (
        <button className="edit-button" onClick={() => setShowModal(true)}>
          <small>edytuj</small>
        </button>
      )}
      {showModal && (
        <DeleteModal
          onConfirm={(percent) => handleDeleteLog(percent, filamentId, logId)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Log;
