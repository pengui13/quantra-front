"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  { src: "/hero-1.jpg", caption: "Capture alpha, not noise." },
  { src: "/hero-2.jpg", caption: "Clarity in every trend." },
  { src: "/hero-3.jpg", caption: "Signals, simplified." },
  { src: "/hero-4.jpg", caption: "Build your edge." },
];

export default function Carousel({ interval = 4500 }: { interval?: number }) {
  const [idx, setIdx] = useState(0);

  // auto-rotate
  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      interval
    );
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-[28px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[idx].src}
            alt={slides[idx].caption}
            fill
            priority
            className="object-cover"
          />

          {/* overlays */}
          <div className="absolute inset-0 bg-[#36C6E0]/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* caption + indicators */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-lg font-semibold drop-shadow">{slides[idx].caption}</p>
            <div className="mt-3 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 w-8 rounded-full transition ${
                    i === idx ? "bg-white/90" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
