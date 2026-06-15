import { NextResponse } from "next/server";
import { createAnonClient } from "@/supabase/anon";

export async function POST(request: Request) {
  try {
    const { fullName, school, district } = await request.json();

    if (!fullName?.trim() || !school?.trim() || !district?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const supabase = createAnonClient();
    const { data, error } = await supabase.rpc("start_exam", {
      p_full_name: fullName.trim(),
      p_school: school.trim(),
      p_district: district.trim(),
    });

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create exam session." },
        { status: 500 }
      );
    }

    const result = data as { examId: string; examToken: string };

    const response = NextResponse.json({
      examId: result.examId,
      examToken: result.examToken,
    });

    response.cookies.set(`exam_${result.examId}`, result.examToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
