-- RPC functions for student exam operations (no auth required, secured by exam_token)

CREATE OR REPLACE FUNCTION start_exam(
  p_full_name TEXT,
  p_school TEXT,
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
  IF trim(p_full_name) = '' OR trim(p_school) = '' OR trim(p_district) = '' THEN
    RAISE EXCEPTION 'All fields are required';
  END IF;

  INSERT INTO students (full_name, school, district)
  VALUES (trim(p_full_name), trim(p_school), trim(p_district))
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

CREATE OR REPLACE FUNCTION save_exam_answer(
  p_exam_id UUID,
  p_exam_token UUID,
  p_question_number INTEGER,
  p_selected_answer TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct TEXT;
BEGIN
  IF p_selected_answer NOT IN ('A','B','C','D') THEN
    RAISE EXCEPTION 'Invalid answer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM exams
    WHERE id = p_exam_id AND exam_token = p_exam_token AND submitted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Exam not found or already submitted';
  END IF;

  SELECT correct_answer INTO v_correct
  FROM responses
  WHERE exam_id = p_exam_id AND question_number = p_question_number;

  UPDATE responses
  SET selected_answer = p_selected_answer,
      is_correct = (p_selected_answer = v_correct)
  WHERE exam_id = p_exam_id AND question_number = p_question_number;

  RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION submit_exam(
  p_exam_id UUID,
  p_exam_token UUID,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score INTEGER;
  v_total INTEGER := 40;
  v_percentage NUMERIC;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM exams
    WHERE id = p_exam_id AND exam_token = p_exam_token AND submitted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Exam not found or already submitted';
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_score
  FROM responses
  WHERE exam_id = p_exam_id AND is_correct = true;

  v_percentage := ROUND((v_score::NUMERIC / v_total) * 100, 2);

  UPDATE exams
  SET score = v_score,
      total_items = v_total,
      percentage = v_percentage,
      submitted_at = NOW(),
      time_spent = COALESCE(p_time_spent, 0)
  WHERE id = p_exam_id AND submitted_at IS NULL;

  RETURN json_build_object('score', v_score, 'total', v_total, 'percentage', v_percentage);
END;
$$;

CREATE OR REPLACE FUNCTION get_exam_session(p_exam_id UUID, p_exam_token UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exam RECORD;
  v_answers JSON;
BEGIN
  SELECT id, started_at, submitted_at INTO v_exam
  FROM exams
  WHERE id = p_exam_id AND exam_token = p_exam_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exam not found';
  END IF;

  SELECT COALESCE(json_object_agg(question_number::TEXT, selected_answer), '{}'::JSON)
  INTO v_answers
  FROM responses
  WHERE exam_id = p_exam_id AND selected_answer IS NOT NULL;

  RETURN json_build_object(
    'id', v_exam.id,
    'started_at', v_exam.started_at,
    'submitted_at', v_exam.submitted_at,
    'answers', v_answers
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_exam_result(p_exam_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'exam', json_build_object(
      'id', e.id,
      'score', e.score,
      'percentage', e.percentage,
      'total_items', e.total_items,
      'submitted_at', e.submitted_at,
      'time_spent', e.time_spent
    ),
    'student', json_build_object(
      'full_name', s.full_name,
      'school', s.school,
      'district', s.district
    ),
    'responses', (
      SELECT COALESCE(json_agg(json_build_object(
        'question_number', r.question_number,
        'is_correct', r.is_correct
      ) ORDER BY r.question_number), '[]'::JSON)
      FROM responses r WHERE r.exam_id = e.id
    )
  ) INTO v_result
  FROM exams e
  JOIN students s ON s.id = e.student_id
  WHERE e.id = p_exam_id AND e.submitted_at IS NOT NULL;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Result not found';
  END IF;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION start_exam(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION save_exam_answer(UUID, UUID, INTEGER, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION submit_exam(UUID, UUID, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_exam_session(UUID, UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_exam_result(UUID) TO anon, authenticated, service_role;
