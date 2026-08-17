"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-authenticated");
    setAuthenticated(auth === "true");
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-authenticated", "true");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue to-blue-900 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-brand-dark">
              Área Administrativa
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Digite a senha para acessar o painel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="pr-10 h-12 rounded-xl"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-brand-blue hover:bg-brand-blue/90 font-heading font-semibold"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
