import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Layers,
  Package,
  Sparkles,
  AlertTriangle,
  Check,
  RotateCcw,
  X,
  HelpCircle,
  FolderTree,
} from "lucide-react";
import { AVAILABLE_CATEGORY_ICONS, DEFAULT_CATEGORIES, getCategoryIcon } from "../data/categories";
import type { Category, Store } from "../types";

interface CategoryFormState {
  name: string;
  key: string;
  desc: string;
  iconName: string;
}

const emptyFormState = (): CategoryFormState => ({
  name: "",
  key: "",
  desc: "",
  iconName: "Home",
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Modal for Adding or Editing a Category
const CategoryModal: React.FC<{
  initial: Category | null;
  existingKeys: string[];
  onSave: (form: CategoryFormState, originalKey?: string) => void;
  onClose: () => void;
}> = ({ initial, existingKeys, onSave, onClose }) => {
  const [form, setForm] = useState<CategoryFormState>(() =>
    initial
      ? {
          name: initial.name,
          key: initial.key,
          desc: initial.desc || "",
          iconName: initial.iconName || "Home",
        }
      : emptyFormState()
  );

  const [iconFilterTab, setIconFilterTab] = useState<string>("Toutes");
  const [iconSearch, setIconSearch] = useState<string>("");
  const [manualKeyEdit, setManualKeyEdit] = useState<boolean>(!!initial);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setError(null);
    setForm((prev) => {
      const next = { ...prev, name: val };
      if (!manualKeyEdit) {
        next.key = slugify(val);
      }
      return next;
    });
  };

  const handleKeyChange = (val: string) => {
    setError(null);
    setManualKeyEdit(true);
    setForm((prev) => ({ ...prev, key: slugify(val) }));
  };

  const filteredIcons = useMemo(() => {
    return AVAILABLE_CATEGORY_ICONS.filter((item) => {
      const matchTab = iconFilterTab === "Toutes" || item.category === iconFilterTab;
      const matchSearch =
        !iconSearch ||
        item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(iconSearch.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [iconFilterTab, iconSearch]);

  const SelectedIconComp = getCategoryIcon(form.iconName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Veuillez saisir un nom pour la catégorie.");
      return;
    }
    if (!form.key.trim()) {
      setError("Veuillez spécifier un identifiant unique (slug).");
      return;
    }
    // Check if key already exists (if adding, or if changed)
    const isKeyTaken = existingKeys.some(
      (k) => k === form.key && (!initial || initial.key !== form.key)
    );
    if (isKeyTaken) {
      setError(`L'identifiant « ${form.key} » est déjà utilisé par une autre catégorie.`);
      return;
    }

    onSave(form, initial?.key);
  };

  const iconCategories = [
    "Toutes",
    "Général",
    "Éclairage",
    "Sécurité",
    "Énergie & Prises",
    "Connectivité",
    "Capteurs & Confort",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <SelectedIconComp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                {initial ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {initial ? `Édition du rayon ${initial.name}` : "Définissez le nom, le slug et choisissez une icône moderne"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center dk-surface-2 hover:bg-slate-700/30 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la catégorie */}
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
              Nom de la catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Éclairage & Variateurs, Domotique Volets..."
              className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm"
              autoFocus
            />
          </div>

          {/* Identifiant Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold" style={{ color: "var(--text)" }}>
                Identifiant unique (Slug / Clé) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                Ex: <code>interrupteurs-wifi</code>
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={form.key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="slug-unique"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
              />
            </div>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
              Cet identifiant est utilisé pour l'association des produits et le filtrage boutique.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
              Description du rayon
            </label>
            <textarea
              rows={2}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Ex: Commandez vos luminaires, prises murales et éclairages d'ambiance à distance..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          {/* Sélecteur d'icône */}
          <div className="p-3.5 rounded-2xl dk-surface-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                <Sparkles className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                <span>Icône de la catégorie</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg dk-chip-teal font-medium">
                <SelectedIconComp className="h-3.5 w-3.5" />
                <span>{form.iconName}</span>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 dk-scrollbar">
                {iconCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setIconFilterTab(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      iconFilterTab === cat
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                        : "dk-surface text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Rechercher une icône (ex: ampoule, wifi, alarme...)"
                  className="dk-input w-full pl-8 pr-3 py-1.5 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 dk-scrollbar">
              {filteredIcons.map((item) => {
                const IconComponent = item.icon;
                const isSelected = form.iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setForm({ ...form, iconName: item.name })}
                    title={`${item.label} (${item.name})`}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center group ${
                      isSelected
                        ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-500 dark:text-cyan-300 shadow-md scale-105"
                        : "dk-surface hover:border-cyan-500/40 hover:scale-102 text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] line-clamp-1 leading-tight font-medium">
                      {item.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>{initial ? "Mettre à jour" : "Créer la catégorie"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-3 text-sm font-semibold dk-btn-secondary transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Deleting Category with Reassignment Option
const DeleteCategoryModal: React.FC<{
  category: Category;
  otherCategories: Category[];
  productCount: number;
  onConfirm: (reassignToKey?: string) => void;
  onClose: () => void;
}> = ({ category, otherCategories, productCount, onConfirm, onClose }) => {
  const [reassignTo, setReassignTo] = useState<string>(
    otherCategories.length > 0 ? otherCategories[0].key : ""
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
              Supprimer la catégorie ?
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Êtes-vous sûr de vouloir retirer le rayon <strong style={{ color: "var(--text)" }}>« {category.name} »</strong> ?
            </p>
          </div>
        </div>

        {productCount > 0 ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{productCount} produit(s) associé(s) à cette catégorie</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Veuillez sélectionner un rayon de substitution pour réassigner ces articles automatiquement :
            </p>
            {otherCategories.length > 0 ? (
              <select
                value={reassignTo}
                onChange={(e) => setReassignTo(e.target.value)}
                className="dk-input rounded-xl px-3 py-2 w-full text-xs font-semibold"
              >
                {otherCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    Transférer vers : {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-red-500 font-semibold">
                Attention : Il s'agit de la seule catégorie disponible.
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs p-3 rounded-xl dk-surface-2" style={{ color: "var(--text-dim)" }}>
            Aucun article n'est actuellement lié à cette catégorie. Elle peut être supprimée sans impact sur le catalogue.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onConfirm(productCount > 0 ? reassignTo : undefined)}
            className="flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-md"
          >
            Confirmer la suppression
          </button>
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold dk-btn-secondary transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminCategories: React.FC<{ s: Store }> = ({ s }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState<string>("");

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return s.categories;
    const q = search.toLowerCase();
    return s.categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.key.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q))
    );
  }, [s.categories, search]);

  // Product counts per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of s.categories) {
      map[cat.key] = 0;
    }
    for (const p of s.products) {
      if (map[p.category] !== undefined) {
        map[p.category]++;
      } else {
        map[p.category] = (map[p.category] || 0) + 1;
      }
    }
    return map;
  }, [s.categories, s.products]);

  // Total products mapped
  const totalMapped = useMemo(() => {
    return Object.values(productCountMap).reduce((a, b) => a + b, 0);
  }, [productCountMap]);

  // Most popular category
  const mostPopular = useMemo(() => {
    if (s.categories.length === 0) return null;
    let max = -1;
    let bestCat: Category | null = null;
    for (const cat of s.categories) {
      const cnt = productCountMap[cat.key] || 0;
      if (cnt > max) {
        max = cnt;
        bestCat = cat;
      }
    }
    return bestCat ? { cat: bestCat, count: max } : null;
  }, [s.categories, productCountMap]);

  // Save (Create or Update)
  const handleSave = (form: CategoryFormState, originalKey?: string) => {
    const iconComp = getCategoryIcon(form.iconName);

    if (originalKey) {
      // Update existing
      s.setCategories((prev) =>
        prev.map((c) =>
          c.key === originalKey
            ? {
                ...c,
                key: form.key,
                name: form.name,
                desc: form.desc,
                iconName: form.iconName,
                icon: iconComp,
              }
            : c
        )
      );

      // If key changed, update products that had the old category key
      if (originalKey !== form.key) {
        s.setProducts((prev) =>
          prev.map((p) => (p.category === originalKey ? { ...p, category: form.key } : p))
        );
      }

      s.showToast(`Catégorie « ${form.name} » mise à jour avec succès`);
    } else {
      // Create new
      const newCat: Category = {
        key: form.key,
        name: form.name,
        desc: form.desc,
        iconName: form.iconName,
        icon: iconComp,
      };

      s.setCategories((prev) => [...prev, newCat]);
      s.showToast(`Nouvelle catégorie « ${form.name} » ajoutée`);
    }

    setModalOpen(false);
    setEditingCategory(null);
  };

  // Delete category
  const handleDeleteConfirm = (reassignToKey?: string) => {
    if (!deletingCategory) return;
    const catToDelete = deletingCategory;

    // Reassign products if necessary
    if (reassignToKey) {
      s.setProducts((prev) =>
        prev.map((p) => (p.category === catToDelete.key ? { ...p, category: reassignToKey } : p))
      );
    }

    s.setCategories((prev) => prev.filter((c) => c.key !== catToDelete.key));
    s.showToast(`Catégorie « ${catToDelete.name} » supprimée`);
    setDeletingCategory(null);
  };

  // Reset to default categories
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Voulez-vous réinitialiser les catégories aux valeurs par défaut de DomoTek ? Les personnalisations seront restaurées."
      )
    ) {
      s.setCategories(DEFAULT_CATEGORIES);
      s.showToast("Catégories réinitialisées par défaut");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2.5" style={{ color: "var(--text)" }}>
            <span>Gestion des Catégories & Rayons</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {s.categories.length} catégories
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Personnalisez les icônes, éditez les libellés et gérez l'arborescence des rayons du catalogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            title="Réinitialiser les catégories d'origine"
            className="dk-btn-secondary text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Défaut</span>
          </button>

          <button
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}
            className="dk-btn-primary font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Ajouter une catégorie</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl dk-chip-teal flex items-center justify-center shrink-0">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Total Catégories</p>
            <p className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{s.categories.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Articles Classés</p>
            <p className="text-xl font-extrabold font-mono" style={{ color: "var(--text)" }}>{totalMapped} produits</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Rayon Principal</p>
            <p className="text-sm font-extrabold truncate" style={{ color: "var(--text)" }}>
              {mostPopular ? mostPopular.cat.name : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie par nom, identifiant slug ou description..."
          className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Categories Table */}
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="text-left px-4 py-3.5 font-semibold">Icône & Catégorie</th>
                <th className="text-left px-4 py-3.5 font-semibold">Identifiant (Slug)</th>
                <th className="text-left px-4 py-3.5 font-semibold hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3.5 font-semibold">Produits</th>
                <th className="text-right px-4 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10" style={{ color: "var(--text-dim)" }}>
                    <p className="text-sm">Aucune catégorie trouvée pour « {search} ».</p>
                    <button
                      onClick={() => setSearch("")}
                      className="mt-2 text-xs text-cyan-500 hover:underline"
                    >
                      Afficher toutes les catégories
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => {
                  const IconComp = c.icon || getCategoryIcon(c.iconName);
                  const count = productCountMap[c.key] || 0;

                  return (
                    <tr key={c.key} className="hover:bg-[var(--surface-2)]/60 transition-colors group">
                      {/* Icon & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner group-hover:scale-105 transition-transform">
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                              {c.name}
                            </p>
                            <p className="text-[11px] block md:hidden text-slate-400 line-clamp-1">
                              {c.desc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Slug / Key */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <code className="text-xs px-2 py-1 rounded-lg dk-surface-2 font-mono" style={{ color: "var(--text-dim)" }}>
                          {c.key}
                        </code>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 hidden md:table-cell max-w-xs">
                        <p className="text-xs line-clamp-2" style={{ color: "var(--text-dim)" }}>
                          {c.desc || "—"}
                        </p>
                      </td>

                      {/* Product Count */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            count > 0
                              ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                              : "dk-surface-2 text-slate-400"
                          }`}
                        >
                          <Package className="h-3 w-3" />
                          <span>{count} produit{count !== 1 ? "s" : ""}</span>
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCategory(c);
                              setModalOpen(true);
                            }}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Modifier l'icône, le nom et les détails"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCategory(c)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Supprimer la catégorie"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <CategoryModal
          initial={editingCategory}
          existingKeys={s.categories.map((c) => c.key)}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          otherCategories={s.categories.filter((c) => c.key !== deletingCategory.key)}
          productCount={productCountMap[deletingCategory.key] || 0}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
};
