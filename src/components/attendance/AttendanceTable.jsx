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

const locationColors = {
  remote: "bg-blue-100 text-blue-700",
  field: "bg-green-100 text-green-700",
  client_site: "bg-purple-100 text-purple-700",
};

export default function AttendanceTable({ records }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center text-slate-400">
        No attendance records yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="text-xs font-semibold text-slate-500">Employee</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Date</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Check In</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Check Out</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-sm">{rec.employee_name}</TableCell>
                <TableCell className="text-sm text-slate-600">
                  {rec.date ? format(new Date(rec.date), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="text-sm">{rec.check_in || "—"}</TableCell>
                <TableCell className="text-sm">{rec.check_out || "—"}</TableCell>
                <TableCell>
                  <Badge className={`text-[10px] font-medium border-0 capitalize ${statusColors[rec.status] || ""}`}>
                    {(rec.status || "").replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] font-medium border-0 capitalize ${locationColors[rec.work_location] || ""}`}>
                    {(rec.work_location || "").replace(/_/g, " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}