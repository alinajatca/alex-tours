import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Eye, EyeOff } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const roles = [
  { value: "tour_guide", label: "Tour Guide" },
  { value: "booking_agent", label: "Booking Agent" },
  { value: "customer_support", label: "Customer Support" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
];

const departments = ["Sales", "Operations", "Marketing", "Finance", "Customer Service"];

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [form, setForm] = useState(employee || {
    full_name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    status: "active",
    hire_date: new Date().toISOString().split("T")[0],
    birth_date: "",
    weekly_hours_target: 40,
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!employee && password) {
      setCreating(true);
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, form.email, password);
      } catch (err) {
        if (err.code !== "auth/email-already-in-use") {
          setError("Eroare creare cont: " + err.message);
          setCreating(false);
          return;
        }
      }
      setCreating(false);
    }

    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          {employee ? "Editare Angajat" : "Adăugare Angajat"}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Nume complet *</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Email *</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>

        {!employee && (
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500">
              Parolă cont {!employee && <span className="text-slate-400">(pentru login)</span>}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minim 6 caractere"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Dată naștere</Label>
          <Input
            type="date"
            value={form.birth_date || ""}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Rol *</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger><SelectValue placeholder="Selectează rol" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Departament *</Label>
          <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
            <SelectTrigger><SelectValue placeholder="Selectează departament" /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Telefon</Label>
          <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Dată angajare</Label>
          <Input type="date" value={form.hire_date || ""} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Status</Label>
          <Select value={form.status || "active"} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activ</SelectItem>
              <SelectItem value="on_leave">În concediu</SelectItem>
              <SelectItem value="inactive">Inactiv</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500">Ore săptămânale</Label>
          <Input type="number" value={form.weekly_hours_target || 40}
            onChange={(e) => setForm({ ...form, weekly_hours_target: Number(e.target.value) })} />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Anulează</Button>
          <Button type="submit" disabled={creating}
            className="text-white"
            style={{ backgroundColor: "#00b5b5" }}>
            {creating ? "Se creează contul..." : employee ? "Salvează" : "Adaugă Angajat"}
          </Button>
        </div>
      </form>
    </div>
  );
}