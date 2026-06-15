import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { TeacherLoginForm } from "@/components/teacher/TeacherLoginForm";
import Link from "next/link";

export const metadata = {
  title: "Teacher Login — Math 11 Diagnostic Test 2026",
};

export default async function TeacherLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/teacher/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <Link
        href="/"
        className="mb-6 text-sm text-[#003366] hover:underline"
      >
        ← Back to Home
      </Link>
      <TeacherLoginForm />
    </div>
  );
}
