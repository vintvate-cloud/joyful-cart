import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Package, User, Calendar, Loader2, Search, CheckCircle2, Truck, Clock, AlertCircle, ChevronRight, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

interface OrderItem {
    id: string;
    product: { title: string; image: string; price: number };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    user: { name: string; email: string };
    total: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    items: OrderItem[];
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const statusConfigs = {
    PENDING: { color: "bg-amber-100 text-amber-600", icon: Clock },
    PROCESSING: { color: "bg-blue-100 text-blue-600", icon: Package },
    SHIPPED: { color: "bg-purple-100 text-purple-600", icon: Truck },
    DELIVERED: { color: "bg-emerald-100 text-emerald-600", icon: CheckCircle2 },
    CANCELLED: { color: "bg-slate-100 text-slate-500", icon: AlertCircle },
};

const Orders = () => {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data: orders = [], isLoading } = useQuery<Order[]>({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/admin/orders`, { credentials: 'include' });
            return res.json();
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const res = await fetch(`${API_URL}/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to update status');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success("Order status updated!");
        }
    });

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight mb-2">Order Queue</h1>
                    <p className="text-slate-500 font-body font-medium">Tracking the path of toys to their new homes 🚚</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders List */}
                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            <div className="p-20 flex flex-col items-center gap-4">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="font-display font-bold text-slate-400">Tracking packages...</p>
                            </div>
                        ) : orders.map((order) => {
                            const StatusIcon = statusConfigs[order.status].icon;
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`bg-white p-6 rounded-[2.5rem] border transition-all cursor-pointer group ${selectedOrder?.id === order.id ? 'border-primary shadow-xl shadow-primary/5' : 'border-slate-100 hover:border-primary/30 shadow-sm'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center relative">
                                                <ShoppingBag className="h-6 w-6 text-slate-300" />
                                                <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                                                    {order.items.reduce((acc, curr) => acc + curr.quantity, 0)}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-display font-black text-slate-900 leading-tight">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" /> {format(new Date(order.createdAt), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6">
                                            <div className="text-right">
                                                <p className="font-display font-black text-slate-900">${order.total.toFixed(2)}</p>
                                                <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-widest">{order.user.name.split(' ')[0]}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${statusConfigs[order.status].color}`}>
                                                <StatusIcon className="h-4 w-4" />
                                                {order.status}
                                            </div>
                                            <ChevronRight className={`h-5 w-5 transition-transform ${selectedOrder?.id === order.id ? 'translate-x-1 text-primary' : 'text-slate-300 group-hover:translate-x-2'}`} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {!isLoading && orders.length === 0 && (
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
                                <h2 className="text-2xl font-display font-black text-slate-900 mb-2">The Queue is Empty</h2>
                                <p className="text-slate-500 font-body max-w-sm mx-auto">Once the kids start their shopping adventure, their orders will appear here like magic!</p>
                            </div>
                        )}
                    </div>

                    {/* Order Details Panel */}
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 h-fit sticky top-10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-display font-black text-slate-900">Order Detail</h2>
                                    <button onClick={() => setSelectedOrder(null)} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-display font-black text-slate-900 text-sm">{selectedOrder.user.name}</p>
                                            <p className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest">{selectedOrder.user.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-widest mb-4">Toy Items</p>
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.product.image} className="w-10 h-10 rounded-xl object-cover bg-slate-100" />
                                                        <div>
                                                            <p className="text-xs font-display font-black text-slate-900 line-clamp-1">{item.product.title}</p>
                                                            <p className="text-[10px] font-display font-bold text-slate-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-display font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 space-y-4">
                                    <div className="flex justify-between items-center bg-slate-950 p-6 rounded-3xl text-white">
                                        <span className="text-[10px] font-display font-black uppercase tracking-widest opacity-60">Grand Total</span>
                                        <span className="text-2xl font-display font-black">${selectedOrder.total.toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-widest ml-1">Magic Status</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => statusMutation.mutate({ id: selectedOrder.id, status })}
                                                    disabled={statusMutation.isPending || selectedOrder.status === status}
                                                    className={`px-3 py-3 rounded-2xl text-[10px] font-display font-black transition-all ${selectedOrder.status === status
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="hidden lg:block bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center h-[500px] flex items-center justify-center">
                                <div>
                                    <p className="font-display font-black text-slate-300 text-lg uppercase tracking-widest">Select an order <br /> to view details</p>
                                    <div className="mt-4 flex justify-center"><ChevronRight className="h-10 w-10 text-slate-200 animate-pulse" /></div>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Orders;
