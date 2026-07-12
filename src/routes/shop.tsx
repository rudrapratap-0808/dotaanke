import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { productsQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — दो Taanke" },
      { name: "description", content: "Shop hand-embroidered shirts and kurtis. Filter by size, category and price." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Shop,
});

function Shop() {
  const { data: allProducts } = useSuspenseQuery(productsQuery());
  const products = useMemo(() => allProducts.filter((p) => p.category !== "Accessories"), [allProducts]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [size, setSize] = useState<string>("All");
  const [price, setPrice] = useState<number>(3000);
  const [sort, setSort] = useState<"featured" | "low" | "high" | "new">("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (size !== "All" && !p.sizes.includes(size)) return false;
      if (p.price > price) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    return list;
  }, [q, category, size, price, sort, products]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <header className="mb-10">
        <p className="eyebrow">The collection</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Shop</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {filtered.length} piece{filtered.length === 1 ? "" : "s"} — handcrafted, one at a time.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent text-sm outline-none" />
          </div>

          <Filter title="Category">
            {["All", "Shirts", "T-Shirts", "Kurtis", "Accessories"].map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`block text-left text-sm ${category === c ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}>{c}</button>
            ))}
          </Filter>

          <Filter title="Size">
            <div className="flex flex-wrap gap-2">
              {["All", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`rounded-md border px-3 py-1.5 text-xs ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>{s}</button>
              ))}
            </div>
          </Filter>

          <Filter title={`Price · up to ₹${price}`}>
            <input type="range" min={500} max={5000} step={100} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-primary" />
          </Filter>

          <Filter title="Sort">
            <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="featured">Featured</option>
              <option value="new">New arrivals</option>
              <option value="low">Price · Low to High</option>
              <option value="high">Price · High to Low</option>
            </select>
          </Filter>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <SlidersHorizontal className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">Nothing matches. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
