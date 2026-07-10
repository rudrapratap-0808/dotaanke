import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-1">
          <div className="flex items-baseline gap-1">
            <span className="font-devanagari text-3xl font-semibold text-primary">दो</span>
            <span className="font-serif text-3xl">Taanke</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Every stitch tells a story. Hand-embroidered heirloom pieces for the modern Indian wardrobe.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.instagram.com/do_taanke/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="https://wa.me/917618516284" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-border p-2 transition-colors hover:border-primary hover:text-primary"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/shop" className="gold-underline">All Products</Link></li>
            <li><Link to="/shop" search={{ category: "Shirts" } as never} className="gold-underline">Embroidery Shirts</Link></li>
            <li><Link to="/shop" search={{ category: "Kurtis" } as never} className="gold-underline">Embroidery Kurtis</Link></li>
            <li><Link to="/accessories" className="gold-underline">Accessories</Link></li>
            <li><Link to="/wishlist" className="gold-underline">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Support</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/faq" className="gold-underline">FAQ</Link></li>
            <li><Link to="/contact" className="gold-underline">Contact</Link></li>
            <li><Link to="/about" className="gold-underline">Our Story</Link></li>
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> +91 76185 16284</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> contact@dotaanke.store</li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">The Atelier Letter</h4>
          <p className="mt-4 text-sm text-muted-foreground">New arrivals, private previews and 10% off your first order.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return toast.error("Enter a valid email");
              toast.success("Welcome. Check your inbox for a gift.");
              setEmail("");
            }}
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your@email.com"
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button className="btn-primary text-xs">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} दो Taanke. All rights reserved.</p>
          <p>Handcrafted in India · Free shipping across India</p>
        </div>
      </div>
    </footer>
  );
}
