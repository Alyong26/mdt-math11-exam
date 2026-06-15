import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11 },
  header: {
    backgroundColor: "#003366",
    color: "#FFD700",
    padding: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#ffffff" },
  section: { marginBottom: 16 },
  label: { fontSize: 10, color: "#666", marginBottom: 2 },
  value: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
  scoreBox: {
    backgroundColor: "#f0f4f8",
    padding: 16,
    borderRadius: 4,
    marginBottom: 20,
    textAlign: "center",
  },
  scoreText: { fontSize: 24, fontWeight: "bold", color: "#003366" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#003366",
    color: "#ffffff",
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 6,
    fontSize: 9,
  },
  col1: { width: "8%" },
  col2: { width: "42%" },
  col3: { width: "15%" },
  col4: { width: "15%" },
  col5: { width: "20%" },
  correct: { color: "#16a34a" },
  incorrect: { color: "#dc2626" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999",
  },
});

interface StudentResultPDFProps {
  student: { full_name: string; school: string; district: string };
  exam: {
    score: number;
    percentage: number;
    total_items: number;
    submitted_at: string;
    time_spent: number | null;
  };
  responses: Array<{
    question_number: number;
    question_text: string;
    selected_answer: string | null;
    correct_answer: string;
    is_correct: boolean | null;
  }>;
}

export function StudentResultPDF({
  student,
  exam,
  responses,
}: StudentResultPDFProps) {
  const passed = exam.percentage >= 60;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            2026 DIVISION DIAGNOSTIC TEST
          </Text>
          <Text style={styles.subtitle}>Grade 11 Mathematics — Result Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>{student.full_name}</Text>
          <Text style={styles.label}>School</Text>
          <Text style={styles.value}>{student.school}</Text>
          <Text style={styles.label}>District</Text>
          <Text style={styles.value}>{student.district}</Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            {exam.score} / {exam.total_items}
          </Text>
          <Text style={{ fontSize: 14, color: "#003366", marginTop: 4 }}>
            {exam.percentage}% — {passed ? "PASSED" : "FAILED"}
          </Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.col1}>#</Text>
          <Text style={styles.col2}>Question</Text>
          <Text style={styles.col3}>Answer</Text>
          <Text style={styles.col4}>Correct</Text>
          <Text style={styles.col5}>Result</Text>
        </View>

        {responses.map((r) => (
          <View key={r.question_number} style={styles.tableRow}>
            <Text style={styles.col1}>{r.question_number}</Text>
            <Text style={styles.col2}>
              {r.question_text.substring(0, 80)}
              {r.question_text.length > 80 ? "..." : ""}
            </Text>
            <Text style={styles.col3}>{r.selected_answer || "—"}</Text>
            <Text style={styles.col4}>{r.correct_answer}</Text>
            <Text
              style={[
                styles.col5,
                r.is_correct ? styles.correct : styles.incorrect,
              ]}
            >
              {r.is_correct ? "Correct" : "Incorrect"}
            </Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Math 11 Diagnostic Test 2026 — Official Examination Report
        </Text>
      </Page>
    </Document>
  );
}

interface MasterReportPDFProps {
  participants: Array<{
    full_name: string;
    school: string;
    district: string;
    score: number;
    percentage: number;
    submitted_at: string;
  }>;
  stats: {
    totalParticipants: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
}

export function MasterReportPDF({
  participants,
  stats,
}: MasterReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>
            2026 DIVISION DIAGNOSTIC TEST — MASTER REPORT
          </Text>
          <Text style={styles.subtitle}>Grade 11 Mathematics</Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 20, gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Total Participants</Text>
            <Text style={styles.value}>{stats.totalParticipants}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Average Score</Text>
            <Text style={styles.value}>{stats.averageScore}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Highest Score</Text>
            <Text style={styles.value}>{stats.highestScore}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Lowest Score</Text>
            <Text style={styles.value}>{stats.lowestScore}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={{ width: "5%" }}>#</Text>
          <Text style={{ width: "25%" }}>Name</Text>
          <Text style={{ width: "25%" }}>School</Text>
          <Text style={{ width: "20%" }}>District</Text>
          <Text style={{ width: "10%" }}>Score</Text>
          <Text style={{ width: "10%" }}>%</Text>
          <Text style={{ width: "15%" }}>Date</Text>
        </View>

        {participants.map((p, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={{ width: "5%" }}>{i + 1}</Text>
            <Text style={{ width: "25%" }}>{p.full_name}</Text>
            <Text style={{ width: "25%" }}>{p.school}</Text>
            <Text style={{ width: "20%" }}>{p.district}</Text>
            <Text style={{ width: "10%" }}>{p.score}</Text>
            <Text style={{ width: "10%" }}>{p.percentage}%</Text>
            <Text style={{ width: "15%" }}>
              {new Date(p.submitted_at).toLocaleDateString()}
            </Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Math 11 Diagnostic Test 2026 — Master Report
        </Text>
      </Page>
    </Document>
  );
}
