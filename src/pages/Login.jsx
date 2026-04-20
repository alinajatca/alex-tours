import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showGdpr, setShowGdpr] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!gdprAccepted) { setError("Trebuie să accepți politica de confidențialitate!"); return; }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email sau parolă incorectă!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.jpg" alt="Alex Tours" className="h-12 w-12 rounded-xl object-cover" />
          <div>
            <h1 className="font-bold text-slate-900">Alex Tours</h1>
            <p className="text-xs text-slate-500">Birou Virtual</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Autentificare</h2>
        <p className="text-xs text-slate-400 mb-6">Conturile sunt create de managerul echipei.</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Email *</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Parolă *</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)} required className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input type="checkbox" id="gdpr" checked={gdprAccepted}
              onChange={e => setGdprAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 cursor-pointer"
              style={{ accentColor: "#00b5b5" }} />
            <label htmlFor="gdpr" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
              Am citit și accept{" "}
              <button type="button" onClick={() => setShowGdpr(!showGdpr)}
                className="underline font-medium" style={{ color: "#00b5b5" }}>
                Politica de Confidențialitate
              </button>
              {" "}și prelucrarea datelor personale conform GDPR.
            </label>
          </div>

          {showGdpr && (
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-2 max-h-40 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 flex-shrink-0" style={{ color: "#00b5b5" }} />
                <span className="font-semibold text-slate-700">Politica de Confidențialitate</span>
              </div>
              <p><strong>Operator:</strong> Alex Tours SRL</p>
              <p><strong>Date colectate:</strong> nume, adresă de email, ore de lucru, prezență.</p>
              <p><strong>Scop:</strong> Gestionarea internă a echipei și activităților companiei.</p>
              <p><strong>Stocare:</strong> Datele sunt stocate securizat prin Firebase (Google Cloud) și nu sunt transmise către terți.</p>
              <p><strong>Drepturi:</strong> Aveți dreptul de acces, rectificare și ștergere a datelor conform Regulamentului (UE) 2016/679 (GDPR).</p>
              <p><strong>Contact:</strong> Pentru orice solicitare privind datele personale, contactați managerul aplicației.</p>
            </div>
          )}

          <Button type="submit" disabled={loading || !gdprAccepted}
            className="w-full"
            style={{ backgroundColor: gdprAccepted ? "#00b5b5" : "#94a3b8" }}>
            {loading ? "Se procesează..." : "Intră în cont"}
          </Button>
        </form>
      </div>
    </div>
  );
}