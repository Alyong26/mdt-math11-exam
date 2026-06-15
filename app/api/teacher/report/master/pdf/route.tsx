import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/supabase/server";
import { MasterReportPDF } from "@/components/pdf/ReportPDF";

export async function GET() {
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

  const { data: participants } = await supabase
    .from("exams")
    .select(
      `
      score, percentage, submitted_at,
      students ( full_name, school, section, district )
    `
    )
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });

  const rows = (participants || []).map((p) => {
    const student = p.students as unknown as {
      full_name: string;
      school: string;
      section: string;
      district: string;
    };
    return {
      full_name: student?.full_name || "",
      school: student?.school || "",
      section: student?.section || "",
      district: student?.district || "",
      score: p.score ?? 0,
      percentage: Number(p.percentage) || 0,
      submitted_at: p.submitted_at!,
    };
  });

  const scores = rows.map((r) => r.score);
  const stats = {
    totalParticipants: rows.length,
    averageScore:
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) /
          100
        : 0,
    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
  };

  const buffer = await renderToBuffer(
    <MasterReportPDF participants={rows} stats={stats} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="master-report.pdf"',
    },
  });
}
