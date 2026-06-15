import { NextResponse } from "next/server";
import { createAnonClient } from "@/supabase/anon";

export async function POST(request: Request) {
  try {
    const { examId, examToken, timeSpent } = await request.json();

    if (!examId || !examToken) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createAnonClient();
    const { data, error } = await supabase.rpc("submit_exam", {
      p_exam_id: examId,
      p_exam_token: examToken,
      p_time_spent: timeSpent || 0,
    });

    if (error) {
      const status = error.message.includes("submitted") ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    const response = NextResponse.json(data);
    response.cookies.delete(`exam_${examId}`);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
