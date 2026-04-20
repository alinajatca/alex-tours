import React, { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";

function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcScore(emp, attendance, tasks) {
  const empAtt = attendance.filter(a => a.employee_email === emp.email);
  const total = empAtt.length;
  const prezent = empAtt.filter(a => a.status === "present").length;
  const prezentaScore = total > 0 ? (prezent / total) * 100 : 0;
  const LIMIT = 9 * 60 + 15;
  const cuCheckin = empAtt.filter(a => a.status === "present" && a.check_in);
  const punctual = cuCheckin.filter(a => {
    const m = timeToMinutes(a.check_in);
    return m !== null && m <= LIMIT;
  }).length;
  const punctualScore = cuCheckin.length > 0 ? (punctual / cuCheckin.length) * 100 : 0;
  const empTasks = tasks.filter(t => t.assigned_to_email === emp.email);
  const done = empTasks.filter(t => t.status === "done").length;
  const tasksScore = empTasks.length > 0 ? (done / empTasks.length) * 100 : 0;
  return Math.round(prezentaScore * 0.4 + punctualScore * 0.3 + tasksScore * 0.3);
}

export default function AIInsights({ employees, tasks, attendance }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [type, setType] = useState("");

  const monthStr = new Date().toISOString().slice(0, 7);
  const today = new Date();

  const generateReport = async (reportType) => {
    setLoading(true);
    setOpen(true);
    setType(reportType);
    setReport("");

    try {
      const monthAttendance = attendance.filter(r => r.date?.startsWith(monthStr));

      const empStats = employees.filter(e => e.status === "active").map(emp => {
        const empAtt = monthAttendance.filter(a => a.employee_email === emp.email);
        const prezente = empAtt.filter(a => a.status === "present").length;
        const absente = empAtt.filter(a => a.status === "absent").length;
        const totalZile = empAtt.length;
        const rataAbsenta = totalZile > 0 ? Math.round((absente / totalZile) * 100) : 0;

        const cuCheckin = empAtt.filter(a => a.status === "present" && a.check_in);
        const LIMIT = 9 * 60 + 15;
        const tarziu = cuCheckin.filter(a => {
          const m = timeToMinutes(a.check_in);
          return m !== null && m > LIMIT;
        }).length;

        const empTasks = tasks.filter(t => t.assigned_to_email === emp.email);
        const tasksDone = empTasks.filter(t => t.status === "done").length;
        const tasksActive = empTasks.filter(t => t.status !== "done").length;
        const tasksOverdue = empTasks.filter(t =>
          t.status !== "done" && t.due_date && new Date(t.due_date) < today
        ).length;

        const score = calcScore(emp, attendance, tasks);

        return {
          name: emp.full_name,
          department: emp.department,
          role: emp.role,
          score,
          prezente,
          absente,
          rataAbsenta,
          tarziu,
          tasksDone,
          tasksActive,
          tasksOverdue,
        };
      });

      const taskStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === "done").length,
        inProgress: tasks.filter(t => t.status === "in_progress").length,
        todo: tasks.filter(t => t.status === "todo").length,
        overdue: tasks.filter(t =>
          t.status !== "done" && t.due_date && new Date(t.due_date) < today
        ).length,
        highPriority: tasks.filter(t => t.priority === "high" && t.status !== "done").length,
      };

      const totalZileLucratoare = monthAttendance.length > 0
        ? [...new Set(monthAttendance.map(a => a.date))].length
        : 0;

      let prompt = "";

      if (reportType === "raport") {
        prompt = `Ești un asistent de management HR pentru agenția de turism Alex Tours din România.
Generează un raport lunar de management în limba română, bazat STRICT pe datele de mai jos.
Nu inventa informații, nu face presupuneri despre ore lucrate dacă nu sunt în date.
Scrie profesionist, concis și util pentru un manager.

LUNA ANALIZATĂ: ${monthStr}
ZILE LUCRĂTOARE ÎNREGISTRATE ÎN SISTEM: ${totalZileLucratoare}

STATISTICI ANGAJAȚI (${empStats.length} angajați activi):
${empStats.map(e =>
  `- ${e.name} (${e.department}): prezent ${e.prezente} zile, absent ${e.absente} zile (${e.rataAbsenta}% rată absență), întârzieri ${e.tarziu}, sarcini finalizate ${e.tasksDone}, sarcini active ${e.tasksActive}, sarcini restante ${e.tasksOverdue}, scor productivitate calculat ${e.score}%`
).join("\n")}

STATISTICI SARCINI:
- Total sarcini în sistem: ${taskStats.total}
- Finalizate: ${taskStats.done} (${taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0}%)
- În progres: ${taskStats.inProgress}
- De făcut: ${taskStats.todo}
- Restante (depășit termenul): ${taskStats.overdue}
- Urgente nerezolvate: ${taskStats.highPriority}

NOTĂ IMPORTANTĂ: Scorul de productivitate este calculat astfel: 40% prezență + 30% punctualitate (check-in înainte de 09:15) + 30% sarcini finalizate. Nu reflectă ore lucrate efective.

Structurează raportul cu aceste secțiuni:
1. Rezumat luna ${monthStr}
2. Situația prezenței echipei
3. Performanța sarcinilor
4. Angajați care necesită atenție (absențe sau restanțe mari)
5. Recomandări pentru luna următoare (maxim 4, concrete și realizabile)

Fii direct și bazează-te DOAR pe datele furnizate.`;

      } else {
        const problematici = empStats
          .filter(e => e.rataAbsenta > 15 || e.tasksOverdue > 0 || e.tarziu > 3)
          .sort((a, b) => b.rataAbsenta - a.rataAbsenta);

        prompt = `Ești un asistent de management HR pentru agenția de turism Alex Tours din România.
Oferă recomandări concrete pentru manager, bazate STRICT pe datele de mai jos.
Nu inventa situații, nu face presupuneri. Fii direct și practic.

LUNA: ${monthStr}

ANGAJAȚI CU POTENȚIALE PROBLEME:
${problematici.length > 0
  ? problematici.map(e =>
    `- ${e.name} (${e.department}): ${e.absente} absențe (${e.rataAbsenta}%), ${e.tarziu} întârzieri, ${e.tasksOverdue} sarcini restante`
  ).join("\n")
  : "- Nu există angajați cu probleme semnificative în datele disponibile"}

TOȚI ANGAJAȚII (scoruri productivitate):
${empStats.sort((a, b) => b.score - a.score).map(e =>
  `- ${e.name}: ${e.score}% (prezență ${e.prezente}z, sarcini ${e.tasksDone} finalizate din ${e.tasksDone + e.tasksActive})`
).join("\n")}

SARCINI URGENTE NEREZOLVATE: ${taskStats.highPriority}
SARCINI RESTANTE (termen depășit): ${taskStats.overdue}

Oferă 5-6 recomandări concrete, fiecare cu:
- Ce problemă rezolvă
- Acțiunea specifică recomandată
- Cine este vizat (folosește numele din date)

Dacă datele nu arată probleme majore, spune asta direct și oferă recomandări preventive.`;
      }

      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text || data?.error?.message || JSON.stringify(data);
      setReport(text || "Nu s-a putut genera raportul.");
    } catch (err) {
      console.error(err);
      setReport("Eroare la generarea raportului. Verificați cheia API.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#f0fafa" }}>
            <Sparkles className="h-5 w-5" style={{ color: "#00b5b5" }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Analiză AI</h3>
            <p className="text-xs text-slate-400">Rapoarte și recomandări bazate pe datele reale din sistem</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => generateReport("raport")}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-all hover:-translate-y-0.5"
            style={{ borderColor: "#00b5b5", backgroundColor: "#f0fafa" }}>
            <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: "#00b5b5" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#00b5b5" }}>Raport Lunar Inteligent</p>
              <p className="text-xs text-slate-500">Analiză completă a performanței echipei</p>
            </div>
          </button>
          <button onClick={() => generateReport("recomandari")}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-all hover:-translate-y-0.5"
            style={{ borderColor: "#8b5cf6", backgroundColor: "#faf5ff" }}>
            <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: "#8b5cf6" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#8b5cf6" }}>Recomandări Manager</p>
              <p className="text-xs text-slate-500">Sugestii concrete bazate pe date reale</p>
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" style={{ color: type === "raport" ? "#00b5b5" : "#8b5cf6" }} />
                <h3 className="font-semibold text-slate-900">
                  {type === "raport" ? "Raport Lunar Inteligent" : "Recomandări pentru Manager"}
                </h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00b5b5" }} />
                  <p className="text-slate-500 text-sm">AI analizează datele echipei...</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {report.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm ${line.startsWith("#") ? "font-bold text-slate-900 text-base mt-4" : "text-slate-700"} ${line === "" ? "mb-2" : "mb-1"}`}>
                      {line.replace(/^#+\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: "#00b5b5" }}>
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}