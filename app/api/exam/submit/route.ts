import { NextResponse } from "next/server";
import { createServiceClient } from "@/supabase/admin";
import { calculateScore } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const { examId, examToken, timeSpent } = await request.json();

    if (!examId || !examToken) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("id, submitted_at, exam_token")
      .eq("id", examId)
      .eq("exam_token", examToken)
      .single();

    if (examError || !exam) {
      return NextResponse.json({ error: "Exam not found." }, { status: 404 });
    }

    if (exam.submitted_at) {
      return NextResponse.json(
        { error: "Exam already submitted." },
        { status: 403 }
      );
    }

    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("question_number, selected_answer, is_correct")
      .eq("exam_id", examId);

    if (responsesError || !responses) {
      return NextResponse.json(
        { error: "Failed to load responses." },
        { status: 500 }
      );
    }

    const answers: Record<number, string> = {};
    for (const r of responses) {
      if (r.selected_answer) {
        answers[r.question_number] = r.selected_answer;
      }
    }

    const { score, total, percentage } = calculateScore(answers);

    const { error: updateError } = await supabase
      .from("exams")
      .update({
        score,
        total_items: total,
        percentage,
        submitted_at: new Date().toISOString(),
        time_spent: timeSpent || 0,
      })
      .eq("id", examId)
      .is("submitted_at", null);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to submit exam. It may have already been submitted." },
        { status: 409 }
      );
    }

    return NextResponse.json({ score, total, percentage });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
