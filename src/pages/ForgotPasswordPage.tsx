import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-lg border border-border p-8">
            {sent ? (
              <div className="text-center">
                <span className="text-5xl">📧</span>
                <h1 className="text-2xl font-display font-bold text-foreground mt-4">Check Your Email</h1>
                <p className="text-muted-foreground font-body text-sm mt-2">We've sent a password reset link to <strong>{email}</strong></p>
                <Link to="/login" className="inline-flex items-center gap-2 mt-6 text-primary font-body font-semibold hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <span className="text-4xl">🔑</span>
                  <h1 className="text-2xl font-display font-bold text-foreground mt-2">Forgot Password?</h1>
                  <p className="text-muted-foreground font-body text-sm mt-1">Enter your email to receive a reset link</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border-none outline-none text-sm font-body focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                    Send Reset Link
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground font-body hover:text-primary">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
