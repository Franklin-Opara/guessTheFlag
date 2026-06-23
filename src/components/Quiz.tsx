import { useState, useEffect, useCallback, useRef } from "react";
import { TIMER_SECONDS, flagUrl } from "../lib/game";
import type { Question, AnswerRecord } from "../lib/game";

// audio files should be placed in public/sounds/
const correctAudio = typeof Audio !== "undefined" ? new Audio("/sounds/correct.mp3") : null;
const wrongAudio = typeof Audio !== "undefined" ? new Audio("/sounds/wrong.mp3") : null;
const tickingAudio = typeof Audio !== "undefined" ? new Audio("/sounds/ticking.mp3") : null;
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
    if (!answered) return "is-neutral";
    if (name === current.correct.name) return "is-correct";
    if (name === chosen) return "is-wrong";
    return "is-muted";
  }

  return (
    <div className="quiz">
      <DotBackground />

      <div className="top-bar">
        <div className="top-row">
          <div className="top-left">
            <span className="meta-line">
              Question <strong>{index + 1}</strong>
              <span style={{ color: "var(--muted-soft)" }}> / {questions.length}</span>
            </span>
          </div>
          <div className="top-right">
            <span className="meta-line">
              Score <strong className="accent">{score}</strong>
            </span>
          </div>
        </div>

        <div className="timer-track">
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timeLeft <= 3 ? "var(--danger)" : "var(--accent)" }} />
        </div>
        <div style={{ textAlign: "right", marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: timeLeft <= 3 ? "var(--danger)" : "var(--muted-soft)" }}>{timeLeft}s</span>
        </div>
      </div>

      <div className="quiz-stage">
        <div className="flag-hero">
          <div className="flag-frame">
            <img className="flag-image" key={current.correct.code} src={flagUrl(current.correct.code)} alt="Flag to identify" />
          </div>
        </div>

        <div className="answers-grid">
          {current.options.map((opt) => {
            return (
              <button key={opt.code} onClick={() => handleAnswer(opt.name)} disabled={answered} className={`answer-btn ${optionBg(opt.name)}`}>
                {opt.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
