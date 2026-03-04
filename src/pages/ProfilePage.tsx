import { useState } from "react";
import { User, Mail, MapPin, Phone, Package, Heart, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const mockOrders = [
    { id: "ORD-001", date: "2024-01-15", total: 89.97, status: "Delivered", items: 3 },
    { id: "ORD-002", date: "2024-01-28", total: 49.99, status: "Shipped", items: 1 },
    { id: "ORD-003", date: "2024-02-05", total: 134.96, status: "Processing", items: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="bg-card rounded-3xl border border-border p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-display font-bold text-foreground">John Doe</h1>
              <p className="text-muted-foreground font-body text-sm flex items-center justify-center md:justify-start gap-1 mt-1">
                <Mail className="h-3.5 w-3.5" /> john@example.com
              </p>
              <p className="text-muted-foreground font-body text-sm flex items-center justify-center md:justify-start gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" /> Mumbai, India
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-body font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "profile" && (
            <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "John Doe", icon: User },
                  { label: "Email", value: "john@example.com", icon: Mail },
                  { label: "Phone", value: "+91 98765 43210", icon: Phone },
                  { label: "Address", value: "123 Main St, Mumbai, MH 400001", icon: MapPin },
                ].map((field) => (
                  <div key={field.label} className="space-y-1">
                    <label className="text-xs font-body text-muted-foreground">{field.label}</label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                      <field.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-body text-foreground">{field.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-sm hover:opacity-90 transition-opacity">
                Edit Profile
              </button>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground font-body">{order.date} • {order.items} items</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold ${
                      order.status === "Delivered" ? "bg-success/10 text-success" :
                      order.status === "Shipped" ? "bg-primary/10 text-primary" :
                      "bg-secondary/10 text-secondary-foreground"
                    }`}>{order.status}</span>
                    <span className="font-display font-bold text-foreground">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="bg-card rounded-3xl border border-border p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-muted-foreground">Your wishlist is empty</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Account Settings</h2>
              {["Email Notifications", "SMS Alerts", "Newsletter"].map((setting) => (
                <div key={setting} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <span className="text-sm font-body text-foreground">{setting}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-card after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
