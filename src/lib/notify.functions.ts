import { createServerFn } from "@tanstack/react-start";

/**
 * Notify the shop owner (email + WhatsApp) when a new user signs up.
 * Runs server-side so credentials stay off the client.
 */
export const notifyOwnerNewSignup = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; name?: string }) => input)
  .handler(async ({ data }) => {
    const ownerEmail = "support@dotaanke.store";
    const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER ?? "918619780142";
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const waToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const name = data.name?.trim() || data.email.split("@")[0];
    const when = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
    const message = `🌸 New signup on दो Taanke\n\n👤 ${name}\n✉️ ${data.email}\n🕒 ${when}`;

    // WhatsApp (owner)
    if (phoneId && waToken) {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v20.0/${phoneId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${waToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: ownerPhone.replace(/[^0-9]/g, ""),
              type: "text",
              text: { body: message },
            }),
          }
        );
        if (!res.ok) console.warn("owner WA notify failed:", await res.text());
      } catch (err) {
        console.warn("owner WA notify exception:", err);
      }
    }

    // Owner email via the existing internal transactional route
    try {
      const origin = process.env.APP_URL ?? "https://dotaanke.store";
      await fetch(`${origin}/lovable/email/transactional/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
        },
        body: JSON.stringify({
          templateName: "owner-new-signup",
          recipientEmail: ownerEmail,
          idempotencyKey: `owner-signup-${data.email}`,
          templateData: { name, email: data.email, when },
        }),
      });
    } catch (err) {
      console.warn("owner email notify failed:", err);
    }

    return { ok: true };
  });
