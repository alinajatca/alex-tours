import React, { useState } from "react";
import { Sparkles, X, Loader2, Send, BookOpen, Briefcase, FileText, MessageSquare } from "lucide-react";

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

const calcWorkingDays = (yearMonth) => {
  const [year, month] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month - 1, d).getDay();
    if (day !== 0 && day !== 6) workingDays++;
  }
  return workingDays;
};

const QUICK_ACTIONS = [
  { id: "redacteaza_email", label: "Redactează un email", icon: FileText, prompt: "Ajută-mă să redactez un email profesionist pentru " },
  { id: "organizeaza_zi", label: "Organizează-mi ziua", icon: Briefcase, prompt: "Ajută-mă să îmi organizez ziua de lucru eficient. Am următoarele sarcini: " },
  { id: "analizeaza_feedback", label: "Analizează feedback", icon: MessageSquare, prompt: "Analizează următorul feedback și sugerează cum să răspund profesionist: " },
  { id: "plan_invatare", label: "Plan de învățare", icon: BookOpen, prompt: "Creează un plan scurt de învățare pentru a îmbunătăți competențele în domeniul: " },
];

export default function AIInsights({ employees, tasks, attendance, user }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [type, setType] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const monthStr = new Date().toISOString().slice(0, 7);
  const today = new Date();
  const workingDaysInMonth = calcWorkingDays(monthStr);

  const callClaude = async (prompt, maxTokens = 1500) => {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    return data?.content?.[0]?.text || "Nu s-a putut genera răspunsul.";
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    setOpen(true);
    setType(reportType);
    setReport("");

    try {
      const monthAttendance = attendance.filter(r => r.date?.startsWith(monthStr));

      const empStats = employees.filter(e => e.status === "active").map(emp => {
        const empAtt = monthAttendance.filter(a => a.employee_email === emp.email);
        const prezente = Math.min(empAtt.filter(a => a.status === "present").length, workingDaysInMonth);
        const absente = empAtt.filter(a => a.status === "absent").length;
        const LIMIT = 9 * 60 + 15;
        const cuCheckin = empAtt.filter(a => a.status === "present" && a.check_in);
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
        return { name: emp.full_name, department: emp.department, role: emp.role, score, prezente, absente, tarziu, tasksDone, tasksActive, tasksOverdue };
      });

      const taskStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === "done").length,
        overdue: tasks.filter(t => t.status !== "done" && t.due_date && new Date(t.due_date) < today).length,
        highPriority: tasks.filter(t => t.priority === "high" && t.status !== "done").length,
      };

      let prompt = "";

      if (reportType === "dezvoltare") {
        prompt = `Ești un consultant HR pentru agenția de turism Alex Tours din România.
Analizează datele de mai jos și creează planuri de dezvoltare profesională personalizate pentru fiecare angajat.
Luna: ${monthStr} | Zile lucrătoare: ${workingDaysInMonth}

ANGAJAȚI:
${empStats.map(e =>
  `- ${e.name} (${e.department}, ${e.role}): prezent ${e.prezente}/${workingDaysInMonth} zile, ${e.tarziu} întârzieri, sarcini finalizate ${e.tasksDone}/${e.tasksDone + e.tasksActive}, restante ${e.tasksOverdue}, scor ${e.score}%`
).join("\n")}

Pentru FIECARE angajat creează un plan scurt care include:
1. Puncte forte identificate din date
2. Arii de îmbunătățire
3. 2-3 recomandări concrete de training sau dezvoltare relevante pentru turism
4. Obiectiv pentru luna următoare

Fii specific și constructiv. Bazează-te STRICT pe datele furnizate.`;

      } else {
        prompt = `Ești un asistent de management HR pentru agenția de turism Alex Tours din România.
Analizează datele și oferă recomandări concrete pentru manager.
Luna: ${monthStr} | Zile lucrătoare: ${workingDaysInMonth}

ANGAJAȚI (maxim ${workingDaysInMonth} zile prezență posibilă):
${empStats.sort((a, b) => b.score - a.score).map(e =>
  `- ${e.name} (${e.department}): prezent ${e.prezente}/${workingDaysInMonth} zile (${Math.round(e.prezente/workingDaysInMonth*100)}%), ${e.tarziu} întârzieri, sarcini ${e.tasksDone} finalizate/${e.tasksDone + e.tasksActive} total, ${e.tasksOverdue} restante, scor ${e.score}%`
).join("\n")}

SARCINI: ${taskStats.done} finalizate din ${taskStats.total} total | ${taskStats.overdue} restante | ${taskStats.highPriority} urgente

Oferă 5-6 recomandări concrete. Dacă un angajat are mai mult de ${workingDaysInMonth} zile prezență în date, ignoră acea valoare ca eroare.
Fii direct și bazează-te DOAR pe datele furnizate.`;
      }

      const text = await callClaude(prompt);
      setReport(text);
    } catch (err) {
      console.error(err);
      setReport("Eroare la generarea raportului. Verificați cheia API.");
    }
    setLoading(false);
  };

  const sendChatMessage = async (messageText) => {
    const text = messageText || chatInput;
    if (!text.trim()) return;
    setChatInput("");
    setChatLoading(true);

    const newHistory = [...chatHistory, { role: "user", content: text }];
    setChatHistory(newHistory);

    try {
      const systemContext = `Ești un asistent AI pentru angajații agenției de turism Alex Tours din România.
Ajuți angajații cu: redactarea documentelor și emailurilor profesionale, organizarea muncii și prioritizarea sarcinilor, analiza și răspunsul la feedback, planuri de învățare și dezvoltare profesională, orice altă solicitare legată de activitatea profesională.
Răspunde întotdeauna în limba română, profesionist și concis.`;

      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemContext,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = data?.content?.[0]?.text || "Nu am putut genera un răspuns.";
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (err_) {
      setChatHistory([...newHistory, { role: "assistant", content: "Eroare de conexiune. Încearcă din nou." }]);
    }
    setChatLoading(false);
  };

  const handleQuickAction = (action) => {
    setShowChat(true);
    setChatInput(action.prompt);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0fafa" }}>
            <Sparkles className="h-5 w-5" style={{ color: "#00b5b5" }} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Asistent AI</h3>
            <p className="text-xs text-slate-400">Analize, planuri de dezvoltare și suport pentru echipă</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Buton 1 - doar manager */}
          {user?.isManager && (
            <button onClick={() => generateReport("dezvoltare")}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-all hover:-translate-y-0.5"
              style={{ borderColor: "#00b5b5", backgroundColor: "#f0fafa" }}>
              <BookOpen className="h-5 w-5 flex-shrink-0" style={{ color: "#00b5b5" }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: "#00b5b5" }}>Planuri de Dezvoltare</p>
                <p className="text-xs text-slate-500">Traininguri și obiective per angajat</p>
              </div>
            </button>
          )}

          {/* Buton 2 - doar manager */}
          {user?.isManager && (
            <button onClick={() => generateReport("recomandari")}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-all hover:-translate-y-0.5"
              style={{ borderColor: "#8b5cf6", backgroundColor: "#faf5ff" }}>
              <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: "#8b5cf6" }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: "#8b5cf6" }}>Recomandări Manager</p>
                <p className="text-xs text-slate-500">Sugestii bazate pe datele echipei</p>
              </div>
            </button>
          )}

          {/* Buton Asistent - toți angajații */}
          <button onClick={() => setShowChat(true)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed text-left transition-all hover:-translate-y-0.5 ${user?.isManager ? "" : "sm:col-span-2"}`}
            style={{ borderColor: "#f59e0b", backgroundColor: "#fffbeb" }}>
            <MessageSquare className="h-5 w-5 flex-shrink-0" style={{ color: "#f59e0b" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#f59e0b" }}>Asistent Personal AI</p>
              <p className="text-xs text-slate-500">Ajutor cu documente, organizare și feedback</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modal rapoarte manager */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {type === "dezvoltare"
                  ? <BookOpen className="h-5 w-5" style={{ color: "#00b5b5" }} />
                  : <Sparkles className="h-5 w-5" style={{ color: "#8b5cf6" }} />}
                <h3 className="font-semibold text-slate-900">
                  {type === "dezvoltare" ? "Planuri de Dezvoltare Profesională" : "Recomandări pentru Manager"}
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

      {/* Modal chat asistent */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fffbeb" }}>
                  <Sparkles className="h-4 w-4" style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Asistent Personal AI</h3>
                  <p className="text-xs text-slate-400">Ajutor cu documente, organizare și feedback</p>
                </div>
              </div>
              <button onClick={() => { setShowChat(false); setChatHistory([]); setChatInput(""); }}
                className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Butoane rapide - vizibile doar când nu e chat activ */}
            {chatHistory.length === 0 && (
              <div className="p-4 border-b border-slate-100">
                <p className="text-xs text-slate-400 mb-3">Acțiuni rapide:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(action => (
                    <button key={action.id} onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-left hover:border-amber-300 hover:bg-amber-50 transition-all">
                      <action.icon className="h-4 w-4 flex-shrink-0 text-amber-500" />
                      <span className="text-xs font-medium text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mesaje chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-3" style={{ color: "#f59e0b" }} />
                  <p className="text-sm text-slate-500">Bună! Cum te pot ajuta astăzi?</p>
                  <p className="text-xs text-slate-400 mt-1">Poți folosi acțiunile rapide sau scrie direct întrebarea ta.</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}
                    style={msg.role === "user" ? { backgroundColor: "#00b5b5" } : {}}>
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j} className={line === "" ? "mb-2" : "mb-0.5"}>
                        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Input chat */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                  placeholder="Scrie o întrebare sau cerere..."
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  disabled={chatLoading}
                />
                <button onClick={() => sendChatMessage()}
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: "#f59e0b" }}>
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {chatHistory.length > 0 && (
                <button onClick={() => setChatHistory([])}
                  className="text-xs text-slate-400 hover:text-slate-600 mt-2 w-full text-center">
                  Șterge conversația
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}