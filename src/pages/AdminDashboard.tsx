import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Package, ShoppingCart, Users, Plus, Eye, Edit, Trash2, X, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: { name: string };
  brand: string;
  rating: number;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  revenueChange: string;
  ordersChange: string;
  productsChange: string;
  customersChange: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }


  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/admin/stats`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    }
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/products`, { credentials: 'include' });
      return res.json();
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const displayStats = [
    { label: "Total Revenue", value: `$${stats?.totalRevenue.toFixed(2) || "0.00"}`, icon: DollarSign, change: stats?.revenueChange || "0%", color: "text-success" },
    { label: "Total Orders", value: stats?.totalOrders.toString() || "0", icon: ShoppingCart, change: stats?.ordersChange || "0%", color: "text-primary" },
    { label: "Products", value: stats?.totalProducts.toString() || "0", icon: Package, change: stats?.productsChange || "0", color: "text-toy-orange" },
    { label: "Customers", value: stats?.totalUsers.toString() || "0", icon: Users, change: stats?.customersChange || "0%", color: "text-toy-purple" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col p-5">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-3xl">🧸</span>
          <span className="text-xl font-display font-bold text-primary tracking-tight">JoyBox <span className="text-[10px] uppercase font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">Admin</span></span>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Package, label: "Products", active: false },
            { icon: ShoppingCart, label: "Orders", active: false },
            { icon: Users, label: "Customers", active: false },
            { icon: TrendingUp, label: "Analytics", active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-bold transition-all ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"}`}>
              <item.icon className="h-4 w-4" />{item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-foreground tracking-tight">JoyLand Management</h1>
            <p className="text-sm text-muted-foreground font-body font-medium">Monitoring the happiness factory ✨</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-display font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25">
            <Plus className="h-5 w-5" /> Add New Toy
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {displayStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card p-6 rounded-3xl border border-border shadow-sm group hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors`}>
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <span className="text-xs font-black font-display text-success bg-success/10 px-2 py-1 rounded-full">{s.change}</span>
              </div>
              <p className="text-3xl font-display font-black text-foreground tracking-tight">{statsLoading ? "..." : s.value}</p>
              <p className="text-xs text-muted-foreground font-display font-bold uppercase tracking-widest mt-1 opacity-70">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted/50 p-1.5 rounded-2xl w-fit border border-border">
          {(["products", "orders"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-sm font-display font-bold capitalize transition-all ${activeTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {productsLoading ? (
                <div className="p-20 flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-display font-bold text-muted-foreground">Cataloging items...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="text-left p-5 text-xs font-display font-black text-muted-foreground uppercase tracking-widest">Product Details</th>
                      <th className="text-left p-5 text-xs font-display font-black text-muted-foreground uppercase tracking-widest">Category</th>
                      <th className="text-left p-5 text-xs font-display font-black text-muted-foreground uppercase tracking-widest">Price</th>
                      <th className="text-left p-5 text-xs font-display font-black text-muted-foreground uppercase tracking-widest">Rating</th>
                      <th className="text-right p-5 text-xs font-display font-black text-muted-foreground uppercase tracking-widest">Magic Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-inner">
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                            <div>
                              <p className="font-display font-bold text-sm text-foreground">{p.title}</p>
                              <p className="text-[10px] font-display font-black text-muted-foreground uppercase tracking-wider">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-[10px] font-display font-black text-primary uppercase tracking-widest">
                            {p.category.name}
                          </span>
                        </td>
                        <td className="p-5 font-display font-black text-sm text-primary">${p.price}</td>
                        <td className="p-5 text-sm font-display font-bold text-secondary">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {p.rating}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-primary"><Eye className="h-4 w-4" /></button>
                            <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-secondary"><Edit className="h-4 w-4" /></button>
                            <button
                              onClick={() => deleteProductMutation.mutate(p.id)}
                              className="p-2.5 rounded-xl hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ... Order section remains same ... */}
        {activeTab === "orders" && (
          <div className="bg-card rounded-3xl border border-border p-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-3xl">📦</div>
            <p className="font-display font-black text-2xl text-foreground mb-2">The Order Queue is Empty</p>
            <p className="text-base text-muted-foreground font-body max-w-sm mx-auto">Once the kids start their shopping adventure, their orders will appear here like magic!</p>
          </div>
        )}
      </div>

      {/* Add Product Modal (Updated to connect later) */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-card rounded-[2.5rem] shadow-2xl z-50 p-8 border border-border"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-black text-foreground tracking-tight">New Treasure ✨</h2>
                <button onClick={() => setShowModal(false)} className="p-3 bg-muted rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90"><X className="h-6 w-6" /></button>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="col-span-2">
                  <label className="block text-xs font-display font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Toy Name</label>
                  <input type="text" placeholder="e.g. Magical Unicorn Plus" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-2 border-transparent focus:border-primary/20 outline-none font-body font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-display font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Price ($)</label>
                  <input type="number" placeholder="29.99" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-2 border-transparent focus:border-primary/20 outline-none font-body font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-display font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Category ID</label>
                  <input type="text" placeholder="categoryId" className="w-full px-5 py-3.5 rounded-2xl bg-muted border-2 border-transparent focus:border-primary/20 outline-none font-body font-medium transition-all" />
                </div>
              </div>

              <button className="w-full py-5 bg-primary text-white rounded-3xl font-display font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30">
                ADD TO CATALOG 🚀
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
