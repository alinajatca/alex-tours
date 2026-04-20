import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, BarChart3, CalendarCheck, Menu, X, LogOut,
  ChevronRight, MessageSquare, Video, CheckSquare, FolderOpen,
  Calendar, UserCheck
} from "lucide-react";

const navItems = [
  { name: "Birou Virtual", icon: LayoutDashboard, page: "VirtualOffice" },
  { name: "Chat", icon: MessageSquare, page: "Chat" },
  { name: "Săli de Întâlnire", icon: Video, page: "Rooms" },
  { name: "Sarcini", icon: CheckSquare, page: "Tasks" },
  { name: "Fișiere", icon: FolderOpen, page: "Files" },
  { name: "Panou Principal", icon: BarChart3, page: "Dashboard", managerOnly: true },
  { name: "Angajați", icon: Users, page: "Employees" },
  { name: "Prezență", icon: CalendarCheck, page: "Attendance" },
  { name: "Calendar", icon: Calendar, page: "Calendar" },
  { name: "Clienți", icon: UserCheck, page: "Clients" },
];

const pageNames = {
  VirtualOffice: "Birou Virtual",
  Chat: "Chat",
  Rooms: "Săli de Întâlnire",
  Tasks: "Sarcini",
  Files: "Fișiere",
  Dashboard: "Panou Principal",
  Employees: "Angajați",
  Attendance: "Prezență",
  Productivity: "Productivitate",
  Calendar: "Calendar",
  Clients: "Clienți",
};

const WORK_START = 9 * 60;

function WorkClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  const timeStr = now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("ro-RO", { weekday: "short", day: "numeric", month: "short" });

  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const WORK_END = isWeekend ? WORK_START : 17 * 60;
  const WORK_DURATION = WORK_END - WORK_START;
  const isWorkTime = !isWeekend && currentMinutes >= WORK_START && currentMinutes < WORK_END;
  const beforeWork = !isWeekend && currentMinutes < WORK_START;
  const afterWork = isWeekend || currentMinutes >= WORK_END;

  let progress = 0;
  let remainingStr = "";
  let statusColor = "#00b5b5";
  let statusLabel = "";

  if (isWeekend) {
    statusColor = "#94a3b8";
    statusLabel = "zi liberă";
  } else if (isWorkTime) {
    const elapsed = currentMinutes - WORK_START;
    progress = Math.min((elapsed / WORK_DURATION) * 100, 100);
    const remaining = WORK_END - currentMinutes;
    const rh = Math.floor(remaining / 60);
    const rm = remaining % 60;
    remainingStr = rh > 0 ? `${rh}h ${rm}m` : `${rm}m`;
    if (progress < 33) statusColor = "#00b5b5";
    else if (progress < 66) statusColor = "#f59e0b";
    else statusColor = "#ef4444";
    statusLabel = `mai rămâne ${remainingStr}`;
  } else if (beforeWork) {
    progress = 0;
    const minutesBefore = WORK_START - currentMinutes;
    const bh = Math.floor(minutesBefore / 60);
    const bm = minutesBefore % 60;
    remainingStr = bh > 0 ? `${bh}h ${bm}m` : `${bm}m`;
    statusColor = "#94a3b8";
    statusLabel = `începe în ${remainingStr}`;
  } else {
    progress = 100;
    statusColor = "#64748b";
    statusLabel = "program încheiat";
  }

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60">
      <div className="relative flex-shrink-0" style={{ width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
          <circle cx="24" cy="24" r="20" fill="none" stroke={statusColor} strokeWidth="3.5"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: "9px", fontWeight: 600, color: statusColor, lineHeight: 1 }}>
            {afterWork ? "✓" : beforeWork ? "–" : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-slate-900 leading-tight">{timeStr}</span>
        <span className="text-xs text-slate-400 leading-tight">{dateStr}</span>
        <span className="text-xs leading-tight font-medium mt-0.5" style={{ color: statusColor }}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const [lastSeenChat, setLastSeenChat] = useState(() => {
    return localStorage.getItem("lastSeenChat") || new Date(0).toISOString();
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages-all"],
    queryFn: () => appClient.entities.Message.list(),
    refetchInterval: 10000,
  });

  const unreadCount = messages.filter(m =>
    m.sender_email !== user?.email &&
    m.created_date > lastSeenChat
  ).length;

  const handleChatClick = () => {
    const now = new Date().toISOString();
    setLastSeenChat(now);
    localStorage.setItem("lastSeenChat", now);
    setSidebarOpen(false);
  };

  const visibleNavItems = navItems.filter(item => !item.managerOnly || user?.isManager);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-72 z-50 
        transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ backgroundColor: "#1a3a3a" }}>

        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <img src="/logo.jpg" alt="Alex Tours" className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Alex Tours</h1>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#00b5b5" }}>Birou Virtual</p>
          </div>
          <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = currentPageName === item.page;
            const isChat = item.page === "Chat";
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={isChat ? handleChatClick : () => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                style={isActive ? { backgroundColor: "#00b5b5" } : {}}>
                <div className="relative">
                  <item.icon className="h-[18px] w-[18px]" />
                  {isChat && unreadCount > 0 && !isActive && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
                {isChat && unreadCount > 0 && !isActive && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-2 text-xs text-white/40 truncate mb-1">{user?.email}</div>
          <button onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all w-full">
            <LogOut className="h-[18px] w-[18px]" />
            <span>Ieșire</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {pageNames[currentPageName] || currentPageName}
            </h2>
          </div>
          <div className="ml-auto">
            <WorkClock />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}