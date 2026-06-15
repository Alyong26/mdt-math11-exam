import { notFound } from "next/navigation";
import { createServiceClient } from "@/supabase/admin";
import { ResultPageClient } from "@/components/result/ResultPageClient";
import Link from "next/link";

interface ResultPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { examId } = await params;
  const supabase = createServiceClient();

  const { data: exam, error } = await supabase
    .from("exams")
    .select(
      `
      id, score, percentage, total_items, submitted_at, time_spent,
      students ( full_name, school, district )
    `
    )
    .eq("id", examId)
    .not("submitted_at", "is", null)
    .single();

  if (error || !exam) notFound();

  const { data: responses } = await supabase
    .from("responses")
    .select("question_number, is_correct")
    .eq("exam_id", examId)
    .order("question_number");

  const student = exam.students as unknown as {
    full_name: string;
    school: string;
    district: string;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003366] px-4 py-3 text-center">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back to Home
        </Link>
      </header>
      <ResultPageClient
        student={student}
        exam={{
          id: exam.id,
          score: exam.score ?? 0,
          percentage: Number(exam.percentage) || 0,
          total_items: exam.total_items,
          submitted_at: exam.submitted_at!,
          time_spent: exam.time_spent,
        }}
        responses={responses || []}
      />
    </div>
  );
}
