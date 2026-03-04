import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Gift } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
    {/* Animated background shapes */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-16 left-[8%] w-24 h-24 rounded-3xl bg-secondary/20 blur-sm" />
      <motion.div animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-32 right-[12%] w-16 h-16 rounded-full bg-accent/25" />
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-16 left-[25%] w-12 h-12 rounded-full bg-primary/15" />
      <motion.div animate={{ y: [0, 18, 0], x: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute top-24 right-[35%] w-10 h-10 rounded-2xl bg-success/20 rotate-45" />
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute bottom-24 right-[20%] w-20 h-20 rounded-full border-2 border-dashed border-primary/15" />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-48 left-[50%] w-8 h-8 rounded-lg bg-toy-orange/20 rotate-12" />
    </div>

    <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-semibold font-body mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-foreground">New Arrivals Just Dropped!</span>
            <Gift className="h-4 w-4 text-secondary" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6"
        >
          Where Every Day
          <br />
          is{" "}
          <span className="relative inline-block">
            <span className="text-primary">Play</span>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-3 bg-secondary/30 -z-10 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </span>{" "}
          Day!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-body mb-10 max-w-xl mx-auto"
        >
          Discover hand-picked toys, trendy kids clothes, and gifts that spark imagination and endless joy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-display font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Shop Now <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/shop?category=Gifts"
            className="inline-flex items-center gap-2 px-10 py-4 bg-card text-foreground rounded-2xl font-display font-bold text-lg border-2 border-border hover:border-primary/30 transition-all hover:-translate-y-0.5"
          >
            🎁 Gift Guide
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground font-body"
        >
          {[
            { icon: "🚚", text: "Free Shipping 499+" },
            { icon: "🔒", text: "Secure Payments" },
            { icon: "↩️", text: "Easy Returns" },
          ].map((badge) => (
            <span key={badge.text} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 border border-border/50">
              <span>{badge.icon}</span>
              {badge.text}
            </span>
          ))}
          <span className="flex items-center gap-1 px-4 py-2 rounded-xl bg-card/80 border border-border/50">
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <span className="ml-1">10K+ Reviews</span>
          </span>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
