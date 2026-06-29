import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";
import { CheckCircle, Clock, Coffee, LogOut, PlayCircle, MapPin, Users, Home, Download, X, Check, CalendarDays, TrendingUp, Timer, Sun, Umbrella } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const WORK_LOCATIONS = [
  { id: "acasa", label: "Acasă", icon: Home, color: "#00b5b5" },
  { id: "teren", label: "În teren", icon: MapPin, color: "#f59e0b" },
];

const LEAVE_TYPES = [
  { id: "concediu_odihna", label: "Concediu de odihnă" },
  { id: "concediu_medical", label: "Concediu medical" },
  { id: "concediu_fara_plata", label: "Fără plată" },
];

const TOTAL_VACATION_DAYS = 21;

const HOLIDAYS_2026 = [
  { date: "2026-01-01", label: "Anul Nou" },
  { date: "2026-01-02", label: "Anul Nou" },
  { date: "2026-01-06", label: "Boboteaza" },
  { date: "2026-01-07", label: "Sf. Ion" },
  { date: "2026-04-10", label: "Vinerea Mare" },
  { date: "2026-04-12", label: "Paștele Ortodox" },
  { date: "2026-04-13", label: "Paștele Ortodox" },
  { date: "2026-05-01", label: "Ziua Muncii" },
  { date: "2026-05-03", label: "Paștele Catolic" },
  { date: "2026-06-01", label: "Ziua Copilului" },
  { date: "2026-06-07", label: "Rusaliile" },
  { date: "2026-06-08", label: "Rusaliile" },
  { date: "2026-08-15", label: "Sf. Maria" },
  { date: "2026-11-30", label: "Sf. Andrei" },
  { date: "2026-12-01", label: "Ziua Națională" },
  { date: "2026-12-25", label: "Crăciunul" },
  { date: "2026-12-26", label: "Crăciunul" },
];

const MANAGER_TABS = [
  { id: "prezenta", label: "Prezență Azi", icon: Clock },
  { id: "pontaj", label: "Pontaj", icon: Download },
  { id: "concedii", label: "Concedii", icon: Umbrella },
  { id: "sarbatori", label: "Zile Libere", icon: Sun },
];

function calcHours(evs) {
  let total = 0, breakTime = 0, checkIn = null, breakStart = null;
  evs.forEach(e => {
    const t = e.time ? e.time.split(":").map(Number) : null;
    if (!t) return;
    const min = t[0] * 60 + t[1];
    if (e.event_type === "check_in") checkIn = min;
    if (e.event_type === "break_start" || e.event_type === "meeting_start") breakStart = min;
    if ((e.event_type === "break_end" || e.event_type === "meeting_end") && breakStart) {
      breakTime += min - breakStart; breakStart = null;
    }
    if (e.event_type === "check_out" && checkIn) total = min - checkIn - breakTime;
  });
  if (total <= 0) return null;
  return Math.floor(total / 60) + "h" + (total % 60 > 0 ? " " + total % 60 + "min" : "");
}

function calcOvertimeMin(evs) {
  let total = 0, breakTime = 0, checkIn = null, breakStart = null;
  evs.forEach(e => {
    const t = e.time ? e.time.split(":").map(Number) : null;
    if (!t) return;
    const min = t[0] * 60 + t[1];
    if (e.event_type === "check_in") checkIn = min;
    if (e.event_type === "break_start" || e.event_type === "meeting_start") breakStart = min;
    if ((e.event_type === "break_end" || e.event_type === "meeting_end") && breakStart) {
      breakTime += min - breakStart; breakStart = null;
    }
    if (e.event_type === "check_out" && checkIn) total = min - checkIn - breakTime;
  });
  return total > 480 ? total - 480 : 0;
}

function countBusinessDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    const dateStr = cur.toISOString().split("T")[0];
    if (day !== 0 && day !== 6 && !HOLIDAYS_2026.find(h => h.date === dateStr)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function eventLabel(ev) {
  const map = {
    check_in: "Început zi", check_out: "Sfârșit zi",
    break_start: "Început pauză", break_end: "Sfârșit pauză",
    meeting_start: "Intrat în ședință", meeting_end: "Ieșit din ședință",
    overtime_start: "Început ore suplimentare",
  };
  return map[ev.event_type] || ev.event_type;
}

function eventColor(ev) {
  const map = {
    check_in: "#00b5b5", check_out: "#ef4444",
    break_start: "#f59e0b", break_end: "#f59e0b",
    meeting_start: "#8b5cf6", meeting_end: "#8b5cf6",
    overtime_start: "#f97316",
  };
  return map[ev.event_type] || "#00b5b5";
}

function ActionBtn({ onClick, color, icon: Icon, label, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-white disabled:opacity-60 w-full transition-all hover:opacity-90"
      style={{ backgroundColor: color }}>
      {Icon && <Icon className="h-4 w-4" />} {label}
    </button>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState("acasa");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "concediu_odihna", start_date: "", end_date: "", reason: "", employee_email: "", employee_name: "" });
  const [exportMonth, setExportMonth] = useState(format(new Date(), "yyyy-MM"));
  const [activeTab, setActiveTab] = useState("prezenta");
  const todayStr = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear().toString();

  const { data: employees = [] } = useQuery({ queryKey: ["employees"], queryFn: () => appClient.entities.Employee.list() });
  const { data: records = [] } = useQuery({ queryKey: ["attendance"], queryFn: () => appClient.entities.Attendance.list(500), refetchInterval: 15000 });
  const { data: events = [] } = useQuery({ queryKey: ["attendance-events"], queryFn: () => appClient.entities.AttendanceEvent.list(500), refetchInterval: 15000 });
  const { data: leaveRequests = [] } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: () => appClient.entities.LeaveRequest.list(500),
    refetchInterval: 30000,
  });

  const createRecord = useMutation({ mutationFn: d => appClient.entities.Attendance.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }) });
  const createEvent = useMutation({ mutationFn: d => appClient.entities.AttendanceEvent.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance-events"] }) });
  const updateEmp = useMutation({ mutationFn: ({ id, data }) => appClient.entities.Employee.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }) });
  const createLeave = useMutation({
    mutationFn: d => appClient.entities.LeaveRequest.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leave-requests"] });
      setShowLeaveModal(false);
      setLeaveForm({ type: "concediu_odihna", start_date: "", end_date: "", reason: "", employee_email: "", employee_name: "" });
    }
  });
  const updateLeave = useMutation({ mutationFn: ({ id, data }) => appClient.entities.LeaveRequest.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["leave-requests"] }) });

  const myEmployee = employees.find(e => e.email === user?.email);
  const myTodayRecord = records.find(r => r.employee_email === user?.email && r.date === todayStr);
  const myTodayEvents = events
    .filter(e => e.employee_email === user?.email && e.date === todayStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const lastEv = myTodayEvents[myTodayEvents.length - 1];
  const hasIn = myTodayEvents.some(e => e.event_type === "check_in");
  const hasOut = myTodayEvents.some(e => e.event_type === "check_out");
  const onBreak = lastEv?.event_type === "break_start";
  const inMeeting = lastEv?.event_type === "meeting_start";
  const hasOvertime = myTodayEvents.some(e => e.event_type === "overtime_start");
  const hoursWorked = calcHours(myTodayEvents);
  const isAfterWork = new Date().getHours() >= 17;
  const isPending = createEvent.isPending;

  const pendingLeaves = leaveRequests.filter(r => r.status === "pending");
  const myLeaves = leaveRequests.filter(r => r.employee_email === user?.email);

  const vacationUsedPerEmployee = employees.reduce((acc, emp) => {
    const approved = leaveRequests.filter(r =>
      r.employee_email === emp.email &&
      r.status === "approved" &&
      r.type === "concediu_odihna" &&
      r.start_date?.startsWith(currentYear)
    );
    acc[emp.email] = approved.reduce((sum, r) => sum + countBusinessDays(r.start_date, r.end_date), 0);
    return acc;
  }, {});

  const logEvent = async (eventType) => {
    const now = format(new Date(), "HH:mm");
    const empName = myEmployee?.full_name || user?.email;
    try {
      await createEvent.mutateAsync({
        employee_email: user?.email,
        employee_name: empName,
        date: todayStr,
        time: now,
        event_type: eventType,
      });
      const statusMap = {
        check_in: selectedLocation,
        break_start: "pauza",
        break_end: selectedLocation,
        meeting_start: "sedinta",
        meeting_end: selectedLocation,
        overtime_start: selectedLocation,
        check_out: "indisponibil",
      };
      if (eventType === "check_in" && !myTodayRecord) {
        await createRecord.mutateAsync({
          employee_email: user?.email,
          employee_name: empName,
          date: todayStr,
          check_in: now,
          status: "present",
          work_location: selectedLocation,
        });
      }
      if (myEmployee && statusMap[eventType]) {
        await updateEmp.mutateAsync({ id: myEmployee.id, data: { current_status: statusMap[eventType] } });
      }
    } catch (err) { console.error(err); }
  };

  const leaveStyle = s => s === "approved"
    ? { bg: "#f0fdf4", color: "#16a34a", label: "Aprobat" }
    : s === "rejected"
    ? { bg: "#fef2f2", color: "#ef4444", label: "Respins" }
    : { bg: "#fffbeb", color: "#f59e0b", label: "În așteptare" };

  const openLeaveModal = (empEmail = "", empName = "") => {
    setLeaveForm({ type: "concediu_odihna", start_date: "", end_date: "", reason: "", employee_email: empEmail, employee_name: empName });
    setShowLeaveModal(true);
  };

  const submitLeave = () => {
    if (!leaveForm.start_date || !leaveForm.end_date) return;
    const empEmail = user?.isManager ? (leaveForm.employee_email || user?.email) : user?.email;
    const empName = user?.isManager ? (leaveForm.employee_name || myEmployee?.full_name || user?.email) : (myEmployee?.full_name || user?.email);
    createLeave.mutate({
      employee_email: empEmail,
      employee_name: empName,
      type: leaveForm.type,
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      reason: leaveForm.reason,
      status: user?.isManager ? "approved" : "pending",
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const recs = records.filter(r => r.date?.startsWith(exportMonth));
    doc.setFontSize(18); doc.setTextColor(0, 181, 181); doc.text("Alex Tours - Raport Prezenta", 14, 20);
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text("Luna: " + exportMonth, 14, 30);
    doc.text("Generat: " + format(new Date(), "dd.MM.yyyy HH:mm"), 14, 37);
    autoTable(doc, {
      startY: 45,
      head: [["Angajat", "Data", "Check-in", "Status", "Locatie"]],
      body: recs.map(r => [r.employee_name || "-", r.date || "-", r.check_in || "-", r.status === "present" ? "Prezent" : "Absent", r.work_location || "-"]),
      headStyles: { fillColor: [0, 181, 181], textColor: 255 },
    });
    doc.save("prezenta-" + exportMonth + ".pdf");
  };

  return (
    <div className="space-y-6">

      {/* ANGAJAT */}
      {!user?.isManager && (
        <>
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: "#00b5b5" }} />
              Ziua Mea — {format(new Date(), "d MMMM yyyy")}
            </h3>

            {myTodayEvents.length > 0 && (
              <div className="mb-5 border-l-2 border-slate-100 pl-4 ml-1 space-y-2">
                {myTodayEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm relative">
                    <div className="h-2 w-2 rounded-full absolute -left-5" style={{ backgroundColor: eventColor(ev) }} />
                    <span className="text-slate-400 font-mono w-12 flex-shrink-0">{ev.time}</span>
                    <span className="text-slate-700">{eventLabel(ev)}</span>
                  </div>
                ))}
                {hoursWorked && (
                  <p className="text-sm font-semibold pt-2 border-t border-slate-100" style={{ color: "#00b5b5" }}>
                    ✓ Total ore lucrate: {hoursWorked}
                  </p>
                )}
              </div>
            )}

            {hasIn && !hasOut && (
              <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"
                style={{
                  backgroundColor: onBreak ? "#fffbeb" : inMeeting ? "#f5f3ff" : "#f0fafa",
                  color: onBreak ? "#f59e0b" : inMeeting ? "#8b5cf6" : "#00b5b5"
                }}>
                {onBreak ? <Coffee className="h-4 w-4" /> : inMeeting ? <Users className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                {onBreak ? "Ești în pauză" : inMeeting ? "Ești în ședință" : "Lucrezi activ"}
              </div>
            )}

            {!hasIn && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Unde lucrezi azi?</p>
                <div className="grid grid-cols-2 gap-2">
                  {WORK_LOCATIONS.map(s => (
                    <button key={s.id} onClick={() => setSelectedLocation(s.id)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-medium transition-all"
                      style={{
                        borderColor: selectedLocation === s.id ? s.color : "#e2e8f0",
                        backgroundColor: selectedLocation === s.id ? s.color + "15" : "white",
                        color: selectedLocation === s.id ? s.color : "#64748b",
                      }}>
                      <s.icon className="h-5 w-5" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {!hasIn && (
                <ActionBtn onClick={() => logEvent("check_in")} color="#00b5b5" icon={PlayCircle}
                  label={"Începe ziua de lucru — " + format(new Date(), "HH:mm")} disabled={isPending} />
              )}
              {hasIn && !hasOut && !onBreak && !inMeeting && (
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn onClick={() => logEvent("break_start")} color="#f59e0b" icon={Coffee} label="Pauză" disabled={isPending} />
                  <ActionBtn onClick={() => logEvent("meeting_start")} color="#8b5cf6" icon={Users} label="Intru în ședință" disabled={isPending} />
                  {isAfterWork && !hasOvertime && (
                    <ActionBtn onClick={() => logEvent("overtime_start")} color="#f97316" icon={Timer} label="Ore suplimentare" disabled={isPending} />
                  )}
                  <ActionBtn onClick={() => logEvent("check_out")} color="#ef4444" icon={LogOut}
                    label={"Sfârșit zi — " + format(new Date(), "HH:mm")} disabled={isPending} />
                </div>
              )}
              {hasIn && !hasOut && onBreak && (
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn onClick={() => logEvent("break_end")} color="#00b5b5" icon={PlayCircle} label="Reiau lucrul" disabled={isPending} />
                  <ActionBtn onClick={() => logEvent("check_out")} color="#ef4444" icon={LogOut} label="Sfârșit zi" disabled={isPending} />
                </div>
              )}
              {hasIn && !hasOut && inMeeting && (
                <div className="grid grid-cols-2 gap-2">
                  <ActionBtn onClick={() => logEvent("meeting_end")} color="#8b5cf6" icon={Users} label="Ies din ședință" disabled={isPending} />
                  <ActionBtn onClick={() => logEvent("check_out")} color="#ef4444" icon={LogOut} label="Sfârșit zi" disabled={isPending} />
                </div>
              )}
              {isAfterWork && hasIn && !hasOut && (
                <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ backgroundColor: "#fff7ed", color: "#f97316" }}>
                  <Timer className="h-4 w-4 flex-shrink-0" />
                  Programul s-a încheiat la 17:00. Orele lucrate acum sunt ore suplimentare (art. 120 Codul Muncii).
                </div>
              )}
              {hasOut && (
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#f0fafa" }}>
                  <CheckCircle className="h-6 w-6" style={{ color: "#00b5b5" }} />
                  <div>
                    <p className="font-medium text-slate-900">Zi de lucru încheiată!</p>
                    {hoursWorked && <p className="text-sm text-slate-500">Total: {hoursWorked}</p>}
                  </div>
                </div>
              )}
            </div>
          </Motion.div>

          {/* Cereri concediu angajat */}
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" style={{ color: "#00b5b5" }} />
                Cererile Mele de Concediu
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {vacationUsedPerEmployee[user?.email] || 0}/{TOTAL_VACATION_DAYS} zile folosite
                </span>
                <button onClick={() => openLeaveModal()}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: "#00b5b5" }}>
                  + Cerere nouă
                </button>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="h-2 rounded-full transition-all"
                  style={{
                    width: Math.min((vacationUsedPerEmployee[user?.email] || 0) / TOTAL_VACATION_DAYS * 100, 100) + "%",
                    backgroundColor: (vacationUsedPerEmployee[user?.email] || 0) >= TOTAL_VACATION_DAYS ? "#ef4444" : "#00b5b5"
                  }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {TOTAL_VACATION_DAYS - (vacationUsedPerEmployee[user?.email] || 0)} zile rămase din {TOTAL_VACATION_DAYS} zile legale {currentYear}
              </p>
            </div>
            {myLeaves.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Nicio cerere înregistrată</p>
            ) : (
              <div className="space-y-3">
                {myLeaves.map(req => {
                  const s = leaveStyle(req.status);
                  const days = countBusinessDays(req.start_date, req.end_date);
                  return (
                    <div key={req.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{LEAVE_TYPES.find(t => t.id === req.type)?.label || req.type}</p>
                        <p className="text-xs text-slate-400">{req.start_date} - {req.end_date} · {days} {days === 1 ? "zi" : "zile"}{req.reason && " · " + req.reason}</p>
                        {req.reviewed_by && <p className="text-xs text-slate-400">Revizuit de {req.reviewed_by}</p>}
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Motion.div>

          {/* Zile libere legale */}
          <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Zile Libere Legale {currentYear}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOLIDAYS_2026.map(h => {
                const isPast = h.date < todayStr;
                const isToday = h.date === todayStr;
                return (
                  <div key={h.date} className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ backgroundColor: isToday ? "#f0fafa" : isPast ? "#f8fafc" : "#fffbeb" }}>
                    <Umbrella className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: isToday ? "#00b5b5" : isPast ? "#94a3b8" : "#f59e0b" }} />
                    <div>
                      <p className="text-xs font-medium" style={{ color: isPast ? "#94a3b8" : "#1e293b" }}>{h.label}</p>
                      <p className="text-xs" style={{ color: isPast ? "#cbd5e1" : "#64748b" }}>
                        {format(new Date(h.date), "d MMMM yyyy")}
                      </p>
                    </div>
                    {isToday && <span className="ml-auto text-xs font-bold" style={{ color: "#00b5b5" }}>Azi!</span>}
                  </div>
                );
              })}
            </div>
          </Motion.div>
        </>
      )}

      {/* MANAGER CU TABURI */}
      {user?.isManager && (
        <>
          {/* Tab-uri */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-2 flex gap-1">
            {MANAGER_TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const hasBadge = tab.id === "concedii" && pendingLeaves.length > 0;
              return (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all relative"
                  style={{
                    backgroundColor: isActive ? "#00b5b5" : "transparent",
                    color: isActive ? "white" : "#64748b",
                  }}>
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {hasBadge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                      style={{ backgroundColor: "#f59e0b", fontSize: "10px" }}>
                      {pendingLeaves.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB: Prezenta Azi */}
          {activeTab === "prezenta" && (
            <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: records.filter(r => r.date === todayStr && r.status === "present").length, label: "Prezenți Azi", color: "#00b5b5" },
                  { val: records.filter(r => r.date === todayStr && r.status === "absent").length, label: "Absenți Azi", color: "#ef4444" },
                  { val: employees.filter(e => e.status === "active").length, label: "Angajați Activi", color: "#8b5cf6" },
                ].map(({ val, label, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center">
                    <p className="text-3xl font-bold" style={{ color }}>{val}</p>
                    <p className="text-sm text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: "#00b5b5" }} />
                  Check-in-uri azi — {format(new Date(), "d MMMM yyyy")}
                </h3>
                {records.filter(r => r.date === todayStr).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">Niciun check-in înregistrat azi</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {records.filter(r => r.date === todayStr)
                      .sort((a, b) => (a.check_in || "").localeCompare(b.check_in || ""))
                      .map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: r.status === "present" ? "#00b5b5" : "#ef4444" }} />
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: "#00b5b5" }}>
                            {r.employee_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-700 flex-1">{r.employee_name}</span>
                          <span className="text-xs font-mono text-slate-400">{r.check_in || "—"}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: r.work_location === "teren" ? "#fff8e1" : "#f0fafa",
                              color: r.work_location === "teren" ? "#b45309" : "#0f6e56"
                            }}>
                            {r.work_location === "acasa" ? "Acasă" : r.work_location === "teren" ? "În teren" : r.work_location || "—"}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Motion.div>
          )}

          {/* TAB: Pontaj */}
          {activeTab === "pontaj" && (
            <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900">Raport Pontaj per Angajat</h3>
                  <input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm" />
                </div>
                <div className="space-y-3">
{employees.filter(e => e.status === "active").map(emp => {
  const empEvs = events.filter(ev => ev.employee_email === emp.email && ev.date?.startsWith(exportMonth));
  const empRecs = records.filter(r => r.employee_email === emp.email && r.date?.startsWith(exportMonth));
  const prez = empRecs.filter(r => r.status === "present").length;
  const abs = empRecs.filter(r => r.status === "absent").length;
  let totalMin = 0, otMin = 0;
  [...new Set(empEvs.map(e => e.date))].forEach(date => {
    const de = empEvs.filter(e => e.date === date).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    let ci = null, bs = null, bt = 0, dt = 0;
    de.forEach(ev => {
      const t = ev.time?.split(":").map(Number);
      if (!t) return;
      const m = t[0] * 60 + t[1];
      if (ev.event_type === "check_in") ci = m;
      if (ev.event_type === "break_start" || ev.event_type === "meeting_start") bs = m;
      if ((ev.event_type === "break_end" || ev.event_type === "meeting_end") && bs) { bt += m - bs; bs = null; }
      if (ev.event_type === "check_out" && ci) dt = m - ci - bt;
    });
    totalMin += dt;
    if (dt > 480) otMin += dt - 480;
  });
  return { emp, empEvs, empRecs, prez, abs, totalMin, otMin };
})
.sort((a, b) => b.totalMin - a.totalMin)
.map(({ emp, empEvs, empRecs, prez, abs, totalMin, otMin }) => {
  const ore = totalMin > 0 ? Math.floor(totalMin / 60) + "h" + (totalMin % 60 > 0 ? " " + totalMin % 60 + "min" : "") : "—";
  const ot = otMin > 0 ? Math.floor(otMin / 60) + "h" + (otMin % 60 > 0 ? " " + otMin % 60 + "min" : "") : null;
  const otZ = [...new Set(empEvs.map(e => e.date))].filter(d => calcOvertimeMin(empEvs.filter(e => e.date === d)) > 0).length;

                    return (
                      <div key={emp.id} className="rounded-xl border border-slate-100 hover:border-slate-200 overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ backgroundColor: "#00b5b5" }}>
                            {emp.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm">{emp.full_name}</p>
                            <p className="text-xs text-slate-400">{emp.department}</p>
                          </div>
                          <div className="flex items-center gap-4 text-center">
                            <div><p className="text-lg font-bold" style={{ color: "#00b5b5" }}>{prez}</p><p className="text-xs text-slate-400">Prezent</p></div>
                            <div><p className="text-lg font-bold text-red-400">{abs}</p><p className="text-xs text-slate-400">Absent</p></div>
                            <div><p className="text-lg font-bold text-slate-700">{ore}</p><p className="text-xs text-slate-400">Ore</p></div>
                            {ot && (
                              <div className="px-3 py-1 rounded-xl" style={{ backgroundColor: "#fffbeb" }}>
                                <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>{ot}</p>
                                <p className="text-xs" style={{ color: "#f59e0b" }}>Supl. ({otZ}z)</p>
                              </div>
                            )}
                          </div>
                          <button onClick={() => {
                            const doc = new jsPDF();
                            const pw = doc.internal.pageSize.getWidth();
                            doc.setFillColor(26, 58, 58); doc.rect(0, 0, pw, 40, "F");
                            doc.setFontSize(20); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.text("ALEX TOURS", 14, 18);
                            doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.setTextColor(0, 181, 181); doc.text("Raport Pontaj Lunar", 14, 28);
                            doc.setTextColor(255, 255, 255); doc.text("Generat: " + format(new Date(), "dd.MM.yyyy HH:mm"), pw - 14, 28, { align: "right" });
                            doc.setFillColor(240, 250, 250); doc.rect(0, 40, pw, 35, "F");
                            doc.setFontSize(14); doc.setTextColor(26, 58, 58); doc.setFont("helvetica", "bold"); doc.text(emp.full_name, 14, 55);
                            doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
                            doc.text("Departament: " + (emp.department || "—"), 14, 65);
                            doc.text("Perioada: " + exportMonth, pw / 2, 65, { align: "center" });
                            doc.text("Email: " + emp.email, pw - 14, 65, { align: "right" });
                            const col = (pw - 28) / 4;
                            [[0, 181, 181, String(prez), "Zile Prezente"], [239, 68, 68, String(abs), "Zile Absente"], [26, 58, 58, ore, "Total Ore"], [245, 158, 11, ot || "0h", "Ore Supl."]].forEach(([r, g, b, v, l], i) => {
                              const x = 14 + col * i;
                              doc.setFillColor(r, g, b); doc.rect(x, 85, col - 4, 30, "F");
                              doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
                              doc.text(v, x + (col - 4) / 2, 97, { align: "center" });
                              doc.setFontSize(7); doc.setFont("helvetica", "normal");
                              doc.text(l, x + (col - 4) / 2, 108, { align: "center" });
                            });
                            autoTable(doc, {
                              startY: 120,
                              head: [["Data", "Check-in", "Check-out", "Ore", "Ore Supl.", "Locație", "Status"]],
                              body: [...empRecs].sort((a, b) => (a.date || "").localeCompare(b.date || "")).map(r => {
                                const de = empEvs.filter(e => e.date === r.date).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
                                const co = de.find(e => e.event_type === "check_out")?.time || "—";
                                const dh = calcHours(de) || "—";
                                const dot = calcOvertimeMin(de);
                                return [r.date || "—", r.check_in || "—", co, dh, dot > 0 ? Math.floor(dot / 60) + "h" + (dot % 60 > 0 ? " " + dot % 60 + "min" : "") : "—", r.work_location || "—", r.status === "present" ? "Prezent" : "Absent"];
                              }),
                              headStyles: { fillColor: [26, 58, 58], textColor: 255, fontSize: 9 },
                              alternateRowStyles: { fillColor: [240, 250, 250] },
                              styles: { fontSize: 9 },
                            });
                            const fy = doc.lastAutoTable.finalY + 10;
                            doc.setDrawColor(0, 181, 181); doc.setLineWidth(0.5); doc.line(14, fy, pw - 14, fy);
                            doc.setFontSize(8); doc.setTextColor(150);
                            doc.text("Document generat automat de Alex Tours Virtual Office", pw / 2, fy + 8, { align: "center" });
                            doc.save("pontaj-" + emp.full_name.replace(" ", "-") + "-" + exportMonth + ".pdf");
                          }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white flex-shrink-0"
                            style={{ backgroundColor: "#00b5b5" }}>
                            <Download className="h-3.5 w-3.5" /> PDF
                          </button>
                        </div>
                        {ot && (
                          <div className="px-4 pb-3 flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
                            <p className="text-xs" style={{ color: "#f59e0b" }}>
                              Spor ore suplimentare — {otZ} {otZ === 1 ? "zi" : "zile"} cu peste 8h în {exportMonth}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#f0fafa" }}>
                  <Download className="h-5 w-5" style={{ color: "#00b5b5" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Export Raport Complet</p>
                  <p className="text-xs text-slate-400">Descarcă prezența tuturor angajaților</p>
                </div>
                <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ backgroundColor: "#00b5b5" }}>
                  <Download className="h-4 w-4" /> Descarcă PDF
                </button>
              </div>
            </Motion.div>
          )}

          {/* TAB: Concedii */}
          {activeTab === "concedii" && (
            <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">

              {/* Concediu propriu manager */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" style={{ color: "#00b5b5" }} />
                    Concediul Meu
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {vacationUsedPerEmployee[user?.email] || 0}/{TOTAL_VACATION_DAYS} zile
                    </span>
                    <button onClick={() => openLeaveModal(user?.email, myEmployee?.full_name || user?.email)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: "#00b5b5" }}>
                      + Adaugă
                    </button>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div className="h-2 rounded-full" style={{ width: Math.min((vacationUsedPerEmployee[user?.email] || 0) / TOTAL_VACATION_DAYS * 100, 100) + "%", backgroundColor: "#00b5b5" }} />
                </div>
                <p className="text-xs text-slate-400 mb-3">{TOTAL_VACATION_DAYS - (vacationUsedPerEmployee[user?.email] || 0)} zile rămase</p>
                {leaveRequests.filter(r => r.employee_email === user?.email).map(req => {
                  const s = leaveStyle(req.status);
                  const days = countBusinessDays(req.start_date, req.end_date);
                  return (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{LEAVE_TYPES.find(t => t.id === req.type)?.label}</p>
                        <p className="text-xs text-slate-400">{req.start_date} - {req.end_date} · {days}z</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Cereri in asteptare */}
              {pendingLeaves.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-amber-500" /> Cereri în Așteptare
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">{pendingLeaves.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {pendingLeaves.map(req => {
                      const days = countBusinessDays(req.start_date, req.end_date);
                      const empUsed = vacationUsedPerEmployee[req.employee_email] || 0;
                      const empRemaining = TOTAL_VACATION_DAYS - empUsed;
                      return (
                        <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: "#00b5b5" }}>
                            {req.employee_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{req.employee_name}</p>
                            <p className="text-xs text-slate-500">{LEAVE_TYPES.find(t => t.id === req.type)?.label} · {req.start_date} - {req.end_date} · {days}z</p>
                            {req.reason && <p className="text-xs text-slate-400">"{req.reason}"</p>}
                            {req.type === "concediu_odihna" && (
                              <p className="text-xs mt-0.5" style={{ color: empRemaining >= days ? "#16a34a" : "#ef4444" }}>
                                {empRemaining >= days ? `✓ ${empRemaining} zile disponibile` : `⚠ Doar ${empRemaining} zile din ${days} cerute`}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => updateLeave.mutate({ id: req.id, data: { status: "approved", reviewed_by: myEmployee?.full_name || user?.email } })}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: "#00b5b5" }}>
                              <Check className="h-3.5 w-3.5" /> Aprobă
                            </button>
                            <button onClick={() => updateLeave.mutate({ id: req.id, data: { status: "rejected", reviewed_by: myEmployee?.full_name || user?.email } })}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-white bg-red-400">
                              <X className="h-3.5 w-3.5" /> Respinge
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Evidenta angajati */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Umbrella className="h-4 w-4" style={{ color: "#00b5b5" }} />
                    Evidență Concedii {currentYear}
                  </h3>
                  <button onClick={() => openLeaveModal()}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: "#00b5b5" }}>
                    + Adaugă pentru angajat
                  </button>
                </div>
                <div className="space-y-3">
                  {employees.filter(e => e.status === "active" && e.email !== user?.email).map(emp => {
                    const used = vacationUsedPerEmployee[emp.email] || 0;
                    const remaining = TOTAL_VACATION_DAYS - used;
                    const empLeaves = leaveRequests.filter(r => r.employee_email === emp.email && r.type === "concediu_odihna" && r.start_date?.startsWith(currentYear));
                    return (
                      <div key={emp.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: remaining <= 3 ? "#ef4444" : remaining <= 7 ? "#f59e0b" : "#00b5b5" }}>
                            {emp.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">{emp.full_name}</p>
                              <p className="text-xs font-bold" style={{ color: remaining <= 3 ? "#ef4444" : remaining <= 7 ? "#f59e0b" : "#00b5b5" }}>
                                {used}/{TOTAL_VACATION_DAYS} zile
                              </p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                              <div className="h-1.5 rounded-full"
                                style={{ width: Math.min(used / TOTAL_VACATION_DAYS * 100, 100) + "%", backgroundColor: remaining <= 3 ? "#ef4444" : remaining <= 7 ? "#f59e0b" : "#00b5b5" }} />
                            </div>
                          </div>
                        </div>
                        {empLeaves.length > 0 && (
                          <div className="pl-12 space-y-1">
                            {empLeaves.slice(0, 2).map(r => {
                              const s = leaveStyle(r.status);
                              const days = countBusinessDays(r.start_date, r.end_date);
                              return (
                                <div key={r.id} className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{r.start_date} - {r.end_date} ({days}z)</span>
                                  <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {remaining <= 0 && <p className="text-xs text-red-500 pl-12 mt-1 font-medium">⚠ Zile epuizate!</p>}
                        {remaining > 0 && remaining <= 5 && <p className="text-xs text-amber-500 pl-12 mt-1">⚡ {remaining} zile rămase</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Istoric */}
              {leaveRequests.filter(r => r.status !== "pending" && r.employee_email !== user?.email).length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" style={{ color: "#00b5b5" }} /> Istoric Cereri
                  </h3>
                  <div className="space-y-2">
                    {leaveRequests.filter(r => r.status !== "pending" && r.employee_email !== user?.email)
                      .sort((a, b) => (b.start_date || "").localeCompare(a.start_date || ""))
                      .slice(0, 10).map(req => {
                        const s = leaveStyle(req.status);
                        const days = countBusinessDays(req.start_date, req.end_date);
                        return (
                          <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: "#00b5b5" }}>
                              {req.employee_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{req.employee_name}</p>
                              <p className="text-xs text-slate-400">{LEAVE_TYPES.find(t => t.id === req.type)?.label} · {req.start_date} - {req.end_date} · {days}z</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </Motion.div>
          )}

          {/* TAB: Zile Libere */}
          {activeTab === "sarbatori" && (
            <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                Zile Libere Legale România {currentYear}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HOLIDAYS_2026.map(h => {
                  const isPast = h.date < todayStr;
                  const isToday = h.date === todayStr;
                  return (
                    <div key={h.date} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: isToday ? "#f0fafa" : isPast ? "#f8fafc" : "#fffbeb" }}>
                      <Umbrella className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: isToday ? "#00b5b5" : isPast ? "#94a3b8" : "#f59e0b" }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: isPast ? "#94a3b8" : "#1e293b" }}>{h.label}</p>
                        <p className="text-xs" style={{ color: isPast ? "#cbd5e1" : "#64748b" }}>
                          {format(new Date(h.date), "d MMMM yyyy")}
                        </p>
                      </div>
                      {isToday && <span className="text-xs font-bold" style={{ color: "#00b5b5" }}>Azi!</span>}
                      {isPast && <span className="text-xs text-slate-300">trecut</span>}
                    </div>
                  );
                })}
              </div>
            </Motion.div>
          )}
        </>
      )}

      {/* Modal concediu */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {user?.isManager ? "Adaugă Concediu" : "Cerere de Concediu"}
              </h2>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {user?.isManager && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Angajat</label>
                  <select value={leaveForm.employee_email}
                    onChange={e => {
                      const emp = employees.find(emp => emp.email === e.target.value);
                      setLeaveForm({ ...leaveForm, employee_email: e.target.value, employee_name: emp?.full_name || "" });
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                    <option value="">Selectează angajat...</option>
                    <option value={user?.email}>{myEmployee?.full_name || user?.email} (eu)</option>
                    {employees.filter(e => e.email !== user?.email && e.status === "active").map(e => (
                      <option key={e.id} value={e.email}>
                        {e.full_name} ({vacationUsedPerEmployee[e.email] || 0}/{TOTAL_VACATION_DAYS} zile)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tip concediu</label>
                <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                  {LEAVE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Data început</label>
                  <input type="date" value={leaveForm.start_date}
  onChange={e => {
    const newStart = e.target.value;
    setLeaveForm({ 
      ...leaveForm, 
      start_date: newStart,
      end_date: leaveForm.end_date && leaveForm.end_date < newStart ? newStart : leaveForm.end_date
    });
  }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Data sfârșit</label>
                  <input type="date" value={leaveForm.end_date} 
  min={leaveForm.start_date || undefined}
  onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
              {leaveForm.start_date && leaveForm.end_date && (
                <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#f0fafa", color: "#00b5b5" }}>
                  Zile lucrătoare: <strong>{countBusinessDays(leaveForm.start_date, leaveForm.end_date)}</strong>
                  {user?.isManager && leaveForm.employee_email && leaveForm.type === "concediu_odihna" && (
                    <span className="ml-2">· Disponibile: <strong>{TOTAL_VACATION_DAYS - (vacationUsedPerEmployee[leaveForm.employee_email] || 0)}</strong></span>
                  )}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Motiv (opțional)</label>
                <textarea value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Descrie pe scurt motivul..." rows={2}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Anulează
              </button>
              <button onClick={submitLeave}
                disabled={!leaveForm.start_date || !leaveForm.end_date || createLeave.isPending || (user?.isManager && !leaveForm.employee_email)}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#00b5b5" }}>
                {createLeave.isPending ? "Se salvează..." : user?.isManager ? "Salvează" : "Trimite cererea"}
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}