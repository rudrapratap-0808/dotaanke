import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-success")({
  head: () => ({ meta: [{ title: "Order Confirmed — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: OrderSuccess,
});

function OrderSuccess() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
      <h1 className="font-serif text-5xl">Thank you.</h1>
      <p className="mt-4 text-muted-foreground">Your order has been placed. We'll notify you once payment is verified.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/track" className="btn-primary">Track your order</Link>
        <Link to="/shop" className="btn-ghost">Continue shopping</Link>
      </div>
    </section>
  );
}
