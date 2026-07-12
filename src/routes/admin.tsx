import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email/send";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

type Product = Tables<"products">;
type Coupon = Tables<"coupons">;
type Order = Tables<"orders">;
type Settings = Tables<"site_settings">;

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: AdminPanel,
});

type Tab = "products" | "orders" | "coupons" | "reviews" | "settings";

function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) return <section className="mx-auto max-w-6xl px-5 py-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></section>;

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 font-serif text-4xl">Control room</h1>
        </div>
        <Link to="/" className="btn-ghost text-xs">← Back to store</Link>
      </div>
      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border">
        {(["products", "orders", "coupons", "reviews", "settings"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm capitalize ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </nav>
      <div className="mt-8">
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "coupons" && <CouponsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </section>
  );
}

// ============ PRODUCTS ============
function ProductsTab() {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      slug: editing.slug ?? "",
      name: editing.name ?? "",
      category: editing.category ?? "Shirts",
      gender: editing.gender ?? "Unisex",
      price: Number(editing.price ?? 0),
      original_price: editing.original_price ? Number(editing.original_price) : null,
      description: editing.description ?? "",
      sizes: editing.sizes ?? ["S", "M", "L", "XL", "XXL"],
      colors: (editing as unknown as { colors?: string[] }).colors ?? [],
      features: editing.features ?? [],
      badges: editing.badges ?? [],
      image_url: editing.image_url ?? "",
      video_url: editing.video_url ?? "",
      gallery: editing.gallery ?? [],
      bestseller: !!editing.bestseller,
      new_arrival: !!editing.new_arrival,
      active: editing.active ?? true,
    };
    if (editing.id) {
      const { error } = await supabase.from("products").update(payload as TablesUpdate<"products">).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("products").insert(payload as TablesInsert<"products">);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  if (editing) return <ProductForm p={editing} onChange={setEditing} onCancel={() => setEditing(null)} onSave={save} />;

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <p className="text-sm text-muted-foreground">{items.length} product{items.length === 1 ? "" : "s"}</p>
        <button onClick={() => setEditing({ active: true, bestseller: false, new_arrival: false })} className="btn-primary text-xs">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>
      {loading ? <p>Loading…</p> : (
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border bg-cream p-3">
              {p.image_url && <img src={p.image_url} alt={p.name} className="h-16 w-14 rounded object-cover" />}
              <div className="flex-1">
                <p className="font-serif">{p.name}</p>
                <p className="text-xs text-muted-foreground">/{p.slug} · ₹{p.price} · {p.category} · {p.active ? "Active" : "Hidden"}</p>
              </div>
              <button onClick={() => setEditing(p)} className="btn-ghost text-xs">Edit</button>
              <button onClick={() => del(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ p, onChange, onCancel, onSave }: { p: Partial<Product>; onChange: (p: Partial<Product>) => void; onCancel: () => void; onSave: () => void }) {
  const upd = (k: keyof Product, v: unknown) => onChange({ ...p, [k]: v });
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const uploadToBucket = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${(p.slug || "product")}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const onMainFile = async (file: File) => {
    setUploadingMain(true);
    const url = await uploadToBucket(file);
    if (url) upd("image_url", url);
    setUploadingMain(false);
  };

  const onGalleryFiles = async (files: FileList) => {
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const url = await uploadToBucket(f);
      if (url) urls.push(url);
    }
    if (urls.length) upd("gallery", [...(p.gallery ?? []), ...urls]);
    setUploadingGallery(false);
  };

  const removeGalleryAt = (idx: number) => {
    const next = [...(p.gallery ?? [])];
    next.splice(idx, 1);
    upd("gallery", next);
  };

  return (
    <div className="rounded-xl border border-border bg-cream p-6">
      <h2 className="font-serif text-2xl">{p.id ? "Edit product" : "New product"}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Name"><input className="input" value={p.name ?? ""} onChange={(e) => upd("name", e.target.value)} /></Field>
        <Field label="Slug (URL)"><input className="input" value={p.slug ?? ""} onChange={(e) => upd("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} /></Field>
        <Field label="Category"><select className="input" value={p.category ?? "Shirts"} onChange={(e) => upd("category", e.target.value)}><option>Shirts</option><option>T-Shirts</option><option>Kurtis</option><option>Accessories</option></select></Field>
        <Field label="Gender"><select className="input" value={p.gender ?? "Unisex"} onChange={(e) => upd("gender", e.target.value)}><option>Men</option><option>Women</option><option>Unisex</option></select></Field>
        <Field label="Price"><input type="number" className="input" value={p.price ?? 0} onChange={(e) => upd("price", Number(e.target.value))} /></Field>
        <Field label="Original price (optional)"><input type="number" className="input" value={p.original_price ?? ""} onChange={(e) => upd("original_price", e.target.value ? Number(e.target.value) : null)} /></Field>

        <Field label="Main image" full>
          <div className="flex items-center gap-3">
            {p.image_url && <img src={p.image_url} alt="" className="h-20 w-16 rounded object-cover" />}
            <label className="btn-ghost cursor-pointer text-xs">
              {uploadingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {p.image_url ? "Replace image" : "Upload image"}
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onMainFile(e.target.files[0])} />
            </label>
            {p.image_url && <button type="button" onClick={() => upd("image_url", "")} className="text-destructive"><Trash2 className="h-4 w-4" /></button>}
          </div>
        </Field>

        <Field label="Gallery images" full>
          <div className="flex flex-wrap gap-3">
            {(p.gallery ?? []).map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="h-20 w-16 rounded object-cover" />
                <button type="button" onClick={() => removeGalleryAt(i)} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="btn-ghost cursor-pointer text-xs">
              {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add gallery images
              <input type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && onGalleryFiles(e.target.files)} />
            </label>
          </div>
        </Field>

        <Field label="Video URL (optional)" full><input className="input" placeholder="https://..." value={p.video_url ?? ""} onChange={(e) => upd("video_url", e.target.value)} /></Field>
        <Field label="Description" full><textarea className="input min-h-32" value={p.description ?? ""} onChange={(e) => upd("description", e.target.value)} /></Field>
        <Field label="Sizes (comma separated)"><input className="input" value={(p.sizes ?? []).join(",")} onChange={(e) => upd("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
        <Field label="Colours (comma separated)"><input className="input" placeholder="Ivory, Rose, Indigo" value={((p as unknown as { colors?: string[] }).colors ?? []).join(",")} onChange={(e) => upd("colors" as keyof Product, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
        <Field label="Badges (comma separated)"><input className="input" value={(p.badges ?? []).join(",")} onChange={(e) => upd("badges", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
        <Field label="Features (comma separated)" full><input className="input" value={(p.features ?? []).join(",")} onChange={(e) => upd("features", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.bestseller} onChange={(e) => upd("bestseller", e.target.checked)} /> Bestseller</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.new_arrival} onChange={(e) => upd("new_arrival", e.target.checked)} /> New arrival</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.active ?? true} onChange={(e) => upd("active", e.target.checked)} /> Active (visible in shop)</label>
      </div>
      <div className="mt-6 flex gap-2">
        <button onClick={onSave} className="btn-primary"><Save className="h-4 w-4" /> Save</button>
        <button onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </div>
  );
}

// ============ ORDERS ============
function OrdersTab() {
  const [items, setItems] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const updateOrder = async (id: string, patch: Partial<Order>, historyStatus?: string, note?: string) => {
    const { error } = await supabase.from("orders").update(patch as TablesUpdate<"orders">).eq("id", id);
    if (error) return toast.error(error.message);
    if (historyStatus) {
      await supabase.from("order_status_history").insert({ order_id: id, status: historyStatus, note: note ?? "" });
    }
    // Notify customer when tracking status changes
    if (patch.tracking_status) {
      const order = items.find((it) => it.id === id);
      if (order?.email) {
        void sendTransactionalEmail({
          templateName: "order-status-update",
          recipientEmail: order.email,
          idempotencyKey: `status-${id}-${patch.tracking_status}`,
          templateData: {
            orderNumber: order.order_number,
            customerName: order.customer_name,
            status: patch.tracking_status,
            trackingNumber: patch.tracking_number ?? order.tracking_number ?? null,
            note: note ?? null,
            trackUrl: `${window.location.origin}/track/${order.order_number}`,
          },
        });
      }
    }
    toast.success("Updated");
    load();
  };

  const viewScreenshot = async (path: string) => {
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      {items.map((o) => (
        <div key={o.id} className="rounded-xl border border-border bg-cream p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-serif text-lg">{o.order_number} — {o.customer_name}</p>
              <p className="text-xs text-muted-foreground">{o.phone} · {new Date(o.created_at).toLocaleString("en-IN")}</p>
              <p className="text-xs text-muted-foreground">{o.address}, {o.city}, {o.state} — {o.pincode}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-xl">₹{o.total}</p>
              <p className="text-xs text-muted-foreground">{o.payment_status} · {o.tracking_status}</p>
            </div>
          </div>
          <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="mt-3 text-xs text-primary underline">
            {openId === o.id ? "Hide" : "Manage"}
          </button>
          {openId === o.id && (
            <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2">
              <div>
                <p className="eyebrow">Items</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {(o.items as Array<{ name: string; size: string; quantity: number; price: number }>).map((i, idx) => (
                    <li key={idx}>{i.name} — {i.size} × {i.quantity} — ₹{i.price * i.quantity}</li>
                  ))}
                </ul>
                {o.payment_screenshot_url && (
                  <button onClick={() => viewScreenshot(o.payment_screenshot_url!)} className="btn-ghost mt-3 text-xs">View screenshot</button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="eyebrow">Payment</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => updateOrder(o.id, { payment_status: "verified" }, "placed", "Payment verified")} className="btn-primary text-xs">Verify payment</button>
                    <button onClick={() => updateOrder(o.id, { payment_status: "rejected" })} className="btn-ghost text-xs">Reject</button>
                  </div>
                </div>
                <div>
                  <p className="eyebrow">Tracking status</p>
                  <select value={o.tracking_status} onChange={(e) => updateOrder(o.id, { tracking_status: e.target.value as Order["tracking_status"] }, e.target.value, `Status: ${e.target.value}`)} className="input mt-2 w-full">
                    <option value="placed">Placed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <p className="eyebrow">Tracking number</p>
                  <input defaultValue={o.tracking_number ?? ""} onBlur={(e) => e.target.value !== o.tracking_number && updateOrder(o.id, { tracking_number: e.target.value })} className="input mt-2 w-full" />
                </div>
                <div>
                  <p className="eyebrow">Admin note</p>
                  <input defaultValue={o.admin_notes ?? ""} onBlur={(e) => e.target.value !== o.admin_notes && updateOrder(o.id, { admin_notes: e.target.value })} className="input mt-2 w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============ COUPONS ============
function CouponsTab() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!code) return;
    const { error } = await supabase.from("coupons").insert({ code: code.toUpperCase(), discount_percent: percent });
    if (error) return toast.error(error.message);
    setCode("");
    load();
  };
  const toggle = async (c: Coupon) => {
    await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-cream p-4">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" className="input flex-1 min-w-32" />
        <input type="number" min={1} max={90} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="input w-24" />
        <button onClick={create} className="btn-primary text-xs"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div>
              <p className="font-mono">{c.code}</p>
              <p className="text-xs text-muted-foreground">{c.discount_percent}% off · {c.active ? "Active" : "Disabled"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(c)} className="btn-ghost text-xs">{c.active ? "Disable" : "Enable"}</button>
              <button onClick={() => del(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SETTINGS ============
function SettingsTab() {
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data));
  }, []);
  if (!s) return <p>Loading…</p>;
  const upd = (k: keyof Settings, v: string) => setS({ ...s, [k]: v });
  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      upi_id: s.upi_id, upi_qr_url: s.upi_qr_url, bank_details: s.bank_details,
      whatsapp_number: s.whatsapp_number, admin_email: s.admin_email,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };
  return (
    <div className="max-w-2xl space-y-4">
      <Field label="UPI ID"><input className="input" value={s.upi_id ?? ""} onChange={(e) => upd("upi_id", e.target.value)} placeholder="yourname@upi" /></Field>
      <Field label="UPI QR image URL"><input className="input" value={s.upi_qr_url ?? ""} onChange={(e) => upd("upi_qr_url", e.target.value)} placeholder="https://..." /></Field>
      {s.upi_qr_url && <img src={s.upi_qr_url} alt="QR preview" className="h-48 rounded-md border border-border" />}
      <Field label="Bank details"><textarea className="input min-h-32" value={s.bank_details ?? ""} onChange={(e) => upd("bank_details", e.target.value)} placeholder="Bank name&#10;Account number&#10;IFSC&#10;Beneficiary" /></Field>
      <Field label="WhatsApp number (with country code)"><input className="input" value={s.whatsapp_number ?? ""} onChange={(e) => upd("whatsapp_number", e.target.value)} /></Field>
      <Field label="Admin email"><input className="input" value={s.admin_email ?? ""} onChange={(e) => upd("admin_email", e.target.value)} /></Field>
      <button onClick={save} className="btn-primary"><Save className="h-4 w-4" /> Save settings</button>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
