import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — दो Taanke" },
      { name: "description", content: "Talk to the atelier. Bespoke commissions, order support and press enquiries." },
    ],
  }),
  component: Contact,
});

type FormData = { name: string; email: string; message: string };

function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    // TODO: wire EmailJS with your service ID / template — until then, log + local success.
    console.info("[contact form]", data);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thank you. We'll be in touch shortly.");
    reset();
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <header className="mb-14">
        <p className="eyebrow">Talk to us</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Contact the atelier</h1>
      </header>

      <div className="grid gap-14 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field label="Full name" error={errors.name?.message}>
            <input {...register("name", { required: "Name is required", maxLength: { value: 80, message: "Too long" } })} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary" />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea rows={5} {...register("message", { required: "Please write a message", maxLength: { value: 1000, message: "Too long" } })} className="w-full resize-none border-b border-border bg-transparent py-3 outline-none focus:border-primary" />
          </Field>
          <button disabled={isSubmitting} className="btn-primary">{isSubmitting ? "Sending…" : "Send message"}</button>
        </form>

        <aside className="space-y-6">
          <Info icon={Phone} label="Call">+91 76185 16284 · +91 87420 80780</Info>
          <Info icon={Mail} label="Email">support@dotaanke.store</Info>
          <Info icon={MapPin} label="Atelier">Lucknow · Jaipur · India</Info>
          <a href="https://wa.me/918619780142" target="_blank" rel="noreferrer" className="btn-gold w-full">
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
          <div className="aspect-video overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Location"
              src="https://www.google.com/maps?q=Lucknow&output=embed"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Info({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-1 h-4 w-4 text-gold" />
      <div>
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-foreground">{children}</p>
      </div>
    </div>
  );
}
