import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { Users, BarChart3, Clock, CalendarCheck, CheckSquare, TrendingUp, AlertTriangle, Gift, TrendingDown, Target, Activity } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import { seedDatabase, seedMissing } from "@/lib/seedData";
import AIInsights from "../components/dashboard/AIInsights";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";

function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcProductivityScore(employee, attendance, tasks) {
  const empEmail = employee.email;
  const empAttendance = attendance.filter(a => a.employee_email === empEmail);
  const totalDays = empAttendance.length;
  const presentDays = empAttendance.filter(a => a.status === "present").length;
  const attendanceScore = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  const CHECKIN_LIMIT = 9 * 60 + 15;
  const presentRecords = empAttendance.filter(a => a.status === "present" && a.check_in);
  const onTimeCount = presentRecords.filter(a => {
    const mins = timeToMinutes(a.check_in);
    return mins !== null && mins <= CHECKIN_LIMIT;
  }).length;
  const punctualityScore = presentRecords.length > 0 ? (onTimeCount / presentRecords.length) * 100 : 0;
  const empTasks = tasks.filter(t => t.assigned_to_email === empEmail);
  const doneTasks = empTasks.filter(t => t.status === "done").length;
  const tasksScore = empTasks.length > 0 ? (doneTasks / empTasks.length) * 100 : 0;
  const score = Math.round(attendanceScore * 0.4 + punctualityScore * 0.3 + tasksScore * 0.3);
  return Math.min(100, Math.max(0, score));
}

const HEATMAP_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const HEATMAP_DAYS = ["Lun", "Mar", "Mie", "Joi", "Vin"];
const HEATMAP_COLORS = ["#f0fafa", "#9fe1cb", "#5dcaa5", "#1d9e75", "#0f6e56"];

