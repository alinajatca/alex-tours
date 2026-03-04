import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ProductivityChart({ logs }) {
  // Group logs by category and sum tasks completed
  const categoryData = {};
  logs.forEach((log) => {
    const cat = log.category || "admin";
    if (!categoryData[cat]) {
      categoryData[cat] = { name: cat.replace(/_/g, " "), tasks: 0, hours: 0 };
    }
    categoryData[cat].tasks += log.tasks_completed || 0;
    categoryData[cat].hours += log.hours_worked || 0;
  });

  const data = Object.values(categoryData).sort((a, b) => b.tasks - a.tasks);
  const colors = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#db2777"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Tasks by Category</h3>
      <p className="text-xs text-slate-400 mb-6">Work distribution across categories</p>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              className="capitalize"
            />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
          No productivity data yet
        </div>
      )}
    </div>
  );
}