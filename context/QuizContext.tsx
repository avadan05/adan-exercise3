import React, { createContext, useContext, useEffect, useState } from "react";
import { questions as defaultQuestions } from "../questions";

export type QuizItem = {
  id: number | string;
  type: string;
  question: string;
  choices: Record<string, string>;
  answer: string;
};

type QuizContextType = {
  items: QuizItem[];
  addItem: (questionText: string) => void;
  editItem: (id: number | string, questionText: string) => void;
  deleteItem: (id: number | string) => void;
  timer: number;
  setTimer: (s: number) => void;
  timeLeft: number;
  startTimer: () => void;
};

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuizItem[]>(defaultQuestions as QuizItem[]);
  const [timer, setTimer] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, timeLeft]);

  const addItem = (questionText: string) => {
    const newItem: QuizItem = {
      id: Date.now(),
      type: "multiple",
      question: questionText,
      choices: {
        A: "Option A",
        B: "Option B",
        C: "Option C",
        D: "Option D",
      },
      answer: "A",
    };
    setItems((prev) => [...prev, newItem]);
  };

  const editItem = (id: number | string, questionText: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, question: questionText } : item))
    );
  };

  const deleteItem = (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startTimer = () => {
    setTimeLeft(timer);
    setRunning(true);
  };

  return (
    <QuizContext.Provider
      value={{ items, addItem, editItem, deleteItem, timer, setTimer, timeLeft, startTimer }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = (): QuizContextType => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
};