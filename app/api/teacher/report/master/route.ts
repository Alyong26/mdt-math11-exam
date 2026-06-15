import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { createServiceClient } from "@/supabase/admin";

export async function GET() {
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

  const { data: participants, error } = await admin
    .from("exams")
    .select(
      `
      id, score, percentage, submitted_at,
      students ( full_name, school, district )
    `
    )
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (participants || []).map((p) => {
    const student = p.students as unknown as {
      full_name: string;
      school: string;
      district: string;
    };
    return {
      full_name: student?.full_name || "",
      school: student?.school || "",
      district: student?.district || "",
      score: p.score ?? 0,
      percentage: Number(p.percentage) || 0,
      submitted_at: p.submitted_at,
    };
  });

  return NextResponse.json({ participants: rows });
}
