import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { fetchOrderByNumber } from "@/lib/api";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track your order — दो Taanke" }] }),
  component: TrackLookup,
});

function TrackLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await fetchOrderByNumber(orderNumber.trim(), phone.trim());
      if (!order) return toast.error("Order not found — check your number and phone.");
      navigate({ to: "/track/$orderNumber", params: { orderNumber: order.order_number } });
    } catch {
      toast.error("Could not look up order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-5 py-24 md:px-10">
      <p className="eyebrow">Order tracker</p>
      <h1 className="mt-3 font-serif text-4xl">Where's my order?</h1>
      <p className="mt-3 text-sm text-muted-foreground">Enter your order number and the phone you used at checkout.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="eyebrow">Order number</span>
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="DT-1001" required className="input mt-2 w-full" />
        </label>
        <label className="block">
          <span className="eyebrow">Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="input mt-2 w-full" />
        </label>
        <button disabled={loading} className="btn-primary w-full">{loading ? "Looking up…" : "Track"}</button>
      </form>
    </section>
  );
}
