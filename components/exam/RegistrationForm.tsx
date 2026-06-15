"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    school: "",
    section: "",
    district: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName.trim() ||
      !form.school.trim() ||
      !form.section.trim() ||
      !form.district.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          school: form.school.trim(),
          section: form.section.trim(),
          district: form.district.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      sessionStorage.setItem("examToken", data.examToken);
      router.push(`/exam/${data.examId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="border-b border-gray-100 bg-[#003366] text-white rounded-t-xl">
        <CardTitle className="text-center text-lg">
          Student Information
        </CardTitle>
        <p className="text-center text-sm text-white/80">
          All fields below are required. Enter your details accurately before
          starting the examination.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">School *</Label>
            <Input
              id="school"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              placeholder="Enter your school name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section">Section *</Label>
            <Input
              id="section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="Enter your section"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Input
              id="district"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="Enter your district"
              required
            />
          </div>
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Starting..." : "Start Examination"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
