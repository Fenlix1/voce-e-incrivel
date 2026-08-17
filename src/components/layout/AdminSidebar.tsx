"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image,
  Calendar,
  Newspaper,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/fotos", label: "Fotos", icon: Image },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/textos", label: "Textos", icon: FileText },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin-authenticated");
    window.location.href = "/";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center font-heading font-bold text-white">
            FTN
          </div>
          <div>
            <p className="text-sm font-heading font-semibold text-white">Admin</p>
            <p className="text-xs text-white/50">Painel de Controle</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-brand-orange text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all duration-300"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-brand-dark text-white shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-brand-dark">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-brand-dark">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
