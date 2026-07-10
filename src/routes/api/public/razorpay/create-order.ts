import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/razorpay/create-order")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const keyId = process.env.RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keyId || !keySecret) {
            return json({ error: "Razorpay not configured" }, 500);
          }

          const { orderNumber } = (await request.json()) as { orderNumber?: string };
          if (!orderNumber) return json({ error: "Missing orderNumber" }, 400);

          // Look up the order (server-side, with service role) to get authoritative amount
          const supabaseUrl = process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !serviceKey) return json({ error: "Server not configured" }, 500);
          const admin = createClient(supabaseUrl, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data: order, error } = await admin
            .from("orders")
            .select("id, order_number, total, payment_status")
            .eq("order_number", orderNumber)
            .maybeSingle();
          if (error || !order) return json({ error: "Order not found" }, 404);

          const amountPaise = Math.round(Number(order.total) * 100);
          if (amountPaise < 100) return json({ error: "Amount too low" }, 400);

          // Create Razorpay order
          const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
          const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: amountPaise,
              currency: "INR",
              receipt: order.order_number,
              notes: { order_number: order.order_number, order_id: order.id },
            }),
          });
          if (!rzpRes.ok) {
            const text = await rzpRes.text();
            console.error("Razorpay create order failed", rzpRes.status, text);
            return json({ error: "Razorpay error" }, 500);
          }
          const rzp = (await rzpRes.json()) as { id: string; amount: number; currency: string };

          // Persist razorpay_order_id
          await admin
            .from("orders")
            .update({ razorpay_order_id: rzp.id })
            .eq("id", order.id);

          return json({
            orderId: rzp.id,
            amount: rzp.amount,
            currency: rzp.currency,
            keyId,
          });
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
