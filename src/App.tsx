import React from "react";
import { Header } from "./components/Header";
import { MobileNavigation } from "./components/MobileNavigation";
import { SearchBar } from "./components/SearchBar";
import { QuickViewModal } from "./components/QuickViewModal";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Toast } from "./components/ui";
import { HomeView } from "./pages/HomeView";
import { ShopView } from "./pages/ShopView";
import { ProductDetailView } from "./pages/ProductDetailView";
import { CheckoutForm } from "./pages/CheckoutForm";
import { ConfirmationView } from "./pages/ConfirmationView";
import { AdminView } from "./admin/AdminView";
import { useStore } from "./lib/useStore";

export default function App() {
  const s = useStore();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <Header s={s} />
      {s.mobileMenuOpen && <MobileNavigation s={s} />}
      {s.searchOpen && <SearchBar s={s} />}
      {s.quickViewProduct && <QuickViewModal s={s} />}

      <main>
        {s.view === "home" && <HomeView s={s} />}
        {s.view === "shop" && <ShopView s={s} />}
        {s.view === "product" && s.selectedProduct && <ProductDetailView s={s} />}
        {s.view === "checkout" && <CheckoutForm s={s} />}
        {s.view === "confirmation" && <ConfirmationView s={s} />}
        {s.view === "admin" && <AdminView s={s} />}
      </main>

      {s.view !== "admin" && <Footer s={s} />}
      <CartDrawer s={s} />
      {s.toast && <Toast message={s.toast} />}
    </div>
  );
}
