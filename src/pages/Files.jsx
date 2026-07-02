import React, { useState } from "react";
import { appClient } from "@/api/appClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FileText, Image, File, Trash2, Download, Upload, Plus, Eye } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";

const CLOUDINARY_CLOUD_NAME = "dzg4ywdzf";
const CLOUDINARY_UPLOAD_PRESET = "alex-tours";

const FOLDERS = ["General", "Tururi", "Marketing", "Finanțe", "HR", "Contracte", "Teambuilding"];

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
  if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  if (b > 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
};

export default function Files() {
  const { user } = useAuth();
  const [activeFolder, setActiveFolder] = useState("General");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
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

      const isImage = file.type.startsWith("image/");

      // Imagini -> /image/upload, orice altceva (PDF, doc etc) -> /raw/upload
      const uploadType = isImage ? "image" : "raw";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${uploadType}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (!data.secure_url) {
        console.error("Cloudinary error:", data);
        alert("Upload eșuat: " + (data.error?.message || "eroare necunoscută"));
        setUploading(false);
        return;
      }

      // FIX 401: transforma URL-ul raw in unul accesibil public
      let fileUrl = data.secure_url;
      if (fileUrl.includes("/raw/upload/")) {
        fileUrl = fileUrl.replace("/raw/upload/", "/raw/upload/fl_attachment:false/");
      }

      await createMutation.mutateAsync({
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type,
        file_size: String(file.size),
        uploaded_by_name: user?.full_name || user?.email,
        uploaded_by_email: user?.email,
        folder: activeFolder,
        description: description || "",
      });

      setDescription("");
      // Reset input
      e.target.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload eșuat!");
    }
    setUploading(false);
  };

  const folderFiles = files.filter((f) => f.folder === activeFolder);

  const isImageFile = (file) => {
    const ext = file.file_name?.split(".").pop()?.toLowerCase();
    return file.file_type?.startsWith("image/") || ["jpg","jpeg","png","gif","webp","svg"].includes(ext);
  };

  const isPDFFile = (file) => {
    const ext = file.file_name?.split(".").pop()?.toLowerCase();
    return file.file_type === "application/pdf" || ext === "pdf";
  };

  const isDocFile = (file) => {
    const ext = file.file_name?.split(".").pop()?.toLowerCase();
    return ["doc","docx","xls","xlsx","ppt","pptx"].includes(ext);
  };

  // Google Docs Viewer pentru PDF si documente
  const getViewerUrl = (url) =>
    `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  // Download fortat pentru fisiere
  const handleDownload = (file) => {
    const a = document.createElement("a");
    a.href = file.file_url;
    a.download = file.file_name || "fisier";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openPreview = (file) => {
    setIframeLoading(true);
    setPreviewFile(file);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">

      {/* Sidebar foldere */}
      <div className="w-48 flex-shrink-0 bg-white rounded-2xl border border-slate-200/60 p-3 flex flex-col gap-1 h-fit">
        <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
          Foldere
        </p>
        {FOLDERS.map((f) => (
          <button key={f} onClick={() => setActiveFolder(f)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeFolder === f ? "text-white" : "text-slate-600 hover:bg-slate-50"}`}
            style={activeFolder === f ? { backgroundColor: "#f59e0b" } : {}}>
            <FolderOpen className="h-3.5 w-3.5 flex-shrink-0" />
            {f}
            <span className={`ml-auto text-xs rounded-full px-1.5 ${activeFolder === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
              {files.filter((fi) => fi.folder === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Continut principal */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Upload zone */}
        <div className="bg-white rounded-2xl border border-dashed border-amber-300 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Upload className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm">
              Upload în <span className="text-amber-600">{activeFolder}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">PDF, Word, Excel, imagini și altele (max 10MB)</p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descriere opțională..."
              className="mt-2 h-8 text-xs"
            />
          </div>
          <label className={`cursor-pointer flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${uploading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
            style={{ backgroundColor: "#f59e0b" }}>
            {uploading
              ? <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Se încarcă...</>
              : <><Plus className="h-4 w-4" />Upload Fișier</>
            }
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg"
            />
          </label>
        </div>

        {/* Lista fisiere */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : folderFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FolderOpen className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Nu există fișiere în {activeFolder}</p>
              <p className="text-xs mt-1 opacity-60">Uploadează primul fișier folosind butonul de mai sus</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {folderFiles.map((file, i) => {
                  const Icon = getFileIcon(file.file_name);
                  const canPreview = isImageFile(file) || isPDFFile(file) || isDocFile(file);
                  return (
                    <Motion.div
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 group transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.file_name}</p>
                        <p className="text-xs text-slate-400">
                          {file.uploaded_by_name}
                          {file.created_date ? ` · ${format(new Date(file.created_date), "d MMM yyyy")}` : ""}
                          {file.file_size ? ` · ${formatSize(file.file_size)}` : ""}
                        </p>
                        {file.description && (
                          <p className="text-xs text-slate-400 italic mt-0.5">{file.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canPreview && (
                          <button
                            onClick={() => openPreview(file)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                            title="Previzualizează">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title="Descarcă">
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Ștergi fișierul?")) deleteMutation.mutate(file.id); }}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Șterge">
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

      {/* Modal previzualizare */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFile(null)}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>

            {/* Header modal */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{previewFile.file_name}</p>
                  <p className="text-xs text-slate-400">{formatSize(previewFile.file_size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(previewFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#f59e0b" }}>
                  <Download className="h-3.5 w-3.5" /> Descarcă
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold text-lg">
                  ✕
                </button>
              </div>
            </div>

            {/* Continut previzualizare */}
            <div className="flex-1 overflow-hidden bg-slate-50 relative" style={{ minHeight: "500px" }}>
              {isImageFile(previewFile) ? (
                <div className="h-full flex items-center justify-center p-4">
                  <img
                    src={previewFile.file_url}
                    alt={previewFile.file_name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              ) : (isPDFFile(previewFile) || isDocFile(previewFile)) ? (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                      <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm text-slate-500">Se încarcă previzualizarea...</p>
                      <p className="text-xs text-slate-400 mt-1">Poate dura câteva secunde</p>
                    </div>
                  )}
                  <iframe
                    src={getViewerUrl(previewFile.file_url)}
                    className="w-full h-full"
                    style={{ border: "none", minHeight: "500px" }}
                    title={previewFile.file_name}
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <FileText className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">Previzualizare indisponibilă pentru acest tip de fișier</p>
                  <button
                    onClick={() => handleDownload(previewFile)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ backgroundColor: "#f59e0b" }}>
                    <Download className="h-4 w-4" /> Descarcă fișierul
                  </button>
                </div>
              )}
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
}