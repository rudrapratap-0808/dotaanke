import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/razorpay/verify")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keySecret) return json({ error: "Razorpay not configured" }, 500);

          const body = (await request.json()) as {
            razorpay_order_id?: string;
            razorpay_payment_id?: string;
            razorpay_signature?: string;
            orderNumber?: string;
          };
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;
          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderNumber) {
            return json({ error: "Missing fields" }, 400);
          }

          const expected = createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

          const a = Buffer.from(expected);
          const b = Buffer.from(razorpay_signature);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return json({ error: "Invalid signature" }, 400);
          }

          const supabaseUrl = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !serviceKey) return json({ error: "Server not configured" }, 500);
          const admin = createClient(supabaseUrl, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const { error } = await admin
            .from("orders")
            .update({
              razorpay_payment_id,
              razorpay_order_id,
              payment_status: "verified",
            })
            .eq("order_number", orderNumber)
            .eq("razorpay_order_id", razorpay_order_id);
          if (error) {
            console.error("Order update failed", error);
            return json({ error: "Could not update order" }, 500);
          }

          return json({ success: true });
        } catch (e) {
          console.error(e);
          return json({ error: "Server error" }, 500);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
