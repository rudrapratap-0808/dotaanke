# दोTaanke

I reviewed your reference file. It uses a **premium, minimal, modern React + Vite + Tailwind design** with smooth animations, a full-screen hero section, elegant typography, and a clean layout. 

Use the prompt below with Cursor AI, Claude Code, Bolt.new, Lovable, v0, or any AI website builder.

---

# AI Website Generation Prompt

## Project

Create a premium luxury eCommerce website for my Indian fashion brand **"दो Taanke"**.

The website should look modern, premium, elegant, and highly animated.

Take inspiration from the attached reference website's architecture, typography, layout, smooth transitions, navbar, hero section, and overall premium feel, but redesign everything for a fashion clothing brand instead of SaaS. Use the same modern React + Tailwind development approach described in the reference. 

---

## Tech Stack

Use

* React 18
* Vite
* TypeScript
* TailwindCSS
* Lucide Icons
* React Router
* Framer Motion
* React Hook Form
* EmailJS or Nodemailer API
* Local Storage
* Context API
* Responsive Design
* Dark/Light mode

---

## Brand

Brand Name:

**दो Taanke**

Tagline:

**Every Stitch Tells A Story**

Theme:

Luxury
Minimal
Indian Fashion
Embroidery
Premium Experience

---

## Color Palette

Background

#FFFDF8

Primary

#6A1E2E

Gold

#D4AF37

Text

#1E1E1E

Light Grey

#F5F5F5

---

## Typography

Luxury serif heading

Clean sans-serif body

Lots of whitespace

Premium spacing

Rounded cards

Glassmorphism navbar

Smooth animations

---

## Products

### Embroidery Shirts

Price

₹799

Available Sizes

S

M

L

XL

XXL

Features

Premium Embroidery

100% Comfortable Fabric

Casual & Festive Wear

Free Shipping

---

### Embroidery Kurti

Price

₹899

Available Sizes

S

M

L

XL

XXL

Features

Designer Embroidery

Comfort Fit

Premium Cotton

Elegant Look

---

## Website Pages

### Home

Luxury Hero Banner

Featured Products

Best Seller

Shop by Category

New Arrival

Customer Reviews

Instagram Gallery

Newsletter

Footer

---

### Shop

Filters

Search

Sort

Category

Size

Price

Quick View

Wishlist

Add to Cart

---

### Product Page

Large Gallery

Zoom Image

Select Size

Quantity

Price

Description

Reviews

Related Products

Add to Cart

Buy Now

---

### About

Our Story

Craftsmanship

Embroidery Process

Mission

Vision

---

### Contact

Contact Form

WhatsApp Button

Google Map

Email

Phone

---

### FAQ

Shipping

Returns

Refund

Sizing

Payments

---

## Cart

Sliding Cart Drawer

Update Quantity

Remove Item

Coupon

Subtotal

Checkout

---

## Checkout

Customer Name

Phone

Email

Address

State

City

PIN Code

Order Summary

Demo Payment Button

---

## Payment

This website must use a **Demo Payment Gateway only**.

Do NOT integrate Razorpay, Stripe, PayPal or any real payment gateway.

When the user clicks

"Pay ₹799"

or

"Pay ₹899"

Show

✅ Payment Successful

Generate a fake Transaction ID.

Save order.

Redirect to Order Success Page.

---

## Order Success

Display

Order ID

Customer Name

Products

Size

Address

Transaction ID

Estimated Delivery

Continue Shopping

---

## Admin Email Notification

Whenever a customer places an order,

Automatically send an email to

**[myemail@example.com](mailto:myemail@example.com)**

using EmailJS or a backend Nodemailer API.

Email should contain:

Customer Name

Phone

Email

Shipping Address

Ordered Product

Size

Quantity

Price

Transaction ID

Order Date

Order Number

Payment Status

Also store the order in Local Storage (or Firebase if configured).

---

## Features

Wishlist

Recently Viewed

Product Search

Category Filter

Size Filter

Price Filter

Reviews

Ratings

Share Product

Responsive Mobile Design

Sticky Navbar

Sticky Buy Button

Smooth Scroll

Loading Animations

Skeleton Loader

Toast Notifications

Back To Top

SEO Friendly

Fast Performance

---

## Animations

Use Framer Motion.

Hero Fade

Slide Up

Image Hover Zoom

Button Ripple

Card Hover

