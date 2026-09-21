import type { LucideIcon } from "lucide-react";

export type IconType = LucideIcon;

export type StockStatus = "in" | "low" | "out";

export interface CategoryKey {
  key: string;
}

export interface Category {
  key: string;
  name: string;
  icon: IconType;
  iconName?: string;
  desc: string;
}

export interface ProductVariant {
  label: string;
  options: string[];
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  slug: string;
  sku?: string;
  name: string;
  category: string;
  icon: IconType;
  shortDesc: string;
  longDesc: string;
  price: number;
  oldPrice: number | null;
  costPrice?: number | null;
  quantity?: number;
  lowStockThreshold?: number;
  stock: StockStatus;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  images?: string[];
  specs?: ProductSpec[];
  variants?: ProductVariant;
}

export interface CartItem {
  key: string;
  productId: number;
  variant: string | null;
  qty: number;
}

export interface CartItemDetailed extends CartItem {
  product: Product;
}

export interface ShopFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  availability: "all" | "in";
  sort: "popularite" | "nouveautes" | "prix-asc" | "prix-desc";
  special: "new" | "best" | null;
  query: string;
}

export type OrderStatus = "Nouvelle" | "Confirmée" | "En préparation" | "Expédiée" | "Livrée" | "Annulée";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  variant?: string | null;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
}

export type View = "home" | "shop" | "product" | "checkout" | "confirmation" | "admin";

/** The single store object passed down to every component — created by useStore(). */
export interface Store {
  view: View;
  setView: (v: View) => void;
  goHome: () => void;
  goShop: (patch: Partial<ShopFilters>) => void;
  openProduct: (p: Product) => void;

  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  categoryLabel: Record<string, string>;

  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedProduct: Product | null;

  cart: CartItem[];
  addToCart: (product: Product, qty?: number, variant?: string | null) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  cartItemsDetailed: CartItemDetailed[];
  cartCount: number;
  cartTotal: number;

  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  wishlist: Set<number>;
  toggleWishlist: (id: number) => void;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;

  shopFilters: ShopFilters;
  setShopFilters: (f: ShopFilters) => void;

  toast: string | null;
  showToast: (msg: string) => void;

  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  placeOrder: (form: CheckoutFormData) => void;
  lastOrder: Order | null;

  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  theme: "light" | "dark";
  toggleTheme: () => void;
}
