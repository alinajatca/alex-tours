import React, { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";

export default function AIInsights({ employees, tasks, attendance, events }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [type, setType] = useState("");

 
  const monthStr = new Date().toISOString().slice(0, 7);

  const generateReport = async (reportType) => {
    setLoading(true);
    setOpen(true);
    setType(reportType);
    setReport("");

    try {
      const monthAttendance = attendance.filter(r => r.date?.startsWith(monthStr));
      const monthEvents = events.filter(e => e.date?.startsWith(monthStr));

      const calcHours = (empEmail) => {
        const empEvents = monthEvents.filter(e => e.employee_email === empEmail);
        let total = 0;
        const days = [...new Set(empEvents.map(e => e.date))];
        days.forEach(date => {
          const dayEvs = empEvents.filter(e => e.date === date).sort((a, b) => a.time?.localeCompare(b.time));
          let checkIn = null, breakStart = null, breakTime = 0;
          dayEvs.forEach(ev => {
            const t = ev.time?.split(":").map(Number);
            if (!t) return;
            const m = t[0] * 60 + t[1];
            if (ev.event_type === "check_in") checkIn = m;
            if (ev.event_type === "break_start") breakStart = m;
            if (ev.event_type === "break_end" && breakStart) { breakTime += m - breakStart; breakStart = null; }
            if (ev.event_type === "check_out" && checkIn) total += m - checkIn - breakTime;
          });
        });
        return Math.round(total / 60);
      };

      const empStats = employees.filter(e => e.status === "active").map(emp => ({
        name: emp.full_name,
        department: emp.department,
        productivity: emp.productivity_score || 0,
        prezente: monthAttendance.filter(r => r.employee_email === emp.email && r.status === "present").length,
        absente: monthAttendance.filter(r => r.employee_email === emp.email && r.status === "absent").length,
        ore: calcHours(emp.email),
        currentStatus: emp.current_status || "necunoscut",
        tasksDone: tasks.filter(t => t.assigned_to_email === emp.email && t.status === "done").length,
        tasksInProgress: tasks.filter(t => t.assigned_to_email === emp.email && t.status === "in_progress").length,
      }));

      const taskStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === "done").length,
        inProgress: tasks.filter(t => t.status === "in_progress").length,
        todo: tasks.filter(t => t.status === "todo").length,
        highPriority: tasks.filter(t => t.priority === "high" && t.status !== "done").length,
      };

      let prompt = "";

      if (reportType === "raport") {
        prompt = `Ești un asistent de management pentru agenția de turism Alex Tours. 
Analizează datele de mai jos și generează un raport lunar profesionist în limba română.
Raportul trebuie să fie structurat, clar și să ofere perspective utile managerului.

DATE LUNA ${monthStr}:

ANGAJAȚI ACTIVI: ${empStats.length}
${empStats.map(e => `- ${e.name} (${e.department}): ${e.prezente} zile prezent, ${e.absente} zile absent, ${e.ore} ore lucrate, ${e.tasksDone} sarcini finalizate, ${e.tasksInProgress} în progres, productivitate ${e.productivity}%`).join("\n")}

SARCINI:
- Total: ${taskStats.total}
- Finalizate: ${taskStats.done}
- În progres: ${taskStats.inProgress}
- De făcut: ${taskStats.todo}
- Urgente nerezolvate: ${taskStats.highPriority}

Generează un raport lunar care include:
1. Rezumat general al lunii
2. Performanța echipei
3. Angajatul lunii (cel mai productiv)
4. Puncte de îmbunătățit
5. Recomandări pentru luna următoare

Fii specific, folosește datele furnizate și scrie într-un ton profesionist dar accesibil.`;
      } else {
        prompt = `Ești un asistent de management pentru agenția de turism Alex Tours.
Analizează datele de mai jos și oferă recomandări concrete și acționabile pentru manager, în limba română.

DATE CURENTE:

ANGAJAȚI:
${empStats.map(e => `- ${e.name}: ${e.prezente} zile prezent luna aceasta, ${e.absente} absențe, ${e.ore} ore lucrate, status curent: ${e.currentStatus}, sarcini finalizate: ${e.tasksDone}`).join("\n")}

SARCINI URGENTE NEREZOLVATE: ${taskStats.highPriority}
SARCINI ÎN PROGRES: ${taskStats.inProgress}
SARCINI DE FĂCUT: ${taskStats.todo}

Oferă 5-7 recomandări concrete pentru manager, bazate pe datele de mai sus. 
Include:
- Angajați care necesită atenție (absențe mari, productivitate scăzută)
- Sarcini care riscă să nu fie finalizate
- Sugestii de îmbunătățire a productivității echipei
- Orice alte observații relevante

Fii direct și specific, folosind numele angajaților din date.`;
      }

     const response = await fetch("/api/claude", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  }),
});

      const data = await response.json();
      setReport(data.content?.[0]?.text || "Nu s-a putut genera raportul.");
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
            <p className="text-xs text-slate-400">Rapoarte și recomandări generate automat</p>
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
              <p className="text-xs text-slate-500">Sugestii bazate pe datele echipei</p>
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