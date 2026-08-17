import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toProduct, type Product } from "@/lib/products";
import type { Tables } from "@/integrations/supabase/types";

export type Order = Tables<"orders">;
export type Coupon = Tables<"coupons">;
export type Settings = Tables<"site_settings">;

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("Product catalog is temporarily unavailable", error.message);
    return [];
  }
  return (data ?? []).map(toProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("Product details are temporarily unavailable", error.message);
    return null;
  }
  return data ? toProduct(data) : null;
}

export async function fetchSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data;
}

export async function fetchCouponByCode(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchOrderByNumber(orderNumber: string, phone?: string): Promise<Order | null> {
  let q = supabase.from("orders").select("*").eq("order_number", orderNumber);
  if (phone) q = q.eq("phone", phone);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const productsQuery = () =>
  queryOptions({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 30_000, retry: false });

export const productBySlugQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => fetchProductBySlug(slug), staleTime: 30_000, retry: false });

export const settingsQuery = () =>
  queryOptions({ queryKey: ["settings"], queryFn: fetchSettings, staleTime: 60_000 });

export function buildWhatsappMessage(params: {
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ name: string; size: string; quantity: number; price: number; customName?: string | null }>;
  total: number;
}) {
  const lines = [
    `Namaste दो Taanke Team 🙏`,
    ``,
    `I have completed payment for my order.`,
    ``,
    `📦 Order: ${params.orderNumber}`,
    `👤 Name: ${params.name}`,
    `📱 Phone: ${params.phone}`,
    `🏠 Address: ${params.address}, ${params.city}, ${params.state} - ${params.pincode}`,
    ``,
    `🛍️ Items:`,
    ...params.items.map(
      (i) =>
        `• ${i.name} — Size ${i.size} × ${i.quantity} — ₹${i.price * i.quantity}${i.customName ? ` — Custom name: ${i.customName}` : ""}`,
    ),
    ``,
    `💰 Total Paid: ₹${params.total}`,
    ``,
    `I'm attaching my payment screenshot. Please confirm and update my tracker.`,
    ``,
    `Thank you 🌸`,
  ];
  return lines.join("\n");
}

export function waLink(phone: string, message: string) {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
