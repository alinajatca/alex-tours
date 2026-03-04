import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  on_leave: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
};

const roleLabels = {
  tour_guide: "Tour Guide",
  booking_agent: "Booking Agent",
  customer_support: "Support",
  marketing: "Marketing",
  operations: "Operations",
  finance: "Finance",
};

export default function TeamOverview({ employees }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Team Overview</h3>
      <p className="text-xs text-slate-400 mb-5">Current employee status</p>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {employees.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No employees added yet</p>
        )}
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              {emp.avatar_url ? (
                <img src={emp.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{emp.full_name}</p>
              <p className="text-xs text-slate-400">{roleLabels[emp.role] || emp.role}</p>
            </div>
            <Badge className={`text-[10px] font-medium ${statusColors[emp.status] || statusColors.active} border-0`}>
              {(emp.status || "active").replace(/_/g, " ")}
            </Badge>
            {emp.productivity_score != null && (
              <span className="text-xs font-semibold text-slate-600 w-8 text-right">
                {emp.productivity_score}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}