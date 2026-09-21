import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "../data/products";
import { DEMO_ORDERS } from "../data/demoAdminData";
import type { CartItem, CheckoutFormData, Order, Product, ShopFilters, Store, View } from "../types";

const EMPTY_FILTERS: ShopFilters = {
  category: "all", minPrice: "", maxPrice: "", availability: "all", sort: "popularite", special: null, query: "",
};

export function useStore(): Store {
  const [view, setView] = useState<View>("home");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [shopFilters, setShopFilters] = useState<ShopFilters>(EMPTY_FILTERS);
  const [toast, setToast] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("domotek_theme") as "light" | "dark") || "light";
  });

  useEffect(() => { window.scrollTo(0, 0); }, [view]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("domotek_theme", theme);
  }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);
  const goHome = () => { setView("home"); setSelectedProduct(null); };
  const goShop = (patch: Partial<ShopFilters>) => { setShopFilters({ ...EMPTY_FILTERS, ...patch }); setView("shop"); };
  const openProduct = (p: Product) => { setSelectedProduct(p); setView("product"); };

  const addToCart = (product: Product, qty = 1, variant: string | null = null) => {
    const key = product.id + (variant ? `-${variant}` : "");
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, productId: product.id, variant, qty }];
    });
    showToast(`${product.name} ajouté au panier`);
  };
  const removeFromCart = (key: string) => setCart((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key: string, qty: number) => {
    if (qty < 1) { removeFromCart(key); return; }
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.min(20, qty) } : i)));
  };
  const toggleWishlist = (id: number) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  const addRecentSearch = (q: string) => setRecentSearches((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, 5));

  const cartItemsDetailed = useMemo(
    () => cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! })).filter((i) => !!i.product),
    [cart, products]
  );
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItemsDetailed.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const placeOrder = (form: CheckoutFormData) => {
    const newOrder: Order = {
      id: `CMD-${1000 + orders.length + 1}`,
      customerName: form.name, phone: form.phone, wilaya: form.wilaya, commune: form.commune, address: form.address, notes: form.notes,
      items: cartItemsDetailed.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price, variant: i.variant })),
      total: cartTotal, status: "Nouvelle", date: new Date().toISOString().slice(0, 10),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart([]);
    setView("confirmation");
  };

  return {
    view, setView, goHome, goShop, openProduct,
    products, setProducts, selectedProduct,
    cart, addToCart, removeFromCart, updateQty, cartItemsDetailed, cartCount, cartTotal,
    cartOpen, setCartOpen,
    wishlist, toggleWishlist,
    mobileMenuOpen, setMobileMenuOpen,
    searchOpen, setSearchOpen, searchQuery, setSearchQuery, recentSearches, addRecentSearch,
    shopFilters, setShopFilters,
    toast, showToast,
    orders, setOrders, placeOrder, lastOrder,
    quickViewProduct, setQuickViewProduct,
    theme, toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  };
}
