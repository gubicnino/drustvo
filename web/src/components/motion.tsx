import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Mehka "fade-up" animacija ob vstopu v pogled.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// Vsebnik za zaporedno (stagger) animacijo otrok.
export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

export const item = fadeUp;

// Poskok ikone, ko starš (kartica) prejme stanje "hover".
export const iconHover: Variants = { hover: { scale: 1.15, rotate: -6 } };
export const iconSpring = { type: "spring", stiffness: 300, damping: 12 } as const;

/** Preprost ovoj: vsebina se nežno pojavi ob drsenju v pogled. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export { motion, useReducedMotion };
