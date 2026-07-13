import { useEffect, useState } from "react";
import { X, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";

const KEY = "do-taanke-welcome10-dismissed";
const CODE = "WELCOME10";

export function DiscountPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY)) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      toast.success("Code copied — apply at checkout");
    } catch {
      toast.error("Please copy: " + CODE);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-title"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-background p-8 text-center shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <Sparkles className="mx-auto h-8 w-8 text-gold" />
        <p className="eyebrow mt-4">First 50 customers</p>
        <h2 id="discount-title" className="mt-3 font-serif text-3xl">
          Enjoy 10% off your first order
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A little welcome from our atelier — hand-embroidered heirlooms, delivered
          to your door.
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary/40 bg-cream p-3">
          <span className="font-mono text-xl tracking-widest text-primary">
            {CODE}
          </span>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        </div>

        <a href="/shop" onClick={close} className="btn-primary mt-6 inline-block w-full">
          Shop the collection
        </a>
        <button onClick={close} className="mt-3 text-xs text-muted-foreground underline">
          No thanks
        </button>
      </div>
    </div>
  );
}
