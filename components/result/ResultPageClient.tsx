"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PASSING_PERCENTAGE } from "@/lib/questions";
import { formatDate, formatDuration } from "@/lib/utils";
import { Download } from "lucide-react";

interface ResultPageProps {
  student: { full_name: string; school: string; district: string };
  exam: {
    id: string;
    score: number;
    percentage: number;
    total_items: number;
    submitted_at: string;
    time_spent: number | null;
  };
  responses: Array<{
    question_number: number;
    is_correct: boolean | null;
  }>;
}

export function ResultPageClient({
  student,
  exam,
}: ResultPageProps) {
  const passed = exam.percentage >= PASSING_PERCENTAGE;

  const chartData = [
    { name: "Correct", value: exam.score, fill: "#16a34a" },
    {
      name: "Incorrect",
      value: exam.total_items - exam.score,
      fill: "#dc2626",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 inline-block rounded-lg bg-[#003366] px-6 py-3">
          <h1 className="text-lg font-bold text-[#FFD700]">
            2026 DIVISION DIAGNOSTIC TEST
          </h1>
          <p className="text-sm text-white/80">Grade 11 Mathematics</p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#003366]">
            {student.full_name}
          </CardTitle>
          <p className="text-gray-600">{student.school}</p>
          <p className="text-sm text-gray-500">{student.district}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-[#003366]">
              {exam.score}{" "}
              <span className="text-2xl text-gray-400">/ {exam.total_items}</span>
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-700">
              {exam.percentage}%
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-6 py-2 text-sm font-bold ${
                passed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {passed ? "PASSED" : "FAILED"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-500">Date Taken</p>
              <p className="font-semibold">{formatDate(exam.submitted_at)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-gray-500">Time Spent</p>
              <p className="font-semibold">
                {exam.time_spent ? formatDuration(exam.time_spent) : "—"}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() =>
              window.open(`/api/result/${exam.id}/pdf`, "_blank")
            }
          >
            <Download className="h-4 w-4" />
            Download Result PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
