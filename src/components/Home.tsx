import { QUESTION_OPTIONS, type QuestionCount } from "../lib/game";
import LogoMark from "./shared/LogoMark";

export default function HomeScreen({ selected, onSelect, onStart }: { selected: QuestionCount; onSelect: (n: QuestionCount) => void; onStart: () => void }) {
  return (
    <div className="home">
      {/* DotBackground is provided by a parent */}
      <div className="home-inner">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
          <div className="logo-row">
            <LogoMark />
            <h1 className="title-text">Guess the Flag</h1>
          </div>
          <div className="title-underline">
            <div className="bar small" />
            <div className="bar large" />
            <div className="bar small" />
          </div>
          <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>How well do you know the world's flags?</p>
        </div>

        <div className="card">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280" }}>Number of Questions</span>
            <div className="options-row">
              {QUESTION_OPTIONS.map((n) => {
                const active = selected === n;
                return (
                  <button
                    key={n}
                    onClick={() => onSelect(n)}
                    className="option-button"
                    style={{
                      border: active ? "2px solid var(--accent)" : "2px solid #E5E7EB",
                      background: active ? "var(--accent)" : "#fff",
                      color: active ? "#fff" : "#6B7280",
                      boxShadow: active ? "0 2px 10px rgba(37,99,235,0.28)" : "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    {n === 195 ? "All" : n}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: 0 }}>{selected === 195 ? "All 195 countries" : `${selected} randomly selected`} · 12 s per question</p>
          </div>

          <button onClick={onStart} className="btn btn-primary">Start Game</button>
        </div>

        <p style={{ fontSize: 11, color: "#9CA3AF", opacity: 0.7 }}>195 sovereign nations · updated 2024</p>
      </div>
    </div>
  );
}
