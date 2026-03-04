import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { SlidersHorizontal, X } from "lucide-react";

const allCategories = ["All", ...new Set(products.map((p) => p.category))];
const allBrands = [...new Set(products.map((p) => p.brand))];
const ageGroups = ["0-2", "2-4", "4-6", "6-8", "8+"];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initialCat);
  const [brand, setBrand] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => products.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (brand !== "All" && p.brand !== brand) return false;
    if (ageGroup !== "All" && p.ageGroup !== ageGroup) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  }), [category, brand, ageGroup, priceRange]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">Brand</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setBrand("All")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${brand === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
          {allBrands.map((b) => (
            <button key={b} onClick={() => setBrand(b)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${brand === b ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">Age Group</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setAgeGroup("All")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${ageGroup === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
          {ageGroups.map((a) => (
            <button key={a} onClick={() => setAgeGroup(a)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${ageGroup === a ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {a} yrs
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm text-foreground mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input type="range" min="0" max="100" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="flex-1 accent-primary" />
          <span className="text-sm font-body text-muted-foreground">Up to ${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header /><CartDrawer />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Shop</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">{filtered.length} products</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-sm font-semibold font-body">
            {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="sticky top-32 bg-card p-5 rounded-2xl border border-border">
              <FilterPanel />
            </div>
          </aside>
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-display text-muted-foreground">No products found</p>
                <button onClick={() => { setCategory("All"); setBrand("All"); setAgeGroup("All"); setPriceRange([0, 100]); }} className="mt-4 text-primary underline font-body">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
