import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore, COUPON_DISCOUNTS } from "@/lib/store";

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, subtotal, updateQuantity, removeItem, coupon, applyCoupon, clearCoupon } =
    useStore();
  const [code, setCode] = useState("");

  const discountRate = coupon ? COUPON_DISCOUNTS[coupon] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-background shadow-luxe"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="eyebrow">Your bag</p>
                <h3 className="font-serif text-2xl">{cart.length} pieces</h3>
              </div>
              <button aria-label="Close" onClick={closeCart} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Your bag is quiet. Add a piece worth telling stories about.</p>
                <Link to="/shop" onClick={closeCart} className="btn-primary mt-2">Explore the collection</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="divide-y divide-border">
                    {cart.map((item) => (
                      <li key={item.productId + item.size} className="flex gap-4 py-4">
                        <img src={item.image} alt={item.name} className="h-24 w-20 rounded-md object-cover" />
                        <div className="flex-1">
                          <div className="flex justify-between gap-2">
                            <p className="font-serif text-base leading-tight">{item.name}</p>
                            <button
                              onClick={() => removeItem(item.productId, item.size)}
                              aria-label="Remove"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">Size {item.size}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-border">
                              <button
                                className="p-1.5 hover:text-primary"
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                              <button
                                className="p-1.5 hover:text-primary"
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                aria-label="Increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border px-6 py-5">
                  <div className="mb-4 flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Coupon (try WELCOME10)"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (!code) return;
                        const res = applyCoupon(code);
                        res.ok ? toast.success(res.message) : toast.error(res.message);
                        setCode("");
                      }}
                      className="btn-ghost text-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {coupon && (
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Coupon {coupon}</span>
                      <button onClick={clearCoupon} className="text-primary underline">Remove</button>
                    </div>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Discount</span>
                        <span>− ₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-border pt-3 font-serif text-xl">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  <Link to="/checkout" onClick={closeCart} className="btn-primary mt-5 w-full">
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
