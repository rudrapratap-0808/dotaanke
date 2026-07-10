import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-serif text-5xl">This thread doesn't lead anywhere.</h1>
        <p className="mt-4 text-sm text-muted-foreground">The page you're looking for has been unstitched or moved.</p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">Return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">A stitch came loose.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "दो Taanke — Every Stitch Tells A Story" },
      { name: "description", content: "Hand-embroidered luxury Indian shirts and kurtis. दो Taanke crafts heirloom pieces where every stitch tells a story." },
      { name: "author", content: "दो Taanke" },
      { name: "theme-color", content: "#6A1E2E" },
      { property: "og:title", content: "दो Taanke — Every Stitch Tells A Story" },
      { property: "og:description", content: "Hand-embroidered luxury Indian shirts and kurtis. दो Taanke crafts heirloom pieces where every stitch tells a story." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "दो Taanke — Every Stitch Tells A Story" },
      { name: "twitter:description", content: "Hand-embroidered luxury Indian shirts and kurtis. दो Taanke crafts heirloom pieces where every stitch tells a story." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/33cd4ed2-404c-4363-abe0-6f1daf3d2a1a/id-preview-33ddbcde--8333eb17-08b2-42af-910c-2f76df98b297.lovable.app-1783513146954.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/33cd4ed2-404c-4363-abe0-6f1daf3d2a1a/id-preview-33ddbcde--8333eb17-08b2-42af-910c-2f76df98b297.lovable.app-1783513146954.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Critical inline CSS to prevent FOUC (header/footer flash before Tailwind loads) */}
        <style dangerouslySetInnerHTML={{ __html: `
          html,body{margin:0;padding:0;background:#fff;color:#111;font-family:Inter,system-ui,sans-serif;}
          header{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);}
          main{padding-top:80px;min-height:60vh;}
          footer{margin-top:auto;}
        `}} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <Navbar />
          <main className="pt-20">
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
          <Toaster position="top-center" richColors closeButton />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
