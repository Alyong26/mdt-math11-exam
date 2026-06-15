"use client";

import { cn } from "@/lib/cn";
import type { AnswerChoice } from "@/types";

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answered: Set<number>;
  onNavigate: (num: number) => void;
}

export function QuestionNavigator({
  total,
  current,
  answered,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
      {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onNavigate(num)}
          className={cn(
            "flex h-9 w-full items-center justify-center rounded-md text-sm font-semibold transition-colors",
            current === num
              ? "bg-[#003366] text-white ring-2 ring-[#FFD700]"
              : answered.has(num)
                ? "bg-[#FFD700] text-[#003366]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

interface AnswerChoicesProps {
  questionNumber: number;
  options: Record<AnswerChoice, string>;
  selected: string | null;
  onSelect: (choice: AnswerChoice) => void;
  disabled?: boolean;
}

export function AnswerChoices({
  options,
  selected,
  onSelect,
  disabled,
}: AnswerChoicesProps) {
  const choices: AnswerChoice[] = ["A", "B", "C", "D"];

  return (
    <div className="space-y-3">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(choice)}
          className={cn(
            "flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors",
            selected === choice
              ? "border-[#003366] bg-[#003366]/5"
              : "border-gray-200 hover:border-[#003366]/50 hover:bg-gray-50",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              selected === choice
                ? "bg-[#003366] text-white"
                : "bg-gray-200 text-gray-700"
            )}
          >
            {choice}
          </span>
          <span className="pt-1 text-gray-800">{options[choice]}</span>
        </button>
      ))}
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm text-gray-600">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#003366] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
