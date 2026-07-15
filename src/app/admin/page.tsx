"use client";

import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import {
  LayoutDashboard,
  Image,
  Calendar,
  Newspaper,
  Users,
  Heart,
} from "lucide-react";
import Link from "next/link";

const cards = [
  {
    label: "Fotos na Galeria",
    href: "/admin/fotos",
    icon: Image,
    color: "bg-blue-500",
  },
  {
    label: "Eventos",
    href: "/admin/eventos",
    icon: Calendar,
    color: "bg-orange-500",
  },
  {
    label: "Notícias",
    href: "/admin/noticias",
    icon: Newspaper,
    color: "bg-green-500",
  },
  {
    label: "Textos do Site",
    href: "/admin/textos",
    icon: LayoutDashboard,
    color: "bg-purple-500",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Bem-vindo ao painel administrativo do Você é Incrível
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}
                  >
                    <card.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">
                    {card.label}
                  </h3>
                  <p className="text-gray-400 text-sm">Gerenciar &rarr;</p>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Heart size={24} className="text-brand-orange" />
                <h2 className="font-heading font-bold text-xl">
                  Bem-vindo ao Painel Admin
                </h2>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Use o menu lateral para navegar entre as seções. Aqui você pode
                gerenciar fotos da galeria, eventos, notícias, textos
                institucionais e configurações do site. Todas as alterações são
                salvas automaticamente no seu navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}
