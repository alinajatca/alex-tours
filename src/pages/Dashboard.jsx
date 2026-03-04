import React from "react";
import { appClient } from "@/api/appClient";
import { useQuery } from "@tanstack/react-query";
import { Users, BarChart3, Clock, CalendarCheck } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import TeamOverview from "../components/dashboard/TeamOverview";

export default function Dashboard() {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["productivity-logs"],
    queryFn: () => appClient.entities.ProductivityLog.list("-date", 100),
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list("-date", 50),
  });

  const activeCount = employees.filter((e) => e.status === "active").length;
  const avgProductivity = employees.length > 0
    ? Math.round(employees.reduce((sum, e) => sum + (e.productivity_score || 0), 0) / employees.length)
    : 0;
  const totalHours = logs.reduce((sum, l) => sum + (l.hours_worked || 0), 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const presentToday = attendance.filter((a) => a.date === todayStr && a.status === "present").length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Employees" value={activeCount} subtitle={`${employees.length} total`} icon={Users} color="blue" delay={0} />
        <StatCard title="Avg Productivity" value={`${avgProductivity}%`} subtitle="Team average" icon={BarChart3} color="green" delay={0.1} />
        <StatCard title="Total Hours Logged" value={totalHours.toFixed(0)} subtitle="All time" icon={Clock} color="purple" delay={0.2} />
        <StatCard title="Present Today" value={presentToday} subtitle={`of ${activeCount} active`} icon={CalendarCheck} color="orange" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ProductivityChart logs={logs} />
        </div>
        <div className="lg:col-span-2">
          <TeamOverview employees={employees} />
        </div>
      </div>
    </div>
  );
}