"use client";

import { useState } from "react";
import { AdminAuthGate } from "@/components/layout/AdminAuthGate";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getGalleryPhotos,
  setGalleryPhotos,
  galleryCategories,
  type GalleryPhoto,
} from "@/data/gallery";
import { Plus, Pencil, Trash2, Image, Search } from "lucide-react";

export default function AdminFotosPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [photos, setPhotos] = useState<GalleryPhoto[]>(getGalleryPhotos());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [editing, setEditing] = useState<GalleryPhoto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    url: "",
    caption: "",
    category: "Aulas" as string,
    date: new Date().toISOString().split("T")[0],
  });

  const save = () => {
    let updated: GalleryPhoto[];
    if (editing) {
      updated = photos.map((p) =>
        p.id === editing.id ? { ...form, id: editing.id, category: form.category as GalleryPhoto["category"] } : p
      );
    } else {
      const newPhoto: GalleryPhoto = {
        ...form,
        id: Date.now().toString(),
        category: form.category as GalleryPhoto["category"],
      };
      updated = [...photos, newPhoto];
    }
    setPhotos(updated);
    setGalleryPhotos(updated);
    setDialogOpen(false);
    resetForm();
  };

  const remove = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    setGalleryPhotos(updated);
  };

  const edit = (photo: GalleryPhoto) => {
    setEditing(photo);
    setForm({
      url: photo.url,
      caption: photo.caption,
      category: photo.category,
      date: photo.date,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      url: "",
      caption: "",
      category: "Aulas",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const filtered = photos.filter((p) => {
    const matchSearch =
      p.caption.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "Todas" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark">
                  Gerenciar Fotos
                </h1>
                <p className="text-gray-500">{photos.length} fotos na galeria</p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
                className="bg-brand-blue hover:bg-brand-blue/90 rounded-xl gap-2"
              >
                <Plus size={18} />
                Nova Foto
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar fotos..."
                  className="pl-9 rounded-xl"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "Todas")}>
                <SelectTrigger className="w-full sm:w-48 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas categorias</SelectItem>
                  {galleryCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Grid */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Image size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">Nenhuma foto encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((photo) => (
                  <div
                    key={photo.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => edit(photo)}
                          className="p-2 rounded-lg bg-white/90 hover:bg-white text-brand-blue transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(photo.id)}
                          className="p-2 rounded-lg bg-red-500/90 hover:bg-red-500 text-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">
                        {photo.caption}
                      </p>
                      <p className="text-xs text-gray-400">
                        {photo.category} &middot;{" "}
                        {new Date(photo.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading font-bold text-xl">
              {editing ? "Editar Foto" : "Nova Foto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL da Imagem</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label>Legenda</Label>
              <Input
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Descrição da foto"
                className="rounded-xl mt-1.5"
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v ?? "Aulas" })}
              >
                <SelectTrigger className="rounded-xl mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {galleryCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="rounded-xl mt-1.5"
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
              className="rounded-xl bg-brand-blue hover:bg-brand-blue/90"
            >
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAuthGate>
  );
}
