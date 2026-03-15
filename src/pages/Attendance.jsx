import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import AttendanceTable from "../components/attendance/AttendanceTable";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";
import { CheckCircle, Clock, Coffee, LogOut, PlayCircle, MapPin, Users, Home, AlertCircle, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUSES = [
  { id: "acasa", label: "Acasă", icon: Home, color: "#00b5b5" },
  { id: "teren", label: "În teren", icon: MapPin, color: "#f59e0b" },
  { id: "sedinta", label: "În ședință", icon: Users, color: "#8b5cf6" },
  { id: "pauza", label: "Pauză", icon: Coffee, color: "#64748b" },
  { id: "indisponibil", label: "Indisponibil", icon: AlertCircle, color: "#ef4444" },
];

const EVENTS = [
  { id: "check_in", label: "Început zi", icon: PlayCircle, color: "#00b5b5" },
  { id: "break_start", label: "Început pauză", icon: Coffee, color: "#f59e0b" },
  { id: "break_end", label: "Sfârșit pauză", icon: PlayCircle, color: "#8b5cf6" },
  { id: "check_out", label: "Sfârșit zi", icon: LogOut, color: "#ef4444" },
];

function calculateHours(events) {
  let total = 0;
  let breakTime = 0;
  let checkIn = null;
  let breakStart = null;

  events.forEach(e => {
    const time = e.time ? e.time.split(":").map(Number) : null;
    if (!time) return;
    const minutes = time[0] * 60 + time[1];
    if (e.event_type === "check_in") checkIn = minutes;
    if (e.event_type === "break_start") breakStart = minutes;
    if (e.event_type === "break_end" && breakStart) {
      breakTime += minutes - breakStart;
      breakStart = null;
    }
    if (e.event_type === "check_out" && checkIn) {
      total = minutes - checkIn - breakTime;
    }
  });

  if (total <= 0) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m > 0 ? m + "min" : ""}`.trim();
}

export default function Attendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("acasa");
  const todayStr = new Date().toISOString().split("T")[0];
  const [exportMonth, setExportMonth] = useState(format(new Date(), "yyyy-MM"));

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list("-date", 200),
    refetchInterval: 30000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["attendance-events"],
    queryFn: () => appClient.entities.AttendanceEvent.list("-created_date", 100),
    refetchInterval: 30000,
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

  const myEmployee = employees.find(e => e.email === user?.email);
  const myTodayRecord = records.find(r => r.employee_email === user?.email && r.date === todayStr);
  const myTodayEvents = events.filter(e => e.employee_email === user?.email && e.date === todayStr)
    .sort((a, b) => a.time?.localeCompare(b.time));

  const lastEvent = myTodayEvents[myTodayEvents.length - 1];
  const hasCheckedIn = myTodayEvents.some(e => e.event_type === "check_in");
  const hasCheckedOut = myTodayEvents.some(e => e.event_type === "check_out");
  const isOnBreak = lastEvent?.event_type === "break_start";
  const hoursWorked = calculateHours(myTodayEvents);

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
      if (myEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: myEmployee.id,
          data: { current_status: selectedStatus },
        });
      }
    }
    if (eventType === "break_start" && myEmployee) {
      await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: "pauza" } });
    }
    if (eventType === "break_end" && myEmployee) {
      await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: selectedStatus } });
    }
    if (eventType === "check_out" && myEmployee) {
      await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: "indisponibil" } });
    }
  };

  const handleStatusChange = async (statusId) => {
    setSelectedStatus(statusId);
    if (myEmployee && hasCheckedIn && !hasCheckedOut && !isOnBreak) {
      await updateEmployeeMutation.mutateAsync({ id: myEmployee.id, data: { current_status: statusId } });
    }
  };

  const filteredRecords = user?.isManager
    ? records
    : records.filter(r => r.employee_email === user?.email);

  const getAvailableActions = () => {
    if (!hasCheckedIn) return ["check_in"];
    if (hasCheckedOut) return [];
    if (isOnBreak) return ["break_end", "check_out"];
    return ["break_start", "check_out"];
  };

  const availableActions = getAvailableActions();

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
    doc.text(`Total inregistrari: ${monthRecords.length}`, 14, 44);

    autoTable(doc, {
      startY: 52,
      head: [["Angajat", "Data", "Check-in", "Status", "Locatie"]],
      body: monthRecords.map(r => [
        r.employee_name || "-",
        r.date || "-",
        r.check_in || "-",
        r.status === "present" ? "Prezent" : r.status === "absent" ? "Absent" : r.status || "-",
        r.work_location || "-",
      ]),
      headStyles: { fillColor: [0, 181, 181], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 250, 250] },
      styles: { fontSize: 10 },
    });

    doc.save(`prezenta-${exportMonth}.pdf`);
  };

  return (
    <div className="space-y-6">
      {!user?.isManager && (
        <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: "#00b5b5" }} />
            Ziua Mea de Lucru - {format(new Date(), "d MMMM yyyy")}
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
              <p className="text-xs text-slate-500 mb-2">
                {hasCheckedIn ? "Status curent:" : "Unde lucrezi azi?"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUSES.filter(s => s.id !== "pauza").map(s => {
                  const isActive = selectedStatus === s.id;
                  return (
                    <button key={s.id} onClick={() => handleStatusChange(s.id)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all"
                      style={{
                        borderColor: isActive ? s.color : "#e2e8f0",
                        backgroundColor: isActive ? `${s.color}15` : "white",
                        color: isActive ? s.color : "#64748b",
                      }}>
                      <s.icon className="h-5 w-5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
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
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all"
                    style={{ backgroundColor: `${action.color}15`, color: action.color, border: `2px solid ${action.color}30` }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${action.color}25`}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = `${action.color}15`}>
                    <action.icon className="h-5 w-5" />
                    {action.label} - {format(new Date(), "HH:mm")}
                  </button>
                );
              })}
            </div>
          ) : hasCheckedOut ? (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#f0fafa" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "#00b5b5" }} />
              <div>
                <p className="font-medium text-slate-900">Zi de lucru încheiată!</p>
                {hoursWorked && <p className="text-sm text-slate-500">Total ore lucrate: {hoursWorked}</p>}
              </div>
            </div>
          ) : null}
        </Motion.div>
      )}

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
              <p className="text-3xl font-bold text-amber-400">
                {employees.filter(e => e.current_status === "sedinta").length}
              </p>
              <p className="text-sm text-slate-500 mt-1">În Ședință</p>
            </div>
          </div>

          {/* Export PDF */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0fafa" }}>
                <Download className="h-5 w-5" style={{ color: "#00b5b5" }} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Export Raport Prezență</p>
                <p className="text-xs text-slate-400">Descarcă raportul lunar în format PDF</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm" />
              <button onClick={exportPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#00b5b5" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#009999"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#00b5b5"}>
                <Download className="h-4 w-4" />
                Descarcă PDF
              </button>
            </div>
          </div>
        </>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 animate-pulse h-48" />
      ) : (
        <AttendanceTable records={filteredRecords} />
      )}
    </div>
  );
}