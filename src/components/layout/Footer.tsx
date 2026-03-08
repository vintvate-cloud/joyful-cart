import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧸</span>
              <span className="text-xl font-display font-bold text-background">Toy<span className="text-secondary">Box</span></span>
            </div>
            <p className="text-sm text-background/60 font-body">Making childhood magical with quality toys and kids products since 2024.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Shop</h4>
            <div className="space-y-2">
              {["Toys", "Clothes", "RC Cars", "Gifts", "Books"].map((item) => (
                <Link key={item} to={`/shop?category=${item}`} className="block text-sm text-background/60 hover:text-secondary transition-colors font-body">{item}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Company</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-background/60 hover:text-secondary transition-colors font-body">About Us</Link>
              <Link to="/blog" className="block text-sm text-background/60 hover:text-secondary transition-colors font-body">Blog</Link>
              <Link to={user?.role === 'ADMIN' ? "/admin/dashboard" : "/profile"} className="block text-sm text-background/60 hover:text-secondary transition-colors font-body">My Account</Link>
              <Link to="/login" className="block text-sm text-background/60 hover:text-secondary transition-colors font-body">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Stay Connected</h4>
            <p className="text-sm text-background/60 font-body mb-3">Subscribe for latest offers and new arrivals.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-xl bg-background/10 text-sm text-background placeholder:text-background/40 outline-none font-body" />
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold font-body hover:opacity-90 transition-opacity">Join</button>
            </div>
            <div className="flex gap-3 mt-4">
              {["📘", "📸", "🐦", "📺"].map((icon, i) => (
                <button key={i} className="text-xl hover:scale-110 transition-transform">{icon}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-8 pt-6 text-center text-sm text-background/40 font-body">
          © 2024 ToyBox. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
