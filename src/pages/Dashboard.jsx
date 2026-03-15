import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { Users, BarChart3, Clock, CalendarCheck, CheckSquare, MessageSquare, TrendingUp } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import TeamOverview from "../components/dashboard/TeamOverview";
import { seedDatabase } from "@/lib/seedData";

export default function Dashboard() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["productivity-logs"],
    queryFn: () => appClient.entities.ProductivityLog.list("-date", 100),
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list("-date", 50),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appClient.entities.Task.list(),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", "general"],
    queryFn: () => appClient.entities.Message.list(),
  });

  const activeCount = employees.filter(e => e.status === "active").length;
  const avgProductivity = employees.length > 0
    ? Math.round(employees.reduce((sum, e) => sum + (e.productivity_score || 0), 0) / employees.length)
    : 0;
  const totalHours = logs.reduce((sum, l) => sum + (l.hours_worked || 0), 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const presentToday = attendance.filter(a => a.date === todayStr && a.status === "present").length;
  const tasksDone = tasks.filter(t => t.status === "done").length;
  const tasksTotal = tasks.length;
  const messagesTotal = messages.length;

  const deptStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = { total: 0, active: 0 };
    acc[emp.department].total++;
    if (emp.status === "active") acc[emp.department].active++;
    return acc;
  }, {});

  const topEmployees = [...employees]
    .sort((a, b) => (b.productivity_score || 0) - (a.productivity_score || 0))
    .slice(0, 5);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const attendanceByDay = last7Days.map(date => ({
    date: date.slice(5),
    prezenti: attendance.filter(a => a.date === date && a.status === "present").length,
    absenti: attendance.filter(a => a.date === date && a.status === "absent").length,
  }));

  return (
    <div className="space-y-8">

      {/* Buton Date Demo */}
      {!seeded && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800 text-sm">Date Demo</p>
            <p className="text-xs text-amber-600">Populează baza de date cu date de demonstrație</p>
          </div>
          <button
            onClick={async () => { setSeeding(true); await seedDatabase(); setSeeding(false); setSeeded(true); }}
            disabled={seeding}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#f59e0b" }}>
            {seeding ? "Se încarcă..." : "Populează Date Demo"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Angajați Activi" value={activeCount} subtitle={`${employees.length} total`} icon={Users} color="blue" delay={0} />
        <StatCard title="Productivitate Medie" value={`${avgProductivity}%`} subtitle="Media echipei" icon={BarChart3} color="green" delay={0.1} />
        <StatCard title="Ore Lucrate Total" value={totalHours.toFixed(0)} subtitle="Toate timpurile" icon={Clock} color="purple" delay={0.2} />
        <StatCard title="Prezenți Azi" value={presentToday} subtitle={`din ${activeCount} activi`} icon={CalendarCheck} color="orange" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e0f7f7" }}>
              <CheckSquare className="h-5 w-5" style={{ color: "#00b5b5" }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sarcini Finalizate</p>
              <p className="text-2xl font-bold text-slate-900">{tasksDone}<span className="text-sm text-slate-400 font-normal">/{tasksTotal}</span></p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${tasksTotal > 0 ? (tasksDone/tasksTotal)*100 : 0}%`, backgroundColor: "#00b5b5" }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">{tasksTotal > 0 ? Math.round((tasksDone/tasksTotal)*100) : 0}% finalizate</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e0f7f7" }}>
              <MessageSquare className="h-5 w-5" style={{ color: "#00b5b5" }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Mesaje Trimise</p>
              <p className="text-2xl font-bold text-slate-900">{messagesTotal}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Total mesaje în toate canalele</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e0f7f7" }}>
              <TrendingUp className="h-5 w-5" style={{ color: "#00b5b5" }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sarcini În Progres</p>
              <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === "in_progress").length}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Sarcini active în desfășurare</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ProductivityChart logs={logs} />
        </div>
        <div className="lg:col-span-2">
          <TeamOverview employees={employees} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Prezență Ultima Săptămână</h3>
        <div className="flex items-end gap-2 h-32">
          {attendanceByDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "100px" }}>
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: `${day.prezenti * 20}px`, backgroundColor: "#00b5b5", minHeight: day.prezenti > 0 ? "4px" : "0" }} />
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: `${day.absenti * 20}px`, backgroundColor: "#fca5a5", minHeight: day.absenti > 0 ? "4px" : "0" }} />
              </div>
              <span className="text-xs text-slate-400">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#00b5b5" }} /> Prezenți
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#fca5a5" }} /> Absenți
          </div>
        </div>
      </div>

      {topEmployees.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Angajați după Productivitate</h3>
          <div className="space-y-3">
            {topEmployees.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 w-4">{i + 1}</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: "#00b5b5" }}>
                  {emp.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                    <span className="text-xs font-bold" style={{ color: "#00b5b5" }}>{emp.productivity_score || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${emp.productivity_score || 0}%`, backgroundColor: "#00b5b5" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(deptStats).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Angajați pe Departamente</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(deptStats).map(([dept, stats]) => (
              <div key={dept} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#f0fafa" }}>
                <p className="text-2xl font-bold" style={{ color: "#00b5b5" }}>{stats.active}</p>
                <p className="text-xs text-slate-500 mt-1">{dept}</p>
                <p className="text-xs text-slate-400">{stats.total} total</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}