Floating CTA

Smooth Page Transition

Scroll Reveal

Luxury Loading Animation

---

## Navbar

Logo

दो Taanke

Home

Shop

About

Contact

Cart Icon

Wishlist

Search

User

Sticky Navbar

Transparent over Hero

Glass Effect

---

## Footer

Brand Story

Quick Links

Customer Support

Social Media

Newsletter

Copyright

---

## Mobile

Fully Responsive

Hamburger Menu

Bottom Sticky Cart

Smooth Drawer

Touch Friendly

---

## Images

Use premium fashion placeholder images.

Use embroidered shirts.

Use embroidered kurtis.

Use Indian fashion lifestyle photography.

---

## Performance

90+ Lighthouse Score

Lazy Loading

Code Splitting

Optimized Images

Reusable Components

Clean Folder Structure

---

## Deliverables

Generate the complete production-ready project including:

* React + Vite + TypeScript
* TailwindCSS
* Responsive UI
* Product Data
* Shopping Cart
* Demo Checkout
* Fake Payment Gateway
* Order Success Page
* Email Notification Integration
* Clean reusable components
* Modern folder structure
* Well-commented code
* Easy deployment to Vercel or Netlify

**Note:** Replace `dotaanke@outlook.com ` phnno +91 7618516284 , 8742080780 with your real email address so order notifications are sent to you. If you later want to accept real payments, the demo payment flow can be replaced with a gateway like Razorpay or Stripe while keeping the rest of the site unchanged. refrence ### Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS 3.4**
- **lucide-react** for icons (`LogIn`, `UserPlus`, `Play`, `Sparkles`, `Menu`, `X`)
- No Framer Motion -- all animations are CSS `transition-*` classes

---

### Fonts (loaded in `index.html`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

```

Body/root font stack (in `index.css`):

```css
html, body, #root {
  height: 100%;
  margin: 0;
  font-family: 'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

---

### Video URL (CloudFront)

```
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4
```

---

### Color Palette

| Token | Hex |
|-------|-----|
| Dark green (text, buttons) | `#1f2a1d` |
| Medium dark green | `#2d3a2a` |
| Button hover | `#2a3827` |
| Body text green | `#4b5b47` |
| Heading primary | `#336443` |
| Heading accent | `#85AB8B` |
| Bottom-left text | `#3d5638` |
| Bottom-left button bg | `#3d5638`, hover `#2d4228` |

---

### Architecture

Two files:

1. **`BoomerangVideoBg.tsx`** -- captures video frames into canvas, then plays them forward/backward in a seamless boomerang loop at 30fps (960px max capture width).
2. **`App.tsx`** -- the full hero section.

---

### `BoomerangVideoBg.tsx` (exact)

```tsx
import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  className?: string;
};

export default function BoomerangVideoBg({ src, className }: Props) {
  const videoRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const [framesReady, setFramesReady] = useState(false);
  const framesRef = useRef([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const frames: HTMLCanvasElement[] = [];
    let capturing = true;
    let lastTime = -1;
    const MAX_WIDTH = 960;

    const captureFrame = () => {
      if (!capturing || video.readyState < 2) return;
      if (video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const scale = Math.min(1, MAX_WIDTH / vw);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      frames.push(canvas);
    };

    type VFCVideo = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    const vfcVideo = video as VFCVideo;
    const hasVFC = typeof vfcVideo.requestVideoFrameCallback === 'function';

    let rafId = 0;
    const rafLoop = () => {
      captureFrame();
      if (capturing) rafId = requestAnimationFrame(rafLoop);
    };

    const vfcLoop = () => {
      captureFrame();
      if (capturing && vfcVideo.requestVideoFrameCallback) {
        vfcVideo.requestVideoFrameCallback(vfcLoop);
      }
    };

    const onEnded = () => {
      capturing = false;
      if (frames.length > 0) {
        framesRef.current = frames;
        setFramesReady(true);
      }
    };

    const onLoaded = () => {
      video.play().catch(() => {});
      if (hasVFC) {
        vfcVideo.requestVideoFrameCallback!(vfcLoop);
      } else {
        rafId = requestAnimationFrame(rafLoop);
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded);
    if (video.readyState >= 1) onLoaded();

    return () => {
      capturing = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (!framesReady) return;
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const frames = framesRef.current;
    if (frames.length === 0) return;

    const first = frames[0];
    canvas.width = first.width;
    canvas.height = first.height;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    const interval = 1000 / 30;
    let rafId = 0;

    const render = (now: number) => {
      if (now - last >= interval) {
        last = now;
        ctx.drawImage(frames[index], 0, 0);
        index += direction;
        if (index >= frames.length - 1) {
          index = frames.length - 1;
          direction = -1;
        } else if (index <= 0) {
          index = 0;
          direction = 1;
        }
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady]);

  return (
    


      
      


    


  );
}
```

