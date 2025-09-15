import { formatRelativeDate } from "../utils/date";
import "./Logs.css";

function Log({ id, quantity, time, filaments }) {
  const filament = filaments.find((f) => f.id === id);
  const name = filament ? filament.name : `id: ${id}`;
  const formattedTime = formatRelativeDate(time);

  return (
    <div className="log">
      <small className={quantity < 0 ? "minus bold" : "plus bold"}>
        {quantity}g
      </small>
      <small>{name}</small>
      <small className="date">{formattedTime}</small>
    </div>
  );
}

export default Log;
