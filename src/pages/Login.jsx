import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "@/lib/firebase";
import { appClient } from "@/api/appClient";

const auth = getAuth(app);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("booking_agent");
  const [department, setDepartment] = useState("Sales");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      await appClient.entities.Employee.create({
        full_name: fullName,
        email: email,
        role: role,
        department: department,
        status: "active",
      });
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Emailul este deja folosit!");
      } else if (err.code === "auth/weak-password") {
        setError("Parola trebuie să aibă cel puțin 6 caractere!");
      } else {
        setError("Eroare la creare cont: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Alex Tours</h1>
            <p className="text-xs text-slate-500">Virtual Office</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {isRegister ? "Creare cont" : "Autentificare"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Nume complet *</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Ion Popescu" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Email *</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Parolă *</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {isRegister && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Rol</Label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="tour_guide">Tour Guide</option>
                  <option value="booking_agent">Booking Agent</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Departament</Label>
                <select value={department} onChange={e => setDepartment(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Customer Service">Customer Service</option>
                </select>
              </div>
            </>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Se procesează..." : isRegister ? "Creează cont" : "Intră în cont"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          {isRegister ? "Ai deja cont?" : "Nu ai cont?"}{" "}
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-blue-600 hover:underline font-medium">
            {isRegister ? "Autentifică-te" : "Creează cont"}
          </button>
        </p>
      </div>
    </div>
  );
}