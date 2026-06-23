import { useState } from "react";
import "./AppStyles.css";
import HomeScreen from "./components/Home";
import QuizScreen from "./components/Quiz";
import ResultsScreen from "./components/Results";
import { buildQuestions, type Question, type AnswerRecord, type QuestionCount } from "./lib/game";

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<"home" | "quiz" | "results">("home");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(20);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  const startGame = () => {
    setQuestions(buildQuestions(questionCount));
    setRecords([]);
    setScreen("quiz");
  };

  return (
    <div className="app-root">
      {screen === "home" && <HomeScreen selected={questionCount} onSelect={setQuestionCount} onStart={startGame} />}
      {screen === "quiz" && <QuizScreen questions={questions} onFinish={(r) => { setRecords(r); setScreen("results"); }} />}
      {screen === "results" && <ResultsScreen records={records} total={questions.length} onPlayAgain={startGame} onChangeSettings={() => setScreen("home")} />}
    </div>
  );
}
