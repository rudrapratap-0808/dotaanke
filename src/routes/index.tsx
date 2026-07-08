import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import craftImg from "@/assets/craft.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Featured />
      <Categories />
      <Craft />
      <Reviews />
      <Instagram />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[100svh] items-end overflow-hidden bg-cream pb-16 pt-32 md:pb-24">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Ivory hand-embroidered kurti" className="h-full w-full object-cover object-center opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
      </div>
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 md:px-10 lg:grid-cols-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <p className="eyebrow flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-gold" /> Handcrafted in India · Autumn 2026
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.6rem] leading-[0.98] tracking-tight text-foreground md:text-6xl lg:text-[5.25rem]">
            Every stitch <em className="text-primary">tells a story.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
            <span className="font-devanagari text-primary">दो</span> Taanke — heirloom embroidery on modern silhouettes.
            Shirts and kurtis threaded by hand, worn like a promise.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn-primary">
              Shop the Edit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="btn-ghost">Our craft story</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    { icon: Truck, label: "Free shipping across India" },
    { icon: RefreshCcw, label: "7-day easy returns" },
    { icon: ShieldCheck, label: "Handcrafted, one at a time" },
    { icon: Sparkles, label: "Real gold zari embroidery" },
  ];
  return (
    <div className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-6 md:grid-cols-4 md:px-10">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <it.icon className="h-4 w-4 text-gold" />
            <span className="text-foreground/80">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: { to: string; label: string } }) {
  return (
    <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 md:px-10">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h2>
      </div>
      {cta && (
        <Link to={cta.to} className="gold-underline hidden text-sm md:inline-flex">
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

function Featured() {
  return (
    <section className="py-24">
      <SectionHeader eyebrow="Best sellers" title="The heirlooms" cta={{ to: "/shop", label: "View all" }} />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-5 px-5 md:grid-cols-4 md:gap-8 md:px-10">
        {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    { title: "Embroidery Shirts", to: "/shop", tag: "For Him", price: "From ₹799" },
    { title: "Embroidery Kurtis", to: "/shop", tag: "For Her", price: "From ₹899" },
  ];
  return (
    <section className="py-24">
      <SectionHeader eyebrow="Shop by category" title="Two worlds, one thread" />
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-10">
        {cats.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-cream"
          >
            <img
              src={i === 0 ? products[0].image : products[1].image}
              alt={c.title}
              className="h-[520px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow text-background/80">{c.tag}</p>
              <h3 className="mt-2 font-serif text-4xl text-background">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-background/80">{c.price}</p>
                <Link to={c.to} className="rounded-full bg-background px-5 py-2 text-xs font-medium tracking-widest text-foreground transition-transform hover:scale-105">
                  Explore
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Craft() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <motion.img
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          src={craftImg}
          alt="Gold zari embroidery in progress"
          className="rounded-2xl object-cover"
          loading="lazy"
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="eyebrow">The atelier</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Slow craft, in a hurried world.</h2>
          <p className="mt-6 leading-relaxed text-foreground/80">
            Each piece is drawn, threaded and finished by artisans in small workshops across Lucknow and Jaipur.
            A single kurti takes up to three days. Two stitches — दो taanke — and a story begins.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {[
              { n: "48h", l: "Hand-embroidery per piece" },
              { n: "12", l: "Master artisans" },
              { n: "100%", l: "Cotton, ethically sourced" },
            ].map((s) => (
              <div key={s.n}>
                <p className="font-serif text-3xl text-primary">{s.n}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-ghost mt-8">Read our story <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Ananya S.", city: "Mumbai", text: "The embroidery is unreal. Everyone at the wedding asked where it was from." , rating: 5 },
    { name: "Rohan K.", city: "Bengaluru", text: "Fit is exquisite. The maroon thread work looks even better in person.", rating: 5 },
    { name: "Meera P.", city: "Delhi", text: "This is what quiet luxury feels like. I've ordered three already.", rating: 5 },
  ];
  return (
    <section className="bg-cream py-24">
      <SectionHeader eyebrow="Customer stories" title="Loved, worn, treasured" />
      <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-5 md:grid-cols-3 md:px-10">
        {reviews.map((r, i) => (
          <motion.blockquote
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="rounded-2xl bg-background p-8 shadow-soft"
          >
            <div className="mb-4 flex gap-0.5 text-gold">{Array.from({ length: r.rating }).map((_, j) => <span key={j}>★</span>)}</div>
            <p className="font-serif text-lg leading-relaxed">"{r.text}"</p>
            <footer className="mt-6 text-sm text-muted-foreground">— {r.name}, {r.city}</footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

function Instagram() {
  const tiles = [products[0].image, products[1].image, products[0].image, products[1].image, products[0].image, products[1].image];
  return (
    <section className="py-24">
      <SectionHeader eyebrow="@dotaanke" title="Follow the thread" />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-3 gap-2 px-5 md:grid-cols-6 md:px-10">
        {tiles.map((src, i) => (
          <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-md bg-cream">
            <img src={src} alt="Instagram tile" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-10">
        <p className="eyebrow text-primary-foreground/70">The atelier letter</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Private previews. First access. 10% off.</h2>
        <form
          className="mx-auto mt-8 flex max-w-md gap-2"
          onSubmit={(e) => { e.preventDefault(); if (!email.includes("@")) return toast.error("Enter a valid email"); toast.success("Welcome to दो Taanke."); setEmail(""); }}
        >
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-md bg-primary-foreground/10 px-4 py-3 text-primary-foreground outline-none placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20" />
          <button className="btn-gold whitespace-nowrap">Join</button>
        </form>
      </div>
    </section>
  );
}
