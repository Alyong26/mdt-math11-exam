-- Math 11 Diagnostic Test 2026 - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  school TEXT NOT NULL,
  section TEXT NOT NULL,
  district TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  score INTEGER,
  total_items INTEGER NOT NULL DEFAULT 40,
  percentage NUMERIC(5,2),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent INTEGER,
  exam_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  CONSTRAINT exams_score_range CHECK (score IS NULL OR (score >= 0 AND score <= total_items)),
  CONSTRAINT exams_percentage_range CHECK (percentage IS NULL OR (percentage >= 0 AND percentage <= 100))
);

CREATE UNIQUE INDEX IF NOT EXISTS exams_exam_token_idx ON exams(exam_token);
CREATE INDEX IF NOT EXISTS exams_student_id_idx ON exams(student_id);
CREATE INDEX IF NOT EXISTS exams_submitted_at_idx ON exams(submitted_at);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  selected_answer TEXT,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN,
  UNIQUE(exam_id, question_number),
  CONSTRAINT responses_question_range CHECK (question_number >= 1 AND question_number <= 40),
  CONSTRAINT responses_answer_choice CHECK (
    selected_answer IS NULL OR selected_answer IN ('A', 'B', 'C', 'D')
  )
);

CREATE INDEX IF NOT EXISTS responses_exam_id_idx ON responses(exam_id);

-- Teachers table (linked to auth.users)
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is authenticated teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teachers WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Students policies
CREATE POLICY "Teachers can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_teacher());

CREATE POLICY "Service role full access students"
  ON students FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Exams policies
CREATE POLICY "Teachers can view all exams"
  ON exams FOR SELECT
  TO authenticated
  USING (is_teacher());

CREATE POLICY "Service role full access exams"
  ON exams FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Responses policies
CREATE POLICY "Teachers can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (is_teacher());

CREATE POLICY "Service role full access responses"
  ON responses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Teachers policies
CREATE POLICY "Teachers can view own record"
  ON teachers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Service role full access teachers"
  ON teachers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- View for dashboard participant list
CREATE OR REPLACE VIEW participant_results AS
SELECT
  e.id AS exam_id,
  s.full_name,
  s.school,
  s.section,
  s.district,
  e.score,
  e.percentage,
  e.submitted_at,
  e.time_spent
FROM exams e
JOIN students s ON s.id = e.student_id
WHERE e.submitted_at IS NOT NULL;

GRANT SELECT ON participant_results TO authenticated;
