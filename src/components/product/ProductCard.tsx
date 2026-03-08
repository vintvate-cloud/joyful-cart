import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  brand: string;
  rating: number;
  badge?: string | null;
  description?: string;
  ageGroup?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-card rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 relative"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-display font-black uppercase tracking-widest shadow-lg ${product.badge === "Sale" ? "bg-accent text-accent-foreground" :
              product.badge === "New" ? "bg-success text-success-foreground" :
                product.badge === "Hot" ? "bg-toy-red text-accent-foreground" :
                  "bg-primary text-primary-foreground"
              }`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 rounded-full text-[10px] font-display font-black bg-secondary text-secondary-foreground shadow-lg uppercase tracking-widest">
              SAVE {discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-widest opacity-60">{product.brand}</span>
          <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
            <Star className="h-3 w-3 fill-secondary" />
            <span className="text-[10px] font-display font-black">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-black text-base text-card-foreground leading-tight mb-4 hover:text-primary transition-colors line-clamp-2 h-10">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-display font-black text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through font-body font-bold opacity-40">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center group/btn"
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover/btn:-rotate-12" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
