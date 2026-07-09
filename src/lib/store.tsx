import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchCouponByCode } from "@/lib/api";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type StoreContextValue = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  coupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  clearCoupon: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const KEY = "do-taanke-store-v2";

type Persisted = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  coupon: { code: string; percent: number } | null;
  theme: "light" | "dark";
};

const initial: Persisted = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  coupon: null,
  theme: "light",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state, hydrated]);

  const value = useMemo<StoreContextValue>(() => {
    const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = state.cart.reduce((s, i) => s + i.quantity, 0);
    return {
      cart: state.cart,
      subtotal,
      count,
      addToCart: (item) =>
        setState((s) => {
          const existing = s.cart.find((c) => c.productId === item.productId && c.size === item.size);
          if (existing) {
            return {
              ...s,
              cart: s.cart.map((c) =>
                c === existing ? { ...c, quantity: c.quantity + item.quantity } : c,
              ),
            };
          }
          return { ...s, cart: [...s.cart, item] };
        }),
      updateQuantity: (productId, size, quantity) =>
        setState((s) => ({
          ...s,
          cart: s.cart
            .map((c) => (c.productId === productId && c.size === size ? { ...c, quantity } : c))
            .filter((c) => c.quantity > 0),
        })),
      removeItem: (productId, size) =>
        setState((s) => ({
          ...s,
          cart: s.cart.filter((c) => !(c.productId === productId && c.size === size)),
        })),
      clearCart: () => setState((s) => ({ ...s, cart: [], coupon: null })),
      isCartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      wishlist: state.wishlist,
      toggleWishlist: (id) =>
        setState((s) => ({
          ...s,
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),
      recentlyViewed: state.recentlyViewed,
      addRecentlyViewed: (id) =>
        setState((s) => ({
          ...s,
          recentlyViewed: [id, ...s.recentlyViewed.filter((x) => x !== id)].slice(0, 6),
        })),
      coupon: state.coupon,
      applyCoupon: async (code) => {
        const c = code.trim().toUpperCase();
        if (!c) return { ok: false, message: "Enter a code" };
        try {
          const row = await fetchCouponByCode(c);
          if (!row) return { ok: false, message: "Invalid or expired code" };
          setState((s) => ({ ...s, coupon: { code: row.code, percent: row.discount_percent } }));
          return { ok: true, message: `${row.discount_percent}% off applied` };
        } catch {
          return { ok: false, message: "Could not check coupon" };
        }
      },
      clearCoupon: () => setState((s) => ({ ...s, coupon: null })),
      theme: state.theme,
      toggleTheme: () => setState((s) => ({ ...s, theme: s.theme === "light" ? "dark" : "light" })),
    };
  }, [state, isCartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
