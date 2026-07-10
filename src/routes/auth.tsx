import { createFileRoute, useNavigate, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({ meta: [{ title: "Sign In — दो Taanke" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const nextPath = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/account";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: nextPath });
  }, [user, navigate, nextPath]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      toast.success("Signed in with Google.");
      navigate({ to: nextPath });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

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
      navigate({ to: nextPath });
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

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.73-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.5l2.63-2.54C16.83 3.3 14.66 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 12s4.1 9.6 9.2 9.6c5.31 0 8.84-3.73 8.84-8.98 0-.6-.07-1.06-.16-1.52H12z"/>
        </svg>
        Continue with Google
      </button>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

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
