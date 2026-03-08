import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Banknote, Smartphone, ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

type PaymentMethod = "card" | "upi" | "cod";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  // Form states
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");

  const codCharge = paymentMethod === "cod" ? total * 0.02 : 0; // 2% COD charge
  const shipping = total > 499 ? 0 : 49;
  const grandTotal = total + codCharge + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacing(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: grandTotal,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to place order');

      setOrderPlaced(true);
      if (typeof clearCart === 'function') clearCart();
    } catch (error) {
      console.error('Checkout Error:', error);
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <span className="text-5xl block mb-4">🛒</span>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground font-body mb-6">Add some products to checkout</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-display font-semibold hover:opacity-90 transition-opacity">
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-success" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Order Placed! 🎉</h1>
          <p className="text-muted-foreground font-body mb-2">Thank you for your order. (UI Demo)</p>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Payment: {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Card"} • Total: ₹{grandTotal.toFixed(2)}
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-display font-semibold hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground font-body hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className="text-sm font-body text-foreground hidden sm:block">{s === 1 ? "Address" : "Payment"}</span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card rounded-3xl border border-border p-6">
                    <h2 className="font-display font-bold text-lg text-foreground mb-4">Delivery Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Full Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="md:col-span-2 w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="PIN Code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <button onClick={() => setStep(2)} className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-display font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card rounded-3xl border border-border p-6">
                    <h2 className="font-display font-bold text-lg text-foreground mb-4">Payment Method</h2>

                    {/* Payment options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      {([
                        { id: "card" as const, label: "Card", icon: CreditCard, desc: "Debit / Credit" },
                        { id: "upi" as const, label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe" },
                        { id: "cod" as const, label: "COD", icon: Banknote, desc: "Partial COD (+2%)" },
                      ]).map((pm) => (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}
                        >
                          <pm.icon className={`h-5 w-5 mb-2 ${paymentMethod === pm.id ? "text-primary" : "text-muted-foreground"}`} />
                          <p className="font-display font-bold text-sm text-foreground">{pm.label}</p>
                          <p className="text-xs text-muted-foreground font-body">{pm.desc}</p>
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handlePlaceOrder}>
                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <input placeholder="Card Number" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                          <div className="grid grid-cols-2 gap-4">
                            <input placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                            <input placeholder="CVV" type="password" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <input placeholder="Cardholder Name" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div className="space-y-4">
                          <input placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30" />
                          <div className="flex gap-3">
                            {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                              <button key={app} type="button" className="px-4 py-2 rounded-xl border border-border text-xs font-body font-semibold text-foreground hover:border-primary/30 transition-colors">{app}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {paymentMethod === "cod" && (
                        <div className="bg-secondary/10 rounded-2xl p-4">
                          <p className="text-sm font-body text-foreground mb-2">💰 <strong>Partial COD</strong></p>
                          <p className="text-xs text-muted-foreground font-body">
                            Pay a small convenience fee of 2% for Cash on Delivery. The remaining amount will be collected at the time of delivery.
                          </p>
                          <p className="text-sm font-display font-bold text-foreground mt-3">COD Charge: ₹{codCharge.toFixed(2)}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-6">
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-muted text-foreground rounded-2xl font-display font-semibold text-sm hover:bg-muted/80 transition-colors">
                          Back
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-display font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                          <ShieldCheck className="h-4 w-4" /> Place Order • ₹{grandTotal.toFixed(2)}
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
            <div className="bg-card rounded-3xl border border-border p-6 sticky top-24">
              <h3 className="font-display font-bold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-foreground truncate">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-display font-bold text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm font-body">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                {codCharge > 0 && <div className="flex justify-between text-muted-foreground"><span>COD Charge</span><span>₹{codCharge.toFixed(2)}</span></div>}
                <div className="flex justify-between font-display font-bold text-foreground text-base pt-2 border-t border-border"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
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
