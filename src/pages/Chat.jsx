import React, { useState, useEffect, useRef } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Hash, User, Paperclip, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";

const DEFAULT_CHANNELS = ["general", "tours", "bookings", "marketing", "random"];

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

  const filteredMessages = messages.filter(m => m.channel === channelKey);

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
    const date = msg.created_date ? format(new Date(msg.created_date), "MMMM d, yyyy") : "Today";
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  const handleDM = (emp) => { setDmTarget(emp); setChannelType("direct"); };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="w-60 flex-shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-bold text-sm text-slate-200">Channels</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {DEFAULT_CHANNELS.map(ch => (
            <button key={ch} onClick={() => { setActiveChannel(ch); setChannelType("channel"); setDmTarget(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${channelType === "channel" && activeChannel === ch ? "bg-blue-600" : "hover:bg-slate-800 text-slate-300"}`}>
              <Hash className="h-3.5 w-3.5" />{ch}
            </button>
          ))}
          <div className="pt-3 pb-1 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Messages</div>
          {employees.map(emp => (
            <button key={emp.id} onClick={() => handleDM(emp)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${channelType === "direct" && dmTarget?.id === emp.id ? "bg-blue-600" : "hover:bg-slate-800 text-slate-300"}`}>
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{emp.full_name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          {channelType === "channel" ? <Hash className="h-4 w-4 text-slate-400" /> : <User className="h-4 w-4 text-slate-400" />}
          <span className="font-semibold text-slate-900">{channelType === "direct" ? dmTarget?.full_name : activeChannel}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">{date}</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              {msgs.map((msg, i) => {
                const isMe = msg.sender_email === user?.email;
                const showSender = i === 0 || msgs[i - 1]?.sender_email !== msg.sender_email;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""} ${showSender ? "mt-4" : "mt-0.5"}`}>
                    {showSender && (
                      <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${isMe ? "bg-blue-600" : "bg-slate-400"}`}>
                        {msg.sender_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!showSender && <div className="w-8 flex-shrink-0" />}
                    <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {showSender && <span className="text-xs text-slate-400 mb-1 font-medium">{isMe ? "You" : msg.sender_name}</span>}
                      <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-900 rounded-tl-sm"}`}>
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
              No messages yet. Say hello! 👋
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={`Message ${channelType === "direct" ? dmTarget?.full_name : "#" + activeChannel}`}
              className="flex-1 bg-slate-50 border-0 focus-visible:ring-1"
            />
            <Button onClick={handleSend} disabled={!text.trim()} className="bg-blue-600 hover:bg-blue-700 px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}