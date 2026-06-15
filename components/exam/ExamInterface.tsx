"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions, TOTAL_QUESTIONS } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamTimer } from "@/components/exam/ExamTimer";
import {
  AnswerChoices,
  ProgressBar,
  QuestionNavigator,
} from "@/components/exam/ExamUI";
import type { AnswerChoice } from "@/types";

interface ExamInterfaceProps {
  examId: string;
  startedAt: string;
  initialAnswers: Record<number, string>;
  isSubmitted: boolean;
}

export function ExamInterface({
  examId,
  startedAt,
  initialAnswers,
  isSubmitted,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const question = questions[currentQ - 1];
  const answeredSet = new Set(
    Object.keys(answers).map(Number).filter((k) => answers[k])
  );

  const getToken = () => sessionStorage.getItem("examToken") || "";

  const saveAnswer = useCallback(
    async (questionNumber: number, choice: AnswerChoice) => {
      setAnswers((prev) => ({ ...prev, [questionNumber]: choice }));
      try {
        await fetch("/api/exam/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId,
            examToken: getToken(),
            questionNumber,
            selectedAnswer: choice,
          }),
        });
      } catch {
        // Silent fail — answer stored locally
      }
    },
    [examId]
  );

  useEffect(() => {
    if (isSubmitted) {
      router.replace(`/result/${examId}`);
    }
  }, [isSubmitted, examId, router]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          examToken: getToken(),
          timeSpent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      sessionStorage.removeItem("examToken");
      router.push(`/result/${examId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  };

  const unanswered = TOTAL_QUESTIONS - answeredSet.size;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-[#003366] sm:text-xl">
          2026 Division Diagnostic Test
        </h1>
        <ExamTimer startedAt={startedAt} onTimeUpdate={setTimeSpent} />
      </div>

      <ProgressBar current={currentQ} total={TOTAL_QUESTIONS} />

      <Card>
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base text-[#003366]">
            Question {question.number}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="text-lg leading-relaxed text-gray-800">
            {question.question}
          </p>
          <AnswerChoices
            questionNumber={question.number}
            options={question.options}
            selected={answers[question.number] || null}
            onSelect={(choice) => saveAnswer(question.number, choice)}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentQ((q) => Math.max(1, q - 1))}
          disabled={currentQ === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentQ((q) => Math.min(TOTAL_QUESTIONS, q + 1))}
          disabled={currentQ === TOTAL_QUESTIONS}
        >
          Next
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          onClick={() => setShowConfirm(true)}
          disabled={submitting}
        >
          Submit Examination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">
            Question Navigator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionNavigator
            total={TOTAL_QUESTIONS}
            current={currentQ}
            answered={answeredSet}
            onNavigate={setCurrentQ}
          />
        </CardContent>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Examination?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You have answered {answeredSet.size} of {TOTAL_QUESTIONS}{" "}
                questions.
                {unanswered > 0 && (
                  <span className="font-semibold text-amber-600">
                    {" "}
                    {unanswered} question(s) remain unanswered.
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                You cannot change your answers after submission.
              </p>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
