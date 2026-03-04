import { useState } from "react";
import { products } from "@/data/products";
import { BarChart3, Package, ShoppingCart, Users, Plus, Eye, Edit, Trash2, X, TrendingUp, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stats = [
  { label: "Total Revenue", value: "$12,450", icon: DollarSign, change: "+12.5%", color: "text-success" },
  { label: "Total Orders", value: "348", icon: ShoppingCart, change: "+8.2%", color: "text-primary" },
  { label: "Products", value: "156", icon: Package, change: "+3", color: "text-toy-orange" },
  { label: "Customers", value: "1,204", icon: Users, change: "+15.3%", color: "text-toy-purple" },
];

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col p-5">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🧸</span>
          <span className="text-xl font-display font-bold text-primary">ToyBox <span className="text-xs font-body text-muted-foreground">Admin</span></span>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Package, label: "Products", active: false },
            { icon: ShoppingCart, label: "Orders", active: false },
            { icon: Users, label: "Customers", active: false },
            { icon: TrendingUp, label: "Analytics", active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold font-body transition-all ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
              <item.icon className="h-4 w-4" />{item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground font-body">Welcome back! Here's your store overview.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm font-body hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs font-semibold font-body text-success">{s.change}</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl w-fit">
          {(["products", "orders"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-semibold font-body capitalize transition-all ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Product</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Category</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Price</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Rating</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-sm font-body text-foreground">{p.title}</p>
                            <p className="text-xs text-muted-foreground font-body">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><span className="px-2 py-1 rounded-lg bg-muted text-xs font-semibold font-body text-muted-foreground">{p.category}</span></td>
                      <td className="p-4 font-semibold font-body text-sm text-foreground">${p.price}</td>
                      <td className="p-4 text-sm font-body text-foreground">⭐ {p.rating}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                          <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-display font-semibold text-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground font-body mt-1">Orders will appear here when customers start shopping.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">Add Product</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Product Name", placeholder: "e.g. Rainbow Teddy Bear" },
                  { label: "Price ($)", placeholder: "0.00", type: "number" },
                  { label: "Category", placeholder: "Toys" },
                  { label: "Brand", placeholder: "PlayTime" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-semibold font-body text-foreground mb-1.5">{field.label}</label>
                    <input type={field.type || "text"} placeholder={field.placeholder} className="w-full px-4 py-2.5 rounded-xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold font-body text-foreground mb-1.5">Description</label>
                  <textarea placeholder="Describe the product..." className="w-full px-4 py-2.5 rounded-xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30 transition-all resize-none h-20" />
                </div>
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity">
                  Add Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
