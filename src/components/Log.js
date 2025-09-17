import { formatRelativeDate } from "../utils/date";
import { db } from "../config/firebase";
import { updateDoc, doc, increment, getDoc } from "firebase/firestore";
import DeleteModal from "./DeleteModal.js";
import { useState, useRef } from "react";
import "./Logs.css";

/**
 * Log component displays a single log entry with details about filament usage and print status.
 * It also includes functionality for managing print timers and handling log deletion.
 * @param {object} log - The log object containing data like quantity, time, status, etc.
 * @param {array} filaments - A list of filament objects to find the corresponding filament name.
 */
function Log({ log, filaments }) {
  // State to control the visibility of the delete modal
  const [showModal, setShowModal] = useState(false);
  // State to store the remaining time for the print timer
  const [remaining, setRemaining] = useState(null);
  // Ref to store the interval ID for the timer
  const intervalRef = useRef(null);

  // Find the corresponding filament name based on log's filamentID
  const filament = filaments.find((f) => f.id === log.filamentID);
  const name = filament ? filament.name : `id: ${log.filamentId}`;
  const formattedTime = formatRelativeDate(log.time);

  /**
   * Parses a time string (e.g., "1h 20m 5s") into total seconds.
   * @param {string} timeStr - The time string to parse.
   * @returns {number} The total time in seconds.
   */
  const parseTime = (timeStr) => {
    const match = timeStr?.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/);
    if (!match) return 0;

    const h = parseInt(match[1] || "0", 10);
    const m = parseInt(match[2] || "0", 10);
    const s = parseInt(match[3] || "0", 10);

    return h * 3600 + m * 60 + s;
  };

  /**
   * Formats a time value in seconds into a human-readable string (e.g., "1h 20m 5s").
   * @param {number} seconds - The time in seconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (seconds) => {
    if (seconds === null) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
  };

  /**
   * Starts a new timer interval, clearing any previous one.
   * Decrements the `remaining` state every second.
   */
  const runInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          finishTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Handles starting the print timer from scratch.
   * Updates the log status to "printing" and sets initial time and progress.
   */
  const startTimer = async () => {
    const total = parseTime(log.estimated_time);
    setRemaining(total);

    await updateDoc(doc(db, "logs", log.id), {
      status: "printing",
      remaining_time: total,
      progress: 0,
    });

    runInterval();
  };

  /**
   * Handles continuing a paused timer.
   * Updates the log status to "printing" and resumes the timer.
   */
  const continueTimer = async () => {
    await updateDoc(doc(db, "logs", log.id), {
      status: "printing",
    });
    runInterval();
  };

  /**
   * Handles stopping the print timer.
   * Clears the interval and updates the log status to "stopped" with current progress.
   */
  const stopTimer = async () => {
    clearInterval(intervalRef.current);
    await updateDoc(doc(db, "logs", log.id), {
      status: "stopped",
      remaining_time: remaining,
      progress: Math.round(
        ((parseTime(log.estimated_time) - remaining) /
          parseTime(log.estimated_time)) *
          100
      ),
    });
  };

  /**
   * Handles a print failure.
   * Recalculates filament usage based on elapsed time and restores the unused portion.
   * Updates the log status to "failed".
   */
  const failTimer = async () => {
    clearInterval(intervalRef.current);

    const elapsed = parseTime(log.estimated_time) - remaining;
    const percent = elapsed / parseTime(log.estimated_time);

    const logRef = doc(db, "logs", log.id);
    const logSnap = await getDoc(logRef);
    const logData = logSnap.data();

    const filamentRef = doc(db, "filaments", logData.filamentID);
    const usedQuantity = (Math.abs(logData.quantity) * percent).toFixed(2);
    const recoveredQuantity = Math.abs(logData.quantity) - usedQuantity;

    // Restore the unused filament quantity
    await updateDoc(filamentRef, {
      quantity: increment(recoveredQuantity),
    });

    // Update the log with the actual used quantity and "failed" status
    await updateDoc(logRef, {
      status: "failed",
      progress: Math.round(percent * 100),
      remaining_time: 0,
      quantity: -usedQuantity, // Store as negative to indicate usage
    });
  };

  /**
   * Handles the successful completion of a print.
   * Updates the log status to "finished" with 100% progress.
   */
  const finishTimer = async () => {
    await updateDoc(doc(db, "logs", log.id), {
      status: "finished",
      progress: 100,
      remaining_time: 0,
    });
  };

  /**
   * Handles the deletion/editing of a log.
   * Splits the log quantity into "successful" and "failed" parts based on a percentage.
   * Restores the "successful" portion to the filament stock and updates the log with the "failed" part.
   * @param {number} percent - The percentage of the print that was successful.
   */
  const handleDeleteLog = async (percent) => {
    // Calculate successful and failed quantities
    const successful = ((Math.abs(log.quantity) * percent) / 100).toFixed(2);
    const failed = Math.abs(log.quantity) - successful;

    try {
      const filamentRef = doc(db, "filaments", log.filamentID);
      const logRef = doc(db, "logs", log.id);

      // Add successful quantity back to filament stock
      await updateDoc(filamentRef, {
        quantity: increment(successful),
      });

      // Update the log with the failed quantity
      await updateDoc(logRef, {
        quantity: increment(failed),
      });
    } catch (err) {
      console.error("Błąd przy usuwaniu logu:", err);
    }
    setShowModal(false);
  };

  return (
    <div className="log">
      {/* Display filament quantity with appropriate class for plus/minus */}
      <small className={log.quantity < 0 ? "minus header" : "plus header"}>
        {log.quantity}g
      </small>
      {/* Display filament name */}
      <small>{name}</small>
      {/* Display formatted log time */}
      <small className="date">{formattedTime}</small>

      {/* Container for log item details and timer controls */}
      <div className="log-card">
        {/* Display print status */}
        <small style={{ color: "var(--text-50)" }}>
          Status: <span className={log.status}>{log.status}</span>
        </small>

        {/* Display estimated time if status is "sliced" */}
        {log.status === "sliced" && (
          <>
            <br></br>
            <small className="text-50">
              Szacowany czas: <span className="text">{log.estimated_time}</span>
            </small>
          </>
        )}

        {/* Display remaining time if status is "printing" */}
        {(log.status === "printing" || log.status === "stopped") &&
          remaining !== null && (
            <>
              <br></br>
              <small className="text-50">
                Pozostało: <span className="text">{formatTime(remaining)}</span>
              </small>
            </>
          )}

        {/* Timer controls based on log status */}
        {log.status === "sliced" && (
          <>
            <br></br>
            <button onClick={startTimer} style={{ color: "var(--accent)" }}>
              <small>Start Timer</small>
            </button>
          </>
        )}
        {log.status === "printing" && (
          <>
            <br></br>
            <button
              onClick={stopTimer}
              style={{ color: "var(--quantity-medium)" }}
            >
              <small>Stop Timer</small>
            </button>
          </>
        )}
        {log.status === "stopped" && (
          <>
            <br></br>
            <button
              onClick={continueTimer}
              style={{ color: "var(--quantity-high)", marginRight: "0.5rem" }}
            >
              <small>Continue</small>
            </button>
            <button
              onClick={failTimer}
              style={{ color: "var(--quantity-low)" }}
            >
              <small>Failed</small>
            </button>
          </>
        )}
      </div>

      {/* "Edit" button to show the delete modal */}
      {!showModal &&
        log.status !== "printing" &&
        log.status !== "sliced" &&
        log.status !== "stopped" && (
          <button className="edit-button" onClick={() => setShowModal(true)}>
            <small>edytuj</small>
          </button>
        )}

      {/* Delete modal component */}
      {showModal && (
        <DeleteModal
          onConfirm={(percent) => handleDeleteLog(percent)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Log;
