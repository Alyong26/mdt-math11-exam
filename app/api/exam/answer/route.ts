import { NextResponse } from "next/server";
import { createServiceClient } from "@/supabase/admin";
import { getQuestionByNumber } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const { examId, examToken, questionNumber, selectedAnswer } =
      await request.json();

    if (!examId || !examToken || !questionNumber || !selectedAnswer) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (!["A", "B", "C", "D"].includes(selectedAnswer)) {
      return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
    }

    const question = getQuestionByNumber(Number(questionNumber));
    if (!question) {
      return NextResponse.json({ error: "Invalid question." }, { status: 400 });
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

    const isCorrect = selectedAnswer === question.answer;

    const { error: updateError } = await supabase
      .from("responses")
      .update({
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      })
      .eq("exam_id", examId)
      .eq("question_number", questionNumber);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save answer." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
