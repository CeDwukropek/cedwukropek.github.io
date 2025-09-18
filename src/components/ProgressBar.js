import "./ProgressBar.css";
// ProgressBar.jsx
export default function ProgressBar({ progress }) {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
