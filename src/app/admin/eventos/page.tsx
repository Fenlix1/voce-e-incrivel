"use client";

import { useState } from "react";
import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getEvents, setEvents, type Event } from "@/data/events";
import { Plus, Pencil, Trash2, Calendar, Star } from "lucide-react";

export default function AdminEventosPage() {
  const [events, setEvts] = useState<Event[]>(getEvents());
  const [editing, setEditing] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "09:00",
    location: "",
    image: "",
    featured: false,
  });

  const save = () => {
    let updated: Event[];
    if (editing) {
      updated = events.map((e) =>
        e.id === editing.id ? { ...form, id: editing.id } : e
      );
    } else {
      updated = [...events, { ...form, id: Date.now().toString() }];
    }
    setEvts(updated);
    setEvents(updated);
    setDialogOpen(false);
    resetForm();
  };

  const remove = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvts(updated);
    setEvents(updated);
  };

  const edit = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      featured: event.featured || false,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      date: "",
      time: "09:00",
      location: "",
      image: "",
      featured: false,
    });
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
                  Gerenciar Eventos
                </h1>
                <p className="text-gray-500">{events.length} eventos cadastrados</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="bg-brand-orange hover:bg-brand-orange/90 rounded-xl gap-2"
              >
                <Plus size={18} />
                Novo Evento
              </Button>
            </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">Nenhum evento cadastrado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {event.image && (
                      <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold text-lg truncate">
                          {event.title}
                        </h3>
                        {event.featured && (
                          <Badge className="bg-brand-orange gap-1 shrink-0">
                            <Star size={10} /> Destaque
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>
                          {new Date(event.date + "T" + event.time).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          às {event.time}
                        </span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => edit(event)}
                        className="rounded-lg"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => remove(event.id)}
                        className="rounded-lg text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl">
              {editing ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-xl mt-1.5"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label>Local</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="rounded-xl mt-1.5"
                placeholder="https://..."
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Evento em destaque</span>
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={save}
              className="rounded-xl bg-brand-orange hover:bg-brand-orange/90"
            >
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAuthGate>
  );
}
