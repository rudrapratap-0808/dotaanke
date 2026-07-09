import { createFileRoute, Link } from "@tanstack/react-router";
import { productsQuery } from "@/lib/api";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const { data: products } = useSuspenseQuery(productsQuery());
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <p className="eyebrow">Saved</p>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">Nothing here yet. Tap the heart on a piece you love.</p>
          <Link to="/shop" className="btn-primary mt-6">Browse the collection</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}
