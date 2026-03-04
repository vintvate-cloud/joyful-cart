import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Search Products</h1>

          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for toys, clothes, gifts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border outline-none text-base font-body focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {query.trim() && (
            <p className="text-sm text-muted-foreground font-body mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for "<strong>{query}</strong>"
            </p>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="font-display font-bold text-foreground text-lg">No products found</p>
              <p className="text-muted-foreground font-body text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">✨</span>
              <p className="font-display font-bold text-foreground text-lg">Start typing to search</p>
              <p className="text-muted-foreground font-body text-sm mt-1">Find toys, clothes, gifts and more</p>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
