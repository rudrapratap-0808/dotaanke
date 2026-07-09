## Scope

Migrate the storefront from static data + localStorage to Lovable Cloud (auth + DB + storage), add an admin panel, and add a WhatsApp-based manual UPI payment flow with order tracking.

## Database (migrations)

Tables (all with RLS + GRANTs):

- `profiles` (id → auth.users, full_name, phone) — auto-created via trigger on signup.
- `user_roles` (user_id, role enum: `admin` | `customer`) + `has_role()` SECURITY DEFINER function. Admin role granted automatically to the single admin email on signup via trigger on verified email.
- `products` (id, name, slug, category, gender, price, original_price, description, sizes[], features[], badges[], image_url, video_url, gallery[], bestseller, new_arrival, active, created_at). Public SELECT for `active=true`; INSERT/UPDATE/DELETE admin only.
- `coupons` (id, code unique, discount_percent, active, created_at). Public SELECT of active; admin CRUD.
- `orders` (id, order_number, user_id nullable, customer_name, phone, email, address, city, state, pincode, items jsonb, subtotal, discount, total, coupon_code, payment_status enum `pending`|`awaiting_verification`|`verified`|`rejected`, tracking_status enum `placed`|`packed`|`shipped`|`out_for_delivery`|`delivered`|`cancelled`, tracking_number, notes, created_at, updated_at). Owner SELECT (by user_id or by public order_number+phone lookup), admin full access.
- `order_status_history` (order_id, status, note, created_at) — timeline for tracker.
- `payment_screenshots` (order_id, storage_path, uploaded_at) — optional upload if customer prefers vs WhatsApp.

Storage buckets (public read): `product-media` (images + videos), `payment-proofs` (private, admin read).

Site settings table `site_settings` (single row): admin UPI id, UPI QR image url, bank details, WhatsApp number, admin email.

## Auth

- Email/password + Google sign-in (default). `/auth` public route with sign-in + sign-up tabs.
- Customers can sign up, view order history at `/account`.
- `/admin/*` gated by `_authenticated` layout + `has_role(uid,'admin')` beforeLoad check.
- Sign-in affordance in navbar (Sign in ↔ account menu with Orders / Admin / Sign out).

## Admin panel (`/admin`)

Tabs:
1. **Products** — table with add/edit/delete. Form: name, category, gender, price, original price, description, sizes multi-select, features, badges, bestseller/new-arrival toggles, image upload (single), video upload (optional), gallery uploads (multi). Uploads go to `product-media` bucket via signed server function.
2. **Orders** — table of all orders with filters. Row expands to full details. Actions: mark payment `verified`/`rejected`, set `tracking_status`, set `tracking_number`, add note (writes to history). Verification action triggers a status update the customer sees on the tracker.
3. **Coupons** — list + create (code, %) + delete + toggle active.
4. **Settings** — UPI id, UPI QR image upload, bank details textarea, WhatsApp number (default +351930656040), admin email.

## Storefront wiring

- Home/Shop/Product pages fetch from `products` table (loader + `ensureQueryData`). Fallback to seed data via migration insert on first run.
- Coupon validation checks `coupons` table (not hardcoded).
- Checkout: creates an `orders` row with `payment_status='pending'`, returns `order_number`. Then navigates to `/pay/:orderNumber`.

## Payment flow (`/pay/:orderNumber`)

Page shows:
- Order summary + total.
- Big UPI QR image + UPI id (copy button) + bank details (fetched from `site_settings`).
- Two CTAs:
  1. **"I've paid — send screenshot on WhatsApp"** → opens `wa.me/351930656040` with AI-generated message (name, address, phone, order id, items, sizes, total) pre-filled. On click, we also flip `payment_status` to `awaiting_verification`.
  2. **"Upload screenshot here instead"** → optional file upload to `payment-proofs` bucket + same status flip.
- Confirmation copy after action: "Thanks! We'll verify your payment and update your tracker. — दो Taanke"
- The AI message is generated via Lovable AI (`google/gemini-2.5-flash-lite`) at checkout time and cached in the order row so the wa.me link is instant.

## Order tracking (`/track` and `/track/:orderNumber`)

- Public lookup by order number + phone.
- Signed-in customers see `/account` with all their orders and click through.
- Timeline UI showing: Placed → Payment verified → Packed → Shipped → Out for delivery → Delivered (with dates + admin notes + tracking number).

## Server functions

All under `src/lib/*.functions.ts`:
- `products.functions.ts` — `listProducts`, `getProduct`, admin `upsertProduct`, `deleteProduct`, `signedUploadUrl`.
- `orders.functions.ts` — `createOrder` (public/auth), `getOrderByNumber` (verifies phone), `listMyOrders` (auth), admin `listAllOrders`, `updateOrderStatus`, `verifyPayment`.
- `coupons.functions.ts` — `validateCoupon`, admin `listCoupons`, `createCoupon`, `deleteCoupon`, `toggleCoupon`.
- `settings.functions.ts` — public `getPublicSettings` (upi + whatsapp), admin `updateSettings`.
- `ai.functions.ts` — `generateWhatsappMessage` using Lovable AI gateway.

## Routes added

- `/auth` — sign in / sign up (email+password + Google).
- `/account` — customer order history (protected).
- `/admin` (index redirects to /admin/products), `/admin/products`, `/admin/orders`, `/admin/coupons`, `/admin/settings`.
- `/pay/$orderNumber` — payment page.
- `/track` — public lookup form.
- `/track/$orderNumber` — order tracker.

## Admin email

I'll ask you for the admin email in a follow-up before implementing (needed for the auto-grant trigger).

## Out of scope for this pass

- Server-side auto-send of WhatsApp messages (needs Twilio Business API — you chose wa.me deep link).
- Real payment gateway (Stripe/Razorpay) — this is manual UPI.
- Email/SMS notifications to admin — added later if you want.

## Ready to build

Reply "go" and I'll ship it. I'll ask for the admin email + your UPI QR image (optional — placeholder if not provided) at the start.