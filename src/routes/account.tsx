import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchMyOrders, type Order } from "@/lib/api";
import { Package } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: Account,
});

function Account() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchMyOrders(user.id)
      .then(setOrders)
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return <section className="mx-auto max-w-3xl px-5 py-24" />;

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-3 font-serif text-4xl">Hello, {user.email?.split("@")[0]}</h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && <Link to="/admin" className="btn-gold">Admin panel</Link>}
          <button onClick={signOut} className="btn-ghost">Sign out</button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl">Your orders</h2>
        {fetching ? (
          <p className="mt-4 text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
            <Package className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No orders yet.</p>
            <Link to="/shop" className="btn-primary mt-6">Shop the collection</Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-xl border border-border bg-cream p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill kind="payment" value={o.payment_status} />
                      <StatusPill kind="tracking" value={o.tracking_status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl">₹{o.total}</p>
                    <Link to="/track/$orderNumber" params={{ orderNumber: o.order_number }} className="text-xs text-primary underline">
                      Track order →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function StatusPill({ kind, value }: { kind: "payment" | "tracking"; value: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    awaiting_verification: "bg-gold/20 text-gold-foreground",
    verified: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    placed: "bg-muted text-muted-foreground",
    packed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    out_for_delivery: "bg-amber-100 text-amber-800",
    delivered: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest ${map[value] ?? "bg-muted"}`}>
      {kind === "payment" ? "Pay: " : ""}{value.replace(/_/g, " ")}
    </span>
  );
}
