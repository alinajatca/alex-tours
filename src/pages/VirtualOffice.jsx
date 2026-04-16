import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { Users, MessageSquare, Video, CheckSquare, FolderOpen, Wifi, Bell, Plus, Trash2, X, AlertTriangle, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";

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

const MANAGER_EMAIL = "alinajatca@gmail.com";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1CmwY6UwTZ/?mibextid=wwXIfr",
    bg: "#1877F2",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/alextours.ro?igsh=Zm56ZXluY2htY2Zq",
    gradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "Site Web",
    href: "https://www.alextours.ro/",
    bg: "#00b5b5",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9M3.5 9h17M3.5 15h17"/>
      </svg>
    ),
  },
];

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "Acum";
  if (diffMin < 60) return `Acum ${diffMin} min`;
  if (diffH < 24) return `Acum ${diffH}h`;
  if (diffD === 1) return "Ieri";
  return date.toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
}

export default function VirtualOffice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isManager = user?.email === MANAGER_EMAIL;

  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [newUrgent, setNewUrgent] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const weekStr = format(new Date(), "yyyy-'W'ww");

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

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => appClient.entities.Announcement.list(),
    refetchInterval: 60000,
  });

  const { data: moodVotes = [] } = useQuery({
    queryKey: ["mood-votes"],
    queryFn: () => appClient.entities.MoodVote.list(),
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.Announcement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setNewText("");
      setNewUrgent(false);
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.Announcement.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const moodMutation = useMutation({
    mutationFn: (data) => appClient.entities.MoodVote.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mood-votes"] }),
  });

  const handleCreate = () => {
    if (!newText.trim()) return;
    createMutation.mutate({
      text: newText.trim(),
      urgent: newUrgent,
      author: user?.full_name || user?.email,
    });
  };

  const handleMoodVote = async (mood) => {
    if (myVote) return;
    setSelectedMood(mood);
    await moodMutation.mutateAsync({
      employee_email: user?.email,
      employee_name: user?.full_name,
      mood,
      week: weekStr,
      date: todayStr,
    });
  };

  const activeRooms = rooms.filter(r => r.status === "in_use").length;
  const myTasks = tasks.filter(t => t.assigned_to_email === user?.email && t.status !== "done").length;
  const onlineCount = employees.filter(e => e.status === "active").length;

  const thisWeekVotes = moodVotes.filter(v => v.week === weekStr);
  const myVote = thisWeekVotes.find(v => v.employee_email === user?.email);
  const moodCounts = {
    "😊": thisWeekVotes.filter(v => v.mood === "😊").length,
    "😐": thisWeekVotes.filter(v => v.mood === "😐").length,
    "😔": thisWeekVotes.filter(v => v.mood === "😔").length,
  };
  const totalVotes = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">

      {/* Banner bun venit */}
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

      {/* Canale oficiale */}
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white rounded-2xl border border-slate-200/60 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-[#00b5b5]" />
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Canale Oficiale Alex Tours
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              style={{ background: link.gradient || link.bg }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </Motion.div>

      {/* Carduri navigare */}
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

      {/* Mood Board - vizibil tuturor */}
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-white rounded-2xl border border-slate-200/60 p-6"
      >
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Smile className="h-4 w-4 text-pink-400" /> Starea Echipei Săptămâna Aceasta
        </h3>
        <p className="text-xs text-slate-400 mb-4">Votul este anonim — cum te simți în această săptămână?</p>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex gap-3">
            {["😊", "😐", "😔"].map(mood => (
              <button key={mood} onClick={() => handleMoodVote(mood)}
                disabled={!!myVote}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all"
                style={{
                  borderColor: myVote?.mood === mood ? "#00b5b5" : "#e2e8f0",
                  backgroundColor: myVote?.mood === mood ? "#f0fafa" : "white",
                  opacity: myVote && myVote.mood !== mood ? 0.5 : 1,
                  cursor: myVote ? "not-allowed" : "pointer",
                  transform: (selectedMood === mood || myVote?.mood === mood) ? "scale(1.1)" : "scale(1)",
                }}>
                <span style={{ fontSize: "28px" }}>{mood}</span>
                <span className="text-xs text-slate-500">
                  {mood === "😊" ? "Bine" : mood === "😐" ? "Ok" : "Greu"}
                </span>
              </button>
            ))}
          </div>

          {totalVotes > 0 ? (
            <div className="flex-1 space-y-2">
              {[
                { mood: "😊", label: "Bine", color: "#1d9e75" },
                { mood: "😐", label: "Ok", color: "#f59e0b" },
                { mood: "😔", label: "Greu", color: "#ef4444" },
              ].map(({ mood, label, color }) => (
                <div key={mood} className="flex items-center gap-3">
                  <span style={{ fontSize: "16px" }}>{mood}</span>
                  <span className="text-xs text-slate-500 w-8">{label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: `${totalVotes > 0 ? (moodCounts[mood] / totalVotes) * 100 : 0}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-8">{moodCounts[mood]}</span>
                </div>
              ))}
              <p className="text-xs text-slate-400">{totalVotes} voturi din {onlineCount} angajați activi</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 self-center">Niciun vot încă în această săptămână</p>
          )}
        </div>
        {myVote && <p className="text-xs text-slate-400 mt-3">✓ Ai votat această săptămână</p>}
      </Motion.div>

      {/* Anunțuri + Echipă Online */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Anunțuri */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />
              Anunțuri
              {announcements.length > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f0fafa] text-[#00b5b5]">
                  {announcements.length}
                </span>
              )}
            </h3>
            {isManager && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-90 text-white"
                style={{ backgroundColor: '#00b5b5' }}
              >
                <Plus className="h-3.5 w-3.5" />
                Anunț nou
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {announcements.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Niciun anunț momentan</p>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: ann.urgent ? '#fff5f5' : '#f8fafc' }}
                >
                  <div
                    className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ann.urgent ? '#ef4444' : '#00b5b5' }}
                  />
                  <div className="flex-1 min-w-0">
                    {ann.urgent && (
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Urgent</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed">{ann.text}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-slate-400">
                        {ann.author && `${ann.author} · `}{formatDate(ann.created_date)}
                      </span>
                      {isManager && (
                        <button
                          onClick={() => deleteMutation.mutate(ann.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Motion.div>

        {/* Echipă Online */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6"
        >
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
        </Motion.div>
      </div>

      {/* Modal adaugă anunț */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Anunț nou</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Scrie anunțul pentru echipă..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#00b5b5] mb-4"
            />
            <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newUrgent}
                onChange={(e) => setNewUrgent(e.target.checked)}
                className="accent-[#ef4444] w-4 h-4"
              />
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-slate-600">Marchează ca urgent</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={handleCreate}
                disabled={!newText.trim() || createMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#00b5b5' }}
              >
                {createMutation.isPending ? "Se salvează..." : "Publică anunț"}
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}