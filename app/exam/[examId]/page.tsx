import { notFound, redirect } from "next/navigation";
import { createServiceClient } from "@/supabase/admin";
import { ExamInterface } from "@/components/exam/ExamInterface";

interface ExamPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { examId } = await params;
  const supabase = createServiceClient();

  const { data: exam, error } = await supabase
    .from("exams")
    .select("id, started_at, submitted_at")
    .eq("id", examId)
    .single();

  if (error || !exam) notFound();

  if (exam.submitted_at) {
    redirect(`/result/${examId}`);
  }

  const { data: responses } = await supabase
    .from("responses")
    .select("question_number, selected_answer")
    .eq("exam_id", examId);

  const initialAnswers: Record<number, string> = {};
  for (const r of responses || []) {
    if (r.selected_answer) {
      initialAnswers[r.question_number] = r.selected_answer;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamInterface
        examId={examId}
        startedAt={exam.started_at}
        initialAnswers={initialAnswers}
        isSubmitted={!!exam.submitted_at}
      />
    </div>
  );
}
