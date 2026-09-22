import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Image as ImageIcon,
  Upload,
  X,
  Copy,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  ArrowUpDown,
  Sparkles,
  Star,
  Check,
  Plus,
  Minus,
  Download,
  Eye,
  Sliders,
  Percent,
  CheckSquare,
  Square,
  RefreshCw,
  Cpu,
  FileText,
  HelpCircle,
  Wrench,
  Smartphone,
  BookOpen,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { IconTile } from "../components/ui";
import { formatDZD } from "../lib/format";
import type { Category, Product, ProductFAQ, ProductSpec, ProductVariant, StockStatus, Store } from "../types";
import { saveProductToDb, deleteProductFromDb } from "../lib/supabaseDb";

interface FormState {
  name: string;
  sku: string;
  category: string;
  price: string;
  oldPrice: string;
  costPrice: string;
  quantity: string;
  lowStockThreshold: string;
  stock: StockStatus;
  shortDesc: string;
  longDesc: string;
  characteristics: string;
  compatibility: string;
  installation: string;
  usage: string;
  faq: ProductFAQ[];
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  imageUrl: string;
  images: string[];
  specs: ProductSpec[];
  variantLabel: string;
  variantOptions: string;
}

const emptyForm = (defaultCatKey = "smart-home"): FormState => ({
  name: "",
  sku: `DK-${Math.floor(1000 + Math.random() * 9000)}`,
  category: defaultCatKey,
  price: "",
  oldPrice: "",
  costPrice: "",
  quantity: "15",
  lowStockThreshold: "5",
  stock: "in",
  shortDesc: "",
  longDesc: "",
  characteristics: "",
  compatibility: "",
  installation: "",
  usage: "",
  faq: [],
  isNew: true,
  isBestSeller: false,
  isFeatured: false,
  imageUrl: "",
  images: [],
  specs: [
    { name: "Alimentation", value: "110-240V AC 50/60Hz" },
    { name: "Connectivité", value: "Wi-Fi 2.4GHz / IEEE 802.11 b/g/n" },
    { name: "Application", value: "Smart Life / Tuya Smart (iOS & Android)" },
    { name: "Garantie", value: "12 Mois" },
  ],
  variantLabel: "",
  variantOptions: "",
});

