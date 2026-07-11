import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { fetchOrderByNumber, type Order } from "@/lib/api";
import { sendTransactionalEmail } from "@/lib/email/send";

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
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderByNumber(orderNumber).then(setOrder);
  }, [orderNumber]);

  if (!order) return <section className="mx-auto max-w-3xl px-5 py-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></section>;

  const onRazorpay = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        toast.error("Could not load Razorpay. Check your connection.");
        return;
      }
      const res = await fetch("/api/public/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: order.order_number }),
      });
      if (!res.ok) {
        toast.error("Could not start payment. Please try again.");
        return;
      }
      const { orderId, amount, currency, keyId } = (await res.json()) as {
        orderId: string; amount: number; currency: string; keyId: string;
      };

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "दो Taanke",
        description: `Order ${order.order_number}`,
        prefill: {
          name: order.customer_name,
          email: order.email ?? undefined,
          contact: order.phone,
        },
        theme: { color: "#6A1E2E" },
        handler: async (response: unknown) => {
          const r = response as { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
          const verifyRes = await fetch("/api/public/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...r, orderNumber: order.order_number }),
          });
          if (verifyRes.ok) {
            toast.success("Payment verified!");
            setDone(true);
            // Send confirmation emails (customer + owner) — fire-and-forget
            const items = order.items as Array<{ name: string; size: string; quantity: number; price: number }>;
            const emailData = {
              orderNumber: order.order_number,
              customerName: order.customer_name,
              customerEmail: order.email,
              phone: order.phone,
              address: order.address, city: order.city, state: order.state, pincode: order.pincode,
              items,
              subtotal: order.subtotal, discount: order.discount, total: order.total,
              couponCode: order.coupon_code ?? null,
              trackUrl: `${window.location.origin}/track/${order.order_number}`,
              deliveryEstimate: "7-10 business days",
            };
            if (order.email) {
              void sendTransactionalEmail({
                templateName: "order-confirmation",
                recipientEmail: order.email,
                idempotencyKey: `order-confirm-${order.order_number}`,
                templateData: emailData,
              });
            }
            void sendTransactionalEmail({
              templateName: "owner-order-alert",
              recipientEmail: "support@dotaanke.store",
              idempotencyKey: `owner-alert-${order.order_number}`,
              templateData: emailData,
            });
            navigate({ to: "/track/$orderNumber", params: { orderNumber: order.order_number } });
          } else {
            toast.error("Payment could not be verified. Contact support.");
          }
        },
        modal: {
          ondismiss: () => toast.message("Payment cancelled"),
        },
      });
      rzp.on("payment.failed", (resp: unknown) => {
        console.error("Razorpay payment failed", resp);
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 md:px-10">
      <p className="eyebrow">Payment</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Pay ₹{order.total} to complete</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Order <span className="font-medium text-foreground">{order.order_number}</span>
      </p>

      {done ? (
        <div className="mt-10 rounded-2xl border border-primary/30 bg-cream p-8 text-center">
          <h2 className="font-serif text-2xl">Payment received. Thank you!</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            A confirmation email is on its way. We'll deliver your order in 7-10 business days.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">— दो Taanke</p>
          <Link to="/track/$orderNumber" params={{ orderNumber: order.order_number }} className="btn-primary mt-6">
            Track your order
          </Link>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-primary/30 bg-cream p-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Secure checkout by Razorpay
          </div>
          <h2 className="mt-3 font-serif text-2xl">Pay with UPI, cards, netbanking or wallets</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Instant confirmation. Delivery in 7-10 business days across India.
          </p>
          <button onClick={onRazorpay} disabled={paying} className="btn-primary mt-6 w-full">
            {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening…</> : <><CreditCard className="h-4 w-4" /> Pay ₹{order.total} securely</>}
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Need help? Email <a href="mailto:support@dotaanke.store" className="text-primary underline">support@dotaanke.store</a>
          </p>
        </div>
      )}
    </section>
  );
}
