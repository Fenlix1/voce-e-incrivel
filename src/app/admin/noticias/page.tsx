"use client";

import { useState } from "react";
import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getNews, setNews, type NewsItem } from "@/data/news";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";

export default function AdminNoticiasPage() {
  const [news, setNws] = useState<NewsItem[]>(getNews());
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    author: "Equipe Você é Incrível",
  });

  const save = () => {
    let updated: NewsItem[];
    if (editing) {
      updated = news.map((n) =>
        n.id === editing.id ? { ...form, id: editing.id } : n
      );
    } else {
      updated = [...news, { ...form, id: Date.now().toString() }];
    }
    setNws(updated);
    setNews(updated);
    setDialogOpen(false);
    resetForm();
  };

  const remove = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNws(updated);
    setNews(updated);
  };

  const edit = (item: NewsItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      summary: item.summary,
      content: item.content,
      date: item.date,
      image: item.image,
      author: item.author || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      summary: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      image: "",
      author: "Equipe Você é Incrível",
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
                  Gerenciar Notícias
                </h1>
                <p className="text-gray-500">{news.length} notícias publicadas</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="bg-brand-green hover:bg-brand-green/90 rounded-xl gap-2"
              >
                <Plus size={18} />
                Nova Notícia
              </Button>
            </div>

            {news.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">Nenhuma notícia cadastrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {item.image && (
                      <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                        {item.summary}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>
                          {new Date(item.date).toLocaleDateString("pt-BR")}
                        </span>
                        {item.author && <span>por {item.author}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => edit(item)}
                        className="rounded-lg"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => remove(item.id)}
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
              {editing ? "Editar Notícia" : "Nova Notícia"}
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
              <Label>Resumo</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="rounded-xl mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label>Conteúdo Completo</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl mt-1.5"
                rows={5}
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
                <Label>Autor</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
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
              className="rounded-xl bg-brand-green hover:bg-brand-green/90"
            >
              {editing ? "Salvar" : "Publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAuthGate>
  );
}
