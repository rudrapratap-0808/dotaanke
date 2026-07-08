import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export type Order = {
  id: string;
  txnId: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  total: number;
  couponCode?: string;
  discount: number;
  paymentStatus: "PAID_DEMO";
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
  orders: Order[];
  addOrder: (order: Order) => void;
  coupon: string | null;
  applyCoupon: (code: string) => { ok: boolean; message: string; discount: number };
  clearCoupon: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const KEY = "do-taanke-store-v1";

type Persisted = {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  orders: Order[];
  coupon: string | null;
  theme: "light" | "dark";
};

const initial: Persisted = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  orders: [],
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
                c === existing ? { ...c, quantity: c.quantity + item.quantity } : c
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
        setState((s) => ({ ...s, cart: s.cart.filter((c) => !(c.productId === productId && c.size === size)) })),
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
      orders: state.orders,
      addOrder: (order) => setState((s) => ({ ...s, orders: [order, ...s.orders] })),
      coupon: state.coupon,
      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        const table: Record<string, number> = { WELCOME10: 0.1, STITCH20: 0.2, GOLD5: 0.05 };
        if (!table[c]) return { ok: false, message: "Invalid code", discount: 0 };
        setState((s) => ({ ...s, coupon: c }));
        return { ok: true, message: `${Math.round(table[c] * 100)}% off applied`, discount: table[c] };
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

export const COUPON_DISCOUNTS: Record<string, number> = { WELCOME10: 0.1, STITCH20: 0.2, GOLD5: 0.05 };
