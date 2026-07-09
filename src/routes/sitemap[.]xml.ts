import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: products } = await supabase.from("products").select("slug").eq("active", true);
        const paths = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/shop", priority: "0.9", changefreq: "weekly" as const },
          { path: "/about", priority: "0.7", changefreq: "monthly" as const },
          { path: "/contact", priority: "0.6", changefreq: "monthly" as const },
          { path: "/faq", priority: "0.5", changefreq: "monthly" as const },
          { path: "/track", priority: "0.4", changefreq: "monthly" as const },
          ...(products ?? []).map((p) => ({ path: `/product/${p.slug}`, priority: "0.8", changefreq: "weekly" as const })),
        ];
        const urls = paths.map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
