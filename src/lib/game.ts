import { COUNTRIES, type Country } from "../data/countries";

export const QUESTION_OPTIONS = [10, 20, 40, 100, 195] as const;
export type QuestionCount = (typeof QUESTION_OPTIONS)[number];
export const TIMER_SECONDS = 12;

export interface Question {
  correct: Country;
  options: Country[];
}
export interface AnswerRecord {
  question: Question;
  chosen: string | null;
  correct: boolean;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function flagUrl(code: string) {
  return `https://flagcdn.com/w640/${code.toLowerCase()}.png`;
}

export function buildQuestions(count: number): Question[] {
  const pool = shuffle(COUNTRIES).slice(0, count);
  return pool.map((correct) => {
    const distractors = shuffle(COUNTRIES.filter((c) => c.code !== correct.code)).slice(0, 3);
    return { correct, options: shuffle([correct, ...distractors]) };
  });
}
