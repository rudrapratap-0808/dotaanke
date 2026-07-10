import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Accessories — दो Taanke" },
      { name: "description", content: "Hand-embroidered accessories: dupattas, potlis, stoles and heirloom finishing touches." },
      { property: "og:title", content: "Accessories — दो Taanke" },
      { property: "og:description", content: "Hand-embroidered accessories: dupattas, potlis, stoles and heirloom finishing touches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Accessories,
});

function Accessories() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const list = products.filter((p) => p.category === "Accessories");

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <header className="mb-12">
        <p className="eyebrow flex items-center gap-2"><Sparkles className="h-3 w-3 text-gold" /> The finishing touch</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">Accessories</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Dupattas, potlis, stoles — small heirlooms, hand-embroidered to complete the story.
        </p>
      </header>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">New pieces coming soon. In the meantime, explore the collection.</p>
          <Link to="/shop" className="btn-ghost mt-6">Shop all →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}
