export type AnswerChoice = "A" | "B" | "C" | "D";

export interface Question {
  number: number;
  question: string;
  options: Record<AnswerChoice, string>;
  answer: AnswerChoice;
}

export interface Student {
  id: string;
  full_name: string;
  school: string;
  section: string;
  district: string;
  created_at: string;
}

export interface Exam {
  id: string;
  student_id: string;
  score: number | null;
  total_items: number;
  percentage: number | null;
  started_at: string;
  submitted_at: string | null;
  time_spent: number | null;
}

export interface Response {
  id: string;
  exam_id: string;
  question_number: number;
  selected_answer: string | null;
  correct_answer: string;
  is_correct: boolean | null;
}

export interface Teacher {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface ParticipantRow {
  exam_id: string;
  full_name: string;
  school: string;
  section: string;
  district: string;
  score: number;
  percentage: number;
  submitted_at: string;
}

export interface DashboardStats {
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export interface RegistrationFormData {
  fullName: string;
  school: string;
  section: string;
  district: string;
}
