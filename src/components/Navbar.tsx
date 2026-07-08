import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Navbar() {
  const { count, openCart, wishlist, theme, toggleTheme } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav py-3" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10">
          <Link to="/" className="group flex items-baseline gap-1">
            <span className="font-devanagari text-2xl font-semibold text-primary md:text-3xl">दो</span>
            <span className="font-serif text-2xl tracking-wide text-foreground md:text-3xl">Taanke</span>
            <span className="ml-1 hidden h-1.5 w-1.5 rounded-full bg-gold md:inline-block" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="gold-underline text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="hidden rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            >
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
            <button
              aria-label="Account"
              className="hidden rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background/80 backdrop-blur"
            >
              <div className="mx-auto max-w-3xl px-5 py-4 md:px-10">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    autoFocus
                    placeholder="Search embroidery shirts, kurtis…"
                    className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const q = (e.target as HTMLInputElement).value;
                        window.location.assign(`/shop?q=${encodeURIComponent(q)}`);
                      }
                    }}
                  />
                  <button onClick={() => setSearchOpen(false)} aria-label="Close">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-xs flex-col bg-background p-8 shadow-luxe lg:hidden"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-serif text-xl">Menu</span>
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-border py-4 font-serif text-2xl text-foreground"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <button onClick={toggleTheme} className="btn-ghost w-full">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
