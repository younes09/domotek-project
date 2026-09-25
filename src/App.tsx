import React, { Suspense, lazy } from "react";
import { Header } from "./components/Header";
import { MobileNavigation } from "./components/MobileNavigation";
import { SearchBar } from "./components/SearchBar";
import { QuickViewModal } from "./components/QuickViewModal";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Toast } from "./components/ui";
import { SeoManager } from "./components/SeoManager";
import { HomeView } from "./pages/HomeView";
import { useStore } from "./lib/useStore";

// Découpage dynamique du bundle (Code Splitting) pour des performances optimales
const ShopView = lazy(() => import("./pages/ShopView").then((m) => ({ default: m.ShopView })));
const ProductDetailView = lazy(() => import("./pages/ProductDetailView").then((m) => ({ default: m.ProductDetailView })));
const CheckoutForm = lazy(() => import("./pages/CheckoutForm").then((m) => ({ default: m.CheckoutForm })));
const ConfirmationView = lazy(() => import("./pages/ConfirmationView").then((m) => ({ default: m.ConfirmationView })));
const AdminView = lazy(() => import("./admin/AdminView").then((m) => ({ default: m.AdminView })));

function ViewFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-xs text-slate-400 font-mono tracking-wider">Chargement...</span>
    </div>
  );
}

export default function App() {
  const s = useStore();
  const isVisitor = s.view !== "admin";

  // Raccourcis clavier discrets pour ouvrir le portail de connexion / admin :
  // Ctrl + Shift + L (Login) | Ctrl + Shift + A (Admin) | Alt + L | Alt + A | Cmd + Shift + L/A
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isLOrA = key === "l" || key === "a";
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      const isCombo =
        (isCtrlOrMeta && e.shiftKey && isLOrA) ||
        (isCtrlOrMeta && e.altKey && isLOrA) ||
        (e.altKey && isLOrA);

      if (isCombo) {
        e.preventDefault();
        e.stopPropagation();
        if (s.view !== "admin") {
          s.setView("admin");
          s.showToast("Portail de connexion administrateur");
        } else {
          s.goHome();
          s.showToast("Retour à la boutique");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [s]);

  React.useEffect(() => {
    if (!isVisitor) return;

    // Bloquer le clic droit / menu contextuel pour les visiteurs (sauf sur les champs de saisie)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Bloquer le glisser-déposer (drag & drop) des images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
      }
    };

    // Bloquer la copie de texte (Ctrl+C / Cmd+C) hors des champs de formulaire
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
    };
  }, [isVisitor]);

  return (
    <div
      className={`min-h-screen ${isVisitor ? "visitor-protected" : ""}`}
      style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}
    >
      <SeoManager s={s} />
      <Header s={s} />
      {s.mobileMenuOpen && <MobileNavigation s={s} />}
      {s.searchOpen && <SearchBar s={s} />}
      {s.quickViewProduct && <QuickViewModal s={s} />}

      <main>
        {s.view === "home" && <HomeView s={s} />}
        <Suspense fallback={<ViewFallback />}>
          {s.view === "shop" && <ShopView s={s} />}
          {s.view === "product" && <ProductDetailView s={s} />}
          {s.view === "checkout" && <CheckoutForm s={s} />}
          {s.view === "confirmation" && <ConfirmationView s={s} />}
          {s.view === "admin" && <AdminView s={s} />}
        </Suspense>
      </main>

      {s.view !== "admin" && <Footer s={s} />}
      <CartDrawer s={s} />
      {s.toast && <Toast message={s.toast} />}
    </div>
  );
}
