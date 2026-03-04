import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";

const ProductGridSection = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-display font-bold text-foreground mb-2">Trending Products</h2>
      <p className="text-muted-foreground font-body">Our most loved picks for your little ones</p>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  </section>
);

export default ProductGridSection;
