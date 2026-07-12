import type { Tables } from "@/integrations/supabase/types";

export type ProductRow = Tables<"products">;

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  video?: string;
  sizes: string[];
  colors: string[];
  features: string[];
  description: string;
  badges: string[];
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  active: boolean;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80";

export function toProduct(r: ProductRow): Product {
  const image = r.image_url && r.image_url.length > 0 ? r.image_url : FALLBACK_IMAGE;
  const gallery = r.gallery && r.gallery.length > 0 ? r.gallery : [image];
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    gender: r.gender,
    price: Number(r.price),
    originalPrice: r.original_price ? Number(r.original_price) : undefined,
    image,
    gallery,
    video: r.video_url || undefined,
    sizes: r.sizes ?? ["S", "M", "L", "XL", "XXL"],
    colors: ((r as unknown as { colors?: string[] }).colors) ?? [],
    features: r.features ?? [],
    description: r.description ?? "",
    badges: r.badges ?? [],
    bestseller: r.bestseller,
    newArrival: r.new_arrival,
    rating: Number(r.rating),
    reviewsCount: r.reviews_count,
    active: r.active,
  };
}
