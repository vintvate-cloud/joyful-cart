import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/50"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold font-body ${
            product.badge === "Sale" ? "bg-accent text-accent-foreground" :
            product.badge === "New" ? "bg-success text-success-foreground" :
            product.badge === "Hot" ? "bg-toy-red text-accent-foreground" :
            "bg-primary text-primary-foreground"
          }`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground font-body">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-muted-foreground font-body mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-sm text-card-foreground leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          <span className="text-xs font-semibold font-body text-card-foreground">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-display text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-body">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
