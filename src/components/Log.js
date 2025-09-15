import { formatRelativeDate } from "../utils/date";

function Log({ id, quantity, time, filaments }) {
  const filament = filaments.find((f) => f.id === id);
  const name = filament ? filament.name : `id: ${id}`;

  const formattedTime = formatRelativeDate(time);

  return (
    <div className="log">
      <h5 className={quantity < 0 ? "minus" : "plus"}>{quantity}g</h5>
      <small>{name}</small>
      <small className="date">{formattedTime}</small>
    </div>
  );
}

export default Log;
