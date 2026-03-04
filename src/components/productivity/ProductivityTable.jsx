import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ratingColors = {
  excellent: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  average: "bg-amber-100 text-amber-700",
  below_average: "bg-orange-100 text-orange-700",
  poor: "bg-red-100 text-red-700",
};

export default function ProductivityTable({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center text-slate-400">
        No productivity logs yet. Add your first log above.
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
              <TableHead className="text-xs font-semibold text-slate-500">Hours</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Tasks</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Category</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-sm">{log.employee_name}</TableCell>
                <TableCell className="text-sm text-slate-600">
                  {log.date ? format(new Date(log.date), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="text-sm font-semibold">{log.hours_worked}h</TableCell>
                <TableCell className="text-sm">
                  <span className="font-semibold">{log.tasks_completed || 0}</span>
                  <span className="text-slate-400">/{log.tasks_assigned || 0}</span>
                </TableCell>
                <TableCell>
                  {log.category && (
                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 border-0 capitalize">
                      {log.category.replace(/_/g, " ")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {log.rating && (
                    <Badge className={`text-[10px] font-medium border-0 capitalize ${ratingColors[log.rating] || ""}`}>
                      {log.rating.replace(/_/g, " ")}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}