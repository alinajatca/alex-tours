import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  CalendarCheck,
  Menu,
  X,
  Plane,
  LogOut,
  ChevronRight,
  MessageSquare,
  Video,
  CheckSquare,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Virtual Office", icon: LayoutDashboard, page: "VirtualOffice" },
  { name: "Chat", icon: MessageSquare, page: "Chat" },
  { name: "Meeting Rooms", icon: Video, page: "Rooms" },
  { name: "Task Board", icon: CheckSquare, page: "Tasks" },
  { name: "Files", icon: FolderOpen, page: "Files" },
  { name: "Dashboard", icon: BarChart3, page: "Dashboard" },
  { name: "Employees", icon: Users, page: "Employees" },
  { name: "Attendance", icon: CalendarCheck, page: "Attendance" },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <style>{`
        :root {
          --brand: #0f172a;
          --brand-light: #1e293b;
          --accent: #2563eb;
          --accent-light: #3b82f6;
        }
      `}</style>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-white z-50 
        transform transition-transform duration-300 ease-out flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Alex Tours</h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Virtual Office</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => console.log("logout")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{currentPageName}</h2>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}