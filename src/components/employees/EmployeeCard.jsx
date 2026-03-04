import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  on_leave: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
};

const roleLabels = {
  tour_guide: "Tour Guide",
  booking_agent: "Booking Agent",
  customer_support: "Customer Support",
  marketing: "Marketing",
  operations: "Operations",
  finance: "Finance",
};

export default function EmployeeCard({ employee, onEdit, onDelete, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          {employee.avatar_url ? (
            <img src={employee.avatar_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            <User className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-slate-900 truncate">{employee.full_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{roleLabels[employee.role] || employee.role} · {employee.department}</p>
            </div>
            <Badge className={`text-[10px] font-medium border-0 ${statusColors[employee.status] || statusColors.active}`}>
              {(employee.status || "active").replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            {employee.email && (
              <span className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" />{employee.email}</span>
            )}
            {employee.phone && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{employee.phone}</span>
            )}
          </div>

          {employee.productivity_score != null && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Productivity</span>
                <span className="font-semibold text-slate-700">{employee.productivity_score}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${employee.productivity_score}%`,
                    backgroundColor: employee.productivity_score >= 75 ? "#059669" : employee.productivity_score >= 50 ? "#d97706" : "#dc2626",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => onEdit(employee)}>
          <Pencil className="h-3 w-3 mr-1" /> Edit
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500 hover:text-red-600" onClick={() => onDelete(employee)}>
          <Trash2 className="h-3 w-3 mr-1" /> Remove
        </Button>
      </div>
    </motion.div>
  );
}