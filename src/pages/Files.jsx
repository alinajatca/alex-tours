import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FileText, Image, File, Trash2, Download, Upload, Plus } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";

const CLOUDINARY_CLOUD_NAME = "dzg4ywdzf";
const CLOUDINARY_UPLOAD_PRESET = "alex-tours";

const FOLDERS = ["General", "Tours", "Marketing", "Finance", "HR", "Contracts"];

const getFileIcon = (name) => {
  if (!name) return File;
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return Image;
  if (["pdf","doc","docx","txt","xls","xlsx","ppt","pptx"].includes(ext)) return FileText;
  return File;
};

const formatSize = (bytes) => {
  if (!bytes) return "";
  const b = parseInt(bytes);
  if (b > 1024*1024) return `${(b/1024/1024).toFixed(1)} MB`;
  if (b > 1024) return `${(b/1024).toFixed(0)} KB`;
  return `${b} B`;
};

export default function Files() {
  const { user } = useAuth();
  const [activeFolder, setActiveFolder] = useState("General");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: () => appClient.entities.File.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => appClient.entities.File.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appClient.entities.File.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (!data.secure_url) {
        console.error("Cloudinary error:", data);
        alert("Upload eșuat: " + (data.error?.message || "eroare necunoscută"));
        setUploading(false);
        return;
      }

      await createMutation.mutateAsync({
        file_name: file.name,
        file_url: data.secure_url,
        file_type: file.type,
        file_size: String(file.size),
        uploaded_by_name: user?.full_name || user?.email,
        uploaded_by_email: user?.email,
        folder: activeFolder,
        description: description || "",
      });
      setDescription("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload eșuat!");
    }
    setUploading(false);
  };

  const folderFiles = files.filter(f => f.folder === activeFolder);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="w-48 flex-shrink-0 bg-white rounded-2xl border border-slate-200/60 p-3 flex flex-col gap-1 h-fit">
        <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">Folders</p>
        {FOLDERS.map(f => (
          <button key={f} onClick={() => setActiveFolder(f)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeFolder === f ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            <FolderOpen className="h-3.5 w-3.5 flex-shrink-0" />
            {f}
            <span className={`ml-auto text-xs rounded-full px-1.5 ${activeFolder === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
              {files.filter(fi => fi.folder === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="bg-white rounded-2xl border border-dashed border-amber-300 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Upload className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm">Upload în <span className="text-amber-600">{activeFolder}</span></p>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descriere opțională..." className="mt-2 h-8 text-xs" />
          </div>
          <label className={`cursor-pointer flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white ${uploading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"} transition-colors`}>
            {uploading ? "Se încarcă..." : <><Plus className="h-4 w-4" />Upload Fișier</>}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-xl" />)}</div>
          ) : folderFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FolderOpen className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Nu există fișiere în {activeFolder}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {folderFiles.map((file, i) => {
                  const Icon = getFileIcon(file.file_name);
                  return (
                    <Motion.div key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 group transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.file_name}</p>
                        <p className="text-xs text-slate-400">
                          {file.uploaded_by_name} · {file.created_date ? format(new Date(file.created_date), "MMM d, yyyy") : ""} {file.file_size ? `· ${formatSize(file.file_size)}` : ""}
                        </p>
                        {file.description && <p className="text-xs text-slate-400 italic">{file.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.file_url && (
                          <a href={file.file_url} target="_blank" rel="noreferrer" download className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => { if(confirm("Ștergi fișierul?")) deleteMutation.mutate(file.id); }} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}