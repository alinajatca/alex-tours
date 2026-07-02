import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Video, Plus, Users, ExternalLink, LogIn, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

export default function Rooms() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", meeting_url: "", topic: "" });
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => appClient.entities.Room.list(),
    refetchInterval: 10000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.Room.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setShowForm(false);
      setForm({ name: "", description: "", meeting_url: "", topic: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appClient.entities.Room.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.Room.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const openMeetLink = (url) => {
    const link = url || "https://meet.google.com/new";
    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleJoin = (room) => {
    // Deschide link-ul IMEDIAT sincron, inainte de orice await
    openMeetLink(room.meeting_url);

    // Actualizeaza participantii in fundal
    const participants = room.current_participants || [];
    if (!participants.includes(user?.email)) {
      updateMutation.mutate({
        id: room.id,
        data: { status: "in_use", current_participants: [...participants, user?.email] },
      });
    }
  };

  const handleLeave = (room) => {
    const participants = (room.current_participants || []).filter(e => e !== user?.email);
    updateMutation.mutate({
      id: room.id,
      data: { current_participants: participants, status: participants.length === 0 ? "available" : "in_use" },
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      status: "available",
      current_participants: [],
      scheduled_by_name: user?.full_name,
    });
  };

  const inRoom = (room) => (room.current_participants || []).includes(user?.email);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Alătură-te sălilor virtuale pentru colaborare în timp real</p>
        <Button style={{ backgroundColor: "#00b5b5" }} className="hover:opacity-90" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Sală nouă
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <Motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onSubmit={handleCreate}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Nume sală *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Subiect</Label>
              <Input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="ex. Ședință săptămânală" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Link video (Zoom / Meet)</Label>
              <Input value={form.meeting_url} onChange={e => setForm({ ...form, meeting_url: e.target.value })} placeholder="https://meet.google.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Descriere</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Anulează</Button>
              <Button type="submit" style={{ backgroundColor: "#00b5b5" }} className="hover:opacity-90 text-white">Creează Sala</Button>
            </div>
          </Motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rooms.map((room, i) => (
            <Motion.div key={room.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${room.status === "in_use" ? "border-teal-300 shadow-lg shadow-teal-100" : "border-slate-200/60"}`}>

              <div className="flex items-start justify-between mb-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${room.status === "in_use" ? "bg-teal-50" : "bg-slate-100"}`}>
                  <Video className={`h-5 w-5 ${room.status === "in_use" ? "text-teal-500" : "text-slate-400"}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] border-0 ${room.status === "in_use" ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                    {room.status === "in_use" ? "🔴 Live" : "● Disponibilă"}
                  </Badge>
                  {user?.isManager && (
                    <button
                      onClick={() => { if (confirm("Ștergi această sală?")) deleteMutation.mutate(room.id); }}
                      className="text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-900">{room.name}</h3>
              {room.topic && <p className="text-xs font-medium mt-0.5" style={{ color: "#00b5b5" }}>{room.topic}</p>}
              {room.description && <p className="text-sm text-slate-400 mt-1">{room.description}</p>}

              {(room.current_participants || []).length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  {room.current_participants.length} {room.current_participants.length === 1 ? "participant" : "participanți"}
                </div>
              )}

              {/* Mesaj daca sala nu are link */}
              {!room.meeting_url && (
                <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                  ⚠ Se va deschide o întâlnire Google Meet nouă
                </p>
              )}

              <div className="flex gap-2 mt-4">
                {inRoom(room) ? (
                  <Button size="sm" variant="outline"
                    className="flex-1 text-xs border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleLeave(room)}>
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Ieși din sală
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1 text-xs text-white hover:opacity-90"
                    style={{ backgroundColor: "#00b5b5" }}
                    onClick={() => handleJoin(room)}>
                    <LogIn className="h-3.5 w-3.5 mr-1.5" /> Intră în sală
                  </Button>
                )}
                {room.meeting_url && (
                  <Button size="sm" variant="outline" className="text-xs px-2"
                    title="Deschide link direct"
                    onClick={() => openMeetLink(room.meeting_url)}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </Motion.div>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              Nicio sală creată încă. Creează una pentru a începe.
            </div>
          )}
        </div>
      )}
    </div>
  );
}