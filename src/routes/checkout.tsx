import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { buildWhatsappMessage } from "@/lib/api";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

type Form = {
  name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string;
};

function Checkout() {
  const { cart, subtotal, coupon, clearCart } = useStore();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Form>();

  useEffect(() => {
    if (!user) return;
    if (user.email) setValue("email", user.email);
    let alive = true;
    supabase
      .from("profiles")
      .select("full_name, phone, address, city, state, pincode")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive || !data) return;
        if (data.full_name) setValue("name", data.full_name);
        if (data.phone) setValue("phone", data.phone);
        if (data.address) setValue("address", data.address);
        if (data.city) setValue("city", data.city);
        if (data.state) setValue("state", data.state);
        if (data.pincode) setValue("pincode", data.pincode);
      });
    return () => { alive = false; };
  }, [user, setValue]);

  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const total = subtotal - discount;

  const onSubmit = async (data: Form) => {
    if (cart.length === 0) return toast.error("Your bag is empty");
    setSubmitting(true);
    try {
      const items = cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        size: c.size,
        quantity: c.quantity,
        image: c.image,
      }));
      const { data: inserted, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          customer_name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          items,
          subtotal,
          discount,
          total,
          coupon_code: coupon?.code ?? null,
        })
        .select("*")
        .single();
      if (error) throw error;

      // Build WhatsApp message and cache on order
      const message = buildWhatsappMessage({
        orderNumber: inserted.order_number,
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        items,
        total,
      });
      await supabase.from("orders").update({ whatsapp_message: message }).eq("id", inserted.id);

      clearCart();
      navigate({ to: "/pay/$orderNumber", params: { orderNumber: inserted.order_number } });
    } catch (e) {
      console.error(e);
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-5 py-24 text-center md:px-10">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-3 font-serif text-4xl">Sign in to place your order</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Create an account or sign in so we can save your order, track it and email you updates.
        </p>
        <Link to="/auth" search={{ redirect: "/checkout" }} className="btn-primary mt-8">Sign in to continue</Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
        <h1 className="font-serif text-4xl">Your bag is empty.</h1>
        <p className="mt-3 text-muted-foreground">Add a piece to check out.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 font-serif text-5xl">Almost yours.</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Section title="Contact">
            <Grid>
              <Field label="Full name" error={errors.name?.message}>
                <input {...register("name", { required: "Required", maxLength: 80 })} className="input" />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register("phone", { required: "Required", pattern: { value: /^[0-9+\-\s]{10,15}$/, message: "Invalid phone" } })} className="input" />
              </Field>
              <Field label="Email" error={errors.email?.message} full>
                <input type="email" {...register("email", { required: "Required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} className="input" />
              </Field>
            </Grid>
          </Section>

          <Section title="Shipping address">
            <Grid>
              <Field label="Address" error={errors.address?.message} full>
                <input {...register("address", { required: "Required", maxLength: 200 })} className="input" />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input {...register("city", { required: "Required" })} className="input" />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <input {...register("state", { required: "Required" })} className="input" />
              </Field>
              <Field label="PIN code" error={errors.pincode?.message}>
                <input {...register("pincode", { required: "Required", pattern: { value: /^\d{6}$/, message: "6 digits" } })} className="input" />
              </Field>
            </Grid>
          </Section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-cream p-6">
          <p className="eyebrow">Order summary</p>
          <ul className="mt-4 divide-y divide-border">
            {cart.map((c) => (
              <li key={c.productId + c.size} className="flex gap-3 py-3">
                <img src={c.image} alt={c.name} className="h-16 w-14 rounded object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-serif text-base leading-tight">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Size {c.size} · Qty {c.quantity}</p>
                </div>
                <p className="text-sm">₹{c.price * c.quantity}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <Row l="Subtotal" v={`₹${subtotal}`} />
            {discount > 0 && <Row l={`Discount (${coupon?.code})`} v={`− ₹${discount}`} />}
            <Row l="Shipping" v="Free" />
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-serif text-xl">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : `Continue to Payment · ₹${total}`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure payment via Razorpay · delivery in 7-10 days
          </p>
        </aside>
      </form>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 font-serif text-2xl">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">{children}</div>;
}
function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between text-muted-foreground"><span>{l}</span><span>{v}</span></div>;
}
