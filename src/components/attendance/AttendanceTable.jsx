import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const statusColors = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
  half_day: "bg-orange-100 text-orange-700",
  on_leave: "bg-violet-100 text-violet-700",
};

const locationLabels = {
  acasa: "Acasă",
  teren: "În teren",
  sedinta: "În ședință",
  pauza: "Pauză",
  indisponibil: "Indisponibil",
};

const statusLabels = {
  present: "Prezent",
  absent: "Absent",
  late: "Întârziat",
  half_day: "Jumătate zi",
  on_leave: "Concediu",
};

export default function AttendanceTable({ records }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center text-slate-400">
        Niciun record de prezență încă.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="text-xs font-semibold text-slate-500">Angajat</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Data</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Check In</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Locație</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-sm">{rec.employee_name}</TableCell>
                <TableCell className="text-sm text-slate-600">
                  {rec.date ? format(new Date(rec.date + "T00:00:00"), "d MMM yyyy") : "—"}
                </TableCell>
                <TableCell className="text-sm">{rec.check_in || "—"}</TableCell>
                <TableCell>
                  <Badge className={`text-[10px] font-medium border-0 ${statusColors[rec.status] || "bg-slate-100 text-slate-600"}`}>
                    {statusLabels[rec.status] || rec.status || "—"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {locationLabels[rec.work_location] || rec.work_location || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}