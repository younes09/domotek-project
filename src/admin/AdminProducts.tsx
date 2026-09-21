import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, Search, Filter, AlertTriangle, CheckCircle2, ShieldAlert, Image as ImageIcon, Upload, X } from "lucide-react";
import { IconTile } from "../components/ui";
import { CATEGORIES, CATEGORY_LABEL } from "../data/categories";
import { formatDZD } from "../lib/format";
import { Cpu } from "lucide-react";
import type { Product, Store, StockStatus } from "../types";

interface FormState {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  stock: StockStatus;
  shortDesc: string;
  imageUrl: string;
}

const emptyForm = (): FormState => ({
  name: "",
  category: CATEGORIES[0].key,
  price: "",
  oldPrice: "",
  stock: "in",
  shortDesc: "",
  imageUrl: "",
});

const ProductFormModal: React.FC<{ initial: Product | null; onSave: (f: FormState) => void; onClose: () => void }> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          name: initial.name,
          category: initial.category,
          price: String(initial.price),
          oldPrice: initial.oldPrice ? String(initial.oldPrice) : "",
          stock: initial.stock,
          shortDesc: initial.shortDesc || "",
          imageUrl: initial.imageUrl || "",
        }
      : emptyForm()
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative dk-surface rounded-3xl w-full max-w-lg p-6 border border-slate-800 bg-[#1a2235] shadow-2xl space-y-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="dk-heading text-lg font-bold text-white">
            {initial ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
            {initial ? `ID #${initial.id}` : "Nouveau"}
          </span>
        </div>

        <div className="space-y-4">
          {/* Photo du produit Upload / URL section */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-cyan-400" />
                <span>Photo de l'équipement</span>
              </label>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: "" })}
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <X className="h-3 w-3" /> Supprimer la photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Thumbnail Preview */}
              <div className="h-20 w-20 shrink-0 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center overflow-hidden relative shadow-inner">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Aperçu du produit" className="h-full w-full object-contain p-1" />
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <ImageIcon className="h-7 w-7 mx-auto mb-1 stroke-[1.5]" />
                    <span className="text-[10px] block leading-none">Aucune photo</span>
                  </div>
                )}
              </div>

              {/* Upload & URL Inputs */}
              <div className="flex-1 space-y-2">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                  <Upload className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Importer depuis l'ordinateur</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Ou collez l'URL d'image (https://...)"
                    className="dk-input rounded-xl px-3 py-1.5 w-full text-xs bg-slate-950/80 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Nom du produit</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ex: Switch WiFi 2 voies"
              className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm bg-slate-900/90 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm bg-slate-900/90 text-white"
              >
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">État du Stock</label>
              <select
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value as StockStatus })}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm bg-slate-900/90 text-white"
              >
                <option value="in">En stock (Disponible)</option>
                <option value="low">Stock limité (&lt; 5)</option>
                <option value="out">Rupture de stock (0)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Prix de vente (DA)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="2800"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm bg-slate-900/90 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ancien prix (Biffé)</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                placeholder="3500 (Optionnel)"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm bg-slate-900/90 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Description courte</label>
            <textarea
              rows={2}
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              placeholder="Contrôlez l'éclairage depuis votre smartphone..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs bg-slate-900/90 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <button onClick={() => onSave(form)} className="flex-1 rounded-xl py-3 text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20">
            {initial ? "Mettre à jour" : "Ajouter au catalogue"}
          </button>
          <button onClick={onClose} className="rounded-xl px-5 py-3 text-sm font-semibold border border-slate-800 text-slate-400 hover:text-white transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminProducts: React.FC<{ s: Store }> = ({ s }) => {
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all");

  const filtered = s.products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    if (filterStock === "low") return matchesSearch && (p.stock === "low" || p.stock === "out");
    if (filterStock === "out") return matchesSearch && p.stock === "out";
    return matchesSearch;
  });

  const handleStockChange = (productId: number, newStock: StockStatus) => {
    s.setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    s.showToast("Stock mis à jour avec succès");
  };

  const save = (form: FormState) => {
    if (editing) {
      s.setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: form.name,
                category: form.category,
                stock: form.stock,
                price: Number(form.price),
                oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
                shortDesc: form.shortDesc,
                imageUrl: form.imageUrl || undefined,
              }
            : p
        )
      );
      s.showToast("Produit modifié avec succès");
      setEditing(null);
    } else {
      const newId = Math.max(...s.products.map((p) => p.id), 0) + 1;
      s.setProducts((prev) => [
        ...prev,
        {
          id: newId,
          slug: `produit-${newId}`,
          icon: Cpu,
          shortDesc: form.shortDesc || "Produit connecté DomoTek",
          longDesc: "Solution intelligente d'automatisation.",
          isNew: true,
          isBestSeller: false,
          name: form.name,
          category: form.category,
          stock: form.stock,
          price: Number(form.price) || 2500,
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          imageUrl: form.imageUrl || undefined,
        },
      ]);
      s.showToast("Nouveau produit ajouté");
      setAdding(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${name}" du catalogue ?`)) {
      s.setProducts((prev) => prev.filter((p) => p.id !== id));
      s.showToast("Produit supprimé");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold text-white flex items-center gap-2">
            <span>Gestion du Stock & Catalogue</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              {s.products.length} articles
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ajustez les quantités, modifiez les prix, les photos ou ajoutez de nouveaux équipements.
          </p>
        </div>

        <button
          onClick={() => setAdding(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Search & Stock Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou catégorie..."
            className="dk-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-900/90 text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStock("all")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStock === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            Tous ({s.products.length})
          </button>
          <button
            onClick={() => setFilterStock("low")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filterStock === "low" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Alerte Stock ({s.products.filter((p) => p.stock !== "in").length})</span>
          </button>
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="dk-surface rounded-2xl overflow-hidden border border-slate-800 bg-[#1a2235] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="text-left px-4 py-3 font-semibold">Photo & Produit</th>
                <th className="text-left px-4 py-3 font-semibold">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold">Prix (DA)</th>
                <th className="text-left px-4 py-3 font-semibold">État du Stock</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-1 shadow-sm">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />
                        ) : (
                          <IconTile Icon={p.icon} variant={2} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight">{p.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{p.shortDesc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px]">
                      {CATEGORY_LABEL[p.category] || p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-white">
                    {formatDZD(p.price)}
                    {p.oldPrice && <span className="text-[10px] text-slate-500 line-through block font-normal">{formatDZD(p.oldPrice)}</span>}
                  </td>
                  {/* Quick stock status switcher */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={p.stock}
                      onChange={(e) => handleStockChange(p.id, e.target.value as StockStatus)}
                      className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                        p.stock === "in"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                          : p.stock === "low"
                          ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                          : "bg-red-950/60 text-red-300 border-red-500/30"
                      }`}
                    >
                      <option value="in" className="bg-slate-900 text-white">✓ En stock</option>
                      <option value="low" className="bg-slate-900 text-white">⚠️ Stock limité</option>
                      <option value="out" className="bg-slate-900 text-white">⛔ Rupture</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(p)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Modifier photo & détails"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || adding) && (
        <ProductFormModal initial={editing} onSave={save} onClose={() => { setEditing(null); setAdding(false); }} />
      )}
    </div>
  );
};

