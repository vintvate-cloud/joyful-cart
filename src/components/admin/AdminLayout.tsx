import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, LogOut, Menu, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, isLoading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const menuItems = [
        { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
        { icon: Package, label: "Products", href: "/admin/products" },
        { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
        { icon: Users, label: "Customers", href: "/admin/customers" },
        { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-3 mb-10 group">
                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="text-2xl">🧸</span>
                        </div>
                        <span className="text-2xl font-display font-black text-slate-900 tracking-tight">JoyBox <span className="text-[10px] uppercase font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">Admin</span></span>
                    </Link>

                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-display font-bold transition-all ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-bold text-slate-500 hover:bg-slate-100 mb-2">
                        <Home className="h-5 w-5 text-slate-400" /> Back to Store
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-display font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
                <span className="text-xl font-display font-black text-slate-900">JoyBox <span className="text-[10px] text-primary">Admin</span></span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className="md:hidden fixed inset-0 bg-white z-50 p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-2xl font-display font-black text-slate-900">JoyBox <span className="text-[10px] text-primary">Admin</span></span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X /></button>
                        </div>
                        <nav className="space-y-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-display font-bold ${location.pathname === item.href ? "bg-primary text-white" : "text-slate-500"
                                        }`}
                                >
                                    <item.icon className="h-6 w-6" /> {item.label}
                                </Link>
                            ))}
                        </nav>
                        <button
                            onClick={() => logout()}
                            className="mt-auto flex items-center gap-4 px-6 py-4 rounded-3xl text-lg font-display font-bold text-red-500"
                        >
                            <LogOut className="h-6 w-6" /> Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 w-full pt-16 md:pt-0 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
