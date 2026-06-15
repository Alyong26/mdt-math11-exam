import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createAnonClient } from "@/supabase/anon";
import { ExamInterface } from "@/components/exam/ExamInterface";

interface ExamPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { examId } = await params;
  const cookieStore = await cookies();
  const examToken = cookieStore.get(`exam_${examId}`)?.value;

  if (!examToken) {
    redirect("/");
  }

  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("get_exam_session", {
    p_exam_id: examId,
    p_exam_token: examToken,
  });

  if (error || !data) notFound();

  const session = data as {
    id: string;
    started_at: string;
    submitted_at: string | null;
    answers: Record<string, string>;
  };

  if (session.submitted_at) {
    redirect(`/result/${examId}`);
  }

  const initialAnswers: Record<number, string> = {};
  for (const [key, value] of Object.entries(session.answers || {})) {
    initialAnswers[Number(key)] = value;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamInterface
        examId={examId}
        startedAt={session.started_at}
        initialAnswers={initialAnswers}
        isSubmitted={false}
      />
    </div>
  );
}
