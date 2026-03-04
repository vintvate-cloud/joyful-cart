import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
    {/* Playful shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-secondary/30" />
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-40 right-[15%] w-14 h-14 rounded-2xl bg-accent/20 rotate-12" />
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-20 left-[20%] w-10 h-10 rounded-full bg-primary/20" />
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute top-32 right-[40%] w-8 h-8 rounded-lg bg-toy-green/25 rotate-45" />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-32 right-[25%] w-16 h-16 rounded-full bg-toy-orange/20" />
    </div>

    <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold font-body mb-6">
            🎉 New Arrivals Just Dropped!
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6"
        >
          Where Every Day
          <br />
          is <span className="text-primary">Play</span> Day! <span className="text-3xl md:text-5xl">✨</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground font-body mb-8 max-w-lg mx-auto"
        >
          Discover hand-picked toys, trendy kids clothes, and gifts that spark imagination and joy.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            Shop Now <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/shop?category=Gifts"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-card text-foreground rounded-2xl font-display font-semibold text-lg border-2 border-border hover:border-primary/30 transition-colors"
          >
            🎁 Gift Guide
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
