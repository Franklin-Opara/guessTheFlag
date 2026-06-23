import { QUESTION_OPTIONS, type QuestionCount } from "../lib/game";
import LogoMark from "./shared/LogoMark";

export default function HomeScreen({ selected, onSelect, onStart }: { selected: QuestionCount; onSelect: (n: QuestionCount) => void; onStart: () => void }) {
  return (
    <div className="home">
      <div className="home-inner">
        <div className="brand-stack">
          <div className="brand-row">
            <LogoMark />
            <h1 className="brand-title">Guess the Flag</h1>
          </div>
          <div className="title-underline">
            <div className="bar small" />
            <div className="bar large" />
            <div className="bar small" />
          </div>
          <p className="brand-tagline">How well do you know the world's flags?</p>
        </div>

        <div className="card">
          <div className="section-stack">
            <span className="section-label">Number of Questions</span>
            <div className="options-row">
              {QUESTION_OPTIONS.map((n) => {
                const active = selected === n;
                return (
                  <button
                    key={n}
                    onClick={() => onSelect(n)}
                    className={`option-button ${active ? "is-active" : ""}`}
                  >
                    {n === 195 ? "All" : n}
                  </button>
                );
              })}
            </div>
            <p className="helper-text">{selected === 195 ? "All 195 countries" : `${selected} randomly selected`} · 12 s per question</p>
          </div>

          <button onClick={onStart} className="btn btn-primary">Start Game</button>
        </div>

        <p className="results-footer">195 sovereign nations · updated 2024</p>
      </div>
    </div>
  );
}
