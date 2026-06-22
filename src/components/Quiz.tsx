import { useState, useEffect, useCallback, useRef } from "react";
import { TIMER_SECONDS, flagUrl } from "../lib/game";
import type { Question, AnswerRecord } from "../lib/game";

// audio files should be placed in public/sounds/
const correctAudio = typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null;
const wrongAudio = typeof Audio !== 'undefined' ? new Audio('/sounds/wrong.mp3') : null;
const tickingAudio = typeof Audio !== 'undefined' ? new Audio('/sounds/ticking.mp3') : null;
import DotBackground from "./shared/DotBackground";

export default function QuizScreen({ questions, onFinish }: { questions: Question[]; onFinish: (records: AnswerRecord[]) => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = questions[index];
  const answered = chosen !== null;

  const handleAnswer = useCallback(
    (name: string) => {
      if (answered) return;
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        tickingAudio?.pause();
        if (tickingAudio) tickingAudio.currentTime = 0;
      } catch {
        /* ignore */
      }
      setChosen(name);
      const isCorrect = name === current.correct.name;
      try {
        if (isCorrect) correctAudio?.play();
        else wrongAudio?.play();
      } catch {
        /* ignore */
      }
      const newScore = isCorrect ? score + 1 : score;
      const newRecords: AnswerRecord[] = [...records, { question: current, chosen: name, correct: isCorrect }];
      advanceRef.current = setTimeout(() => {
        if (index + 1 >= questions.length) {
          onFinish(newRecords);
        } else {
          setRecords(newRecords);
          setScore(newScore);
          setIndex((i) => i + 1);
          setChosen(null);
          setTimeLeft(TIMER_SECONDS);
        }
      }, 1100);
    },
    [answered, current, score, records, index, questions.length, onFinish]
  );

  useEffect(() => {
    // start ticking at the start of each question
  try { tickingAudio?.play(); } catch { /* ignore */ }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          const newRecords: AnswerRecord[] = [...records, { question: current, chosen: null, correct: false }];
          try { wrongAudio?.play(); } catch { /* ignore */ }
          try {
            tickingAudio?.pause();
            if (tickingAudio) tickingAudio.currentTime = 0;
          } catch { /* ignore */ }
          advanceRef.current = setTimeout(() => {
            if (index + 1 >= questions.length) {
              onFinish(newRecords);
            } else {
              setRecords(newRecords);
              setIndex((i) => i + 1);
              setChosen("__timeout__");
              setTimeout(() => {
                setChosen(null);
                setTimeLeft(TIMER_SECONDS);
              }, 900);
            }
          }, 900);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (advanceRef.current) clearTimeout(advanceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;

  function optionBg(name: string) {
    if (!answered) return { bg: "#fff", border: "#E5E7EB", color: "#111827", shadow: "0 2px 8px rgba(0,0,0,0.07)" };
    if (name === current.correct.name) return { bg: "#F0FDF4", border: "#16A34A", color: "#15803D", shadow: "0 2px 8px rgba(22,163,74,0.15)" };
    if (name === chosen) return { bg: "#FEF2F2", border: "#DC2626", color: "#B91C1C", shadow: "0 2px 8px rgba(220,38,38,0.12)" };
    return { bg: "#fff", border: "#E5E7EB", color: "#9CA3AF", shadow: "none" };
  }

  return (
    <div className="quiz">
      <DotBackground />

      <div className="top-bar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
            Question <span style={{ color: "#111827", fontWeight: 800 }}>{index + 1}</span>
            <span style={{ color: "#9CA3AF" }}> / {questions.length}</span>
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
            Score <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: 15 }}>{score}</span>
          </span>
        </div>

        <div className="timer-track">
          <div style={{ height: "100%", width: `${timerPct}%`, borderRadius: "9999px", background: timeLeft <= 3 ? "#DC2626" : "var(--accent)", transition: "width 1s linear, background 0.3s" }} />
        </div>
        <div style={{ textAlign: "right", marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: timeLeft <= 3 ? "#DC2626" : "#9CA3AF" }}>{timeLeft}s</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 24px 40px", gap: 24, position: "relative", zIndex: 2 }}>
        <div className="flag-hero">
          <div className="flag-frame">
            <img key={current.correct.code} src={flagUrl(current.correct.code)} alt="Flag to identify" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        <div className="answers-grid">
          {current.options.map((opt) => {
            const { bg, border, color, shadow } = optionBg(opt.name);
            return (
              <button key={opt.code} onClick={() => handleAnswer(opt.name)} disabled={answered} className="answer-btn" style={{ border: `2px solid ${border}`, background: bg, color, boxShadow: shadow, cursor: answered ? "default" : "pointer", opacity: answered && color === "#9CA3AF" ? 0.55 : 1 }}>
                {opt.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
