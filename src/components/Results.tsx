import { type AnswerRecord } from "../lib/game";
import DotBackground from "./shared/DotBackground";
import { useEffect } from "react";

const completeAudio = typeof Audio !== 'undefined' ? new Audio('/sounds/complete.mp3') : null;


export default function ResultsScreen({ records, total, onPlayAgain, onChangeSettings }: { records: AnswerRecord[]; total: number; onPlayAgain: () => void; onChangeSettings: () => void; }) {
  useEffect(() => {
    try { completeAudio?.play(); } catch { /* ignore */ }
  }, []);
  const correct = records.filter((r) => r.correct).length;
  const incorrect = records.length - correct;
  const accuracy = Math.round((correct / records.length) * 100);
  const missed = records.filter((r) => !r.correct);

  function grade() {
    if (accuracy >= 90) return "Excellent!";
    if (accuracy >= 70) return "Well done!";
    if (accuracy >= 50) return "Not bad!";
    return "Keep practicing!";
  }

  return (
    <div className="results-wrap">
      <DotBackground />

      <div className="results-inner">
        <div className="score-panel">
          <span className="eyebrow">Final Score</span>
          <div className="score-value">
            <strong>{correct}</strong>
            <span>/ {total}</span>
          </div>
          <div className="title-underline">
            <div className="bar small" />
            <div className="bar large" />
            <div className="bar small" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--accent)", marginTop: 4 }}>{grade()}</span>
        </div>

        <div className="stats-grid">
          {[{ label: "Correct", value: correct, accent: "var(--success)", textColor: "#15803d" }, { label: "Incorrect", value: incorrect, accent: "var(--danger)", textColor: "#b91c1c" }, { label: "Accuracy", value: `${accuracy}%`, accent: "var(--accent)", textColor: "#1d4ed8" }].map(({ label, value, accent, textColor }) => (
            <div key={label} className="stat-card" style={{ borderTopColor: accent }}>
              <span className="stat-value" style={{ color: textColor }}>{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {missed.length > 0 && (
          <div className="stack">
            <span className="eyebrow">Missed Flags</span>
            <div className="missed-list">
              {missed.map((r, i) => (
                <div key={i} className="missed-row">
                  <div className="missed-flag">
                    <img src={`https://flagcdn.com/w640/${r.question.correct.code}.png`} alt={r.question.correct.name} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="missed-title">{r.question.correct.name}</div>
                    <div className="missed-subtitle">{r.chosen && r.chosen !== "__timeout__" ? `You said: ${r.chosen}` : "Time ran out"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button onClick={onPlayAgain} className="btn btn-primary">Play Again</button>
          <button onClick={onChangeSettings} className="btn btn-secondary">Change Settings</button>
        </div>

        <p className="results-footer">195 sovereign nations · updated 2024</p>
      </div>
    </div>
  );
}
