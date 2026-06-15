import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";
import type { DashboardStats, ParticipantRow } from "@/types";

export const metadata = {
  title: "Teacher Dashboard — Math 11 Diagnostic Test 2026",
};

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/teacher");

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!teacher) redirect("/teacher");

  const { data: participants } = await supabase
    .from("exams")
    .select(
      `
      id, score, percentage, submitted_at,
      students ( full_name, school, district )
    `
    )
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false });

  const rows: ParticipantRow[] = (participants || []).map((p) => {
    const student = p.students as unknown as {
      full_name: string;
      school: string;
      district: string;
    };
    return {
      exam_id: p.id,
      full_name: student?.full_name || "",
      school: student?.school || "",
      district: student?.district || "",
      score: p.score ?? 0,
      percentage: Number(p.percentage) || 0,
      submitted_at: p.submitted_at!,
    };
  });

  const scores = rows.map((r) => r.score);
  const stats: DashboardStats = {
    totalParticipants: rows.length,
    averageScore:
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) /
          100
        : 0,
    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
  };

  return <TeacherDashboard stats={stats} participants={rows} />;
}
