import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { Star, Minus, Plus, ChevronLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);

  if (!product) return (
    <div className="min-h-screen bg-background">
      <Header /><CartDrawer />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl font-display">Product not found</p>
        <Link to="/" className="text-primary underline mt-4 inline-block font-body">Go back home</Link>
      </div>
      <Footer />
    </div>
  );

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header /><CartDrawer />
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-body mb-6">
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-2xl overflow-hidden bg-muted">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-sm text-muted-foreground font-body">{product.brand}</span>
            <h1 className="text-3xl font-display font-bold text-foreground mt-1 mb-3">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-semibold font-body">{product.rating}</span>
              </div>
              {product.badge && <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold font-body">{product.badge}</span>}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-display font-bold text-primary">${product.price}</span>
              {product.originalPrice && <span className="text-lg text-muted-foreground line-through font-body">${product.originalPrice}</span>}
            </div>

            <p className="text-muted-foreground font-body mb-6 leading-relaxed">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <span className="text-sm font-semibold font-body text-foreground mb-2 block">Color</span>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === i ? "border-primary scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-semibold font-body text-foreground mb-2 block">Size</span>
                <div className="flex gap-2">
                  {product.sizes.map((s, i) => (
                    <button key={s} onClick={() => setSelectedSize(i)} className={`px-4 py-2 rounded-xl text-sm font-semibold font-body border transition-all ${selectedSize === i ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/30"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:bg-card rounded-lg transition-colors"><Minus className="h-4 w-4" /></button>
                <span className="font-bold font-body w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-1 hover:bg-card rounded-lg transition-colors"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => { for (let i = 0; i < qty; i++) addItem(product); }}
                className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