---

### `App.tsx` (exact)

```tsx
import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Play, Sparkles, Menu, X } from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '#mission', label: 'Purpose' },
    { href: '#how', label: 'The Process' },
    { href: '#pricing', label: 'Tariffs' },
  ];

  return (
    


      
      
        


          
            LinkFlowTM
          
        



        


          {navLinks.map((link, i) => (
            
              {link.label}
            
          ))}
          
            Try it Live
          
        



        


          
            
            Sign Me Up!
          
          
            
            Enter
          
           setMenuOpen((v) => !v)}
            className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-[#1f2a1d] transition-all duration-300 hover:bg-white/90"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            
            
          
        


      

      {/* Mobile menu overlay */}
      

 setMenuOpen(false)}
      >
        


      



      {/* Mobile menu drawer */}
      


        


          


            {navLinks.map((link, i) => (
               setMenuOpen(false)}
                className={`text-2xl font-semibold text-[#1f2a1d] py-4 border-b border-[#1f2a1d]/10 transition-all duration-500 ${
                  menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
              >
                {link.label}
              
            ))}
          



          


            
              
              Sign Me Up!
            
            
              
              Enter
            
            
              Try it Live
            
          


        


      



      {/* Hero copy */}
      


        


          Close the rift{' '}
          
            linking
            
 signals and action
          
        


        


          Shape scattered signals into meaningful outcomes via AI-driven workflows.
        


      



      {/* Bottom-left CTA block */}
      


        


          
          
            FluxEngineTM
          
        


        


          LinkFlow smoothly unites your company systems, streamlining data paths between services without having to write custom scripts.
        


        


          
            Try it Live
          
          
            Know More.
          
        


      



      {/* Bottom-right video link */}
      


        
          
        
        How we build?
        1:35
      


    


  );
}

export default App;
```

---

### Animation Details (all CSS, no Framer Motion)

| Element | Property | Values |
|---------|----------|--------|
| Hamburger Menu/X icon swap | `transition-all duration-300` | Open: Menu gets `opacity-0 rotate-90 scale-50`, X gets `opacity-100 rotate-0 scale-100`. Closed: reverse. |
| Mobile overlay backdrop | `transition-opacity duration-300` | Open: `opacity-100 pointer-events-auto`. Closed: `opacity-0 pointer-events-none`. |
| Mobile drawer slide | `transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]` | Open: `translate-x-0`. Closed: `translate-x-full`. |
| Mobile nav links stagger | `transition-all duration-500` | Open: `translate-x-0 opacity-100`, delay per item: `150ms + i * 70ms`. Closed: `translate-x-8 opacity-0`, delay `0ms`. |
| Mobile CTA group | `transition-all duration-500` | Open: `translate-x-0 opacity-100`, delay `400ms`. Closed: `translate-x-8 opacity-0`, delay `0ms`. |
| Nav buttons | `transition-colors` | Default Tailwind duration (150ms). |
| Opacity links | `transition-opacity` | `hover:opacity-80`. |

---

### Key Layout/Spacing Notes

- Root section: `relative w-full min-h-screen sm:h-screen overflow-hidden`
- Navbar padding: `px-4 sm:px-6 md:px-10 py-4 sm:py-6`
- Desktop pill nav: `bg-white/70 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60`
- Hero heading: `pt-24 sm:pt-28 md:pt-32`, font sizes `text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem]`, `leading-[0.95]`, `letterSpacing: '-0.035em'`
- Bottom-left block: `absolute left-4 right-4 sm:right-auto sm:left-6 md:left-10 bottom-6 sm:bottom-8 md:bottom-10`
- Bottom-right video: `absolute right-6 md:right-10 bottom-8 md:bottom-10`

---

### Dependencies (package.json)

```json
{
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dotaanke.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8333eb17-08b2-42af-910c-2f76df98b297).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
