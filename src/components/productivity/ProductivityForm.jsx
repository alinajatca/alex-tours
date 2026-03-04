import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const categories = [
  { value: "bookings", label: "Bookings" },
  { value: "customer_calls", label: "Customer Calls" },
  { value: "tour_planning", label: "Tour Planning" },
  { value: "marketing", label: "Marketing" },
  { value: "admin", label: "Admin" },
  { value: "training", label: "Training" },
  { value: "meetings", label: "Meetings" },
];

const ratings = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "below_average", label: "Below Average" },
  { value: "poor", label: "Poor" },
];

export default function ProductivityForm({ employees, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    employee_id: "",
    employee_name: "",
    date: new Date().toISOString().split("T")[0],
    hours_worked: "",
    tasks_completed: "",
    tasks_assigned: "",
    category: "",
    rating: "",
    notes: "",
  });

  const handleEmployeeChange = (id) => {
    const emp = employees.find((e) => e.id === id);
    setForm({ ...form, employee_id: id, employee_name: emp?.full_name || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      hours_worked: Number(form.hours_worked),
      tasks_completed: Number(form.tasks_completed),
      tasks_assigned: Number(form.tasks_assigned),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Log Productivity</h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100"><X className="h-4 w-4 text-slate-400" /></button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Employee *</Label>
          <Select value={form.employee_id} onValueChange={handleEmployeeChange}>
            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>
              {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Date *</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Hours Worked *</Label>
          <Input type="number" step="0.5" min="0" max="24" value={form.hours_worked} onChange={(e) => setForm({ ...form, hours_worked: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Tasks Completed</Label>
          <Input type="number" min="0" value={form.tasks_completed} onChange={(e) => setForm({ ...form, tasks_completed: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Tasks Assigned</Label>
          <Input type="number" min="0" value={form.tasks_assigned} onChange={(e) => setForm({ ...form, tasks_assigned: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Rating</Label>
          <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
            <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
            <SelectContent>
              {ratings.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium text-slate-500">Notes</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
        </div>
        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Log</Button>
        </div>
      </form>
    </div>
  );
}