import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Package } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({ meta: [{ title: "Order Confirmed — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { id } = Route.useSearch();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id) ?? orders[0];

  if (!order) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
        <h1 className="font-serif text-4xl">No recent orders.</h1>
        <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </section>
    );
  }

  const eta = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-8 w-8" />
      </motion.div>
      <h1 className="mt-6 text-center font-serif text-5xl md:text-6xl">Thank you.</h1>
      <p className="mt-3 text-center text-muted-foreground">Your order is confirmed. A confirmation has been sent to {order.customer.email}.</p>

      <div className="mt-10 rounded-2xl border border-border bg-cream p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Info label="Order number">{order.id}</Info>
          <Info label="Transaction ID">{order.txnId}</Info>
          <Info label="Estimated delivery"><span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" /> By {eta}</span></Info>
        </div>
        <hr className="my-6 border-border" />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">Shipping to</p>
            <p className="mt-2 font-serif text-lg">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.address}<br />{order.customer.city}, {order.customer.state} {order.customer.pincode}<br />{order.customer.phone}</p>
          </div>
          <div>
            <p className="eyebrow">Items</p>
            <ul className="mt-2 space-y-2 text-sm">
              {order.items.map((i) => (
                <li key={i.productId + i.size} className="flex justify-between">
                  <span>{i.name} · Size {i.size} · x{i.quantity}</span>
                  <span>₹{i.price * i.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-3 font-serif text-xl">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
        <Link to="/" className="btn-ghost">Return home</Link>
      </div>
    </section>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 font-medium">{children}</p>
    </div>
  );
}