const ProductFormModal: React.FC<{
  initial: Product | null;
  categories: Category[];
  onSave: (f: FormState) => void;
  onClose: () => void;
}> = ({ initial, categories, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "stock" | "details" | "media" | "specs">("general");
  const [activeDetailsSection, setActiveDetailsSection] = useState<"desc" | "specs" | "compat" | "install" | "usage" | "faq">("desc");

  const [form, setForm] = useState<FormState>(() => {
    if (initial) {
      const rawImages: string[] = [];
      if (Array.isArray(initial.images)) {
        rawImages.push(...initial.images.filter((img) => Boolean(img && img.trim())));
      }
      if (initial.imageUrl && initial.imageUrl.trim() && !rawImages.includes(initial.imageUrl.trim())) {
        rawImages.unshift(initial.imageUrl.trim());
      }
      const initialImages = rawImages.slice(0, 3);

      return {
        name: initial.name,
        sku: initial.sku || `DK-${initial.id.toString().padStart(4, "0")}`,
        category: initial.category,
        price: String(initial.price),
        oldPrice: initial.oldPrice ? String(initial.oldPrice) : "",
        costPrice: initial.costPrice ? String(initial.costPrice) : "",
        quantity: String(initial.quantity !== undefined ? initial.quantity : initial.stock === "out" ? 0 : initial.stock === "low" ? 3 : 20),
        lowStockThreshold: String(initial.lowStockThreshold || 5),
        stock: initial.stock,
        shortDesc: initial.shortDesc || "",
        longDesc: initial.longDesc || "",
        characteristics: initial.characteristics || "",
        compatibility: initial.compatibility || "",
        installation: initial.installation || "",
        usage: initial.usage || "",
        faq: initial.faq ? initial.faq.map((item) => ({ ...item })) : [],
        isNew: initial.isNew ?? false,
        isBestSeller: initial.isBestSeller ?? false,
        isFeatured: initial.isFeatured ?? false,
        imageUrl: initialImages[0] || initial.imageUrl || "",
        images: initialImages,
        specs: initial.specs || [
          { name: "Alimentation", value: "110-240V AC 50/60Hz" },
          { name: "Connectivité", value: "Wi-Fi 2.4GHz" },
          { name: "Application", value: "Smart Life / Tuya" },
          { name: "Garantie", value: "12 Mois" },
        ],
        variantLabel: initial.variants?.label || "",
        variantOptions: initial.variants?.options ? initial.variants.options.join(", ") : "",
      };
    }
    return emptyForm(categories[0]?.key || "smart-home");
  });

  // Calculate profit margin
  const sellingPriceNum = Number(form.price) || 0;
  const costPriceNum = Number(form.costPrice) || 0;
  const marginDA = sellingPriceNum - costPriceNum;
  const marginPercent = sellingPriceNum > 0 ? Math.round((marginDA / sellingPriceNum) * 100) : 0;

  // Multi-photo handlers (1 to 3 photos)
  const handlePhotoUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setForm((prev) => {
          const nextImages = [...(prev.images || [])];
          // Ensure slots up to slotIndex exist
          while (nextImages.length <= slotIndex) {
            nextImages.push("");
          }
          nextImages[slotIndex] = dataUrl;
          const clean = nextImages.filter(Boolean).slice(0, 3);
          return {
            ...prev,
            images: clean,
            imageUrl: clean[0] || "",
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUrlChange = (slotIndex: number, val: string) => {
    setForm((prev) => {
      const nextImages = [...(prev.images || [])];
      while (nextImages.length <= slotIndex) {
        nextImages.push("");
      }
      nextImages[slotIndex] = val;
      const clean = nextImages.filter((s) => s && s.trim() !== "").slice(0, 3);
      return {
        ...prev,
        images: nextImages.slice(0, 3),
        imageUrl: clean[0] || (slotIndex === 0 ? val : prev.imageUrl),
      };
    });
  };

  const handleRemovePhoto = (slotIndex: number) => {
    setForm((prev) => {
      const nextImages = (prev.images || []).filter((_, idx) => idx !== slotIndex);
      return {
        ...prev,
        images: nextImages,
        imageUrl: nextImages[0] || "",
      };
    });
  };

  const handleMovePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex > 2) return;
    setForm((prev) => {
      const list = [...(prev.images || [])];
      while (list.length < 3) list.push("");
      const item = list[fromIndex];
      list[fromIndex] = list[toIndex];
      list[toIndex] = item;
      const clean = list.filter(Boolean);
      return {
        ...prev,
        images: clean,
        imageUrl: clean[0] || "",
      };
    });
  };

  // Spec handlers
  const handleAddSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { name: "", value: "" }],
    }));
  };

  const handleUpdateSpec = (index: number, field: "name" | "value", val: string) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((sp, idx) => (idx === index ? { ...sp, [field]: val } : sp)),
    }));
  };

  const handleRemoveSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, idx) => idx !== index),
    }));
  };

  // FAQ handlers
  const handleAddFaq = () => {
    setForm((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((item, idx) => (idx === index ? { ...item, [field]: val } : item)),
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, idx) => idx !== index),
    }));
  };

  // Auto-update stock status based on quantity
  const handleQuantityChange = (qtyStr: string) => {
    const qty = Number(qtyStr);
    let autoStock: StockStatus = "in";
    const threshold = Number(form.lowStockThreshold) || 5;

    if (qty <= 0) {
      autoStock = "out";
    } else if (qty <= threshold) {
      autoStock = "low";
    }

    setForm((prev) => ({
      ...prev,
      quantity: qtyStr,
      stock: autoStock,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                {initial ? `Modifier : ${initial.name}` : "Nouveau Produit au Catalogue"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {initial ? `SKU : ${form.sku || `ID #${initial.id}`}` : "Définissez les détails, prix, stock et spécifications techniques"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center dk-surface-2 hover:bg-slate-700/30 transition-colors"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b dk-scrollbar" style={{ borderColor: "var(--border)" }}>
          {[
            { id: "general", label: "Général & Rayon", icon: Package },
            { id: "pricing", label: "Prix & Rentabilité", icon: DollarSign },
            { id: "stock", label: "Stock & Seuil", icon: Sliders },
            { id: "details", label: "Fiche Produit (6 Onglets)", icon: FileText },
            { id: "media", label: "Photos & Visuels", icon: ImageIcon },
            { id: "specs", label: "Variantes & Options", icon: Layers },
          ].map((t) => {
            const IconComp = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  active
                    ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                    : "dk-surface-2 hover:opacity-100"
                }`}
                style={!active ? { color: "var(--text-dim)" } : {}}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                  Nom officiel du produit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Switch Mural WiFi Tactile 2 Voies - Compatible Tuya & Alexa"
                  className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Catégorie / Rayon <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key} className="bg-[var(--surface)] text-[var(--text)]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Référence SKU / Code Article
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="DK-SW-WIFI2"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                  Accroche courte (affichée sur la carte produit)
                </label>
                <textarea
                  rows={2}
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  placeholder="ex: Contrôlez deux circuits d'éclairage indépendamment depuis votre smartphone..."
                  className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                  Description détaillée & Conseils d'installation
                </label>
                <textarea
                  rows={3}
                  value={form.longDesc}
                  onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
                  placeholder="Description complète, compatibilité avec les boîtes d'encastrement 86mm, schéma de câblage..."
                  className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
                />
              </div>

              {/* Flags */}
              <div className="p-3.5 rounded-2xl dk-surface-2 space-y-2">
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>Badges & Visibilité Boutique</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl dk-surface cursor-pointer text-xs" style={{ color: "var(--text)" }}>
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                      className="rounded text-cyan-500"
                    />
                    <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Nouveauté (Badge New)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl dk-surface cursor-pointer text-xs" style={{ color: "var(--text)" }}>
                    <input
                      type="checkbox"
                      checked={form.isBestSeller}
                      onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span>Top Vente (Best-seller)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl dk-surface cursor-pointer text-xs" style={{ color: "var(--text)" }}>
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded text-purple-500"
                    />
                    <Percent className="h-3.5 w-3.5 text-purple-500" />
                    <span>Mise en avant (Promo)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & MARGIN */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Prix de vente public (DA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2800"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Ancien Prix barré (DA)
                  </label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="3500 (Optionnel)"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Coût d'achat fournisseur (DA)
                  </label>
                  <input
                    type="number"
                    value={form.costPrice}
                    onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                    placeholder="1600 (Interne)"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-mono"
                  />
                </div>
              </div>

              {/* Profit Simulator Card */}
              {sellingPriceNum > 0 && (
                <div className="p-4 rounded-2xl dk-surface-2 border space-y-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span>Analyse de Rentabilité & Marge Unitaire</span>
                    </p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold ${
                        marginPercent >= 40
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                          : marginPercent >= 20
                          ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                      }`}
                    >
                      Marge : {marginPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl dk-surface">
                      <span style={{ color: "var(--text-dim)" }}>Bénéfice Net estimé par unité</span>
                      <p className="text-base font-extrabold font-mono text-emerald-500 mt-0.5">
                        +{formatDZD(Math.max(0, marginDA))}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl dk-surface">
                      <span style={{ color: "var(--text-dim)" }}>Valeur Marchande du Stock ({form.quantity || 0} pcs)</span>
                      <p className="text-base font-extrabold font-mono text-cyan-500 mt-0.5">
                        {formatDZD(sellingPriceNum * (Number(form.quantity) || 0))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STOCK & INVENTORY */}
          {activeTab === "stock" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Quantité exacte en stock (Pièces) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    placeholder="25"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Seuil d'alerte stock bas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                    placeholder="5"
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: "var(--text)" }}>
                    Statut affiché aux clients
                  </label>
                  <select
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value as StockStatus })}
                    className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-bold"
                  >
                    <option value="in">✓ En stock (Disponible)</option>
                    <option value="low">⚠️ Stock limité (&lt; seuil)</option>
                    <option value="out">⛔ Rupture de stock</option>
                  </select>
                </div>
              </div>

              {/* Quick replenishment buttons */}
              <div className="p-3.5 rounded-2xl dk-surface-2 space-y-2">
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>Réapprovisionnement rapide du stock</p>
                <div className="flex flex-wrap gap-2">
                  {[+5, +10, +25, +50].map((increment) => (
                    <button
                      key={increment}
                      type="button"
                      onClick={() => {
                        const nextVal = (Number(form.quantity) || 0) + increment;
                        handleQuantityChange(String(nextVal));
                      }}
                      className="px-3 py-1.5 rounded-xl dk-surface text-xs font-bold hover:border-cyan-500/50 transition-colors"
                      style={{ color: "var(--text)" }}
                    >
                      +{increment} unités
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleQuantityChange("0")}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors"
                  >
                    Marquer en Rupture (0)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FICHE PRODUIT (6 ONGLETS) */}
          {activeTab === "details" && (
            <div className="space-y-4">
              {/* Header explanation banner */}
              <div className="p-3.5 rounded-2xl dk-surface-2 border flex items-start gap-3" style={{ borderColor: "var(--border)" }}>
                <FileText className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--teal)" }} />
                <div className="text-xs">
                  <span className="font-bold block" style={{ color: "var(--text)" }}>
                    Personnalisation de la fiche produit sur la boutique
                  </span>
                  <span style={{ color: "var(--text-dim)" }}>
                    Gérez directement les 6 sections d'information affichées sur la page produit client.
                  </span>
                </div>
              </div>

              {/* Sub-tabs selector for the 6 sections */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 border-b dk-scrollbar" style={{ borderColor: "var(--border)" }}>
                {[
                  { id: "desc", label: "1. Description", icon: FileText },
                  { id: "specs", label: "2. Caractéristiques", icon: Sliders },
                  { id: "compat", label: "3. Compatibilité", icon: CheckCircle2 },
                  { id: "install", label: "4. Installation", icon: Wrench },
                  { id: "usage", label: "5. Utilisation", icon: Smartphone },
                  { id: "faq", label: `6. Questions fréquentes (${form.faq.length})`, icon: HelpCircle },
                ].map((sec) => {
                  const IconC = sec.icon;
                  const isActiveSec = activeDetailsSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveDetailsSection(sec.id as typeof activeDetailsSection)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                        isActiveSec
                          ? "dk-btn-primary shadow-sm"
                          : "dk-surface-2 hover:opacity-100"
                      }`}
                      style={!isActiveSec ? { color: "var(--text-dim)" } : {}}
                    >
                      <IconC className="h-3.5 w-3.5" />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SECTION 1: DESCRIPTION */}
              {activeDetailsSection === "desc" && (
                <div className="space-y-3 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>1. Description Détaillée</h4>
                    <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      Présentation complète du produit affichée dans le premier onglet client.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Texte complet de la description
                    </label>
                    <textarea
                      rows={6}
                      value={form.longDesc}
                      onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
                      placeholder="Décrivez en détail les bénéfices du produit, son fonctionnement et ses usages quotidiens..."
                      className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Accroche courte complémentaire (carte produit & haut de fiche)
                    </label>
                    <input
                      type="text"
                      value={form.shortDesc}
                      onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                      placeholder="Accroche en 1 phrase concise..."
                      className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: CARACTÉRISTIQUES */}
              {activeDetailsSection === "specs" && (
                <div className="space-y-4 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>2. Caractéristiques & Spécifications</h4>
                    <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                      Résumé clé et tableau technique des spécifications (Tension, Wi-Fi, Garantie, etc.).
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Résumé des caractéristiques (points forts)
                    </label>
                    <textarea
                      rows={2}
                      value={form.characteristics}
                      onChange={(e) => setForm({ ...form, characteristics: e.target.value })}
                      placeholder="ex: Façade verre trempé résistant, commande tactile rétroéclairée, mémoire d'état..."
                      className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold" style={{ color: "var(--text)" }}>
                        Tableau technique des spécifications ({form.specs.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="text-xs text-cyan-500 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Ajouter une spécification
                      </button>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto dk-scrollbar pr-1">
                      {form.specs.map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sp.name}
                            onChange={(e) => handleUpdateSpec(idx, "name", e.target.value)}
                            placeholder="Nom (ex: Alimentation)"
                            className="dk-input rounded-xl px-3 py-1.5 w-1/3 text-xs"
                          />
                          <input
                            type="text"
                            value={sp.value}
                            onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                            placeholder="Valeur (ex: 110-240V AC)"
                            className="dk-input rounded-xl px-3 py-1.5 flex-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(idx)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Presets */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] self-center mr-1" style={{ color: "var(--text-faint)" }}>Raccourcis :</span>
                      {["Tension", "Puissance max", "Connectivité", "Portée", "Matériau", "Garantie"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, specs: [...prev.specs, { name: preset, value: "" }] }))}
                          className="px-2 py-0.5 rounded-md dk-surface text-[10px] transition-colors hover:border-cyan-500/50"
                          style={{ color: "var(--text-dim)" }}
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: COMPATIBILITÉ */}
              {activeDetailsSection === "compat" && (
                <div className="space-y-3 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>3. Informations de Compatibilité</h4>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                        Indiquez les écosystèmes, assistants vocaux, dimensions et normes compatibles.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const template = "• Compatible Tuya Smart & Smart Life (iOS / Android)\n• Compatible commandes vocales Amazon Alexa et Google Assistant\n• Compatible avec boîtes d'encastrement standard 60mm\n• Compatible Wi-Fi 2.4 GHz (sans box domotique requise)";
                        setForm((prev) => ({ ...prev, compatibility: prev.compatibility ? `${prev.compatibility}\n${template}` : template }));
                      }}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      + Insérer un modèle
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Détails de compatibilité (une puce ou tiret par ligne pour affichage avec coche)
                    </label>
                    <textarea
                      rows={6}
                      value={form.compatibility}
                      onChange={(e) => setForm({ ...form, compatibility: e.target.value })}
                      placeholder="• Compatible Tuya Smart & Smart Life&#10;• Compatible Amazon Alexa et Google Home&#10;• Compatible avec toutes les ampoules LED (3W à 600W)..."
                      className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 4: INSTALLATION */}
              {activeDetailsSection === "install" && (
                <div className="space-y-3 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>4. Guide d'Installation & Câblage</h4>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                        Numérotez les étapes (1. Couper le courant, 2. ...) pour un affichage automatique sous forme de badges.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const template = "1. Coupez impérativement le disjoncteur général avant toute manipulation électrique.\n2. Retirez l'ancien équipement de la boîte murale.\n3. Raccordez la Phase (L) et le retour de lampe conformément au schéma.\n4. Fixez le mécanisme dans la boîte et remettez la façade.\n5. Rétablissez le courant au disjoncteur.";
                        setForm((prev) => ({ ...prev, installation: prev.installation ? `${prev.installation}\n${template}` : template }));
                      }}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      + Insérer un modèle
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Étapes d'installation
                    </label>
                    <textarea
                      rows={6}
                      value={form.installation}
                      onChange={(e) => setForm({ ...form, installation: e.target.value })}
                      placeholder="1. Coupez le disjoncteur général...&#10;2. Raccordez la Phase et le retour de lampe...&#10;3. Vissez dans la boîte d'encastrement..."
                      className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 5: UTILISATION */}
              {activeDetailsSection === "usage" && (
                <div className="space-y-3 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>5. Guide d'Utilisation & Appairage</h4>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                        Expliquez le téléchargement de l'application, l'association Wi-Fi et les scénarios utiles.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const template = "1. Téléchargez l'application 'Smart Life' sur App Store ou Google Play.\n2. Mettez l'appareil en mode appairage en maintenant le bouton 5 secondes.\n3. Ajoutez l'appareil détecté et connectez-le à votre Wi-Fi 2.4 GHz.\n4. Configurez vos plannings, minuteries et commandes vocales.";
                        setForm((prev) => ({ ...prev, usage: prev.usage ? `${prev.usage}\n${template}` : template }));
                      }}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                    >
                      + Insérer un modèle
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Guide d'usage et de configuration
                    </label>
                    <textarea
                      rows={6}
                      value={form.usage}
                      onChange={(e) => setForm({ ...form, usage: e.target.value })}
                      placeholder="1. Téléchargez l'application Smart Life...&#10;2. Activez le mode appairage...&#10;3. Profitez du pilotage à distance et scénarios..."
                      className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 6: QUESTIONS FRÉQUENTES (FAQ) */}
              {activeDetailsSection === "faq" && (
                <div className="space-y-3 p-4 rounded-2xl dk-surface-2 border" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: "var(--text)" }}>6. Questions Fréquentes ({form.faq.length})</h4>
                      <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                        FAQ interactive affichée sous forme d'accordéon pour répondre aux interrogations des clients.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="text-xs text-cyan-500 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Ajouter une question
                    </button>
                  </div>

                  {form.faq.length === 0 ? (
                    <div className="p-6 text-center rounded-xl dk-surface border space-y-2" style={{ borderColor: "var(--border)" }}>
                      <HelpCircle className="h-8 w-8 mx-auto" style={{ color: "var(--text-faint)" }} />
                      <p className="text-xs" style={{ color: "var(--text-dim)" }}>Aucune question fréquente renseignée pour ce produit.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            faq: [
                              {
                                question: "Cet équipement nécessite-t-il un fil Neutre ?",
                                answer: "Ce produit peut fonctionner avec ou sans neutre selon le câblage de votre installation.",
                              },
                              {
                                question: "L'appareil fonctionne-t-il si Internet est coupé ?",
                                answer: "Oui, le contrôle manuel local reste opérationnel même en cas de coupure de votre connexion Internet.",
                              },
                            ],
                          }));
                        }}
                        className="px-3 py-1.5 rounded-xl dk-surface-2 text-xs font-semibold hover:border-cyan-500/50"
                        style={{ color: "var(--text)" }}
                      >
                        + Insérer 2 questions types
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto dk-scrollbar pr-1">
                      {form.faq.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl dk-surface border space-y-2 relative" style={{ borderColor: "var(--border)" }}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                              Question #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(idx)}
                              className="h-6 w-6 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10"
                              title="Supprimer cette question"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            placeholder="Question (ex: Cet interrupteur nécessite-t-il un neutre ?)"
                            className="dk-input rounded-xl px-3 py-1.5 w-full text-xs font-semibold"
                          />

                          <textarea
                            rows={2}
                            value={item.answer}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            placeholder="Réponse détaillée..."
                            className="dk-input rounded-xl px-3 py-1.5 w-full text-xs leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA & PHOTOS (1 à 3 PHOTOS) */}
          {activeTab === "media" && (
            <div className="space-y-4">
              {/* Header Info Banner */}
              <div className="p-3.5 rounded-2xl dk-surface-2 border flex items-start gap-3" style={{ borderColor: "var(--border)" }}>
                <ImageIcon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--teal)" }} />
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: "var(--text)" }}>
                      Galerie Photos du Produit (1 à 3 photos)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold dk-chip-teal">
                      {(form.images || []).filter((s) => Boolean(s && s.trim())).length} / 3 ajoutée(s)
                    </span>
                  </div>
                  <p style={{ color: "var(--text-dim)" }}>
                    Ajoutez entre <strong>1 et 3 photos haute définition</strong>. La <strong>Photo #1</strong> sert d'image principale sur les cartes de la boutique. Les photos 2 et 3 permettent aux clients d'explorer l'équipement sous différents angles sur la fiche produit.
                  </p>
                </div>
              </div>

              {/* 3 Photo Slots */}
              <div className="space-y-3">
                {[
                  { index: 0, title: "Photo 1 — Image Principale (Couverture)", role: "Principale", required: true, subtitle: "Affichée sur les cartes produit, recherche et page d'accueil" },
                  { index: 1, title: "Photo 2 — Vue Secondaire / Profil", role: "Secondaire", required: false, subtitle: "Vue de profil, connecteurs ou schéma d'installation" },
                  { index: 2, title: "Photo 3 — Vue Détails / Boîtier / Application", role: "Détail", required: false, subtitle: "Gros plan sur les finitions, emballage ou capture d'application" },
                ].map((slot) => {
                  const currentImg = (form.images && form.images[slot.index]) || (slot.index === 0 ? form.imageUrl : "") || "";
                  const hasImg = Boolean(currentImg && currentImg.trim());

                  return (
                    <div
                      key={slot.index}
                      className={`p-4 rounded-2xl dk-surface-2 border transition-all ${
                        hasImg ? "border-cyan-500/40 shadow-sm" : ""
                      }`}
                      style={{ borderColor: hasImg ? undefined : "var(--border)" }}
                    >
                      <div className="flex items-center justify-between pb-2 mb-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                            hasImg ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300" : "dk-surface text-[var(--text-dim)]"
                          }`}>
                            #{slot.index + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold block" style={{ color: "var(--text)" }}>
                              {slot.title}
                            </span>
                            <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                              {slot.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Move up / down controls */}
                          {hasImg && (
                            <div className="flex items-center gap-0.5 mr-2">
                              {slot.index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(slot.index, slot.index - 1)}
                                  className="h-6 px-1.5 rounded text-[10px] dk-surface hover:border-cyan-500/50 flex items-center gap-0.5"
                                  style={{ color: "var(--text-dim)" }}
                                  title="Déplacer vers le haut"
                                >
                                  ▲
                                </button>
                              )}
                              {slot.index < 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(slot.index, slot.index + 1)}
                                  className="h-6 px-1.5 rounded text-[10px] dk-surface hover:border-cyan-500/50 flex items-center gap-0.5"
                                  style={{ color: "var(--text-dim)" }}
                                  title="Déplacer vers le bas"
                                >
                                  ▼
                                </button>
                              )}
                            </div>
                          )}

                          {hasImg ? (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(slot.index)}
                              className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 font-medium px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" /> Supprimer
                            </button>
                          ) : (
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              slot.required
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                                : "text-[var(--text-faint)]"
                            }`}>
                              {slot.required ? "Recommandée" : "Optionnelle"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Preview Box */}
                        <div className="h-28 w-28 shrink-0 rounded-2xl dk-surface flex items-center justify-center overflow-hidden border shadow-inner relative group" style={{ borderColor: "var(--border)" }}>
                          {hasImg ? (
                            <>
                              <img src={currentImg} alt={`Aperçu slot ${slot.index + 1}`} className="h-full w-full object-contain p-1.5" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer text-white text-[10px] font-bold px-2 py-1 rounded bg-black/60 hover:bg-black/90 transition-colors">
                                  Changer
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoUpload(slot.index, e)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2" style={{ color: "var(--text-faint)" }}>
                              <ImageIcon className="h-7 w-7 mx-auto mb-1 stroke-[1.5]" />
                              <span className="text-[10px] block leading-none">Slot #{slot.index + 1} vide</span>
                            </div>
                          )}
                        </div>

                        {/* Input controls */}
                        <div className="flex-1 w-full space-y-2">
                          <label className="cursor-pointer dk-surface hover:border-cyan-500/50 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 transition-all border shadow-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                            <Upload className="h-3.5 w-3.5 text-cyan-500" />
                            <span>{hasImg ? "Remplacer par un fichier" : "Importer une photo depuis l'ordinateur"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(slot.index, e)}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={currentImg}
                              onChange={(e) => handlePhotoUrlChange(slot.index, e.target.value)}
                              placeholder={`Ou collez le lien direct de la photo #${slot.index + 1} (https://...)`}
                              className="dk-input rounded-xl px-3 py-1.5 flex-1 text-xs"
                            />
                            {hasImg && (
                              <button
                                type="button"
                                onClick={() => handlePhotoUrlChange(slot.index, "")}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Vider le lien"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SPECS & VARIANTS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              {/* Variants */}
              <div className="p-3.5 rounded-2xl dk-surface-2 space-y-3">
                <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text)" }}>
                  <Sliders className="h-4 w-4 text-cyan-500" />
                  <span>Variantes du produit (Optionnel)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Libellé (ex: Couleur, Nombre de voies)
                    </label>
                    <input
                      type="text"
                      value={form.variantLabel}
                      onChange={(e) => setForm({ ...form, variantLabel: e.target.value })}
                      placeholder="ex: Finition ou Canaux"
                      className="dk-input rounded-xl px-3 py-2 w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--text-dim)" }}>
                      Options (séparées par des virgules)
                    </label>
                    <input
                      type="text"
                      value={form.variantOptions}
                      onChange={(e) => setForm({ ...form, variantOptions: e.target.value })}
                      placeholder="ex: 1 Voie, 2 Voies, 3 Voies"
                      className="dk-input rounded-xl px-3 py-2 w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-3.5 rounded-2xl dk-surface-2 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold" style={{ color: "var(--text)" }}>
                    Fiche Technique & Caractéristiques ({form.specs.length})
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs text-cyan-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Ajouter une ligne
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto dk-scrollbar pr-1">
                  {form.specs.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sp.name}
                        onChange={(e) => handleUpdateSpec(idx, "name", e.target.value)}
                        placeholder="Caractéristique (ex: Tension)"
                        className="dk-input rounded-xl px-3 py-1.5 w-1/3 text-xs"
                      />
                      <input
                        type="text"
                        value={sp.value}
                        onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                        placeholder="Valeur (ex: 220V 16A)"
                        className="dk-input rounded-xl px-3 py-1.5 flex-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={() => onSave(form)}
            className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>{initial ? "Mettre à jour le produit" : "Ajouter au catalogue"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-semibold dk-btn-secondary transition-colors"
          >
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filterStock, setFilterStock] = useState<"all" | "in" | "low" | "out">("all");
  const [filterFlag, setFilterFlag] = useState<"all" | "new" | "best" | "promo">("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc" | "margin">("name");

  // Selected products for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Quick Stock adjustment handler
  const handleQuickQtyAdjust = (productId: number, delta: number) => {
    s.setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentQty = p.quantity !== undefined ? p.quantity : p.stock === "out" ? 0 : p.stock === "low" ? 3 : 20;
          const nextQty = Math.max(0, currentQty + delta);
          const threshold = p.lowStockThreshold || 5;
          let nextStatus: StockStatus = "in";
          if (nextQty === 0) nextStatus = "out";
          else if (nextQty <= threshold) nextStatus = "low";

          return {
            ...p,
            quantity: nextQty,
            stock: nextStatus,
          };
        }
        return p;
      })
    );
    s.showToast("Stock ajusté");
  };

  const handleStockChange = (productId: number, newStock: StockStatus) => {
    s.setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    s.showToast("État du stock mis à jour");
  };

  // Duplicate product
  const handleDuplicate = (prod: Product) => {
    const newId = Math.max(...s.products.map((p) => p.id), 0) + 1;
    const cloned: Product = {
      ...prod,
      id: newId,
      name: `${prod.name} (Copie)`,
      slug: `${prod.slug}-copie-${newId}`,
      sku: `DK-${newId.toString().padStart(4, "0")}`,
    };
    s.setProducts((prev) => [cloned, ...prev]);
    s.showToast(`Produit « ${prod.name} » dupliqué avec succès`);
  };

  // Delete product
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${name}" du catalogue ?`)) {
      s.setProducts((prev) => prev.filter((p) => p.id !== id));
      deleteProductFromDb(id).catch((e) => console.error("Supabase delete product error", e));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      s.showToast("Produit supprimé");
    }
  };

  // Bulk Actions
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (filteredIds: number[]) => {
    if (selectedIds.size === filteredIds.length && filteredIds.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Supprimer définitivement les ${selectedIds.size} produits sélectionnés ?`)) {
      s.setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      s.showToast(`${selectedIds.size} produits supprimés`);
      setSelectedIds(new Set());
    }
  };

  const handleBulkStock = (newStock: StockStatus) => {
    if (selectedIds.size === 0) return;
    s.setProducts((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, stock: newStock } : p))
    );
    s.showToast(`Stock mis à jour pour ${selectedIds.size} produits`);
    setSelectedIds(new Set());
  };

  // Export catalogue as JSON / CSV
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(s.products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catalogue_domotek_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    s.showToast("Catalogue exporté au format JSON");
  };

  // Filtered & Sorted products
  const filtered = useMemo(() => {
    let list = s.products.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q));

      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;

      let matchesStock = true;
      if (filterStock === "in") matchesStock = p.stock === "in";
      else if (filterStock === "low") matchesStock = p.stock === "low";
      else if (filterStock === "out") matchesStock = p.stock === "out";

      let matchesFlag = true;
      if (filterFlag === "new") matchesFlag = p.isNew;
      else if (filterFlag === "best") matchesFlag = p.isBestSeller;
      else if (filterFlag === "promo") matchesFlag = !!p.oldPrice;

      return matchesSearch && matchesCat && matchesStock && matchesFlag;
    });

    // Sorting
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "stock-asc") {
      list.sort((a, b) => (a.quantity ?? (a.stock === "out" ? 0 : 10)) - (b.quantity ?? (b.stock === "out" ? 0 : 10)));
    } else if (sortBy === "stock-desc") {
      list.sort((a, b) => (b.quantity ?? (b.stock === "out" ? 0 : 10)) - (a.quantity ?? (a.stock === "out" ? 0 : 10)));
    } else if (sortBy === "margin") {
      list.sort((a, b) => (b.price - (b.costPrice || 0)) - (a.price - (a.costPrice || 0)));
    }

    return list;
  }, [s.products, search, categoryFilter, filterStock, filterFlag, sortBy]);

  // KPIs
  const totalStockValue = useMemo(() => {
    return s.products.reduce((sum, p) => {
      const qty = p.quantity !== undefined ? p.quantity : p.stock === "out" ? 0 : p.stock === "low" ? 3 : 15;
      return sum + p.price * qty;
    }, 0);
  }, [s.products]);

  const totalUnits = useMemo(() => {
    return s.products.reduce((sum, p) => {
      return sum + (p.quantity !== undefined ? p.quantity : p.stock === "out" ? 0 : p.stock === "low" ? 3 : 15);
    }, 0);
  }, [s.products]);

  const alertStockCount = useMemo(() => {
    return s.products.filter((p) => p.stock !== "in" || (p.quantity !== undefined && p.quantity <= (p.lowStockThreshold || 5))).length;
  }, [s.products]);

  // Save product from modal
  const save = (form: FormState) => {
    const optionsArray = form.variantOptions
      .split(",")
      .map((opt) => opt.trim())
      .filter(Boolean);

    const variantObj: ProductVariant | undefined =
      form.variantLabel && optionsArray.length > 0
        ? { label: form.variantLabel, options: optionsArray }
        : undefined;

    const cleanImages = (form.images || [])
      .map((img) => img?.trim())
      .filter((img): img is string => Boolean(img));

    if (form.imageUrl && form.imageUrl.trim() && !cleanImages.includes(form.imageUrl.trim())) {
      cleanImages.unshift(form.imageUrl.trim());
    }

    const finalImages = cleanImages.slice(0, 3);
    const primaryImageUrl = finalImages[0] || undefined;

    if (editing) {
      const updatedProduct: Product = {
        ...editing,
        name: form.name,
        sku: form.sku,
        category: form.category,
        stock: form.stock,
        quantity: Number(form.quantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        shortDesc: form.shortDesc,
        longDesc: form.longDesc,
        characteristics: form.characteristics,
        compatibility: form.compatibility,
        installation: form.installation,
        usage: form.usage,
        faq: form.faq.filter((q) => q.question.trim() || q.answer.trim()),
        isNew: form.isNew,
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
        imageUrl: primaryImageUrl,
        images: finalImages.length > 0 ? finalImages : undefined,
        specs: form.specs.filter((sp) => sp.name.trim() && sp.value.trim()),
        variants: variantObj,
      };

      s.setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? updatedProduct : p))
      );
      saveProductToDb(updatedProduct).catch((e) => console.error("Supabase save product error", e));
      s.showToast("Produit modifié avec succès");
      setEditing(null);
    } else {
      const newId = Math.max(...s.products.map((p) => p.id), 0) + 1;
      const newProduct: Product = {
        id: newId,
        slug: `produit-${newId}`,
        sku: form.sku || `DK-${newId.toString().padStart(4, "0")}`,
        icon: Cpu,
        shortDesc: form.shortDesc || "Produit connecté DomoTek",
        longDesc: form.longDesc || "Solution intelligente d'automatisation.",
        characteristics: form.characteristics,
        compatibility: form.compatibility,
        installation: form.installation,
        usage: form.usage,
        faq: form.faq.filter((q) => q.question.trim() || q.answer.trim()),
        isNew: form.isNew,
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
        name: form.name,
        category: form.category,
        stock: form.stock,
        quantity: Number(form.quantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        price: Number(form.price) || 2500,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        imageUrl: primaryImageUrl,
        images: finalImages.length > 0 ? finalImages : undefined,
        specs: form.specs.filter((sp) => sp.name.trim() && sp.value.trim()),
        variants: variantObj,
      };

      s.setProducts((prev) => [newProduct, ...prev]);
      saveProductToDb(newProduct).catch((e) => console.error("Supabase save product error", e));
      s.showToast("Nouveau produit ajouté au catalogue");
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2.5" style={{ color: "var(--text)" }}>
            <span>Inventaire & Gestion Complète du Stock</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {s.products.length} références
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Ajustement des quantités en temps réel, rentabilité/marges, références SKU, photos et variantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            title="Exporter l'inventaire en JSON"
            className="dk-btn-secondary text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exporter</span>
          </button>

          <button
            onClick={() => setAdding(true)}
            className="dk-btn-primary font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl dk-chip-teal flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Valeur Stock (DA)</p>
            <p className="text-base sm:text-lg font-extrabold font-mono" style={{ color: "var(--text)" }}>
              {formatDZD(totalStockValue)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Pièces Physiques</p>
            <p className="text-base sm:text-lg font-extrabold font-mono" style={{ color: "var(--text)" }}>
              {totalUnits} unités
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Rayons Actifs</p>
            <p className="text-base sm:text-lg font-extrabold font-mono" style={{ color: "var(--text)" }}>
              {s.categories.length} catégories
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Alertes Réappro</p>
            <p className="text-base sm:text-lg font-extrabold font-mono text-amber-500">
              {alertStockCount} article{alertStockCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters & Controls Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, SKU / référence, rayon ou spécification..."
              className="dk-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm"
            />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="dk-input rounded-xl px-3 py-2.5 text-xs font-semibold"
          >
            <option value="all">Tous les Rayons ({s.products.length})</option>
            {s.categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="dk-input rounded-xl px-3 py-2.5 text-xs font-semibold"
          >
            <option value="name">Trier par : Nom (A-Z)</option>
            <option value="price-asc">Prix : Moins cher d'abord</option>
            <option value="price-desc">Prix : Plus cher d'abord</option>
            <option value="stock-asc">Stock : Moins approvisionné</option>
            <option value="stock-desc">Stock : Plus grand stock</option>
            <option value="margin">Rentabilité : Marge brute max</option>
          </select>
        </div>

        {/* Filter Badges & Quick Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 dk-scrollbar">
          <button
            onClick={() => setFilterStock("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStock === "all" ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30" : "dk-surface"
            }`}
            style={filterStock !== "all" ? { color: "var(--text-dim)" } : {}}
          >
            Tout l'état ({s.products.length})
          </button>
          <button
            onClick={() => setFilterStock("in")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStock === "in" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30" : "dk-surface"
            }`}
            style={filterStock !== "in" ? { color: "var(--text-dim)" } : {}}
          >
            ✓ En stock ({s.products.filter((p) => p.stock === "in").length})
          </button>
          <button
            onClick={() => setFilterStock("low")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filterStock === "low" ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30" : "dk-surface"
            }`}
            style={filterStock !== "low" ? { color: "var(--text-dim)" } : {}}
          >
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span>Stock Faible ({s.products.filter((p) => p.stock === "low").length})</span>
          </button>
          <button
            onClick={() => setFilterStock("out")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStock === "out" ? "bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30" : "dk-surface"
            }`}
            style={filterStock !== "out" ? { color: "var(--text-dim)" } : {}}
          >
            ⛔ Rupture ({s.products.filter((p) => p.stock === "out").length})
          </button>

          <span className="h-4 w-[1px] bg-slate-700 mx-1 shrink-0" />

          {/* Quick flags filter */}
          <button
            onClick={() => setFilterFlag((prev) => (prev === "best" ? "all" : "best"))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
              filterFlag === "best" ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30" : "dk-surface"
            }`}
            style={filterFlag !== "best" ? { color: "var(--text-dim)" } : {}}
          >
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>Top Ventes</span>
          </button>
          <button
            onClick={() => setFilterFlag((prev) => (prev === "new" ? "all" : "new"))}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
              filterFlag === "new" ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30" : "dk-surface"
            }`}
            style={filterFlag !== "new" ? { color: "var(--text-dim)" } : {}}
          >
            <Sparkles className="h-3 w-3 text-cyan-500" />
            <span>Nouveautés</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300">
              {selectedIds.size} produit{selectedIds.size !== 1 ? "s" : ""} sélectionné{selectedIds.size !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStock("in")}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold transition-colors"
            >
              Passer en Stock
            </button>
            <button
              onClick={() => handleBulkStock("out")}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold transition-colors"
            >
              Passer en Rupture
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Supprimer la sélection</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Inventory Table */}
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto dk-scrollbar">
          <table className="w-full min-w-[850px] text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="px-4 py-3.5 text-left w-10">
                  <button
                    onClick={() => handleSelectAll(filtered.map((p) => p.id))}
                    className="flex items-center justify-center text-slate-400 hover:text-slate-200"
                    title="Tout sélectionner"
                  >
                    {selectedIds.size > 0 && selectedIds.size === filtered.length ? (
                      <CheckSquare className="h-4 w-4 text-cyan-500" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="text-left px-4 py-3.5 font-semibold">Photo & Produit</th>
                <th className="text-left px-4 py-3.5 font-semibold">Rayon & SKU</th>
                <th className="text-left px-4 py-3.5 font-semibold">Prix & Marge</th>
                <th className="text-left px-4 py-3.5 font-semibold">Quantité & Ajustement</th>
                <th className="text-left px-4 py-3.5 font-semibold">État Stock</th>
                <th className="text-right px-4 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: "var(--text-dim)" }}>
                    <p className="text-sm">Aucun produit ne correspond à ces critères.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isSelected = selectedIds.has(p.id);
                  const qty = p.quantity !== undefined ? p.quantity : p.stock === "out" ? 0 : p.stock === "low" ? 3 : 15;
                  const cost = p.costPrice || 0;
                  const margin = p.price - cost;
                  const marginPct = cost > 0 ? Math.round((margin / p.price) * 100) : 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[var(--surface-2)]/60 transition-colors ${
                        isSelected ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      {/* Select checkbox */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleSelect(p.id)}
                          className="flex items-center justify-center text-slate-400 hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-cyan-500" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      {/* Photo & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden dk-surface-2 flex items-center justify-center p-1 border shadow-sm" style={{ borderColor: "var(--border)" }}>
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />
                            ) : (
                              <IconTile Icon={p.icon} variant={2} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>
                                {p.name}
                              </p>
                              {p.isBestSeller && (
                                <span title="Top Vente" className="inline-flex">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                </span>
                              )}
                              {p.isNew && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-500 font-bold">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] line-clamp-1 max-w-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                              {p.shortDesc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg dk-surface-2 text-xs font-semibold block w-fit" style={{ color: "var(--text)" }}>
                          {s.categoryLabel[p.category] || p.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                          SKU : {p.sku || `DK-${p.id.toString().padStart(4, "0")}`}
                        </span>
                      </td>

                      {/* Price & Margin */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                        <div className="font-bold text-sm" style={{ color: "var(--text)" }}>
                          {formatDZD(p.price)}
                        </div>
                        {p.oldPrice && (
                          <span className="text-[11px] line-through block text-slate-500">
                            {formatDZD(p.oldPrice)}
                          </span>
                        )}
                        {cost > 0 && (
                          <span className="text-[10px] text-emerald-500 font-semibold block mt-0.5">
                            +{formatDZD(margin)} ({marginPct}%)
                          </span>
                        )}
                      </td>

                      {/* Quantity with Instant Stepper */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center dk-surface-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                            <button
                              onClick={() => handleQuickQtyAdjust(p.id, -1)}
                              className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                              title="Retirer 1 pièce"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-10 text-center font-bold font-mono text-xs" style={{ color: "var(--text)" }}>
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQuickQtyAdjust(p.id, 1)}
                              className="h-7 w-7 flex items-center justify-center hover:bg-slate-700/20"
                              title="Ajouter 1 pièce"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-400">pcs</span>
                        </div>
                      </td>

                      {/* Stock Status Selector */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={p.stock}
                          onChange={(e) => handleStockChange(p.id, e.target.value as StockStatus)}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                            p.stock === "in"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                              : p.stock === "low"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30"
                              : "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/30"
                          }`}
                        >
                          <option value="in" className="bg-[var(--surface)] text-[var(--text)]">✓ En stock</option>
                          <option value="low" className="bg-[var(--surface)] text-[var(--text)]">⚠️ Stock limité</option>
                          <option value="out" className="bg-[var(--surface)] text-[var(--text)]">⛔ Rupture</option>
                        </select>
                      </td>

                      {/* Row Action Buttons */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => s.openProduct(p)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Voir sur la boutique"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Dupliquer le produit"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditing(p)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                            style={{ color: "var(--text)" }}
                            title="Modifier détails & prix"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Supprimer ce produit"
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

      {/* Product Form Modal (Add / Edit) */}
      {(editing || adding) && (
        <ProductFormModal
          initial={editing}
          categories={s.categories}
          onSave={save}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
};
