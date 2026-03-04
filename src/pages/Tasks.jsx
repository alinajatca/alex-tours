import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle2, Circle, ArrowUpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const COLUMNS = [
  { id: "todo", label: "To Do", icon: Circle, color: "text-slate-400", bg: "bg-slate-50" },
  { id: "in_progress", label: "In Progress", icon: ArrowUpCircle, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
];

const priorityColors = { low: "bg-slate-100 text-slate-600", medium: "bg-amber-100 text-amber-700", high: "bg-red-100 text-red-700" };

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", assigned_to_email: "", assigned_to_name: "", due_date: "", status: "todo" });
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appClient.entities.Task.list("-created_date"),
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Assign and track work across the team</p>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <Motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onSubmit={handleCreate}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-500">Task Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="What needs to be done?" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-500">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Assign To</Label>
              <Select onValueChange={handleAssign}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Due Date</Label>
              <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Create Task</Button>
            </div>
          </Motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />)}</div>
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
                          <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-slate-400" : "text-slate-900"}`}>{task.title}</p>
                          <button onClick={e => { e.stopPropagation(); deleteMutation.mutate(task.id); }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 flex-shrink-0">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {task.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge className={`text-[10px] border-0 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                          {task.assigned_to_name && <span className="text-[10px] text-slate-400">→ {task.assigned_to_name}</span>}
                          {task.due_date && <span className="text-[10px] text-slate-400 ml-auto">{format(new Date(task.due_date), "MMM d")}</span>}
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
    </div>
  );
}