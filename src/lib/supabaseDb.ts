import { supabase, isSupabaseConfigured } from "./supabase";
import type { Category, Order, Product } from "../types";
import { DEFAULT_CATEGORIES, getCategoryIcon } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { DEMO_ORDERS } from "../data/demoAdminData";

export async function fetchCategoriesFromDb(): Promise<Category[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Supabase categories error:", error);
      return null;
    }
    if (!data || data.length === 0) return null;

    return data.map((item: any) => ({
      key: item.key,
      name: item.name,
      description: item.description || item.desc || "",
      iconName: item.icon_name || "Home",
      icon: getCategoryIcon(item.icon_name),
    }));
  } catch (err) {
    console.error("Failed to fetch categories from Supabase:", err);
    return null;
  }
}

export async function saveCategoryToDb(category: Category): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from("categories").upsert(
      {
        key: category.key,
        name: category.name,
        description: category.description,
        icon_name: category.iconName || "Home",
      },
      { onConflict: "key" }
    );
    if (error) {
      console.error("Failed to upsert category to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error saving category to Supabase:", err);
    return false;
  }
}

export async function deleteCategoryFromDb(key: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from("categories").delete().eq("key", key);
    if (error) console.error("Error deleting category from Supabase:", error);
    return !error;
  } catch (err) {
    console.error("Error deleting category:", err);
    return false;
  }
}

export async function fetchProductsFromDb(): Promise<Product[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Supabase products error:", error);
      return null;
    }
    if (!data || data.length === 0) return null;

    return data.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      category: p.category,
      icon: getCategoryIcon(p.icon_name),
      shortDesc: p.short_desc,
      longDesc: p.long_desc,
      price: Number(p.price),
      oldPrice: p.old_price ? Number(p.old_price) : null,
      costPrice: p.cost_price ? Number(p.cost_price) : null,
      quantity: p.quantity,
      lowStockThreshold: p.low_stock_threshold,
      stock: p.stock || "in",
      isNew: Boolean(p.is_new),
      isBestSeller: Boolean(p.is_bestseller),
      isFeatured: Boolean(p.is_featured),
      imageUrl: p.image_url || (Array.isArray(p.images) && p.images[0]) || "",
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []),
      specs: Array.isArray(p.specs) ? p.specs : [],
      variants: p.variants || undefined,
      characteristics: p.characteristics || "",
      compatibility: p.compatibility || "",
      installation: p.installation || "",
      usage: p.usage || "",
      faq: Array.isArray(p.faq) ? p.faq : [],
    }));
  } catch (err) {
    console.error("Failed to fetch products from Supabase:", err);
    return null;
  }
}

export async function saveProductToDb(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const imagesList = (product.images && product.images.length > 0)
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);

    const payload = {
      id: product.id,
      slug: product.slug || `product-${product.id}`,
      sku: product.sku || null,
      name: product.name,
      category: product.category,
      icon_name: product.category || "Cpu",
      short_desc: product.shortDesc || "",
      long_desc: product.longDesc || "",
      price: product.price,
      old_price: product.oldPrice ?? null,
      cost_price: product.costPrice ?? null,
      quantity: product.quantity ?? 10,
      low_stock_threshold: product.lowStockThreshold ?? 2,
      stock: product.stock || "in",
      is_new: Boolean(product.isNew),
      is_bestseller: Boolean(product.isBestSeller),
      is_featured: Boolean(product.isFeatured),
      image_url: imagesList[0] || product.imageUrl || "",
      images: imagesList,
      specs: product.specs || [],
      variants: product.variants || null,
      characteristics: product.characteristics || "",
      compatibility: product.compatibility || "",
      installation: product.installation || "",
      usage: product.usage || "",
      faq: product.faq || [],
    };

    const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Failed to save product to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error saving product:", err);
    return false;
  }
}

export async function deleteProductFromDb(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error("Error deleting product from Supabase:", error);
    return !error;
  } catch (err) {
    console.error("Error deleting product:", err);
    return false;
  }
}

export async function fetchOrdersFromDb(): Promise<Order[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase orders error:", error);
      return null;
    }
    if (!data || data.length === 0) return null;

    return data.map((o: any) => ({
      id: o.id,
      customerName: o.customer_name,
      phone: o.phone,
      wilaya: o.wilaya,
      commune: o.commune,
      address: o.address,
      notes: o.notes || undefined,
      items: Array.isArray(o.items) ? o.items : [],
      total: Number(o.total),
      status: o.status || "Nouvelle",
      date: o.created_at ? new Date(o.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.error("Failed to fetch orders from Supabase:", err);
    return null;
  }
}

export async function saveOrderToDb(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      phone: order.phone,
      wilaya: order.wilaya,
      commune: order.commune,
      address: order.address,
      notes: order.notes || null,
      items: order.items,
      total: order.total,
      status: order.status,
    };
    const { error } = await supabase.from("orders").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Failed to save order to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error saving order:", err);
    return false;
  }
}

export async function seedSupabaseInitialData(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    // 1. Seed Categories if empty
    const { data: existingCats } = await supabase.from("categories").select("key").limit(1);
    if (!existingCats || existingCats.length === 0) {
      console.log("Seeding initial categories to Supabase...");
      for (const cat of DEFAULT_CATEGORIES) {
        await saveCategoryToDb(cat);
      }
    }

    // 2. Seed Products if empty
    const { data: existingProds } = await supabase.from("products").select("id").limit(1);
    if (!existingProds || existingProds.length === 0) {
      console.log("Seeding initial products to Supabase...");
      for (const prod of PRODUCTS) {
        await saveProductToDb(prod);
      }
    }

    // 3. Seed Orders if empty
    const { data: existingOrders } = await supabase.from("orders").select("id").limit(1);
    if (!existingOrders || existingOrders.length === 0) {
      console.log("Seeding initial demo orders to Supabase...");
      for (const ord of DEMO_ORDERS) {
        await saveOrderToDb(ord);
      }
    }
  } catch (err) {
    console.error("Error seeding initial data to Supabase:", err);
  }
}
