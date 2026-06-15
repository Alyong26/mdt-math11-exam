import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { createServiceClient } from "@/supabase/admin";
import { questions } from "@/lib/questions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();

  const { data: teacher } = await admin
    .from("teachers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: exam, error: examError } = await admin
    .from("exams")
    .select(
      `
      id, score, percentage, submitted_at, time_spent,
      students ( full_name, school, district )
    `
    )
    .eq("id", examId)
    .not("submitted_at", "is", null)
    .single();

  if (examError || !exam) {
    return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  }

  const { data: responses } = await admin
    .from("responses")
    .select("*")
    .eq("exam_id", examId)
    .order("question_number");

  const student = exam.students as unknown as {
    full_name: string;
    school: string;
    district: string;
  };

  const detailedResponses = (responses || []).map((r) => {
    const q = questions.find((q) => q.number === r.question_number);
    return {
      ...r,
      question_text: q?.question || "",
      selected_text: q?.options[r.selected_answer as keyof typeof q.options] || "—",
      correct_text: q?.options[r.correct_answer as keyof typeof q.options] || "",
    };
  });

  return NextResponse.json({
    exam: {
      id: exam.id,
      score: exam.score,
      percentage: exam.percentage,
      submitted_at: exam.submitted_at,
      time_spent: exam.time_spent,
      student,
    },
    responses: detailedResponses,
  });
}
