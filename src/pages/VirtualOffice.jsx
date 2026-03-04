import React from "react";
import { appClient } from "@/api/appClient";
import { Users, MessageSquare, Video, CheckSquare, FolderOpen, Wifi, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { motion as Motion} from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const officeAreas = [
  { label: "Team Chat", icon: MessageSquare, page: "Chat", color: "bg-blue-600", light: "bg-blue-50 text-blue-600", description: "Channels & direct messages" },
  { label: "Meeting Rooms", icon: Video, page: "Rooms", color: "bg-violet-600", light: "bg-violet-50 text-violet-600", description: "Video calls & live rooms" },
  { label: "Task Board", icon: CheckSquare, page: "Tasks", color: "bg-emerald-600", light: "bg-emerald-50 text-emerald-600", description: "Assign & track work" },
  { label: "Files", icon: FolderOpen, page: "Files", color: "bg-amber-500", light: "bg-amber-50 text-amber-600", description: "Shared documents & uploads" },
];

export default function VirtualOffice() {
  const { user } = useAuth();

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
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
        className="relative bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl overflow-hidden px-8 py-10 text-white"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 text-blue-300" />
              <span className="text-blue-300 text-sm font-medium">Virtual Office · Online</span>
            </div>
            <h1 className="text-3xl font-bold mb-1">Bun venit{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}! 👋</h1>
            <p className="text-slate-300 text-sm">Alex Tours Virtual HQ — everything your team needs in one place.</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{onlineCount}</div>
              <div className="text-xs text-slate-300">Active Staff</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{activeRooms}</div>
              <div className="text-xs text-slate-300">Live Rooms</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{myTasks}</div>
              <div className="text-xs text-slate-300">My Tasks</div>
            </div>
          </div>
        </div>
      </Motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {officeAreas.map((area, i) => (
          <Motion.div key={area.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={createPageUrl(area.page)}
              className="block bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 group">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${area.light} mb-4 group-hover:scale-110 transition-transform`}>
                <area.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{area.label}</h3>
              <p className="text-sm text-slate-400 mt-1">{area.description}</p>
            </Link>
          </Motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" /> Team Online
        </h3>
        <div className="flex flex-wrap gap-3">
          {employees.filter(e => e.status === "active").map(emp => (
            <div key={emp.id} className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 text-sm">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              <span className="font-medium text-slate-700">{emp.full_name}</span>
              <span className="text-slate-400 text-xs">{emp.role?.replace(/_/g, " ")}</span>
            </div>
          ))}
          {employees.filter(e => e.status === "active").length === 0 && (
            <p className="text-sm text-slate-400">No active employees yet</p>
          )}
        </div>
      </div>
    </div>
  );
}