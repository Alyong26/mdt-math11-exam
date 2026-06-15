import { notFound } from "next/navigation";
import { createAnonClient } from "@/supabase/anon";
import { ResultPageClient } from "@/components/result/ResultPageClient";
import Link from "next/link";

interface ResultPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { examId } = await params;
  const supabase = createAnonClient();

  const { data, error } = await supabase.rpc("get_exam_result", {
    p_exam_id: examId,
  });

  if (error || !data) notFound();

  const result = data as {
    exam: {
      id: string;
      score: number;
      percentage: number;
      total_items: number;
      submitted_at: string;
      time_spent: number | null;
    };
    student: {
      full_name: string;
      school: string;
      district: string;
    };
    responses: Array<{ question_number: number; is_correct: boolean | null }>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003366] px-4 py-3 text-center">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back to Home
        </Link>
      </header>
      <ResultPageClient
        student={result.student}
        exam={{
          id: result.exam.id,
          score: result.exam.score ?? 0,
          percentage: Number(result.exam.percentage) || 0,
          total_items: result.exam.total_items,
          submitted_at: result.exam.submitted_at,
          time_spent: result.exam.time_spent,
        }}
        responses={result.responses || []}
      />
    </div>
  );
}
