import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Phone, Mail, MapPin, Trash2, Edit, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const STATUS_COLORS = {
  activ: { bg: "#f0fafa", color: "#00b5b5", label: "Activ" },
  inactiv: { bg: "#f1f5f9", color: "#94a3b8", label: "Inactiv" },
  prospect: { bg: "#fff8e1", color: "#f59e0b", label: "Prospect" },
};

const EMPTY_FORM = {
  full_name: "", email: "", phone: "", city: "",
  status: "activ", notes: "", last_tour: "", tours_count: "0",
};

export default function Clients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState("toate");

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => appClient.entities.Client.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setShowForm(false);
      setForm(EMPTY_FORM);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.Client.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const handleSubmit = () => {
    if (!form.full_name || !form.email) return;
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (client) => {
    setEditing(client);
    setForm({
      full_name: client.full_name || "",
      email: client.email || "",
      phone: client.phone || "",
      city: client.city || "",
      status: client.status || "activ",
      notes: client.notes || "",
      last_tour: client.last_tour || "",
      tours_count: client.tours_count || "0",
    });
    setShowForm(true);
  };

  const filtered = clients
    .filter(c => filterStatus === "toate" || c.status === filterStatus)
    .filter(c =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: clients.length,
    activi: clients.filter(c => c.status === "activ").length,
    prospecti: clients.filter(c => c.status === "prospect").length,
    tururi: clients.reduce((sum, c) => sum + (parseInt(c.tours_count) || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Statistici */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Clienți", value: stats.total, color: "#00b5b5" },
          { label: "Clienți Activi", value: stats.activi, color: "#10b981" },
          { label: "Prospecți", value: stats.prospecti, color: "#f59e0b" },
          { label: "Tururi Rezervate", value: stats.tururi, color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtre si cautare */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Caută client..." value={search}
              onChange={e => setSearch(e.target.value)} className="pl-10 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="h-9 rounded-md border border-input bg-white px-3 text-sm">
            <option value="toate">Toți</option>
            <option value="activ">Activi</option>
            <option value="prospect">Prospecți</option>
            <option value="inactiv">Inactivi</option>
          </select>
        </div>
        <Button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(!showForm); }}
          style={{ backgroundColor: "#00b5b5" }}>
          <Plus className="h-4 w-4 mr-2" /> Adaugă Client
        </Button>
      </div>

      {/* Form adaugare/editare */}
      <AnimatePresence>
        {showForm && (
          <Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">
                {editing ? "Editează Client" : "Client Nou"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }}
                className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Nume complet *</Label>
                <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Ion Popescu" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="ion@example.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Telefon</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="07xx xxx xxx" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Oraș</Label>
                <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="București" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Ultimul tur</Label>
                <Input value={form.last_tour} onChange={e => setForm(f => ({ ...f, last_tour: e.target.value }))}
                  placeholder="ex: Grecia 2025" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Nr. tururi rezervate</Label>
                <Input type="number" value={form.tours_count}
                  onChange={e => setForm(f => ({ ...f, tours_count: e.target.value }))} min="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Status</Label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="activ">Activ</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactiv">Inactiv</option>
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs text-slate-500">Note</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Preferințe, observații..." />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                style={{ backgroundColor: "#00b5b5" }}>
                {editing ? "Salvează" : "Adaugă Client"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }}>
                Anulează
              </Button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Lista clienti */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border border-slate-200/60 h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center text-slate-400">
          <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "Niciun client găsit" : "Niciun client adăugat încă"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((client, i) => {
              const statusDef = STATUS_COLORS[client.status] || STATUS_COLORS.activ;
              return (
                <Motion.div key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: "#00b5b5" }}>
                        {client.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{client.full_name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: statusDef.bg, color: statusDef.color }}>
                          {statusDef.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(client)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Ștergi clientul ${client.full_name}?`)) deleteMutation.mutate(client.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#00b5b5" }} />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#00b5b5" }} />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.city && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#00b5b5" }} />
                        <span>{client.city}</span>
                      </div>
                    )}
                  </div>
                  {(client.last_tour || client.tours_count) && (
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{client.last_tour}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#f0fafa", color: "#00b5b5" }}>
                        {client.tours_count || 0} tururi
                      </span>
                    </div>
                  )}
                  {client.notes && (
                    <p className="mt-2 text-xs text-slate-400 italic truncate">{client.notes}</p>
                  )}
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}