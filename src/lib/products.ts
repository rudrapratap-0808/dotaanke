import shirtImg from "@/assets/product-shirt.jpg";
import kurtiImg from "@/assets/product-kurti.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Shirts" | "Kurtis";
  gender: "Men" | "Women";
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  sizes: string[];
  features: string[];
  description: string;
  badges: string[];
  bestseller?: boolean;
  newArrival?: boolean;
  rating: number;
  reviewsCount: number;
};

export const products: Product[] = [
  {
    id: "embroidery-shirt-ivory",
    name: "Ivory Zari Embroidery Shirt",
    category: "Shirts",
    gender: "Men",
    price: 799,
    originalPrice: 1499,
    image: shirtImg,
    gallery: [shirtImg, shirtImg, shirtImg],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Premium Embroidery", "100% Comfortable Fabric", "Casual & Festive Wear", "Free Shipping"],
    description:
      "A masterwork of quiet luxury. Hand-guided zari embroidery traces the placket in whispered gold and rich maroon, set against a breathable cotton weave that drapes with intention. Made for weddings, dinners and the moments in between.",
    badges: ["Bestseller", "Handcrafted"],
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: "embroidery-kurti-blush",
    name: "Blush Chikankari Kurti",
    category: "Kurtis",
    gender: "Women",
    price: 899,
    originalPrice: 1699,
    image: kurtiImg,
    gallery: [kurtiImg, kurtiImg, kurtiImg],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Designer Embroidery", "Comfort Fit", "Premium Cotton", "Elegant Look"],
    description:
      "Blush cotton kissed with hand-drawn gold thread. A silhouette designed to move — softly tailored, weightless against the skin, ornamented where it matters. A modern heirloom.",
    badges: ["New Arrival", "Handcrafted"],
    bestseller: true,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 96,
  },
  {
    id: "embroidery-shirt-classic",
    name: "Classic Maroon Thread Shirt",
    category: "Shirts",
    gender: "Men",
    price: 799,
    originalPrice: 1499,
    image: shirtImg,
    gallery: [shirtImg, shirtImg],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Premium Embroidery", "100% Comfortable Fabric", "Casual & Festive Wear", "Free Shipping"],
    description:
      "A restrained, refined shirt with a signature vertical band of embroidery. For the man who lets his craft speak first.",
    badges: ["Signature"],
    rating: 4.7,
    reviewsCount: 64,
  },
  {
    id: "embroidery-kurti-ivory",
    name: "Ivory Heirloom Kurti",
    category: "Kurtis",
    gender: "Women",
    price: 899,
    originalPrice: 1699,
    image: kurtiImg,
    gallery: [kurtiImg, kurtiImg],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Designer Embroidery", "Comfort Fit", "Premium Cotton", "Elegant Look"],
    description: "Ivory cotton, gold at the yoke. A quiet showpiece, worn from morning to midnight.",
    badges: ["Bestseller"],
    bestseller: true,
    rating: 4.9,
    reviewsCount: 112,
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
