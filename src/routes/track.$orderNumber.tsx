import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Order, } from "@/lib/api";
import { fetchOrderByNumber } from "@/lib/api";
import { Check, Package, Truck, Home, X, CircleDashed } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type HistoryRow = Tables<"order_status_history">;

export const Route = createFileRoute("/track/$orderNumber")({
  head: () => ({ meta: [{ title: "Order tracking — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: TrackDetail,
});

const STEPS = ["placed", "packed", "shipped", "out_for_delivery", "delivered"] as const;
const LABELS: Record<string, string> = {
  placed: "Order placed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function TrackDetail() {
  const { orderNumber } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const o = await fetchOrderByNumber(orderNumber);
      if (!alive) return;
      setOrder(o);
      if (o) {
        const { data } = await supabase
          .from("order_status_history")
          .select("*")
          .eq("order_id", o.id)
          .order("created_at", { ascending: true });
        if (alive) setHistory(data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [orderNumber]);

  if (loading) return <section className="mx-auto max-w-3xl px-5 py-24 text-center text-muted-foreground">Loading…</section>;
  if (!order) return <section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-serif text-3xl">Order not found</h1></section>;

  const cancelled = order.tracking_status === "cancelled";
  const currentIdx = STEPS.indexOf(order.tracking_status as (typeof STEPS)[number]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <p className="eyebrow">Tracking</p>
      <h1 className="mt-3 font-serif text-4xl">Order {order.order_number}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <PaymentBadge status={order.payment_status} />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-cream p-6">
        {cancelled ? (
          <div className="flex items-center gap-3 text-destructive"><X className="h-5 w-5" /> Order cancelled</div>
        ) : (
          <ol className="grid gap-6 md:grid-cols-5">
            {STEPS.map((s, i) => {
              const done = i <= currentIdx;
              const Icon = i === 0 ? Check : i === 1 ? Package : i === 2 ? Truck : i === 3 ? Truck : Home;
              return (
                <li key={s} className="flex flex-col items-center gap-2 text-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`}>
                    {done ? <Icon className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{LABELS[s]}</span>
                </li>
              );
            })}
          </ol>
        )}

        {order.tracking_number && (
          <div className="mt-6 rounded-lg bg-background p-4 text-sm">
            <p className="eyebrow">Tracking number</p>
            <p className="mt-1 font-medium">{order.tracking_number}</p>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl">Updates</h2>
          <ul className="mt-4 space-y-3">
            {history.map((h) => (
              <li key={h.id} className="rounded-lg border border-border bg-background p-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{LABELS[h.status] ?? h.status}</span>
                  <span className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString("en-IN")}</span>
                </div>
                {h.note && <p className="mt-1 text-muted-foreground">{h.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-cream p-6">
        <h3 className="font-serif text-xl">Shipping to</h3>
        <p className="mt-2 text-sm">{order.customer_name}<br />{order.address}<br />{order.city}, {order.state} — {order.pincode}<br />{order.phone}</p>
      </div>
    </section>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    awaiting_verification: "bg-gold/20 text-foreground",
    verified: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
  };
  const labels: Record<string, string> = {
    pending: "Payment pending",
    awaiting_verification: "Payment awaiting verification",
    verified: "Payment verified",
    rejected: "Payment rejected",
  };
  return <span className={`rounded-full px-3 py-1 text-xs ${map[status]}`}>{labels[status]}</span>;
}
