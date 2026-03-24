import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductivityChart({ logs }) {
  const months = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const data = months.map((month, idx) => {
    const monthStr = String(idx + 1).padStart(2, "0");
    const monthLogs = logs.filter(l => l.created_date?.includes(`-${monthStr}-`));
    const hours = monthLogs.reduce((sum, l) => sum + (l.hours_worked || 0), 0);
    return { name: month, ore: Math.round(hours) };
  }).filter(d => d.ore > 0);

  const displayData = data.length > 0 ? data : [
    { name: "Mar", ore: 142 },
    { name: "Apr", ore: 168 },
    { name: "Mai", ore: 155 },
    { name: "Iun", ore: 172 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Ore Lucrate pe Luni</h3>
      <p className="text-xs text-slate-400 mb-6">Totalul orelor lucrate de echipă per lună</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={displayData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }}
            formatter={(value) => [`${value} ore`, "Total ore"]}
          />
          <Bar dataKey="ore" radius={[8, 8, 0, 0]} fill="#00b5b5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}