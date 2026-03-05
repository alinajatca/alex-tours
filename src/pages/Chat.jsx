import React, { useState, useRef, useEffect } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Hash, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";

const DEFAULT_CHANNELS = [
  { id: "general", label: "General" },
  { id: "tours", label: "Tururi" },
  { id: "bookings", label: "Rezervări" },
  { id: "marketing", label: "Marketing" },
  { id: "random", label: "Diverse" },
];

export default function Chat() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("general");
  const [channelType, setChannelType] = useState("channel");
  const [dmTarget, setDmTarget] = useState(null);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  const channelKey = channelType === "direct"
    ? `dm:${[user?.email, dmTarget?.email].sort().join(":")}`
    : activeChannel;

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", channelKey],
    queryFn: () => appClient.entities.Message.list(),
    refetchInterval: 3000,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => appClient.entities.Employee.list(),
  });

 const filteredMessages = messages
  .filter(m => m.channel === channelKey)
  .sort((a, b) => (a.created_date || "").localeCompare(b.created_date || ""));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await appClient.entities.Message.create({
      channel: channelKey,
      channel_type: channelType,
      sender_email: user?.email,
      sender_name: user?.full_name || user?.email,
      content: text.trim(),
    });
    setText("");
    queryClient.invalidateQueries({ queryKey: ["messages", channelKey] });
  };

  const grouped = filteredMessages.reduce((acc, msg) => {
    const date = msg.created_date ? format(new Date(msg.created_date), "d MMMM yyyy") : "Azi";
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const handleDM = (emp) => { setDmTarget(emp); setChannelType("direct"); };

  const activeChannelLabel = DEFAULT_CHANNELS.find(c => c.id === activeChannel)?.label || activeChannel;

  return (
    <div className="flex h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-slate-200/60">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col" style={{ backgroundColor: "#1a3a3a" }}>
        <div className="p-4 border-b border-white/10">
          <h3 className="font-bold text-sm text-white/80 uppercase tracking-wider">Canale</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {DEFAULT_CHANNELS.map(ch => {
            const isActive = channelType === "channel" && activeChannel === ch.id;
            return (
              <button key={ch.id} onClick={() => { setActiveChannel(ch.id); setChannelType("channel"); setDmTarget(null); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "#00b5b5" : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                {ch.label}
              </button>
            );
          })}

          <div className="pt-3 pb-1 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
            Mesaje Directe
          </div>
          {employees.map(emp => {
            const isActive = channelType === "direct" && dmTarget?.id === emp.id;
            return (
              <button key={emp.id} onClick={() => handleDM(emp)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? "#00b5b5" : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: "#00b5b5" }}>
                  {emp.full_name?.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{emp.full_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2" style={{ backgroundColor: "#f8fffe" }}>
          {channelType === "channel"
            ? <Hash className="h-4 w-4" style={{ color: "#00b5b5" }} />
            : <User className="h-4 w-4" style={{ color: "#00b5b5" }} />}
          <span className="font-semibold text-slate-900">
            {channelType === "direct" ? dmTarget?.full_name : activeChannelLabel}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-slate-50/30">
          {Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-white rounded-full border border-slate-200">{date}</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender_email === user?.email;
                const showSender = i === 0 || msgs[i - 1]?.sender_email !== msg.sender_email;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""} ${showSender ? "mt-4" : "mt-0.5"}`}>
                    {showSender && (
                      <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: isMe ? "#00b5b5" : "#94a3b8" }}>
                        {msg.sender_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!showSender && <div className="w-8 flex-shrink-0" />}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {showSender && (
                        <span className="text-xs text-slate-400 mb-1 font-medium">
                          {isMe ? "Tu" : msg.sender_name}
                        </span>
                      )}
                      <div className="rounded-2xl px-4 py-2.5 text-sm"
                        style={{
                          backgroundColor: isMe ? "#00b5b5" : "white",
                          color: isMe ? "white" : "#1e293b",
                          borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                        }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm pt-20">
              Niciun mesaj încă. Spune salut! 👋
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={`Mesaj ${channelType === "direct" ? dmTarget?.full_name : "#" + activeChannelLabel}`}
              className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-1"
              style={{ "--ring-color": "#00b5b5" }}
            />
            <Button onClick={handleSend} disabled={!text.trim()} className="px-3"
              style={{ backgroundColor: "#00b5b5" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#009999"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#00b5b5"}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}