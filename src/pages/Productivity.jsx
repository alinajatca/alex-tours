import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import ProductivityForm from "../components/productivity/ProductivityForm";
import ProductivityTable from "../components/productivity/ProductivityTable";

export default function Productivity() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["productivity-logs"],
    queryFn: () => appClient.entities.ProductivityLog.list("-date", 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.ProductivityLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productivity-logs"] });
      setShowForm(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Track and rate daily employee output</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Log Entry
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <ProductivityForm
            employees={employees}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 animate-pulse h-48" />
      ) : (
        <ProductivityTable logs={logs} />
      )}
    </div>
  );
}