import { createServerFn } from "@tanstack/react-start";

/**
 * Send a plain WhatsApp text message via Meta Cloud API.
 * NOTE: free-form text only works inside a 24-hour customer conversation window;
 * outside that window, WhatsApp requires an approved template.
 */
export const sendWhatsapp = createServerFn({ method: "POST" })
  .inputValidator((input: { to: string; message: string }) => input)
  .handler(async ({ data }) => {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    if (!phoneId || !token) {
      return { ok: false, error: "WhatsApp API not configured" };
    }
    const to = data.to.replace(/[^0-9]/g, "");
    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: data.message.slice(0, 4096) },
          }),
        }
      );
      const body = await res.text();
      if (!res.ok) {
        console.error(`WhatsApp send failed [${res.status}]: ${body}`);
        return { ok: false, error: `${res.status}: ${body.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      console.error("WhatsApp send exception:", msg);
      return { ok: false, error: msg };
    }
  });
