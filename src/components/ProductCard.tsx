import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWishlist, addToCart, openCart } = useStore();
  const wished = wishlist.includes(product.id);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative overflow-hidden rounded-lg bg-cream aspect-[4/5]">
          <img
            src={product.image}
            alt={product.name}
            width={1200}
            height={1500}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <button
            aria-label="Toggle wishlist"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
              toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-md transition-transform hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          {product.badges[0] && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest">
              {product.badges[0]}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: "M",
                quantity: 1,
              });
              openCart();
            }}
            className="absolute inset-x-3 bottom-3 translate-y-2 rounded-md bg-foreground/95 py-2.5 text-xs font-medium uppercase tracking-widest text-background opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Quick Add
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{product.category}</p>
            <h3 className="mt-1 font-serif text-lg leading-tight">{product.name}</h3>
          </div>
          <div className="text-right">
            <p className="font-medium">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
