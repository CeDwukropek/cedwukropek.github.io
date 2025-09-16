import { useState } from "react";
import "./DeleteModal.css";

function DeleteModal({ onConfirm, onClose }) {
  const [percent, setPercent] = useState(0);

  const handleSubmit = () => {
    if (percent >= 0 && percent <= 100) {
      onConfirm(percent);
      onClose();
    } else {
      alert("Podaj wartość od 0 do 100");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h5>Ile % wydruku się udało?</h5>
        <input
          type="number"
          min="0"
          max="100"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>
            <small className="cancel">Anuluj</small>
          </button>
          <button onClick={handleSubmit}>
            <small className="accept">OK</small>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
