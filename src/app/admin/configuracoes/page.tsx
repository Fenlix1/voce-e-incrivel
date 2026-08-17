"use client";

import { useState } from "react";
import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupporters, setSupporters, type Supporter } from "@/data/supporters";
import { getContact, setContact } from "@/data/contact";
import { Settings, Star, Phone, Mail, Save, Plus, Trash2 } from "lucide-react";

export default function AdminConfiguracoesPage() {
  const [supporters, setSupp] = useState<Supporter[]>(getSupporters());
  const [contact, setCont] = useState(getContact());
  const [saved, setSaved] = useState(false);

  const handleSaveAll = () => {
    setSupporters(supporters);
    setContact(contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSupporter = () => {
    setSupp([
      ...supporters,
      { id: Date.now().toString(), name: "Novo Apoiador", role: "Apoio Cultural" },
    ]);
  };

  const updateSupporter = (id: string, data: Partial<Supporter>) => {
    setSupp(supporters.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const removeSupporter = (id: string) => {
    setSupp(supporters.filter((s) => s.id !== id));
  };

  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
                  Configurações
                </h1>
                <p className="text-gray-500">Gerencie apoiadores e contatos</p>
              </div>
              <Button
                onClick={handleSaveAll}
                className="bg-brand-blue hover:bg-brand-blue/90 rounded-xl gap-2"
              >
                <Save size={18} />
                {saved ? "Salvo!" : "Salvar Tudo"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Supporters */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <Star size={20} className="text-brand-orange" />
                  Apoiadores
                </h2>
                <div className="space-y-4">
                  {supporters.map((supporter) => (
                    <div
                      key={supporter.id}
                      className="bg-brand-light rounded-xl p-4 space-y-3"
                    >
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label className="text-xs">Nome</Label>
                          <Input
                            value={supporter.name}
                            onChange={(e) =>
                              updateSupporter(supporter.id, {
                                name: e.target.value,
                              })
                            }
                            className="rounded-lg mt-1 h-9 text-sm"
                          />
                        </div>
                        <button
                          onClick={() => removeSupporter(supporter.id)}
                          className="p-2 mt-5 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>
                        <Label className="text-xs">Cargo/Função</Label>
                        <Input
                          value={supporter.role}
                          onChange={(e) =>
                            updateSupporter(supporter.id, {
                              role: e.target.value,
                            })
                          }
                          className="rounded-lg mt-1 h-9 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addSupporter}
                    className="w-full rounded-xl gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Apoiador
                  </Button>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-brand-blue" />
                  Contatos
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "WhatsApp (número completo)",
                      key: "whatsapp",
                      icon: Phone,
                    },
                    {
                      label: "WhatsApp (exibição)",
                      key: "whatsappDisplay",
                      icon: Phone,
                    },
                    {
                      label: "Instagram (@)",
                      key: "instagram",
                      icon: Phone,
                    },
                    {
                      label: "URL Instagram",
                      key: "instagramUrl",
                      icon: Phone,
                    },
                    {
                      label: "Facebook",
                      key: "facebook",
                      icon: Phone,
                    },
                    {
                      label: "URL Facebook",
                      key: "facebookUrl",
                      icon: Phone,
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <Label className="text-xs">{field.label}</Label>
                      <Input
                        value={
                          String((contact as unknown as Record<string, string>)[field.key] || "")
                        }
                        onChange={(e) =>
                          setCont({ ...contact, [field.key]: e.target.value })
                        }
                        className="rounded-lg mt-1 h-9 text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input
                      value={contact.email}
                      onChange={(e) =>
                        setCont({ ...contact, email: e.target.value })
                      }
                      className="rounded-lg mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Telefone</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) =>
                        setCont({ ...contact, phone: e.target.value })
                      }
                      className="rounded-lg mt-1 h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}
