import { NextResponse } from "next/server";
import { createAnonClient } from "@/supabase/anon";

export async function POST(request: Request) {
  try {
    const { examId, examToken, questionNumber, selectedAnswer } =
      await request.json();

    if (!examId || !examToken || !questionNumber || !selectedAnswer) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createAnonClient();
    const { error } = await supabase.rpc("save_exam_answer", {
      p_exam_id: examId,
      p_exam_token: examToken,
      p_question_number: Number(questionNumber),
      p_selected_answer: selectedAnswer,
    });

    if (error) {
      const status = error.message.includes("submitted") ? 403 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
