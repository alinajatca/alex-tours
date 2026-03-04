import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import AttendanceForm from "../components/attendance/AttendanceForm";
import AttendanceTable from "../components/attendance/AttendanceTable";

export default function Attendance() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => appClient.entities.Attendance.list("-date", 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.Attendance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      setShowForm(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Daily check-in/check-out tracking for remote employees</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Record
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <AttendanceForm
            employees={employees}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 animate-pulse h-48" />
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
}
