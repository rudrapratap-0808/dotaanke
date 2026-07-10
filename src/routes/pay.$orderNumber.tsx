import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Upload, MessageCircle, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchOrderByNumber, fetchSettings, waLink, type Order, type Settings } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void };
  }
}

export const Route = createFileRoute("/pay/$orderNumber")({
  head: () => ({ meta: [{ title: "Complete payment — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: PayPage,
});

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function PayPage() {
  const { orderNumber } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [uploading, setUploading] = useState(false);
  const [payingRzp, setPayingRzp] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderByNumber(orderNumber).then(setOrder);
    fetchSettings().then(setSettings);
  }, [orderNumber]);

  if (!order || !settings) return <section className="mx-auto max-w-3xl px-5 py-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></section>;

  const whatsappNumber = settings.whatsapp_number || "+351930656040";
  const message = order.whatsapp_message || "";

  const flipToAwaiting = async () => {
    if (order.payment_status === "pending") {
      await supabase.from("orders").update({ payment_status: "awaiting_verification" }).eq("id", order.id);
      setOrder({ ...order, payment_status: "awaiting_verification" });
    }
  };

  const onWhatsApp = async () => {
    await flipToAwaiting();
    window.open(waLink(whatsappNumber, message), "_blank");
    setDone(true);
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${order.order_number}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("payment-proofs").upload(path, file, { upsert: false });
      if (error) throw error;
      await supabase.from("orders").update({
        payment_status: "awaiting_verification",
        payment_screenshot_url: path,
      }).eq("id", order.id);
      setOrder({ ...order, payment_status: "awaiting_verification", payment_screenshot_url: path });
      toast.success("Screenshot uploaded. We'll verify shortly.");
      setDone(true);
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. Try WhatsApp instead.");
    } finally {
      setUploading(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <p className="eyebrow">Payment</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Pay ₹{order.total} to complete</h1>
      <p className="mt-3 text-sm text-muted-foreground">Order <span className="font-medium text-foreground">{order.order_number}</span></p>

      {done ? (
        <div className="mt-10 rounded-2xl border border-primary/30 bg-cream p-8 text-center">
          <h2 className="font-serif text-2xl">Thanks! We'll verify your payment.</h2>
          <p className="mt-3 text-sm text-muted-foreground">Once confirmed, we'll update your tracker within a few hours.</p>
          <p className="mt-1 text-xs text-muted-foreground">— दो Taanke</p>
          <Link to="/track/$orderNumber" params={{ orderNumber: order.order_number }} className="btn-primary mt-6">Track your order</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-cream p-6">
              <p className="eyebrow">Scan UPI QR</p>
              {settings.upi_qr_url ? (
                <img src={settings.upi_qr_url} alt="UPI QR" className="mt-3 aspect-square w-full rounded-xl bg-background object-contain p-4" />
              ) : (
                <div className="mt-3 flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                  Admin hasn't added a UPI QR yet.
                </div>
              )}
              {settings.upi_id && (
                <div className="mt-4">
                  <p className="eyebrow">UPI ID</p>
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2">
                    <code className="text-sm">{settings.upi_id}</code>
                    <button onClick={() => copy(settings.upi_id ?? "")} className="text-primary"><Copy className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6">
              <p className="eyebrow">Bank transfer</p>
              {settings.bank_details ? (
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-background p-3 text-xs">{settings.bank_details}</pre>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Admin hasn't added bank details yet — use UPI above.</p>
              )}
              <div className="mt-6">
                <p className="eyebrow">Amount</p>
                <p className="mt-2 font-serif text-3xl">₹{order.total}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-cream p-6">
            <h2 className="font-serif text-2xl">After you pay</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap below to send your payment screenshot on WhatsApp. Your message is pre-written with all order details.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={onWhatsApp} className="btn-primary flex-1">
                <MessageCircle className="h-4 w-4" /> Send screenshot on WhatsApp
              </button>
              <label className="btn-ghost flex-1 cursor-pointer">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Or upload screenshot here"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
              </label>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
