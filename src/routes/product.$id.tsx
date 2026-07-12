import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Share2, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { productBySlugQuery, productsQuery } from "@/lib/api";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productBySlugQuery(params.id));
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — दो Taanke` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Product — दो Taanke" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(productBySlugQuery(id));
  const { data: allProducts } = useSuspenseQuery(productsQuery());
  const [size, setSize] = useState("M");
  const [color, setColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });
  const { addToCart, openCart, wishlist, toggleWishlist, addRecentlyViewed } = useStore();
  const navigate = useNavigate();

  if (!product) return null;
  const wished = wishlist.includes(product.id);

  useEffect(() => { addRecentlyViewed(product.id); }, [product.id, addRecentlyViewed]);

  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const add = () => {
    addToCart({ productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, size, quantity: qty });
    openCart();
  };
  const buyNow = () => {
    addToCart({ productId: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, size, quantity: qty });
    navigate({ to: "/checkout" });
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
      <nav className="mb-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> · <Link to="/shop" className="hover:text-foreground">Shop</Link> · <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="grid gap-4">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream"
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img
              src={product.gallery[active] ?? product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500"
              style={zoom.on ? { transform: "scale(1.6)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden rounded-md border ${active === i ? "border-primary" : "border-border"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {product.video && (
            <video src={product.video} controls className="w-full rounded-2xl" />
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="eyebrow">{product.category} · {product.gender}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex text-gold">{"★".repeat(Math.round(product.rating))}<span className="text-border">{"★".repeat(5 - Math.round(product.rating))}</span></div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.reviewsCount} reviews</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl">₹{product.price}</span>
            {product.originalPrice && <span className="text-muted-foreground line-through">₹{product.originalPrice}</span>}
            {product.originalPrice && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Save ₹{product.originalPrice - product.price}</span>}
          </div>
          <p className="mt-6 leading-relaxed text-foreground/80">{product.description}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">Size</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-12 rounded-md border px-4 py-2 text-sm ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow">Colour {color && <span className="ml-2 normal-case tracking-normal text-foreground/70">— {color}</span>}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-md border px-4 py-2 text-sm ${color === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}


          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="min-w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={add} className="btn-primary flex-1">Add to Bag</button>
            <button onClick={() => { toggleWishlist(product.id); toast.success(wished ? "Removed" : "Saved"); }} aria-label="Wishlist" className="rounded-md border border-border p-3 hover:border-foreground">
              <Heart className={`h-5 w-5 ${wished ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>
          <button onClick={buyNow} className="btn-gold mt-3 w-full">Buy Now — ₹{product.price * qty}</button>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                else if (typeof navigator !== "undefined") { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }
              }}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>

          {product.features.length > 0 && (
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-foreground/80">
                  <ShieldCheck className="h-4 w-4 text-gold" /> {f}
                </li>
              ))}
            </ul>
          )}

        </motion.div>
      </div>


      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </section>
  );
}
