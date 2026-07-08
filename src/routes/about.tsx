import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import craftImg from "@/assets/craft.jpg";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — दो Taanke" },
      { name: "description", content: "The atelier, the craft, and the philosophy behind दो Taanke." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-5 py-24 text-center md:px-10">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-6 font-serif text-5xl md:text-7xl">Two stitches. One promise.</h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80">
          <span className="font-devanagari text-primary">दो</span> Taanke began in a small workshop in Lucknow, with a
          simple idea: that heritage embroidery deserves modern silhouettes, and that every stitch should be worth
          remembering.
        </p>
      </section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative h-[70vh] overflow-hidden">
        <img src={heroImg} alt="Craft" className="h-full w-full object-cover" />
      </motion.section>

      <section className="mx-auto grid max-w-6xl gap-16 px-5 py-24 md:grid-cols-2 md:px-10">
        <div>
          <p className="eyebrow">Craftsmanship</p>
          <h2 className="mt-4 font-serif text-4xl">Hands that remember.</h2>
          <p className="mt-6 leading-relaxed text-foreground/80">
            Our artisans have inherited their craft over generations. Each thread is measured, each motif drawn on
            tracing paper, each stitch guided by instinct as much as by design.
          </p>
        </div>
        <img src={craftImg} alt="Embroidery" className="rounded-2xl object-cover" loading="lazy" />
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { t: "Mission", d: "To bring hand-embroidered heirloom fashion to modern wardrobes, without compromise." },
              { t: "Vision", d: "A world where craft is celebrated, and slow fashion outlasts every trend." },
              { t: "Promise", d: "Every piece is signed by the artisan who made it. Every stitch, counted." },
            ].map((s) => (
              <div key={s.t}>
                <p className="eyebrow">{s.t}</p>
                <p className="mt-4 font-serif text-2xl leading-tight">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
