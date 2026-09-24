import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Phone,
  MessageSquare,
  Star,
  MapPin,
  Eye,
  X,
  Award,
  Pencil,
  Trash2,
  PlusCircle,
  Check,
  Briefcase,
  UserCheck,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import { ALGERIA_WILAYAS } from "../data/wilayas";
import { formatDZD } from "../lib/format";
import { deleteOrderFromDb } from "../lib/supabaseDb";
import type { Order, Store } from "../types";

export type CustomerTag = "vip" | "pro" | "fidele" | "nouveau" | "prospect";

export interface CustomerProfile {
  name: string;
  phone: string;
  wilaya: string;
  commune?: string;
  address?: string;
  email?: string;
  tag?: CustomerTag;
  notes?: string;
  createdAt?: string;
}

export interface CustomerData extends CustomerProfile {
  orders: Order[];
  totalSpent: number;
  lastOrderDate: string;
}

const TAG_CONFIG: Record<CustomerTag, { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  vip: { label: "Client VIP", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-300", border: "border-amber-500/30", icon: Star },
  pro: { label: "Installateur Pro", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-300", border: "border-purple-500/30", icon: Briefcase },
  fidele: { label: "Client Fidèle", bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-300", border: "border-cyan-500/30", icon: Award },
  nouveau: { label: "Nouveau Client", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-300", border: "border-emerald-500/30", icon: UserCheck },
  prospect: { label: "Prospect / Contact", bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-300", border: "border-slate-500/30", icon: Tag },
};

// Modal for Adding a New Customer Profile
const CreateCustomerModal: React.FC<{
  onSave: (profile: CustomerProfile) => void;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wilaya, setWilaya] = useState("Alger");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [tag, setTag] = useState<CustomerTag>("nouveau");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Veuillez renseigner le nom et le numéro de téléphone.");
      return;
    }

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      wilaya: wilaya.trim(),
      commune: commune.trim() || undefined,
      address: address.trim() || undefined,
      tag,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                Ajouter un client CRM
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Créez une nouvelle fiche client, contact ou installateur partenaire
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Nom & Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sofiane Dahmani"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                N° Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550 12 34 56"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Statut / Segment CRM
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as CustomerTag)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-semibold"
              >
                <option value="nouveau">Nouveau Client</option>
                <option value="fidele">Client Fidèle</option>
                <option value="vip">Client VIP</option>
                <option value="pro">Installateur / Électricien Pro</option>
                <option value="prospect">Prospect / Demande de devis</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Email (Optionnel)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domotek.dz"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Wilaya
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              >
                {ALGERIA_WILAYAS.map((w) => {
                  const cleanName = w.replace(/^\d+\s*-\s*/, "");
                  return (
                    <option key={w} value={cleanName}>
                      {w}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Commune
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Ex: Chéraga"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Adresse
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse ou quartier..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Notes internes & Préférences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Préférences de contact, projets domotiques, type d'équipements..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Créer la fiche client</span>
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

// Modal for Editing an Existing Customer
const EditCustomerModal: React.FC<{
  customer: CustomerData;
  onSave: (updated: CustomerProfile, oldPhone: string) => void;
  onClose: () => void;
}> = ({ customer, onSave, onClose }) => {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email || "");
  const [wilaya, setWilaya] = useState(customer.wilaya);
  const [commune, setCommune] = useState(customer.commune || "");
  const [address, setAddress] = useState(customer.address || "");
  const [tag, setTag] = useState<CustomerTag>(customer.tag || (customer.totalSpent >= 10000 ? "vip" : customer.orders.length >= 2 ? "fidele" : "nouveau"));
  const [notes, setNotes] = useState(customer.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Veuillez renseigner le nom et le téléphone.");
      return;
    }

    onSave(
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        wilaya: wilaya.trim(),
        commune: commune.trim() || undefined,
        address: address.trim() || undefined,
        tag,
        notes: notes.trim() || undefined,
        createdAt: customer.createdAt,
      },
      customer.phone
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 border"
        style={{ borderColor: "var(--border)", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center dk-chip-teal shadow-inner">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h3 className="dk-heading text-lg font-bold" style={{ color: "var(--text)" }}>
                Modifier le profil client
              </h3>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Mise à jour des coordonnées et des informations CRM pour {customer.name}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                N° Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Statut / Segment CRM
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as CustomerTag)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs font-semibold"
              >
                <option value="nouveau">Nouveau Client</option>
                <option value="fidele">Client Fidèle</option>
                <option value="vip">Client VIP</option>
                <option value="pro">Installateur / Électricien Pro</option>
                <option value="prospect">Prospect / Demande de devis</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Email (Optionnel)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domotek.dz"
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Wilaya
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              >
                {ALGERIA_WILAYAS.map((w) => {
                  const cleanName = w.replace(/^\d+\s*-\s*/, "");
                  return (
                    <option key={w} value={cleanName}>
                      {w}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
                Commune
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="dk-input rounded-xl px-3.5 py-2.5 w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Adresse
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text)" }}>
              Notes internes & Historique
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes confidentielles..."
              className="dk-input rounded-xl px-3.5 py-2 w-full text-xs"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              type="submit"
              className="flex-1 rounded-xl py-3 text-sm font-bold dk-btn-primary transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer les modifications</span>
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

// Modal for Deleting Customer Profile
const DeleteCustomerModal: React.FC<{
  customer: CustomerData;
  onConfirm: (deleteOrders: boolean) => void;
  onClose: () => void;
}> = ({ customer, onConfirm, onClose }) => {
  const [deleteOrders, setDeleteOrders] = useState(false);

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
              Supprimer le client ?
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Êtes-vous sûr de vouloir supprimer la fiche de <strong style={{ color: "var(--text)" }}>{customer.name}</strong> ({customer.phone}) ?
            </p>
          </div>
        </div>

        {customer.orders.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
            <p className="font-semibold text-amber-600 dark:text-amber-400">
              Ce client possède {customer.orders.length} commande(s) enregistrée(s) ({formatDZD(customer.totalSpent)}).
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-amber-500/20" style={{ color: "var(--text)" }}>
              <input
                type="checkbox"
                checked={deleteOrders}
                onChange={(e) => setDeleteOrders(e.target.checked)}
                className="rounded"
              />
              <span>Supprimer également toutes ses commandes associées</span>
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onConfirm(deleteOrders)}
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

export const AdminCustomers: React.FC<{ s: Store }> = ({ s }) => {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerData | null>(null);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  // Custom profiles saved in localStorage
  const [customProfiles, setCustomProfiles] = useState<Record<string, CustomerProfile>>(() => {
    try {
      const saved = localStorage.getItem("domotek_crm_profiles");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse custom CRM profiles", e);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem("domotek_crm_profiles", JSON.stringify(customProfiles));
    } catch (e) {
      console.error("Failed to save CRM profiles", e);
    }
  }, [customProfiles]);

  // Construct combined Customer dataset
  const customers = useMemo(() => {
    const map = new Map<string, CustomerData>();

    // 1. Add all customers from orders
    s.orders.forEach((o) => {
      const key = o.phone;
      if (!map.has(key)) {
        const custom = customProfiles[key];
        map.set(key, {
          name: custom?.name || o.customerName,
          phone: o.phone,
          wilaya: custom?.wilaya || o.wilaya,
          commune: custom?.commune || o.commune,
          address: custom?.address || o.address,
          email: custom?.email,
          tag: custom?.tag,
          notes: custom?.notes,
          createdAt: custom?.createdAt || o.date,
          orders: [],
          totalSpent: 0,
          lastOrderDate: o.date,
        });
      }
      const c = map.get(key)!;
      c.orders.push(o);
      c.totalSpent += o.total;
    });

    // 2. Add custom customers who don't have orders yet
    Object.entries(customProfiles).forEach(([phone, prof]) => {
      if (!map.has(phone)) {
        map.set(phone, {
          name: prof.name,
          phone: prof.phone,
          wilaya: prof.wilaya,
          commune: prof.commune,
          address: prof.address,
          email: prof.email,
          tag: prof.tag || "prospect",
          notes: prof.notes,
          createdAt: prof.createdAt || new Date().toISOString().slice(0, 10),
          orders: [],
          totalSpent: 0,
          lastOrderDate: "—",
        });
      }
    });

    return Array.from(map.values());
  }, [s.orders, customProfiles]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(search) ||
        c.wilaya.toLowerCase().includes(q) ||
        (c.commune && c.commune.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));

      const calculatedTag =
        c.tag || (c.totalSpent >= 10000 ? "vip" : c.orders.length >= 2 ? "fidele" : "nouveau");

      if (tagFilter === "all") return matchesSearch;
      return matchesSearch && calculatedTag === tagFilter;
    });
  }, [customers, search, tagFilter]);

  // Metrics
  const totalVIPs = useMemo(() => {
    return customers.filter(
      (c) => c.tag === "vip" || c.tag === "pro" || c.totalSpent >= 10000
    ).length;
  }, [customers]);

  const totalLTV = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }, [customers]);

  const avgSpent = useMemo(() => {
    if (customers.length === 0) return 0;
    return Math.round(totalLTV / customers.length);
  }, [customers, totalLTV]);

  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "213" + clean.slice(1);
    if (!clean.startsWith("213") && clean.length === 9) clean = "213" + clean;
    return clean;
  };

  const openWhatsAppCRM = (c: CustomerData, customMsg?: string) => {
    const phoneNum = getCleanPhone(c.phone);
    const msg =
      customMsg ||
      `Bonjour ${c.name}, merci pour votre fidélité envers DomoTek ! Nous faisons le suivi de vos équipements domotiques à ${c.wilaya}. Avez-vous besoin d'assistance ou de nouveaux modules connectés ?`;
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const getTierBadge = (c: CustomerData) => {
    const calculatedTag: CustomerTag =
      c.tag || (c.totalSpent >= 10000 ? "vip" : c.orders.length >= 2 ? "fidele" : "nouveau");
    const conf = TAG_CONFIG[calculatedTag] || TAG_CONFIG.nouveau;
    const IconComp = conf.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${conf.bg} ${conf.text} ${conf.border}`}
      >
        <IconComp className="h-3 w-3" /> {conf.label}
      </span>
    );
  };

  const handleSaveCreate = (profile: CustomerProfile) => {
    setCustomProfiles((prev) => ({
      ...prev,
      [profile.phone]: profile,
    }));
    s.showToast(`Client « ${profile.name} » ajouté au CRM`);
    setCreatingCustomer(false);
  };

  const handleSaveEdit = (updated: CustomerProfile, oldPhone: string) => {
    // 1. Update customProfiles dictionary
    setCustomProfiles((prev) => {
      const next = { ...prev };
      if (oldPhone !== updated.phone) {
        delete next[oldPhone];
      }
      next[updated.phone] = updated;
      return next;
    });

    // 2. Update orders with matching phone
    s.setOrders((prev) =>
      prev.map((o) =>
        o.phone === oldPhone
          ? {
              ...o,
              customerName: updated.name,
              phone: updated.phone,
              wilaya: updated.wilaya,
              commune: updated.commune || o.commune,
              address: updated.address || o.address,
            }
          : o
      )
    );

    s.showToast(`Profil de ${updated.name} mis à jour avec succès`);
    setEditingCustomer(null);
    if (selectedCustomer && selectedCustomer.phone === oldPhone) {
      setSelectedCustomer(null);
    }
  };

  const handleDeleteConfirm = (deleteOrders: boolean) => {
    if (!deletingCustomer) return;
    const targetPhone = deletingCustomer.phone;

    // Remove from customProfiles
    setCustomProfiles((prev) => {
      const next = { ...prev };
      delete next[targetPhone];
      return next;
    });

    // Optionally remove their orders
    if (deleteOrders) {
      const ordersToDelete = s.orders.filter((o) => o.phone === targetPhone);
      ordersToDelete.forEach((ord) => {
        deleteOrderFromDb(ord.id).catch((err) => console.error("Error deleting customer order from Supabase:", err));
      });
      s.setOrders((prev) => prev.filter((o) => o.phone !== targetPhone));
    }

    s.showToast(`Client ${deletingCustomer.name} supprimé`);
    setDeletingCustomer(null);
    if (selectedCustomer && selectedCustomer.phone === targetPhone) {
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="dk-heading text-xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span>Gestion Relation Client (CRM DomoTek)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full dk-chip-teal font-mono">
              {customers.length} contacts
            </span>
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
            Fiches clients, segments VIP / Installateurs Pro, modification, suppression et relances WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setCreatingCustomer(true)}
          className="dk-btn-primary font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Nouveau client CRM</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl dk-chip-teal flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Total Portefeuille Client</p>
            <p className="text-xl font-extrabold font-mono" style={{ color: "var(--text)" }}>{customers.length} clients</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Clients VIP & Installateurs</p>
            <p className="text-xl font-extrabold font-mono text-amber-500">{totalVIPs} comptes clés</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl dk-surface border flex items-center gap-3.5" style={{ borderColor: "var(--border)" }}>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--text-dim)" }}>Panier Moyen Client (LTV)</p>
            <p className="text-xl font-extrabold font-mono text-emerald-500">{formatDZD(avgSpent)}</p>
          </div>
        </div>
      </div>

      {/* Search & Segment Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par Nom, Numéro de téléphone, Wilaya, Email..."
            className="dk-input w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 dk-scrollbar">
          <button
            onClick={() => setTagFilter("all")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              tagFilter === "all" ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30" : "dk-surface"
            }`}
            style={tagFilter !== "all" ? { color: "var(--text-dim)" } : {}}
          >
            Tous ({customers.length})
          </button>
          {Object.entries(TAG_CONFIG).map(([key, conf]) => {
            const count = customers.filter(
              (c) =>
                (c.tag || (c.totalSpent >= 10000 ? "vip" : c.orders.length >= 2 ? "fidele" : "nouveau")) === key
            ).length;
            const IconComp = conf.icon;
            return (
              <button
                key={key}
                onClick={() => setTagFilter(key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  tagFilter === key ? `${conf.bg} ${conf.text} border ${conf.border}` : "dk-surface"
                }`}
                style={tagFilter !== key ? { color: "var(--text-dim)" } : {}}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{conf.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer CRM Table */}
      <div className="dk-surface rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto dk-scrollbar">
          <table className="w-full min-w-[850px] text-xs sm:text-sm">
            <thead>
              <tr className="border-b dk-surface-2" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
                <th className="text-left px-4 py-3.5 font-semibold">Client</th>
                <th className="text-left px-4 py-3.5 font-semibold">Téléphone / WhatsApp</th>
                <th className="text-left px-4 py-3.5 font-semibold">Wilaya & Commune</th>
                <th className="text-left px-4 py-3.5 font-semibold">Statut CRM</th>
                <th className="text-left px-4 py-3.5 font-semibold">Commandes</th>
                <th className="text-left px-4 py-3.5 font-semibold">Total Dépensé (LTV)</th>
                <th className="text-right px-4 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10" style={{ color: "var(--text-dim)" }}>
                    <p className="text-sm">Aucun client trouvé pour « {search} ».</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.phone} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                        {c.name}
                      </p>
                      {c.email && (
                        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                          {c.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openWhatsAppCRM(c)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                        title="Échanger sur WhatsApp"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>{c.phone}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                      <p className="font-semibold" style={{ color: "var(--text)" }}>{c.wilaya}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>{c.commune || "Centre"}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getTierBadge(c)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold" style={{ color: "var(--text-dim)" }}>
                      {c.orders.length} commande{c.orders.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {formatDZD(c.totalSpent)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="h-8 px-2.5 rounded-lg dk-surface-2 hover:border-cyan-500/50 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          style={{ color: "var(--text)" }}
                          title="Voir fiche client détaillée"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Fiche</span>
                        </button>
                        <button
                          onClick={() => setEditingCustomer(c)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:border-cyan-500/50 transition-colors"
                          style={{ color: "var(--text)" }}
                          title="Modifier les coordonnées"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(c)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg dk-surface-2 hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Supprimer ce client"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div
            className="relative dk-surface rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 border"
            style={{ borderColor: "var(--border)", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="dk-heading text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span>Fiche Client : {selectedCustomer.name}</span>
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                  Client depuis : {selectedCustomer.createdAt || selectedCustomer.lastOrderDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="h-8 w-8 rounded-full dk-surface-2 flex items-center justify-center"
                style={{ color: "var(--text-dim)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl dk-surface-2 text-center">
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>Valeur Totale (LTV)</p>
                <p className="text-lg font-extrabold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {formatDZD(selectedCustomer.totalSpent)}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl dk-surface-2 text-center">
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>Segment & Statut</p>
                <div className="mt-1 flex justify-center">{getTierBadge(selectedCustomer)}</div>
              </div>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-2xl dk-surface-2 space-y-2 text-xs" style={{ color: "var(--text-dim)" }}>
              <div className="flex items-center justify-between">
                <p className="font-bold" style={{ color: "var(--text)" }}>Coordonnées & Localisation</p>
                <button
                  onClick={() => {
                    setEditingCustomer(selectedCustomer);
                    setSelectedCustomer(null);
                  }}
                  className="text-cyan-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Pencil className="h-3 w-3" /> Modifier
                </button>
              </div>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> {selectedCustomer.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" style={{ color: "var(--text-faint)" }} /> Wilaya de {selectedCustomer.wilaya} ({selectedCustomer.commune || "Centre"})
              </p>
              {selectedCustomer.address && (
                <p className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  Adresse : {selectedCustomer.address}
                </p>
              )}
              {selectedCustomer.notes && (
                <p className="text-cyan-600 dark:text-cyan-400 italic pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                  Note CRM : « {selectedCustomer.notes} »
                </p>
              )}
            </div>

            {/* Order History */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                Historique des Commandes ({selectedCustomer.orders.length})
              </p>
              {selectedCustomer.orders.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto dk-scrollbar pr-1">
                  {selectedCustomer.orders.map((o) => (
                    <div key={o.id} className="p-3 rounded-xl dk-surface-2 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-cyan-600 dark:text-cyan-400">{o.id} • {o.date}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-dim)" }}>
                          {o.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold" style={{ color: "var(--text)" }}>{formatDZD(o.total)}</p>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs p-3 rounded-xl dk-surface-2 text-center" style={{ color: "var(--text-dim)" }}>
                  Aucune commande enregistrée pour l'instant (Fiche contact).
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => openWhatsAppCRM(selectedCustomer)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="h-4 w-4 fill-slate-950" />
                <span>Relancer {selectedCustomer.name} sur WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCustomer(selectedCustomer);
                    setSelectedCustomer(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl dk-btn-secondary text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Modifier le profil</span>
                </button>
                <button
                  onClick={() => {
                    setDeletingCustomer(selectedCustomer);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {creatingCustomer && (
        <CreateCustomerModal
          onSave={handleSaveCreate}
          onClose={() => setCreatingCustomer(false)}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onSave={handleSaveEdit}
          onClose={() => setEditingCustomer(null)}
        />
      )}

      {/* Delete Customer Modal */}
      {deletingCustomer && (
        <DeleteCustomerModal
          customer={deletingCustomer}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingCustomer(null)}
        />
      )}
    </div>
  );
};
