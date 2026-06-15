import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/supabase/server";
import { questions } from "@/lib/questions";
import { StudentResultPDF } from "@/components/pdf/ReportPDF";

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

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  if (error || !exam) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: responses } = await supabase
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
      question_number: r.question_number,
      question_text: q?.question || "",
      selected_answer: r.selected_answer,
      correct_answer: r.correct_answer,
      is_correct: r.is_correct,
    };
  });

  const buffer = await renderToBuffer(
    <StudentResultPDF
      student={student}
      exam={{
        score: exam.score ?? 0,
        percentage: Number(exam.percentage) || 0,
        total_items: exam.total_items,
        submitted_at: exam.submitted_at!,
        time_spent: exam.time_spent,
      }}
      responses={detailedResponses}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="student-report-${examId}.pdf"`,
    },
  });
}
