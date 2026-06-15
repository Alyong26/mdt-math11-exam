import Link from "next/link";
import { RegistrationForm } from "@/components/exam/RegistrationForm";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#003366] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-sm font-semibold text-[#FFD700]">
            DepEd Division Examination
          </span>
          <Link
            href="/teacher"
            className="text-sm text-white/70 hover:text-white"
          >
            Teacher Login
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-8 inline-block rounded-2xl bg-[#003366] px-8 py-6 shadow-lg">
            <div className="mb-2 text-4xl">📐</div>
            <h1 className="text-3xl font-bold text-[#FFD700] sm:text-4xl">
              Math 11 Diagnostic Test 2026
            </h1>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-xl font-bold tracking-wide text-[#003366] sm:text-2xl">
              2026 DIVISION DIAGNOSTIC TEST
            </h2>
            <p className="text-lg text-gray-600">Grade 11 Mathematics</p>
            <p className="text-sm text-gray-400">
              40 Multiple Choice Questions · Official Examination
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Questions", value: "40" },
              { label: "Choices", value: "A – D" },
              { label: "Format", value: "Online" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-2xl font-bold text-[#003366]">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <RegistrationForm />

        <p className="mt-6 text-xs text-gray-400">
          Please ensure you have a stable internet connection before starting.
        </p>
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        © 2026 Division Diagnostic Test — Grade 11 Mathematics
      </footer>
    </div>
  );
}
