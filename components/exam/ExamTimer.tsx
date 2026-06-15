"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

interface ExamTimerProps {
  startedAt: string;
  onTimeUpdate?: (seconds: number) => void;
}

export function ExamTimer({ startedAt, onTimeUpdate }: ExamTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();

    const tick = () => {
      const seconds = Math.floor((Date.now() - start) / 1000);
      setElapsed(seconds);
      onTimeUpdate?.(seconds);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, onTimeUpdate]);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-white">
      <svg
        className="h-5 w-5 text-[#FFD700]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-mono text-lg font-bold">{formatDuration(elapsed)}</span>
    </div>
  );
}
