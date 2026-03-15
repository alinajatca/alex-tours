import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Clock, Users, Bell } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import { ro } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EVENT_COLORS = [
  { id: "teal", label: "Turcoaz", color: "#00b5b5" },
  { id: "purple", label: "Mov", color: "#8b5cf6" },
  { id: "amber", label: "Portocaliu", color: "#f59e0b" },
  { id: "red", label: "Roșu", color: "#ef4444" },
  { id: "green", label: "Verde", color: "#10b981" },
];

export default function Calendar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", date: "", time: "", duration: "60",
    description: "", color: "teal", notify: true,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: () => appClient.entities.CalendarEvent.list(),
    refetchInterval: 30000,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.CalendarEvent.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      setShowForm(false);
      setForm({ title: "", date: "", time: "", duration: "60", description: "", color: "teal", notify: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.CalendarEvent.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar-events"] }),
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const paddingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getEventsForDay = (day) =>
    events.filter(e => e.date === format(day, "yyyy-MM-dd"));

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (user?.isManager) {
      setForm(f => ({ ...f, date: format(day, "yyyy-MM-dd") }));
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.time) return;
    createMutation.mutate({
      ...form,
      created_by: user?.email,
      created_by_name: user?.full_name,
    });
  };

  // Notificari - verifica daca exista sedinte in urmatoarele 60 minute
  const now = new Date();
  const upcomingEvents = events.filter(e => {
    if (!e.date || !e.time) return false;
    const eventDate = new Date(`${e.date}T${e.time}`);
    const diff = (eventDate - now) / 60000;
    return diff > 0 && diff <= 60;
  });

  return (
    <div className="space-y-6">
      {/* Notificari */}
      {upcomingEvents.length > 0 && (
        <Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#fff8e1", border: "1px solid #f59e0b" }}>
          <Bell className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Ședință în curând!</p>
            {upcomingEvents.map(e => (
              <p key={e.id} className="text-xs text-amber-700">
                {e.title} - {e.time} ({e.date})
              </p>
            ))}
          </div>
        </Motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6">
          {/* Header luna */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: ro })}
            </h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Zile saptamana */}
          <div className="grid grid-cols-7 mb-2">
            {["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
            ))}
          </div>

          {/* Grid zile */}
          <div className="grid grid-cols-7 gap-1">
            {Array(paddingDays).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const isCurrentDay = isToday(day);
              return (
                <button key={day.toISOString()} onClick={() => handleDayClick(day)}
                  className="relative aspect-square flex flex-col items-center justify-start pt-1 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: isSelected ? "#00b5b5" : isCurrentDay ? "#f0fafa" : "transparent",
                    color: isSelected ? "white" : isCurrentDay ? "#00b5b5" : "#1e293b",
                  }}>
                  <span className="font-medium text-xs">{format(day, "d")}</span>
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {dayEvents.slice(0, 3).map((e, i) => {
                      const colorDef = EVENT_COLORS.find(c => c.id === e.color);
                      return (
                        <div key={i} className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? "white" : (colorDef?.color || "#00b5b5") }} />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel dreapta */}
        <div className="space-y-4">
          {/* Evenimente zi selectata */}
          {selectedDay && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {format(selectedDay, "d MMMM yyyy", { locale: ro })}
                </h3>
                {user?.isManager && (
                  <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                    style={{ backgroundColor: "#f0fafa", color: "#00b5b5" }}>
                    <Plus className="h-3.5 w-3.5" /> Adaugă
                  </button>
                )}
              </div>

              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-slate-400">Niciun eveniment în această zi</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(e => {
                    const colorDef = EVENT_COLORS.find(c => c.id === e.color);
                    return (
                      <div key={e.id} className="flex items-start gap-2 p-3 rounded-xl"
                        style={{ backgroundColor: `${colorDef?.color || "#00b5b5"}10` }}>
                        <div className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: colorDef?.color || "#00b5b5" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{e.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{e.time} · {e.duration} min</span>
                          </div>
                          {e.description && <p className="text-xs text-slate-400 mt-1">{e.description}</p>}
                        </div>
                        {user?.isManager && (
                          <button onClick={() => deleteMutation.mutate(e.id)}
                            className="text-slate-300 hover:text-red-400 transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Form adaugare */}
          <AnimatePresence>
            {showForm && user?.isManager && (
              <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm">Eveniment nou</h3>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Titlu *</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="ex: Ședință echipă" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Ora *</Label>
                  <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Durată (minute)</Label>
                  <Input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className="h-8 text-sm" min="15" step="15" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Descriere</Label>
                  <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detalii opționale..." className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Culoare</Label>
                  <div className="flex gap-2">
                    {EVENT_COLORS.map(c => (
                      <button key={c.id} onClick={() => setForm(f => ({ ...f, color: c.id }))}
                        className="h-6 w-6 rounded-full transition-transform"
                        style={{
                          backgroundColor: c.color,
                          transform: form.color === c.id ? "scale(1.3)" : "scale(1)",
                          outline: form.color === c.id ? `2px solid ${c.color}` : "none",
                          outlineOffset: "2px"
                        }} />
                    ))}
                  </div>
                </div>
                <Button onClick={handleSubmit} disabled={createMutation.isPending}
                  className="w-full text-sm h-8"
                  style={{ backgroundColor: "#00b5b5" }}>
                  {createMutation.isPending ? "Se salvează..." : "Salvează"}
                </Button>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Evenimente viitoare */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Evenimente Viitoare</h3>
            {events
              .filter(e => e.date >= format(new Date(), "yyyy-MM-dd"))
              .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
              .slice(0, 5)
              .map(e => {
                const colorDef = EVENT_COLORS.find(c => c.id === e.color);
                return (
                  <div key={e.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${colorDef?.color || "#00b5b5"}15` }}>
                      <Clock className="h-4 w-4" style={{ color: colorDef?.color || "#00b5b5" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.title}</p>
                      <p className="text-xs text-slate-400">{e.date} · {e.time}</p>
                    </div>
                  </div>
                );
              })}
            {events.filter(e => e.date >= format(new Date(), "yyyy-MM-dd")).length === 0 && (
              <p className="text-xs text-slate-400">Niciun eveniment viitor</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}