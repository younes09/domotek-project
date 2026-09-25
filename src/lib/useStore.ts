import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_CATEGORIES, buildCategoryLabel, getCategoryIcon } from "../data/categories";
import { PRODUCTS } from "../data/products";
import type { CartItem, Category, CheckoutFormData, Order, Product, ShopFilters, Store, View } from "../types";
import {
  fetchCategoriesFromDb,
  fetchOrdersFromDb,
  fetchProductsFromDb,
  saveOrderToDb,
  seedSupabaseInitialData,
} from "./supabaseDb";
import { isSupabaseConfigured, supabase } from "./supabase";
import { sendOrderWhatsAppNotification } from "./notifications";

const EMPTY_FILTERS: ShopFilters = {
  category: "all", minPrice: "", maxPrice: "", availability: "all", sort: "popularite", special: null, query: "",
};

const VALID_VIEWS: View[] = ["home", "shop", "product", "checkout", "confirmation", "admin"];

function parseNavigation(rawHash: string): { view: View; selectedProductId: number | null } {
  try {
    const hash = rawHash.replace(/^#\/?/, "");
    if (hash.startsWith("product/")) {
      const id = Number(hash.replace("product/", ""));
      if (!isNaN(id) && id > 0) {
        return { view: "product", selectedProductId: id };
      }
    }
    if (VALID_VIEWS.includes(hash as View)) {
      return { view: hash as View, selectedProductId: null };
    }
  } catch (e) {
    console.error("Failed to parse navigation", e);
  }
  return { view: "home", selectedProductId: null };
}

export function useStore(): Store {
  const initialNav = useMemo(() => parseNavigation(window.location.hash), []);
  const [view, setViewInternal] = useState<View>(initialNav.view);

  // Dynamic Categories with LocalStorage persistence & Supabase sync
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem("domotek_categories");
      if (saved) {
        const parsed: Array<{ key: string; name: string; description?: string; desc?: string; iconName?: string }> = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            key: item.key,
            name: item.name,
            description: item.description || item.desc || "",
            iconName: item.iconName,
            icon: getCategoryIcon(item.iconName),
          }));
        }
      }
    } catch (e) {
      console.error("Failed to parse saved categories", e);
    }
    return DEFAULT_CATEGORIES;
  });

  const categoryLabel = useMemo(() => buildCategoryLabel(categories), [categories]);

  useEffect(() => {
    try {
      const serialized = categories.map((c) => ({
        key: c.key,
        name: c.name,
        description: c.description,
        iconName: c.iconName,
      }));
      localStorage.setItem("domotek_categories", JSON.stringify(serialized));
    } catch (e) {
      console.error("Failed to persist categories", e);
    }
  }, [categories]);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("domotek_products");
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            icon: getCategoryIcon(p.category),
          }));
        }
      }
    } catch (e) {
      console.error("Failed to parse saved products", e);
    }
    return PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("domotek_products", JSON.stringify(products));
    } catch (e) {
      console.error("Failed to persist products", e);
    }
  }, [products]);

  // Instant image preloading into browser cache
  useEffect(() => {
    if (!products || products.length === 0) return;
    const urls: string[] = [];
    products.forEach((p) => {
      if (p.imageUrl && typeof p.imageUrl === "string" && p.imageUrl.trim()) {
        urls.push(p.imageUrl.trim());
      }
      if (Array.isArray(p.images)) {
        p.images.forEach((img) => {
          if (img && typeof img === "string" && img.trim()) {
            urls.push(img.trim());
          }
        });
      }
    });

    Array.from(new Set(urls)).forEach((url) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    });
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      if (initialNav.selectedProductId) {
        const saved = localStorage.getItem("domotek_products");
        if (saved) {
          const parsed: Product[] = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const found = parsed.find((p) => p.id === initialNav.selectedProductId);
            if (found) {
              return {
                ...found,
                icon: getCategoryIcon(found.category),
              };
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore selected product", e);
    }
    return null;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [shopFilters, setShopFilters] = useState<ShopFilters>(EMPTY_FILTERS);
  const [toast, setToast] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Navigate to view with native browser history support
  const navigateTo = useCallback(
    (targetView: View, productId?: number | null) => {
      const targetHash = targetView === "product" && productId ? `#product/${productId}` : `#${targetView}`;

      setCartOpen(false);
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setQuickViewProduct(null);

      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        setViewInternal(targetView);
        if (targetView === "product" && productId) {
          const found = products.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === productId);
          if (found) setSelectedProduct(found);
        } else if (targetView !== "product") {
          setSelectedProduct(null);
        }
      }
    },
    [products]
  );

  // Support browser Back / Forward buttons & Hash changes
  useEffect(() => {
    const onLocationChange = () => {
      const nav = parseNavigation(window.location.hash);
      setViewInternal(nav.view);

      if (nav.view === "product" && nav.selectedProductId) {
        const found =
          products.find((p) => p.id === nav.selectedProductId) ||
          PRODUCTS.find((p) => p.id === nav.selectedProductId);
        if (found) {
          setSelectedProduct(found);
        }
      } else if (nav.view !== "product") {
        setSelectedProduct(null);
      }

      setMobileMenuOpen(false);
      setSearchOpen(false);
      setQuickViewProduct(null);
    };

    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("popstate", onLocationChange);

    return () => {
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [products]);

  // Synchronize selectedProduct if products are updated from database
  useEffect(() => {
    const nav = parseNavigation(window.location.hash);
    if (nav.view === "product" && nav.selectedProductId && products.length > 0) {
      const found = products.find((p) => p.id === nav.selectedProductId);
      if (found && (!selectedProduct || selectedProduct.id !== found.id)) {
        setSelectedProduct(found);
      }
    }
  }, [products, selectedProduct]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("domotek_orders");
      if (saved !== null) {
        const parsed: Order[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse saved orders", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("domotek_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to persist orders", e);
    }
  }, [orders]);

  // Sync data and real-time updates from Supabase directly
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    async function initSupabaseData() {
      try {
        const [dbCats, dbProds, dbOrders] = await Promise.allSettled([
          fetchCategoriesFromDb(),
          fetchProductsFromDb(),
          fetchOrdersFromDb(),
        ]);

        if (isMounted) {
          if (dbCats.status === "fulfilled" && dbCats.value && dbCats.value.length > 0) {
            setCategories(dbCats.value);
          }
          if (dbProds.status === "fulfilled" && dbProds.value && dbProds.value.length > 0) {
            setProducts(dbProds.value);
          }
          if (dbOrders.status === "fulfilled" && dbOrders.value !== null) {
            setOrders(dbOrders.value);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch notice:", err);
      }
    }

    initSupabaseData();

    // Abonnement temps réel Supabase aux changements sur les produits, catégories et commandes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        async () => {
          const freshProds = await fetchProductsFromDb();
          if (freshProds && isMounted) setProducts(freshProds);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        async () => {
          const freshCats = await fetchCategoriesFromDb();
          if (freshCats && isMounted) setCategories(freshCats);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          const freshOrders = await fetchOrdersFromDb();
          if (freshOrders !== null && isMounted) setOrders(freshOrders);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("domotek_theme") as "light" | "dark") || "light";
  });

  useEffect(() => { window.scrollTo(0, 0); }, [view, selectedProduct?.id]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("domotek_theme", theme);
  }, [theme]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);
  const goHome = useCallback(() => {
    navigateTo("home");
  }, [navigateTo]);

  const goShop = useCallback((patch: Partial<ShopFilters> = {}) => {
    setShopFilters((prev) => ({ ...EMPTY_FILTERS, ...prev, ...patch }));
    navigateTo("shop");
  }, [navigateTo]);

  const openProduct = useCallback((p: Product) => {
    setSelectedProduct(p);
    navigateTo("product", p.id);
  }, [navigateTo]);

  const setView = useCallback((v: View) => {
    if (v === "product" && selectedProduct) {
      navigateTo("product", selectedProduct.id);
    } else {
      navigateTo(v);
    }
  }, [navigateTo, selectedProduct]);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo("home");
    }
  }, [navigateTo]);

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
    navigateTo("confirmation");

    // Async save to Supabase
    saveOrderToDb(newOrder).catch((err) => console.error("Could not save order to Supabase:", err));

    // Automated WhatsApp background notification dispatch
    sendOrderWhatsAppNotification(newOrder).catch((err) =>
      console.warn("WhatsApp background notification notice:", err)
    );
  };

  return {
    view, setView, goHome, goShop, openProduct, goBack,
    categories, setCategories, categoryLabel,
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

