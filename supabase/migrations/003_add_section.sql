-- Add section field to students

ALTER TABLE students ADD COLUMN IF NOT EXISTS section TEXT NOT NULL DEFAULT '';

DROP VIEW IF EXISTS participant_results;

CREATE VIEW participant_results AS
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

-- Update start_exam to require section
DROP FUNCTION IF EXISTS start_exam(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION start_exam(
  p_full_name TEXT,
  p_school TEXT,
  p_section TEXT,
  p_district TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id UUID;
  v_exam_id UUID;
  v_exam_token UUID;
BEGIN
  IF trim(p_full_name) = '' OR trim(p_school) = '' OR trim(p_section) = '' OR trim(p_district) = '' THEN
    RAISE EXCEPTION 'All fields are required';
  END IF;

  INSERT INTO students (full_name, school, section, district)
  VALUES (trim(p_full_name), trim(p_school), trim(p_section), trim(p_district))
  RETURNING id INTO v_student_id;

  INSERT INTO exams (student_id, total_items)
  VALUES (v_student_id, 40)
  RETURNING id, exam_token INTO v_exam_id, v_exam_token;

  INSERT INTO responses (exam_id, question_number, correct_answer)
  SELECT v_exam_id, q.number, q.answer
  FROM (
    VALUES
      (1,'B'),(2,'B'),(3,'A'),(4,'C'),(5,'A'),(6,'C'),(7,'C'),(8,'A'),(9,'C'),(10,'C'),
      (11,'D'),(12,'B'),(13,'A'),(14,'C'),(15,'B'),(16,'A'),(17,'A'),(18,'C'),(19,'B'),(20,'A'),
      (21,'A'),(22,'A'),(23,'C'),(24,'A'),(25,'B'),(26,'B'),(27,'B'),(28,'C'),(29,'A'),(30,'A'),
      (31,'A'),(32,'A'),(33,'A'),(34,'B'),(35,'A'),(36,'C'),(37,'A'),(38,'B'),(39,'A'),(40,'A')
  ) AS q(number, answer);

  RETURN json_build_object('examId', v_exam_id, 'examToken', v_exam_token);
END;
$$;

GRANT EXECUTE ON FUNCTION start_exam(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
