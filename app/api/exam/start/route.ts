import { NextResponse } from "next/server";
import { createServiceClient } from "@/supabase/admin";
import { questions, TOTAL_QUESTIONS } from "@/lib/questions";

export async function POST(request: Request) {
  try {
    const { fullName, school, district } = await request.json();

    if (!fullName?.trim() || !school?.trim() || !district?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert({
        full_name: fullName.trim(),
        school: school.trim(),
        district: district.trim(),
      })
      .select("id")
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Failed to create student record." },
        { status: 500 }
      );
    }

    const { data: exam, error: examError } = await supabase
      .from("exams")
      .insert({
        student_id: student.id,
        total_items: TOTAL_QUESTIONS,
      })
      .select("id, exam_token")
      .single();

    if (examError || !exam) {
      return NextResponse.json(
        { error: "Failed to create exam session." },
        { status: 500 }
      );
    }

    const responseRows = questions.map((q) => ({
      exam_id: exam.id,
      question_number: q.number,
      correct_answer: q.answer,
      selected_answer: null,
      is_correct: null,
    }));

    const { error: responsesError } = await supabase
      .from("responses")
      .insert(responseRows);

    if (responsesError) {
      return NextResponse.json(
        { error: "Failed to initialize exam responses." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      examId: exam.id,
      examToken: exam.exam_token,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
