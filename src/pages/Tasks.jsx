import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle2, Circle, ArrowUpCircle, Trash2, Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";

const COLUMNS = [
  { id: "todo", label: "De făcut", icon: Circle, color: "text-slate-400", bg: "bg-slate-50" },
  { id: "in_progress", label: "În progres", icon: ArrowUpCircle, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "done", label: "Finalizat", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const priorityColors = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700"
};

const priorityLabels = { low: "Scăzut", medium: "Mediu", high: "Ridicat" };

const QUICK_ACTIONS = [
  { id: "prioritizeaza", label: "Prioritizează sarcinile mele", prompt: "Ajută-mă să prioritizez sarcinile mele de lucru. Am următoarele sarcini: " },
  { id: "descriere", label: "Scrie o descriere pentru sarcină", prompt: "Ajută-mă să scriu o descriere clară și profesională pentru următoarea sarcină: " },
  { id: "plan", label: "Plan de acțiune", prompt: "Creează un plan de acțiune pas cu pas pentru a finaliza următoarea sarcină: " },
  { id: "email", label: "Redactează un email", prompt: "Ajută-mă să redactez un email profesional pentru: " },
];

export default function Tasks() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    assigned_to_email: "", assigned_to_name: "", due_date: "", status: "todo"
  });
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appClient.entities.Task.list(),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowForm(false);
      setForm({ title: "", description: "", priority: "medium", assigned_to_email: "", assigned_to_name: "", due_date: "", status: "todo" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.Task.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.Task.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleAssign = (empId) => {
    const emp = employees.find(e => e.id === empId);
    setForm({ ...form, assigned_to_email: emp?.email || "", assigned_to_name: emp?.full_name || "" });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const cycleStatus = (task) => {
    const next = { todo: "in_progress", in_progress: "done", done: "todo" };
    updateMutation.mutate({ id: task.id, data: { status: next[task.status] } });
  };

  const sendChatMessage = async (messageText) => {
    const text = messageText || chatInput;
    if (!text.trim()) return;
    setChatInput("");
    setChatLoading(true);
    const newHistory = [...chatHistory, { role: "user", content: text }];
    setChatHistory(newHistory);
    try {
      const myTasks = tasks.filter(t => t.assigned_to_email === user?.email);
      const systemContext = `Ești un asistent AI pentru angajații agenției de turism Alex Tours din România.
Ajuți cu: prioritizarea sarcinilor, redactarea documentelor și emailurilor, planuri de acțiune, organizarea muncii.
${myTasks.length > 0 ? `Sarcinile curente ale utilizatorului: ${myTasks.map(t => `"${t.title}" (${t.status === "todo" ? "de făcut" : t.status === "in_progress" ? "în progres" : "finalizat"}, prioritate ${priorityLabels[t.priority]})`).join(", ")}` : ""}
Răspunde în română, profesionist și concis.`;
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemContext,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = data?.content?.[0]?.text || "Nu am putut genera un răspuns.";
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatHistory([...newHistory, { role: "assistant", content: "Eroare de conexiune. Încearcă din nou." }]);
    }
    setChatLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Atribuie și urmărește sarcinile echipei</p>
        <Button style={{ backgroundColor: "#00b5b5" }} onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Sarcină nouă
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <Motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onSubmit={handleCreate}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-500">Titlu sarcină *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Ce trebuie făcut?" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-500">Descriere</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Asignează la</Label>
              <Select onValueChange={handleAssign}>
                <SelectTrigger><SelectValue placeholder="Selectează angajat" /></SelectTrigger>
                <SelectContent>
                  {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Prioritate</Label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Scăzut</SelectItem>
                  <SelectItem value="medium">Mediu</SelectItem>
                  <SelectItem value="high">Ridicat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Termen limită</Label>
              <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Anulează</Button>
              <Button type="submit" style={{ backgroundColor: "#00b5b5" }}>Creează sarcină</Button>
            </div>
          </Motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className={`${col.bg} rounded-2xl p-4 min-h-[200px]`}>
                <div className="flex items-center gap-2 mb-4">
                  <col.icon className={`h-4 w-4 ${col.color}`} />
                  <span className="font-semibold text-sm text-slate-700">{col.label}</span>
                  <span className="ml-auto text-xs font-semibold text-slate-400 bg-white rounded-full px-2 py-0.5">{colTasks.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {colTasks.map((task) => (
                      <Motion.div key={task.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 group hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => cycleStatus(task)}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {task.title}
                          </p>
                          <button onClick={e => { e.stopPropagation(); deleteMutation.mutate(task.id); }}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 flex-shrink-0">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {task.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge className={`text-[10px] border-0 ${priorityColors[task.priority]}`}>
                            {priorityLabels[task.priority] || task.priority}
                          </Badge>
                          {task.assigned_to_name && <span className="text-[10px] text-slate-400">→ {task.assigned_to_name}</span>}
                          {task.due_date && <span className="text-[10px] text-slate-400 ml-auto">{format(new Date(task.due_date), "d MMM")}</span>}
                        </div>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buton AI fix în colțul din dreapta jos */}
      <div className="fixed bottom-6 right-6 z-40">
        <button onClick={() => setShowChat(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-medium text-sm shadow-lg hover:-translate-y-1 transition-all"
          style={{ backgroundColor: "#f59e0b" }}>
          <Sparkles className="h-5 w-5" />
          Asistent AI
        </button>
      </div>

      {/* Modal chat asistent */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <Motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fffbeb" }}>
                  <Sparkles className="h-4 w-4" style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Asistent Personal AI</h3>
                  <p className="text-xs text-slate-400">Ajutor cu sarcini, documente și organizare</p>
                </div>
              </div>
              <button onClick={() => { setShowChat(false); setChatHistory([]); setChatInput(""); }}
                className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {chatHistory.length === 0 && (
              <div className="p-4 border-b border-slate-100">
                <p className="text-xs text-slate-400 mb-3">Acțiuni rapide:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(action => (
                    <button key={action.id}
                      onClick={() => { setChatInput(action.prompt); }}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-left hover:border-amber-300 hover:bg-amber-50 transition-all">
                      <span className="text-xs font-medium text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-3" style={{ color: "#f59e0b" }} />
                  <p className="text-sm text-slate-500">Bună! Cum te pot ajuta cu sarcinile tale?</p>
                  <p className="text-xs text-slate-400 mt-1">Alege o acțiune rapidă sau scrie direct.</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}
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

            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                  placeholder="Scrie o întrebare sau cerere..."
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  disabled={chatLoading} />
                <button onClick={() => sendChatMessage()}
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50"
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
          </Motion.div>
        </div>
      )}
    </div>
  );
}