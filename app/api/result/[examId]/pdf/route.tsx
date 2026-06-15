import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createAnonClient } from "@/supabase/anon";
import { questions } from "@/lib/questions";
import { StudentResultPDF } from "@/components/pdf/ReportPDF";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const supabase = createAnonClient();

  const { data, error } = await supabase.rpc("get_exam_result", {
    p_exam_id: examId,
  });

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = data as {
    exam: {
      score: number;
      percentage: number;
      total_items: number;
      submitted_at: string;
      time_spent: number | null;
    };
    student: { full_name: string; school: string; section: string; district: string };
    responses: Array<{
      question_number: number;
      selected_answer: string | null;
      correct_answer: string;
      is_correct: boolean | null;
    }>;
  };

  const detailedResponses = (result.responses || []).map((r) => {
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
      student={result.student}
      exam={{
        score: result.exam.score ?? 0,
        percentage: Number(result.exam.percentage) || 0,
        total_items: result.exam.total_items,
        submitted_at: result.exam.submitted_at,
        time_spent: result.exam.time_spent,
      }}
      responses={detailedResponses}
    />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="result-${examId}.pdf"`,
    },
  });
}
