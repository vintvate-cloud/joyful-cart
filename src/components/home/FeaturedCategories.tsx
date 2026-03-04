import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import { ArrowRight } from "lucide-react";

const colorMap: Record<string, string> = {
  "toy-orange": "bg-toy-orange/10 hover:bg-toy-orange/20 border-toy-orange/20",
  "toy-cyan": "bg-toy-cyan/10 hover:bg-toy-cyan/20 border-toy-cyan/20",
  "toy-purple": "bg-toy-purple/10 hover:bg-toy-purple/20 border-toy-purple/20",
  "toy-red": "bg-toy-red/10 hover:bg-toy-red/20 border-toy-red/20",
};

const FeaturedCategories = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-display font-bold text-foreground mb-2">Shop by Category</h2>
      <p className="text-muted-foreground font-body">Find exactly what you're looking for</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <Link
            to={`/shop?category=${cat.name}`}
            className={`block p-6 rounded-2xl border transition-all ${colorMap[cat.color] || "bg-muted hover:bg-muted/80 border-border"}`}
          >
            <span className="text-4xl mb-3 block">{cat.icon}</span>
            <h3 className="font-display font-semibold text-foreground text-lg">{cat.name}</h3>
            <p className="text-sm text-muted-foreground font-body mt-1">{cat.count} products</p>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-3" />
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturedCategories;
