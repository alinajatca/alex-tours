import React from "react";
import { appClient } from "@/api/appClient";
import { Users, MessageSquare, Video, CheckSquare, FolderOpen, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const officeAreas = [
  { label: "Chat Echipă", icon: MessageSquare, page: "Chat", description: "Canale și mesaje directe" },
  { label: "Săli de Întâlnire", icon: Video, page: "Rooms", description: "Apeluri video și săli live" },
  { label: "Sarcini", icon: CheckSquare, page: "Tasks", description: "Atribuie și urmărește munca" },
  { label: "Fișiere", icon: FolderOpen, page: "Files", description: "Documente și fișiere partajate" },
];

const STATUS_COLORS = {
  acasa: "#00b5b5", teren: "#f59e0b", sedinta: "#8b5cf6",
  pauza: "#64748b", indisponibil: "#ef4444"
};

const STATUS_LABELS = {
  acasa: "Acasă", teren: "În teren", sedinta: "În ședință",
  pauza: "Pauză", indisponibil: "Indisponibil"
};

export default function VirtualOffice() {
  const { user } = useAuth();

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
    refetchInterval: 30000,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appClient.entities.Task.list(),
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => appClient.entities.Room.list(),
  });

  const activeRooms = rooms.filter(r => r.status === "in_use").length;
  const myTasks = tasks.filter(t => t.assigned_to_email === user?.email && t.status !== "done").length;
  const onlineCount = employees.filter(e => e.status === "active").length;

  return (
    <div className="space-y-8">
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden px-8 py-10 text-white"
        style={{ background: "linear-gradient(135deg, #1a3a3a, #0d2525)" }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4" style={{ color: "#00b5b5" }} />
              <span className="text-sm font-medium" style={{ color: "#00b5b5" }}>Birou Virtual · Online</span>
            </div>
            <h1 className="text-3xl font-bold mb-1">Bun venit{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}! 👋</h1>
            <p className="text-slate-300 text-sm">Alex Tours Virtual — tot ce are nevoie echipa ta într-un singur loc.</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{onlineCount}</div>
              <div className="text-xs text-slate-300">Angajați Activi</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{activeRooms}</div>
              <div className="text-xs text-slate-300">Săli Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{myTasks}</div>
              <div className="text-xs text-slate-300">Sarcinile Mele</div>
            </div>
          </div>
        </div>
      </Motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {officeAreas.map((area, i) => (
          <Motion.div key={area.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={createPageUrl(area.page)}
              className="block bg-white rounded-2xl border border-slate-200/60 p-6 hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                style={{ backgroundColor: '#f0fafa' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#00b5b5'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f0fafa'}>
                <area.icon className="h-6 w-6" style={{ color: '#00b5b5' }} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#00b5b5] transition-colors">{area.label}</h3>
              <p className="text-sm text-slate-400 mt-1">{area.description}</p>
            </Link>
          </Motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" /> Echipă Online
        </h3>
        <div className="flex flex-wrap gap-3">
          {employees.filter(e => e.status === "active").map(emp => {
            const statusColor = STATUS_COLORS[emp.current_status] || "#00b5b5";
            const statusLabel = STATUS_LABELS[emp.current_status] || "Online";
            return (
              <div key={emp.id} className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 text-sm">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="font-medium text-slate-700">{emp.full_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
                  {statusLabel}
                </span>
              </div>
            );
          })}
          {employees.filter(e => e.status === "active").length === 0 && (
            <p className="text-sm text-slate-400">Niciun angajat activ momentan</p>
          )}
        </div>
      </div>
    </div>
  );
}