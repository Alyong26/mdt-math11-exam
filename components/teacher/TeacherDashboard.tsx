"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DashboardStats, ParticipantRow } from "@/types";
import { formatDate } from "@/lib/utils";
import { Search, Download, LogOut } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

const COLORS = ["#003366", "#FFD700", "#004080", "#e6c200", "#0066cc"];

interface TeacherDashboardProps {
  stats: DashboardStats;
  participants: ParticipantRow[];
}

export function TeacherDashboard({
  stats: initialStats,
  participants: initialParticipants,
}: TeacherDashboardProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let rows = initialParticipants.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.school.toLowerCase().includes(q) ||
        p.section.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
    );
    rows = rows.sort((a, b) =>
      sortOrder === "desc" ? b.score - a.score : a.score - b.score
    );
    return rows;
  }, [initialParticipants, search, sortOrder]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-9", count: 0 },
      { range: "10-19", count: 0 },
      { range: "20-29", count: 0 },
      { range: "30-39", count: 0 },
      { range: "40", count: 0 },
    ];
    for (const p of initialParticipants) {
      if (p.score >= 40) buckets[4].count++;
      else if (p.score >= 30) buckets[3].count++;
      else if (p.score >= 20) buckets[2].count++;
      else if (p.score >= 10) buckets[1].count++;
      else buckets[0].count++;
    }
    return buckets;
  }, [initialParticipants]);

  const schoolPerformance = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const p of initialParticipants) {
      const cur = map.get(p.school) || { total: 0, count: 0 };
      cur.total += p.score;
      cur.count++;
      map.set(p.school, cur);
    }
    return Array.from(map.entries())
      .map(([school, { total, count }]) => ({
        school: school.length > 20 ? school.substring(0, 20) + "…" : school,
        average: Math.round((total / count) * 10) / 10,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 8);
  }, [initialParticipants]);

  const districtPerformance = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const p of initialParticipants) {
      const cur = map.get(p.district) || { total: 0, count: 0 };
      cur.total += p.score;
      cur.count++;
      map.set(p.district, cur);
    }
    return Array.from(map.entries()).map(([district, { total, count }]) => ({
      name: district,
      value: Math.round((total / count) * 10) / 10,
    }));
  }, [initialParticipants]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/teacher");
  };

  const downloadMasterReport = () => {
    window.open("/api/teacher/report/master/pdf", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003366] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm text-white/70">
              Math 11 Diagnostic Test 2026
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={downloadMasterReport}>
              <Download className="h-4 w-4" />
              Master Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-2 border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Participants", value: initialStats.totalParticipants },
            { label: "Average Score", value: initialStats.averageScore },
            { label: "Highest Score", value: initialStats.highestScore },
            { label: "Lowest Score", value: initialStats.lowestScore },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-[#003366]">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366]">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#003366" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366]">District Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={districtPerformance}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {districtPerformance.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#003366]">School Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={schoolPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 40]} fontSize={12} />
                <YAxis dataKey="school" type="category" width={120} fontSize={11} />
                <Tooltip />
                <Bar dataKey="average" fill="#FFD700" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-[#003366]">Participants</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search name, school, section, district..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9 w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
                  }
                >
                  {sortOrder === "desc" ? "Highest → Lowest" : "Lowest → Highest"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">School</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">Section</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">District</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">Score</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">%</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#003366]">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No participants found.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p) => (
                      <tr key={p.exam_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{p.full_name}</td>
                        <td className="px-4 py-3">{p.school}</td>
                        <td className="px-4 py-3">{p.section}</td>
                        <td className="px-4 py-3">{p.district}</td>
                        <td className="px-4 py-3 font-semibold">{p.score} / 40</td>
                        <td className="px-4 py-3">{p.percentage}%</td>
                        <td className="px-4 py-3">{formatDate(p.submitted_at)}</td>
                        <td className="px-4 py-3">
                          <a
                            href={`/api/teacher/report/student/${p.exam_id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#003366] hover:underline"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
