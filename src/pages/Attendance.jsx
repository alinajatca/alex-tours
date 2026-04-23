import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";
import { CheckCircle, Clock, Coffee, LogOut, PlayCircle, MapPin, Users, Home, AlertCircle, Download, X, Check, CalendarDays, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUSES = [
  { id: "acasa", label: "Acasă", icon: Home, color: "#00b5b5" },
  { id: "teren", label: "În teren", icon: MapPin, color: "#f59e0b" },
  { id: "sedinta", label: "În ședință", icon: Users, color: "#8b5cf6" },
  { id: "indisponibil", label: "Indisponibil", icon: AlertCircle, color: "#ef4444" },
];

const EVENTS = [
  { id: "check_in", label: "Început zi", icon: PlayCircle, color: "#00b5b5" },
  { id: "break_start", label: "Început pauză", icon: Coffee, color: "#f59e0b" },
  { id: "break_end", label: "Sfârșit pauză", icon: PlayCircle, color: "#8b5cf6" },
  { id: "check_out", label: "Sfârșit zi", icon: LogOut, color: "#ef4444" },
];

const LEAVE_TYPES = [
  { id: "concediu_odihna", label: "Concediu de odihnă" },
  { id: "concediu_medical", label: "Concediu medical" },
  { id: "concediu_fara_plata", label: "Fără plată" },
];

function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calculateHours(evs) {
  let total = 0, breakTime = 0, checkIn = null, breakStart = null;
  evs.forEach(e => {
    const time = e.time ? e.time.split(":").map(Number) : null;
    if (!time) return;
    const minutes = time[0] * 60 + time[1];
    if (e.event_type === "check_in") checkIn = minutes;
    if (e.event_type === "break_start") breakStart = minutes;
    if (e.event_type === "break_end" && breakStart) { breakTime += minutes - breakStart; breakStart = null; }
    if (e.event_type === "check_out" && checkIn) { total = minutes - checkIn - breakTime; }
  });
  if (total <= 0) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m > 0 ? m + "min" : ""}`.trim();
}

function calculateOvertimeMinutes(evs) {
  let total = 0, breakTime = 0, checkIn = null, breakStart = null;
  evs.forEach(e => {
    const time = e.time ? e.time.split(":").map(Number) : null;
    if (!time) return;
    const minutes = time[0] * 60 + time[1];
    if (e.event_type === "check_in") checkIn = minutes;
    if (e.event_type === "break_start") breakStart = minutes;
    if (e.event_type === "break_end" && breakStart) { breakTime += minutes - breakStart; breakStart = null; }
    if (e.event_type === "check_out" && checkIn) { total = minutes - checkIn - breakTime; }
  });
  const overtime = total - 480;
  return overtime > 0 ? overtime : 0;
}

export default function Attendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("acasa");
  const todayStr = new Date().toISOString().split("T")[0];
  const [exportMonth, setExportMonth] = useState(format(new Date(), "yyyy-MM"));
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "concediu_odihna", start_date: "", end_date: "", reason: "" });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: records = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list(500),
    refetchInterval: 30000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["attendance-events"],
    queryFn: () => appClient.entities.AttendanceEvent.list(500),
    refetchInterval: 30000,
  });

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ["leave-requests", user?.email, user?.isManager],
    queryFn: () => appClient.entities.LeaveRequest.list(user?.isManager ? 200 : 50),
    refetchInterval: 30000,
    select: (data) => user?.isManager
      ? data
      : data.filter(r => r.employee_email === user?.email),
  });

  const createRecordMutation = useMutation({
    mutationFn: (data) => appClient.entities.Attendance.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });

  const createEventMutation = useMutation({
    mutationFn: (data) => appClient.entities.AttendanceEvent.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance-events"] }),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.Employee.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });

  const createLeaveMutation = useMutation({
    mutationFn: (data) => appClient.entities.LeaveRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      setShowLeaveModal(false);
      setLeaveForm({ type: "concediu_odihna", start_date: "", end_date: "", reason: "" });
    },
  });

  const updateLeaveMutation = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.LeaveRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leave-requests"] }),
  });

  const myEmployee = employees.find(e => e.email === user?.email);
  const myTodayRecord = records.find(r => r.employee_email === user?.email && r.date === todayStr);
  const myTodayEvents = events
    .filter(e => e.employee_email === user?.email && e.date === todayStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const lastEvent = myTodayEvents[myTodayEvents.length - 1];
  const hasCheckedIn = myTodayEvents.some(e => e.event_type === "check_in");
  const hasCheckedOut = myTodayEvents.some(e => e.event_type === "check_out");
  const isOnBreak = lastEvent?.event_type === "break_start";
  const hoursWorked = calculateHours(myTodayEvents);

  const myLeaveRequests = leaveRequests
    .filter(r => r.employee_email === user?.email)
    .sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""));

  const pendingLeaves = leaveRequests
    .filter(r => r.status === "pending")
    .sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""));

  const logEvent = async (eventType) => {
    const now = format(new Date(), "HH:mm");
    await createEventMutation.mutateAsync({
      employee_email: user?.email,
      employee_name: user?.full_name,
      date: todayStr,
      time: now,
      event_type: eventType,
    });
    if (eventType === "check_in") {
      if (!myTodayRecord) {
        await createRecordMutation.mutateAsync({
          employee_email: user?.email,
          employee_name: user?.full_name,
          date: todayStr,
          check_in: now,
          status: "present",
          work_location: selectedStatus,
        });
      }
      if (myEmployee) await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: selectedStatus } });
    }
    if (eventType === "break_start" && myEmployee) await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: "pauza" } });
    if (eventType === "break_end" && myEmployee) await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: selectedStatus } });
    if (eventType === "check_out" && myEmployee) await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: "indisponibil" } });
  };

  const handleStatusChange = async (statusId) => {
    setSelectedStatus(statusId);
    if (myEmployee && hasCheckedIn && !hasCheckedOut && !isOnBreak) {
      await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: statusId } });
    }
  };

  const handleLeaveSubmit = () => {
    if (!leaveForm.start_date || !leaveForm.end_date) return;
    createLeaveMutation.mutate({
      employee_email: user?.email,
      employee_name: user?.full_name,
      type: leaveForm.type,
      start_date: leaveForm.start_date,
      end_date: leaveForm.end_date,
      reason: leaveForm.reason,
      status: "pending",
    });
  };

  const handleLeaveAction = (id, status) => {
    updateLeaveMutation.mutate({ id, data: { status, reviewed_by: user?.full_name, reviewed_at: new Date().toISOString() } });
  };

  const getAvailableActions = () => {
    if (!hasCheckedIn) return ["check_in"];
    if (hasCheckedOut) return [];
    if (isOnBreak) return ["break_end", "check_out"];
    return ["break_start", "check_out"];
  };

  const availableActions = getAvailableActions();

  const getLeaveStatusStyle = (status) => {
    if (status === "approved") return { bg: "#f0fdf4", color: "#16a34a", label: "Aprobat" };
    if (status === "rejected") return { bg: "#fef2f2", color: "#ef4444", label: "Respins" };
    return { bg: "#fffbeb", color: "#f59e0b", label: "În așteptare" };
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const monthRecords = records.filter(r => r.date?.startsWith(exportMonth));
    doc.setFontSize(18);
    doc.setTextColor(0, 181, 181);
    doc.text("Alex Tours - Raport Prezenta", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Luna: ${exportMonth}`, 14, 30);
    doc.text(`Generat: ${format(new Date(), "dd.MM.yyyy HH:mm")}`, 14, 37);
    autoTable(doc, {
      startY: 45,
      head: [["Angajat", "Data", "Check-in", "Status", "Locatie"]],
      body: monthRecords.map(r => [r.employee_name || "-", r.date || "-", r.check_in || "-", r.status === "present" ? "Prezent" : "Absent", r.work_location || "-"]),
      headStyles: { fillColor: [0, 181, 181], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 250, 250] },
    });
    doc.save(`prezenta-${exportMonth}.pdf`);
  };

  return (
    <div className="space-y-6">

      {/* ANGAJAT - Ziua de lucru */}
      {!user?.isManager && (
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: "#00b5b5" }} />
            Ziua Mea de Lucru — {format(new Date(), "d MMMM yyyy")}
          </h3>

          {myTodayEvents.length > 0 && (
            <div className="mb-5 space-y-2">
              {myTodayEvents.map((ev, i) => {
                const eventDef = EVENTS.find(e => e.id === ev.event_type);
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-400 font-mono w-12">{ev.time}</span>
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: eventDef?.color || "#00b5b5" }} />
                    <span className="text-slate-700">{eventDef?.label || ev.event_type}</span>
                  </div>
                );
              })}
              {hoursWorked && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm font-semibold" style={{ color: "#00b5b5" }}>
                  <Clock className="h-4 w-4" />
                  Total ore lucrate: {hoursWorked}
                </div>
              )}
            </div>
          )}

          {!hasCheckedOut && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">{hasCheckedIn ? "Status curent:" : "Unde lucrezi azi?"}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUSES.map(s => {
                  const isActive = selectedStatus === s.id;
                  return (
                    <button key={s.id} onClick={() => handleStatusChange(s.id)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all"
                      style={{ borderColor: isActive ? s.color : "#e2e8f0", backgroundColor: isActive ? `${s.color}15` : "white", color: isActive ? s.color : "#64748b" }}>
                      <s.icon className="h-5 w-5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasCheckedIn && !hasCheckedOut && (
            <div className="mb-3 p-3 rounded-xl text-xs flex items-center gap-2"
              style={{ backgroundColor: "#fffbeb", color: "#f59e0b" }}>
              <span>⏱</span>
              <span>Programul normal e 09:00-17:00. Dacă lucrezi în continuare, orele se calculează automat ca ore suplimentare.</span>
            </div>
          )}

          {availableActions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableActions.map(actionId => {
                const action = EVENTS.find(e => e.id === actionId);
                if (!action) return null;
                return (
                  <button key={actionId} onClick={() => logEvent(actionId)}
                    disabled={createEventMutation.isPending}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all text-white"
                    style={{ backgroundColor: action.color }}>
                    <action.icon className="h-5 w-5" />
                    {action.label} — {format(new Date(), "HH:mm")}
                  </button>
                );
              })}
            </div>
          ) : hasCheckedOut ? (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#f0fafa" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "#00b5b5" }} />
              <div>
                <p className="font-medium text-slate-900">Zi de lucru încheiată!</p>
                {hoursWorked && <p className="text-sm text-slate-500">Total: {hoursWorked}</p>}
              </div>
            </div>
          ) : null}
        </Motion.div>
      )}

      {/* ANGAJAT - Cereri concediu */}
      {!user?.isManager && (
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" style={{ color: "#00b5b5" }} />
              Cererile Mele de Concediu
            </h3>
            <button onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: "#00b5b5" }}>
              + Cerere nouă
            </button>
          </div>
          {myLeaveRequests.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Nicio cerere de concediu înregistrată</p>
          ) : (
            <div className="space-y-3">
              {myLeaveRequests.map(req => {
                const style = getLeaveStatusStyle(req.status);
                const leaveType = LEAVE_TYPES.find(t => t.id === req.type);
                return (
                  <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{leaveType?.label || req.type}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {req.start_date} → {req.end_date}
                        {req.reason && ` · ${req.reason}`}
                      </p>
                      {req.reviewed_by && <p className="text-xs text-slate-400">Revizuit de {req.reviewed_by}</p>}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: style.bg, color: style.color }}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Motion.div>
      )}

      {/* MANAGER */}
      {user?.isManager && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center">
              <p className="text-3xl font-bold" style={{ color: "#00b5b5" }}>
                {records.filter(r => r.date === todayStr && r.status === "present").length}
              </p>
              <p className="text-sm text-slate-500 mt-1">Prezenți Azi</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center">
              <p className="text-3xl font-bold text-red-400">
                {records.filter(r => r.date === todayStr && r.status === "absent").length}
              </p>
              <p className="text-sm text-slate-500 mt-1">Absenți Azi</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center">
              <p className="text-3xl font-bold text-amber-400">{pendingLeaves.length}</p>
              <p className="text-sm text-slate-500 mt-1">Cereri în așteptare</p>
            </div>
          </div>

          {pendingLeaves.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                Cereri de Concediu în Așteptare
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                  {pendingLeaves.length}
                </span>
              </h3>
              <div className="space-y-3">
                {pendingLeaves.map(req => {
                  const leaveType = LEAVE_TYPES.find(t => t.id === req.type);
                  return (
                    <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: "#00b5b5" }}>
                        {req.employee_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{req.employee_name}</p>
                        <p className="text-xs text-slate-500">{leaveType?.label || req.type} · {req.start_date} → {req.end_date}</p>
                        {req.reason && <p className="text-xs text-slate-400 mt-0.5">"{req.reason}"</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleLeaveAction(req.id, "approved")}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                          style={{ backgroundColor: "#00b5b5" }}>
                          <Check className="h-3.5 w-3.5" /> Aprobă
                        </button>
                        <button onClick={() => handleLeaveAction(req.id, "rejected")}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-red-400">
                          <X className="h-3.5 w-3.5" /> Respinge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {leaveRequests.filter(r => r.status !== "pending").length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" style={{ color: "#00b5b5" }} />
                Istoric Cereri Concediu
              </h3>
              <div className="space-y-2">
                {leaveRequests.filter(r => r.status !== "pending")
                  .sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""))
                  .slice(0, 10)
                  .map(req => {
                    const style = getLeaveStatusStyle(req.status);
                    const leaveType = LEAVE_TYPES.find(t => t.id === req.type);
                    return (
                      <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: "#00b5b5" }}>
                          {req.employee_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{req.employee_name}</p>
                          <p className="text-xs text-slate-400">{leaveType?.label} · {req.start_date} → {req.end_date}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: style.bg, color: style.color }}>
                          {style.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-semibold text-slate-900">Raport Pontaj per Angajat</h3>
              <input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm" />
            </div>
            <div className="space-y-3">
              {employees.filter(e => e.status === "active").map(emp => {
                const empEvents = events.filter(ev => ev.employee_email === emp.email && ev.date?.startsWith(exportMonth));
                const empRecords = records.filter(r => r.employee_email === emp.email && r.date?.startsWith(exportMonth));
                const zilePrezente = empRecords.filter(r => r.status === "present").length;
                const zileAbsente = empRecords.filter(r => r.status === "absent").length;
                let totalMinute = 0, totalOvertimeMinute = 0;

                [...new Set(empEvents.map(e => e.date))].forEach(date => {
                  const dayEvents = empEvents.filter(e => e.date === date).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
                  let checkIn = null, breakStart = null, breakTime = 0, dayTotal = 0;
                  dayEvents.forEach(ev => {
                    const time = ev.time ? ev.time.split(":").map(Number) : null;
                    if (!time) return;
                    const minutes = time[0] * 60 + time[1];
                    if (ev.event_type === "check_in") checkIn = minutes;
                    if (ev.event_type === "break_start") breakStart = minutes;
                    if (ev.event_type === "break_end" && breakStart) { breakTime += minutes - breakStart; breakStart = null; }
                    if (ev.event_type === "check_out" && checkIn) { dayTotal = minutes - checkIn - breakTime; }
                  });
                  totalMinute += dayTotal;
                  if (dayTotal > 480) totalOvertimeMinute += dayTotal - 480;
                });

                const oreLucrate = totalMinute > 0 ? `${Math.floor(totalMinute / 60)}h ${totalMinute % 60 > 0 ? totalMinute % 60 + "min" : ""}`.trim() : "—";
                const oreSupl = totalOvertimeMinute > 0 ? `${Math.floor(totalOvertimeMinute / 60)}h ${totalOvertimeMinute % 60 > 0 ? totalOvertimeMinute % 60 + "min" : ""}`.trim() : null;
                const zileSupl = [...new Set(empEvents.map(e => e.date))].filter(date => {
                  const dayEvs = empEvents.filter(e => e.date === date);
                  return calculateOvertimeMinutes(dayEvs) > 0;
                }).length;

                return (
                  <div key={emp.id} className="rounded-xl border border-slate-100 hover:border-slate-200 transition-colors overflow-hidden">
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
                        <div><p className="text-lg font-bold" style={{ color: "#00b5b5" }}>{zilePrezente}</p><p className="text-xs text-slate-400">Prezent</p></div>
                        <div><p className="text-lg font-bold text-red-400">{zileAbsente}</p><p className="text-xs text-slate-400">Absent</p></div>
                        <div><p className="text-lg font-bold text-slate-700">{oreLucrate}</p><p className="text-xs text-slate-400">Ore lucrate</p></div>
                        {oreSupl && (
                          <div className="px-3 py-1 rounded-xl" style={{ backgroundColor: "#fffbeb" }}>
                            <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>{oreSupl}</p>
                            <p className="text-xs" style={{ color: "#f59e0b" }}>Ore supl. ({zileSupl}z)</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => {
                        const doc = new jsPDF();
                        const pageWidth = doc.internal.pageSize.getWidth();
                        doc.setFillColor(26, 58, 58);
                        doc.rect(0, 0, pageWidth, 40, "F");
                        doc.setFontSize(20);
                        doc.setTextColor(255, 255, 255);
                        doc.setFont("helvetica", "bold");
                        doc.text("ALEX TOURS", 14, 18);
                        doc.setFontSize(11);
                        doc.setFont("helvetica", "normal");
                        doc.setTextColor(0, 181, 181);
                        doc.text("Raport Pontaj Lunar", 14, 28);
                        doc.setTextColor(255, 255, 255);
                        doc.text(`Generat: ${format(new Date(), "dd.MM.yyyy HH:mm")}`, pageWidth - 14, 28, { align: "right" });
                        doc.setFillColor(240, 250, 250);
                        doc.rect(0, 40, pageWidth, 35, "F");
                        doc.setFontSize(14);
                        doc.setTextColor(26, 58, 58);
                        doc.setFont("helvetica", "bold");
                        doc.text(emp.full_name, 14, 55);
                        doc.setFontSize(10);
                        doc.setFont("helvetica", "normal");
                        doc.setTextColor(100, 116, 139);
                        doc.text(`Departament: ${emp.department || "—"}`, 14, 65);
                        doc.text(`Perioada: ${exportMonth}`, pageWidth / 2, 65, { align: "center" });
                        doc.text(`Email: ${emp.email}`, pageWidth - 14, 65, { align: "right" });
                        const col = (pageWidth - 28) / 4;
                        doc.setFillColor(0, 181, 181);
                        doc.rect(14, 85, col - 4, 30, "F");
                        doc.setFillColor(239, 68, 68);
                        doc.rect(14 + col, 85, col - 4, 30, "F");
                        doc.setFillColor(26, 58, 58);
                        doc.rect(14 + col * 2, 85, col - 4, 30, "F");
                        doc.setFillColor(245, 158, 11);
                        doc.rect(14 + col * 3, 85, col - 4, 30, "F");
                        doc.setTextColor(255, 255, 255);
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(16);
                        doc.text(`${zilePrezente}`, 14 + col / 2, 97, { align: "center" });
                        doc.text(`${zileAbsente}`, 14 + col + col / 2, 97, { align: "center" });
                        doc.text(oreLucrate, 14 + col * 2 + col / 2, 97, { align: "center" });
                        doc.text(oreSupl || "0h", 14 + col * 3 + col / 2, 97, { align: "center" });
                        doc.setFontSize(8);
                        doc.setFont("helvetica", "normal");
                        doc.text("Zile Prezente", 14 + col / 2, 108, { align: "center" });
                        doc.text("Zile Absente", 14 + col + col / 2, 108, { align: "center" });
                        doc.text("Total Ore", 14 + col * 2 + col / 2, 108, { align: "center" });
                        doc.text("Ore Suplimentare", 14 + col * 3 + col / 2, 108, { align: "center" });
                        if (oreSupl) {
                          doc.setFontSize(9);
                          doc.setTextColor(245, 158, 11);
                          doc.text(`Spor ore suplimentare: ${zileSupl} zile cu peste 8h lucrate`, 14, 120);
                          doc.setTextColor(100, 116, 139);
                          doc.text("Conform art. 123 Codul Muncii - salariatii au dreptul la spor de minimum 75%", 14, 127);
                          doc.text("din salariul de baza pentru primele 2 ore suplimentare si 100% pentru urmatoarele.", 14, 134);
                        }
                        autoTable(doc, {
                          startY: oreSupl ? 142 : 125,
                          head: [["Data", "Check-in", "Check-out", "Ore Lucrate", "Ore Supl.", "Locație", "Status"]],
                          body: empRecords.map(r => {
                            const dayEvs = empEvents.filter(e => e.date === r.date).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
                            const checkOut = dayEvs.find(e => e.event_type === "check_out")?.time || "—";
                            const dayHours = calculateHours(dayEvs) || "—";
                            const dayOT = calculateOvertimeMinutes(dayEvs);
                            const dayOTStr = dayOT > 0 ? `${Math.floor(dayOT / 60)}h ${dayOT % 60 > 0 ? dayOT % 60 + "min" : ""}`.trim() : "—";
                            return [r.date || "—", r.check_in || "—", checkOut, dayHours, dayOTStr, r.work_location || "—", r.status === "present" ? "Prezent" : "Absent"];
                          }),
                          headStyles: { fillColor: [26, 58, 58], textColor: 255, fontStyle: "bold", fontSize: 9 },
                          alternateRowStyles: { fillColor: [240, 250, 250] },
                          styles: { fontSize: 9 },
                        });
                        const finalY = doc.lastAutoTable.finalY + 10;
                        doc.setDrawColor(0, 181, 181);
                        doc.setLineWidth(0.5);
                        doc.line(14, finalY, pageWidth - 14, finalY);
                        doc.setFontSize(8);
                        doc.setTextColor(150);
                        doc.text("Document generat automat de sistemul Alex Tours Virtual Office", pageWidth / 2, finalY + 8, { align: "center" });
                        doc.save(`pontaj-${emp.full_name.replace(" ", "-")}-${exportMonth}.pdf`);
                      }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white flex-shrink-0"
                        style={{ backgroundColor: "#00b5b5" }}>
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </button>
                    </div>
                    {oreSupl && (
                      <div className="px-4 pb-3 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                        <p className="text-xs" style={{ color: "#f59e0b" }}>
                          Spor ore suplimentare aplicabil — {zileSupl} {zileSupl === 1 ? "zi" : "zile"} cu peste 8h lucrate în {exportMonth}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0fafa" }}>
                <Download className="h-5 w-5" style={{ color: "#00b5b5" }} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Export Raport Complet</p>
                <p className="text-xs text-slate-400">Descarcă prezența tuturor angajaților</p>
              </div>
            </div>
            <button onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: "#00b5b5" }}>
              <Download className="h-4 w-4" />
              Descarcă PDF
            </button>
          </div>
        </>
      )}

      {/* MODAL cerere concediu */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Cerere de concediu</h2>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tip concediu</label>
                <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b5b5]">
                  {LEAVE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Data început</label>
                  <input type="date" value={leaveForm.start_date} onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b5b5]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Data sfârșit</label>
                  <input type="date" value={leaveForm.end_date} onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00b5b5]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Motiv (opțional)</label>
                <textarea value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Descrie pe scurt motivul..." rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00b5b5]" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Anulează
              </button>
              <button onClick={handleLeaveSubmit}
                disabled={!leaveForm.start_date || !leaveForm.end_date || createLeaveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: "#00b5b5" }}>
                {createLeaveMutation.isPending ? "Se trimite..." : "Trimite cererea"}
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}