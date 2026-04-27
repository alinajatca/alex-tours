import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { EMP_LIST, seedAttendance, seedMessages, seedTasks, seedClients, seedCalendar, seedRooms, seedMoodVotes } from "@/lib/seedData";

const BUTTONS = [
  { label: "👥 Angajați", fn: async () => { for (const emp of EMP_LIST) await appClient.entities.Employee.create(emp); } },
  { label: "📅 Prezență (toate lunile)", fn: seedAttendance },
  { label: "💬 Mesaje", fn: seedMessages },
  { label: "✅ Sarcini", fn: seedTasks },
  { label: "👤 Clienți", fn: seedClients },
  { label: "📆 Calendar", fn: seedCalendar },
  { label: "🏠 Săli", fn: seedRooms },
  { label: "😊 Mood Votes", fn: seedMoodVotes },
];

export default function SeedPage() {
  const [status, setStatus] = useState({});

  const run = async (label, fn) => {
    setStatus(s => ({ ...s, [label]: "⏳ Se adaugă..." }));
    try {
      await fn();
      setStatus(s => ({ ...s, [label]: "✅ Gata!" }));
    } catch (err) {
      setStatus(s => ({ ...s, [label]: "❌ Eroare!" }));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl border border-slate-200/60 p-8 space-y-4">
      <h2 className="text-xl font-bold text-slate-900">🌱 Populare Date Demo</h2>
      <p className="text-xs text-slate-400">Pagină internă - nu apare în meniu</p>
      {BUTTONS.map(({ label, fn }) => (
        <div key={label} className="flex items-center gap-4">
          <button onClick={() => run(label, fn)}
            className="flex-1 py-3 rounded-xl text-white font-medium text-sm"
            style={{ backgroundColor: "#00b5b5" }}>
            {label}
          </button>
          <span className="text-sm w-32">{status[label] || ""}</span>
        </div>
      ))}
    </div>
  );
}