export default function Dashboard() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split("T")[0];
  const today = new Date();

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list(200),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appClient.entities.Task.list(),
  });

  const activeCount = employees.filter(e => e.status === "active").length;

  const employeesWithScore = employees.map(emp => ({
    ...emp,
    computed_score: calcProductivityScore(emp, attendance, tasks),
  }));

  const avgProductivity = employeesWithScore.length > 0
    ? Math.round(employeesWithScore.reduce((sum, e) => sum + e.computed_score, 0) / employeesWithScore.length)
    : 0;

  const presentToday = attendance.filter(a => a.date === todayStr && a.status === "present").length;
  const tasksDone = tasks.filter(t => t.status === "done").length;
  const tasksTotal = tasks.length;
  const tasksInProgress = tasks.filter(t => t.status === "in_progress").length;

  const tasksOverdue = tasks.filter(t => {
    if (t.status === "done") return false;
    if (!t.due_date) return false;
    return new Date(t.due_date) < today;
  });

  const absenteeismData = employeesWithScore.map(emp => {
    const empAtt = attendance.filter(a => a.employee_email === emp.email);
    const absent = empAtt.filter(a => a.status === "absent").length;
    const total = empAtt.length;
    const rate = total > 0 ? Math.round((absent / total) * 100) : 0;
    return { ...emp, absentRate: rate, absentDays: absent, totalDays: total };
  }).sort((a, b) => b.absentRate - a.absentRate);

  const overtimeData = employeesWithScore.map(emp => {
    const empAtt = attendance.filter(a => a.employee_email === emp.email && a.status === "present");
    let overtimeDays = 0;
    empAtt.forEach(a => {
      if (a.check_in && a.check_out) {
        const inMin = timeToMinutes(a.check_in);
        const outMin = timeToMinutes(a.check_out);
        if (outMin && inMin && (outMin - inMin) > 480) overtimeDays++;
      }
    });
    return { ...emp, overtimeDays };
  }).filter(e => e.overtimeDays > 0).sort((a, b) => b.overtimeDays - a.overtimeDays);

  const topEmployees = [...employeesWithScore]
    .sort((a, b) => b.computed_score - a.computed_score)
    .slice(0, 5);

  const burnoutData = employeesWithScore.map(emp => {
    const empAtt = attendance.filter(a => a.employee_email === emp.email);
    const absent = empAtt.filter(a => a.status === "absent").length;
    const total = empAtt.length;
    const absentRate = total > 0 ? (absent / total) * 100 : 0;
    const empOvertimeAtt = empAtt.filter(a => a.status === "present");
    let overtimeDays = 0;
    empOvertimeAtt.forEach(a => {
      if (a.check_in && a.check_out) {
        const inMin = timeToMinutes(a.check_in);
        const outMin = timeToMinutes(a.check_out);
        if (outMin && inMin && (outMin - inMin) > 480) overtimeDays++;
      }
    });
    const overtimeScore = Math.min((overtimeDays / Math.max(total, 1)) * 100 * 2, 100);
    const empTasks = tasks.filter(t => t.assigned_to_email === emp.email && t.status !== "done");
    const overdueEmp = empTasks.filter(t => t.due_date && new Date(t.due_date) < today).length;
    const overdueScore = Math.min(overdueEmp * 20, 100);
    const burnout = Math.round(absentRate * 0.4 + overtimeScore * 0.4 + overdueScore * 0.2);
    return { ...emp, burnoutScore: Math.min(burnout, 100) };
  }).sort((a, b) => b.burnoutScore - a.burnoutScore);

  const heatmapData = HEATMAP_DAYS.map((day, di) => {
    return HEATMAP_HOURS.map(hour => {
      const last5Days = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        const dayOfWeek = d.getDay();
        const diff = dayOfWeek - 1 - di;
        d.setDate(d.getDate() - diff);
        return d.toISOString().split("T")[0];
      });
      const count = attendance.filter(a =>
        last5Days.includes(a.date) &&
        a.status === "present" &&
        a.check_in &&
        timeToMinutes(a.check_in) <= hour * 60 + 59 &&
        timeToMinutes(a.check_in) >= hour * 60
      ).length;
      return count;
    });
  });

  const todayEvents = attendance
    .filter(a => a.date === todayStr)
    .sort((a, b) => (a.check_in || "").localeCompare(b.check_in || ""));

  const birthdaysThisMonth = employees.filter(emp => {
    if (!emp.birth_date) return false;
    const bday = new Date(emp.birth_date);
    return bday.getMonth() === today.getMonth();
  });

  return (
    <div className="space-y-8">

      {!seeded && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800 text-sm">Date Demo</p>
            <p className="text-xs text-amber-600">Populează baza de date cu date de demonstrație</p>
          </div>
          <div className="flex gap-2">
            <button onClick={async () => { setSeeding(true); await seedDatabase(); setSeeding(false); setSeeded(true); }}
              disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#f59e0b" }}>
              {seeding ? "Se încarcă..." : "Populează Tot"}
            </button>
            <button onClick={async () => { setSeeding(true); await seedMissing(); setSeeding(false); setSeeded(true); }}
              disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#00b5b5" }}>
              {seeding ? "Se încarcă..." : "Adaugă Date Lipsă"}
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Angajați Activi" value={activeCount} subtitle={`${employees.length} total`} icon={Users} color="blue" delay={0} />
        <StatCard title="Productivitate Medie" value={`${avgProductivity}%`} subtitle="Prezență + Punctualitate + Sarcini" icon={BarChart3} color="green" delay={0.1} />
        <StatCard title="Prezenți Azi" value={presentToday} subtitle={`din ${activeCount} activi`} icon={CalendarCheck} color="orange" delay={0.2} />
        <StatCard title="Sarcini Finalizate" value={`${tasksDone}/${tasksTotal}`} subtitle={`${tasksTotal > 0 ? Math.round((tasksDone/tasksTotal)*100) : 0}% din total`} icon={CheckSquare} color="purple" delay={0.3} />
      </div>

      {/* AI Insights */}
      {user?.isManager && (
        <AIInsights employees={employees} tasks={tasks} attendance={attendance} events={[]} />
      )}

      {/* Sarcini */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e0f7f7" }}>
              <TrendingUp className="h-5 w-5" style={{ color: "#00b5b5" }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sarcini În Progres</p>
              <p className="text-2xl font-bold text-slate-900">{tasksInProgress}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Sarcini active în desfășurare</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff0f0" }}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sarcini Întârziate</p>
              <p className="text-2xl font-bold text-red-500">{tasksOverdue.length}</p>
            </div>
          </div>
          {tasksOverdue.length > 0 ? (
            <div className="space-y-1 mt-1">
              {tasksOverdue.slice(0, 2).map(t => (
                <p key={t.id} className="text-xs text-red-400 truncate">⚠ {t.title}</p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Nicio sarcină întârziată</p>
          )}
        </div>
      </div>

      {/* Heatmap activitate */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: "#00b5b5" }} /> Activitate Echipă pe Ore
        </h3>
        <p className="text-xs text-slate-400 mb-4">Câți angajați sunt activi în fiecare interval orar</p>
        <div className="overflow-x-auto">
          <div style={{ display: "grid", gridTemplateColumns: "40px repeat(10, 1fr)", gap: "3px", minWidth: "400px" }}>
            <div></div>
            {HEATMAP_HOURS.map(h => (
              <div key={h} style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", paddingBottom: "4px" }}>{h}:00</div>
            ))}
            {HEATMAP_DAYS.map((day, di) => (
              <React.Fragment key={day}>
                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center" }}>{day}</div>
                {HEATMAP_HOURS.map((h, hi) => {
                  const val = heatmapData[di]?.[hi] || 0;
                  const maxVal = 11;
                  const ci = val === 0 ? 0 : Math.min(Math.ceil((val / maxVal) * 4), 4);
                  return (
                    <div key={h} title={`${day} ${h}:00 — ${val} angajați`}
                      style={{ height: "24px", borderRadius: "4px", backgroundColor: HEATMAP_COLORS[ci] }} />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <span>Puțin activ</span>
          <div style={{ display: "flex", gap: "2px" }}>
            {HEATMAP_COLORS.map((c, i) => (
              <div key={i} style={{ width: "14px", height: "14px", borderRadius: "3px", backgroundColor: c }} />
            ))}
          </div>
          <span>Foarte activ</span>
        </div>
      </div>

      {/* Timeline azi */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Clock className="h-4 w-4" style={{ color: "#00b5b5" }} /> Activitate Azi — {format(new Date(), "d MMMM yyyy")}
        </h3>
        <p className="text-xs text-slate-400 mb-4">Check-in-urile echipei în timp real</p>
        {todayEvents.length === 0 ? (
          <p className="text-sm text-slate-400">Niciun check-in înregistrat azi</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todayEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: ev.status === "present" ? "#1d9e75" : "#ef4444" }} />
                <span className="text-xs font-mono text-slate-400 w-12">{ev.check_in || "--:--"}</span>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#00b5b5" }}>
                  {ev.employee_name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-700">{ev.employee_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                  style={{
                    backgroundColor: ev.work_location === "teren" ? "#fff8e1" : ev.work_location === "sedinta" ? "#f5f3ff" : "#f0fafa",
                    color: ev.work_location === "teren" ? "#b45309" : ev.work_location === "sedinta" ? "#7c3aed" : "#0f6e56"
                  }}>
                  {ev.work_location === "acasa" ? "Acasă" : ev.work_location === "teren" ? "În teren" : ev.work_location === "sedinta" ? "Ședință" : ev.work_location || "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Angajati + Absenteism */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topEmployees.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" style={{ color: "#00b5b5" }} /> Top Angajați după Productivitate
            </h3>
            <div className="space-y-3">
              {topEmployees.map((emp, i) => (
                <div key={emp.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400 w-4">{i + 1}</span>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#00b5b5" }}>
                    {emp.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                      <span className="text-xs font-bold" style={{ color: "#00b5b5" }}>{emp.computed_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${emp.computed_score}%`, backgroundColor: "#00b5b5" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">* 40% prezență + 30% punctualitate + 30% sarcini</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" /> Rata de Absenteism
          </h3>
          <div className="space-y-3">
            {absenteeismData.slice(0, 5).map(emp => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: emp.absentRate > 20 ? "#ef4444" : emp.absentRate > 10 ? "#f59e0b" : "#00b5b5" }}>
                  {emp.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                    <span className="text-xs font-bold" style={{ color: emp.absentRate > 20 ? "#ef4444" : emp.absentRate > 10 ? "#f59e0b" : "#00b5b5" }}>
                      {emp.absentRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${emp.absentRate}%`, backgroundColor: emp.absentRate > 20 ? "#ef4444" : emp.absentRate > 10 ? "#f59e0b" : "#00b5b5" }} />
                  </div>
                  <p className="text-xs text-slate-400">{emp.absentDays} zile absente din {emp.totalDays}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Burnout Risk + Ore Suplimentare */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Risc Burnout
          </h3>
          <p className="text-xs text-slate-400 mb-4">Calculat din absențe + ore suplimentare + sarcini restante</p>
          <div className="space-y-3">
            {burnoutData.slice(0, 5).map(emp => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: emp.burnoutScore > 60 ? "#ef4444" : emp.burnoutScore > 30 ? "#f59e0b" : "#1d9e75" }}>
                  {emp.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: emp.burnoutScore > 60 ? "#fef2f2" : emp.burnoutScore > 30 ? "#fffbeb" : "#f0fdf4",
                        color: emp.burnoutScore > 60 ? "#ef4444" : emp.burnoutScore > 30 ? "#f59e0b" : "#1d9e75"
                      }}>
                      {emp.burnoutScore > 60 ? "⚠ Risc ridicat" : emp.burnoutScore > 30 ? "Moderat" : "Scăzut"} {emp.burnoutScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${emp.burnoutScore}%`, backgroundColor: emp.burnoutScore > 60 ? "#ef4444" : emp.burnoutScore > 30 ? "#f59e0b" : "#1d9e75" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> Ore Suplimentare
          </h3>
          {overtimeData.length === 0 ? (
            <p className="text-sm text-slate-400">Nicio oră suplimentară înregistrată</p>
          ) : (
            <div className="space-y-3">
              {overtimeData.slice(0, 5).map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: emp.overtimeDays > 5 ? "#fff8e1" : "#f0fafa" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: emp.overtimeDays > 5 ? "#f59e0b" : "#00b5b5" }}>
                      {emp.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: emp.overtimeDays > 5 ? "#f59e0b" : "#00b5b5" }}>
                    {emp.overtimeDays} zile
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zile de nastere */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-pink-400" /> Zile de Naștere Luna Aceasta
        </h3>
        {birthdaysThisMonth.length === 0 ? (
          <p className="text-sm text-slate-400">Nicio zi de naștere în această lună</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {birthdaysThisMonth.map(emp => (
              <div key={emp.id} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "#fdf0f5" }}>
                <span style={{ fontSize: "16px" }}>🎂</span>
                <span className="text-sm font-medium text-slate-800">{emp.full_name}</span>
                <span className="text-xs text-pink-400">
                  {new Date(emp.birth_date).toLocaleDateString("ro-RO", { day: "numeric", month: "long" })}
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400 mt-3">* Adaugă data nașterii în profilul angajatului</p>
      </div>

    </div>
  );
}