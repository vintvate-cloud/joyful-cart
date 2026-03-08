import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Banknote, Smartphone, ArrowLeft, Check, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

import { useAuth } from "@/context/AuthContext";
import OrderInvoice from "@/components/orders/OrderInvoice";

type PaymentMethod = "card" | "upi" | "cod";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Form states
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");

  const codCharge = paymentMethod === "cod" ? total * 0.02 : 0; // 2% COD charge
  const shipping = total > 499 ? 0 : 49;
  const grandTotal = total + codCharge + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert("Please fill all card details");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID");
        return;
      }
    }

    setIsPlacing(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: grandTotal,
          paymentMethod,
          customerAddress: address,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();
      setOrderId(data.id);
      setPlacedOrder(data);
      setOrderPlaced(true);
      if (typeof clearCart === 'function') clearCart();
    } catch (error) {
      console.error('Checkout Error:', error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const validateAddress = () => {
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !state || !pincode) {
      alert("Please fill all delivery address fields");
      return false;
    }
    return true;
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <span className="text-6xl block mb-6 animate-bounce">🛒</span>
          <h1 className="text-3xl font-display font-black mb-4">Your cart is feeling lonely</h1>
          <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">Fill it up with some magical toys and treasures before they vanish!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-[2rem] font-display font-black hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Start the Hunt
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
            <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
              <Check className="h-12 w-12 text-emerald-500" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-display font-black mb-4">Victory is Yours! 🏆</h1>
          <p className="text-muted-foreground font-body mb-2 text-lg">Your order #{orderId?.slice(-8).toUpperCase()} has been successfully placed.</p>
          <p className="text-sm text-muted-foreground font-body mb-10 max-w-md mx-auto">
            Payment Method: <span className="text-foreground font-black uppercase tracking-widest text-[10px]">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Card"}</span> •
            Total: <span className="text-primary font-black">₹{grandTotal.toFixed(2)}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={`/profile?tab=orders`} className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-[2rem] font-display font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Track Order
            </Link>
            <button
              onClick={() => setShowInvoice(true)}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-foreground rounded-[2rem] font-display font-black text-sm hover:scale-105 transition-all"
            >
              View Invoice
            </button>
          </div>

          <p className="mt-12 text-muted-foreground font-body text-sm animate-pulse">
            An invoice for this order has been generated automatically for you!
          </p>

          <AnimatePresence>
            {showInvoice && placedOrder && (
              <OrderInvoice
                order={placedOrder}
                onClose={() => setShowInvoice(false)}
              />
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Keep Exploring
        </Link>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-display font-black transition-all ${step >= s ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>{s === 1 ? "Delivery Details" : "Final Step: Payment"}</span>
              {s < 2 && <div className={`w-16 h-[2px] rounded-full transition-all ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-xl">🏠</div>
                      <div>
                        <h2 className="font-display font-black text-xl">Shipping Details</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Where should we send the magic?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Full Name*</label>
                        <input required placeholder="Elon Musk" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Phone Number*</label>
                        <input required placeholder="+91 98765 43210" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Street Address*</label>
                        <input required placeholder="Apartment, suite, unit, etc." value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">City*</label>
                        <input required placeholder="Gotham" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">State*</label>
                        <input required placeholder="Metropolis" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">PIN Code*</label>
                        <input required placeholder="123456" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body transition-all" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (validateAddress()) setStep(2);
                      }}
                      className="mt-10 w-full md:w-auto px-10 py-4 bg-primary text-white rounded-[2rem] font-display font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      Process to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-xl">💳</div>
                      <div>
                        <h2 className="font-display font-black text-xl">Secure Checkout</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Safe & Encrypted Payments</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {([
                        { id: "card" as const, label: "Credit/Debit", icon: CreditCard, desc: "Global Cards" },
                        { id: "upi" as const, label: "UPI Pay", icon: Smartphone, desc: "Instant GPay/PPe" },
                        { id: "cod" as const, label: "Cash On Delivery", icon: Banknote, desc: "+2% Service Fee" },
                      ]).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}
                        >
                          <pm.icon className={`h-6 w-6 mb-3 ${paymentMethod === pm.id ? "text-primary" : "text-muted-foreground"}`} />
                          <p className="font-display font-black text-xs text-foreground uppercase tracking-widest">{pm.label}</p>
                          <p className="text-[10px] text-muted-foreground font-body font-medium mt-1">{pm.desc}</p>
                          {paymentMethod === pm.id && (
                            <motion.div layoutId="activeRule" className="absolute top-4 right-4 text-primary">
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handlePlaceOrder}>
                      <AnimatePresence mode="wait">
                        {paymentMethod === "card" && (
                          <motion.div key="card-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Card Number*</label>
                              <input required placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body tracking-[0.2em]" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Expiry Date*</label>
                                <input required placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">CVV*</label>
                                <input required placeholder="123" type="password" maxLength={4} value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Cardholder Name*</label>
                              <input required placeholder="Name as on card" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body" />
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === "upi" && (
                          <motion.div key="upi-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Unified Payments Interface (UPI)*</label>
                              <input required placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-accent/50 border border-transparent focus:border-primary/50 outline-none text-sm font-body" />
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                                <button key={app} type="button" className="px-6 py-3 rounded-2xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all">{app}</button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === "cod" && (
                          <motion.div key="cod-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6">
                              <p className="text-xs font-display font-black text-emerald-600 mb-2 uppercase tracking-widest">💰 Partial Cash on Delivery Activated</p>
                              <p className="text-[10px] text-muted-foreground font-body font-medium leading-relaxed">
                                Experience hassle-free delivery with our verified COD option. A small 2% convenience fee is applied to maintain our logistics chain.
                              </p>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-emerald-500/10">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Charge</span>
                                <span className="text-sm font-display font-black text-emerald-600">₹{codCharge.toFixed(2)}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                        <button type="button" onClick={() => setStep(1)} className="w-full sm:w-auto px-8 py-4 bg-accent text-foreground rounded-[2rem] font-display font-black text-sm hover:scale-105 transition-all">
                          Review Address
                        </button>
                        <button
                          disabled={isPlacing}
                          type="submit"
                          className="flex-1 w-full py-4 bg-primary text-white rounded-[2rem] font-display font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isPlacing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <ShieldCheck className="h-5 w-5" />
                              Finalize Order • ₹{grandTotal.toFixed(2)}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-[2.5rem] border border-border p-8 sticky top-24 shadow-sm">
              <h3 className="font-display font-black text-xl mb-8">Cart Contents</h3>
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-accent shrink-0 border border-border group-hover:scale-105 transition-transform duration-500">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.product.title}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Qty: {item.quantity} • ₹{item.product.price}</p>
                    </div>
                    <p className="text-sm font-display font-black text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Logistics</span>
                  <span className={shipping === 0 ? "text-emerald-500" : "text-foreground"}>{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                </div>
                {codCharge > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>COD Processing</span>
                    <span className="text-foreground">₹{codCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-display font-black text-foreground text-xl pt-4 border-t border-border">
                  <span>Total Due</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-muted/50 rounded-2xl">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">SSL Secure Checkout Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
