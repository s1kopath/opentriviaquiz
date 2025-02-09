"use client";

import { useState, useEffect, useMemo } from "react";
import { QuizState } from "@/types/quiz";

export default function Quiz({ category }: { category: string }) {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showResults: false,
    answers: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  const answers = useMemo(() => {
    if (!currentQuestion) return [];
    return [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();
    let isLoading = true;

    const fetchQuestions = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!isLoading) return;

        const response = await fetch(
          `https://opentdb.com/api.php?amount=10&category=${category}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!isSubscribed) return;

        if (data && data.response_code === 0 && data.results) {
          setQuizState((prev) => ({ ...prev, questions: data.results }));
        } else {
          throw new Error(
            `Failed to get questions. Response code: ${data?.response_code}`
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
      if (isSubscribed) {
        setLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      isSubscribed = false;
      isLoading = false;
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [category]);

  const handleAnswer = (answer: string) => {
    if (isAnswerLocked) return;

    const isCorrect = currentQuestion.correct_answer === answer;
    setSelectedAnswer(answer);
    setIsAnswerLocked(true);

    setTimeout(() => {
      setQuizState((prev) => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showResults: prev.currentQuestionIndex === prev.questions.length - 1,
        answers: [...prev.answers, answer],
      }));
      setSelectedAnswer(null);
      setIsAnswerLocked(false);
    }, 500);
  };

  const getButtonClass = (answer: string) => {
    const baseClass =
      "w-full p-4 text-left border rounded dark:border-gray-600 dark:text-white";

    if (!isAnswerLocked) {
      return `${baseClass} hover:bg-gray-100 dark:hover:bg-gray-700`;
    }

    const isCorrect = currentQuestion.correct_answer === answer;

    if (answer === selectedAnswer) {
      return `${baseClass} ${
        isCorrect
          ? "bg-green-200 dark:bg-green-800"
          : "bg-red-200 dark:bg-red-800"
      }`;
    }

    if (isCorrect) {
      return `${baseClass} bg-green-200 dark:bg-green-800`;
    }

    return baseClass;
  };

  if (loading) return <div>Loading...</div>;

  if (!quizState.questions.length) {
    return <div>Failed to load questions. Please try again.</div>;
  }

  if (quizState.showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl">
          You scored {quizState.score} out of {quizState.questions.length}
        </p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() =>
            setQuizState({
              questions: quizState.questions,
              currentQuestionIndex: 0,
              score: 0,
              showResults: false,
              answers: [],
            })
          }
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <span className="text-sm">
          Question {quizState.currentQuestionIndex + 1}/
          {quizState.questions.length}
        </span>
      </div>
      <h2
        className="text-xl mb-4"
        dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
      />
      <div className="space-y-2">
        {answers.map((answer, index) => (
          <button
            key={index}
            className={getButtonClass(answer)}
            onClick={() => handleAnswer(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
            disabled={isAnswerLocked}
          />
        ))}
      </div>
    </div>
  );
}
