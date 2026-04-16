import React from "react";
import { User } from "lucide-react";

const roleLabels = {
  tour_guide: "Ghid Turistic",
  booking_agent: "Agent Rezervări",
  customer_support: "Suport Clienți",
  marketing: "Marketing",
  operations: "Operațiuni",
  finance: "Finanțe",
};

export default function TeamOverview({ employees, employeesWithScore }) {
  const list = employeesWithScore || employees;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Prezentare Echipă</h3>
      <p className="text-xs text-slate-400 mb-5">Statusul curent al angajaților</p>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {list.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Niciun angajat adăugat</p>
        )}
        {list.map((emp) => (
          <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ backgroundColor: "#00b5b5" }}>
              {emp.full_name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{emp.full_name}</p>
              <p className="text-xs text-slate-400">{roleLabels[emp.role] || emp.role}</p>
            </div>
            <span className="text-xs font-bold" style={{ color: "#00b5b5" }}>
              {emp.computed_score ?? emp.productivity_score ?? 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}