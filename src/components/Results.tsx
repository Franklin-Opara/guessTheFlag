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
      <div aria-hidden style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 90% 40% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <div className="results-inner">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Final Score</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, lineHeight: 1 }}>
            <span style={{ fontSize: 96, fontWeight: 900, color: '#111827', letterSpacing: '-0.05em', lineHeight: 1 }}>{correct}</span>
            <span style={{ fontSize: 40, fontWeight: 500, color: '#9CA3AF', marginBottom: 10 }}>/ {total}</span>
          </div>
          <div className="title-underline">
            <div className="bar small" />
            <div className="bar large" />
            <div className="bar small" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>{grade()}</span>
        </div>

        <div className="stats-grid">
          {[{ label: 'Correct', value: correct, accent: '#16A34A', textColor: '#15803D' }, { label: 'Incorrect', value: incorrect, accent: '#DC2626', textColor: '#B91C1C' }, { label: 'Accuracy', value: `${accuracy}%`, accent: '#2563EB', textColor: '#1D4ED8' }].map(({ label, value, accent, textColor }) => (
            <div key={label} className="stat-card" style={{ borderTop: `3px solid ${accent}` }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: textColor, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.03em' }}>{label}</span>
            </div>
          ))}
        </div>

        {missed.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Missed Flags</span>
            <div className="missed-list">
              {missed.map((r, i) => (
                <div key={i} className="missed-row" style={{ borderBottom: i < missed.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <div className="missed-flag">
                    <img src={`https://flagcdn.com/w640/${r.question.correct.code}.png`} alt={r.question.correct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.question.correct.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.chosen && r.chosen !== '__timeout__' ? `You said: ${r.chosen}` : 'Time ran out'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onPlayAgain} className="btn btn-primary">Play Again</button>
          <button onClick={onChangeSettings} className="btn-outline">Change Settings</button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', opacity: 0.6 }}>195 sovereign nations · updated 2024</p>
      </div>
    </div>
  );
}
