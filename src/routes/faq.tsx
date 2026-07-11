import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — दो Taanke" },
      { name: "description", content: "Shipping, returns, refunds, sizing and payments." },
    ],
  }),
  component: FAQ,
});

const groups = [
  {
    title: "Shipping",
    items: [
      { q: "Do you offer free shipping?", a: "Yes — every order ships free within India." },
      { q: "How long does delivery take?", a: "7-10 business days across India after your order is confirmed." },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "7-day easy returns on unworn pieces with original packaging." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days to the original payment method." },
    ],
  },
  {
    title: "Sizing",
    items: [
      { q: "How do I choose the right size?", a: "Refer to the size chart on each product page. When in doubt, size up — our fits run true." },
    ],
  },
  {
    title: "Payments",
    items: [
      { q: "Which payment methods do you accept?", a: "This demo store uses a simulated payment. In production we support UPI, cards, netbanking, and wallets." },
    ],
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <header className="mb-12">
        <p className="eyebrow">Frequently asked</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Questions, answered.</h1>
      </header>
      <div className="space-y-12">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="mb-4 font-serif text-2xl">{g.title}</h2>
            <div className="divide-y divide-border border-y border-border">
              {g.items.map((it) => <Row key={it.q} q={it.q} a={it.a} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="font-serif text-lg">{q}</span>
        {open ? <Minus className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-5 pr-8 text-foreground/80">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
