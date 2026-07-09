import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/account" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/account`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({ to: "/account" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Auth failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-5 py-24 md:px-10">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-serif text-4xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {mode === "signin" ? "Sign in to track orders and save pieces you love." : "One account for orders, tracking and the wishlist."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <label className="block">
            <span className="eyebrow">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input mt-2 w-full" />
          </label>
        )}
        <label className="block">
          <span className="eyebrow">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input mt-2 w-full" />
        </label>
        <label className="block">
          <span className="eyebrow">Password</span>
          <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required className="input mt-2 w-full" />
        </label>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signin" ? "New here?" : "Have an account?"}{" "}
        <button className="text-primary underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Create one" : "Sign in"}
        </button>
      </p>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Back to store</Link>
      </p>
    </section>
  );
}
