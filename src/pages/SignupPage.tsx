import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Phone, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const SignupPage = () => {
  const { refetchUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"SIGNUP" | "EMAIL_VERIFY" | "OTP_ENTRY">("SIGNUP");
  const [authMethod, setAuthMethod] = useState<"EMAIL" | "PHONE">("EMAIL");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || (authMethod === "EMAIL" ? !email : !phone)) {
      setError("Please fill in all fields");
      return;
    }
    if (authMethod === "EMAIL" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (authMethod === "EMAIL") {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (signupError) throw signupError;

        if (data.session) {
          // Already verified/logged in (autologin enabled in supabase)
          await syncWithBackend(data.session.access_token, password);
        } else {
          // Temporarily store password in session storage to sync after email link click
          sessionStorage.setItem('pending_password', password);
          setStep("EMAIL_VERIFY");
        }
      } else {
        // Phone verification via OTP
        const { error: phoneError } = await supabase.auth.signInWithOtp({
          phone: phone.startsWith("+") ? phone : `+91${phone}`, // Default to India if no code
          options: {
            data: { full_name: name },
          }
        });

        if (phoneError) throw phoneError;
        setStep("OTP_ENTRY");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);
    setError("");

    try {
      const { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: phone.startsWith("+") ? phone : `+91${phone}`,
        token: otp,
        type: 'sms'
      } as any);

      if (verifyErr) throw verifyErr;
      if (data.session) {
        await syncWithBackend(data.session.access_token);
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP code");
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithBackend = async (access_token: string, pass?: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/supabase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ access_token, password: pass }),
    });

    if (!res.ok) throw new Error("Could not sync profile with JoyLand server");
    await refetchUser();
    navigate("/");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Pricekam for the best kids products"
      emoji="🎉"
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 text-destructive text-sm font-body p-4 rounded-2xl mb-6 flex items-center gap-3 border border-destructive/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {step === "SIGNUP" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl mb-4 border border-border/50">
            <button
              type="button"
              onClick={() => setAuthMethod("EMAIL")}
              className={`flex-1 py-2 text-[10px] font-display font-black uppercase tracking-widest rounded-xl transition-all ${authMethod === "EMAIL" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Email Verified
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("PHONE")}
              className={`flex-1 py-2 text-[10px] font-display font-black uppercase tracking-widest rounded-xl transition-all ${authMethod === "PHONE" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Number Verified
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/50 border border-transparent outline-none text-sm font-body hover:bg-muted focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {authMethod === "EMAIL" ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/50 border border-transparent outline-none text-sm font-body hover:bg-muted focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-muted/50 border border-transparent outline-none text-sm font-body hover:bg-muted focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pb-2">
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-muted/50 border border-transparent outline-none text-sm font-body hover:bg-muted focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2 pb-2">
              <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="tel"
                  placeholder="+91 99999 99999"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/50 border border-transparent outline-none text-sm font-body hover:bg-muted focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 relative overflow-hidden group disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Initializing Verify...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{authMethod === "EMAIL" ? "Send Verification Email" : "Send Verification OTP"}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </button>
        </form>
      ) : step === "EMAIL_VERIFY" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-primary animate-bounce-custom" />
          </div>
          <h2 className="text-2xl font-display font-black text-foreground mb-4">Magic Link Sent! 🪄</h2>
          <p className="font-body text-muted-foreground mb-8 leading-relaxed">
            We've sent a verification email to <span className="text-primary font-bold">{email}</span>.
            Please click the link in the email to activate your JoyLand account.
          </p>
          <button
            onClick={() => setStep("SIGNUP")}
            className="text-sm font-display font-black text-primary uppercase tracking-widest hover:underline"
          >
            Wrong email? Change it
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-black text-foreground">Verify Your Number</h2>
            <p className="text-xs text-muted-foreground mt-1 px-4">Enter the 6-digit code we sent to your phone</p>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full py-5 rounded-2xl bg-muted/50 border-2 border-transparent outline-none text-4xl text-center font-display font-black tracking-[0.5em] focus:bg-card focus:border-primary/30 transition-all placeholder:text-muted-foreground/10"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-display font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Verify & Join <CheckCircle2 className="h-4 w-4" /></>}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep("SIGNUP")}
              className="text-xs font-display font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Didn't get code? Restart Signup
            </button>
          </div>
        </form>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" />

      <div className="mt-6 text-center text-sm font-body text-muted-foreground font-medium">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all hover:text-primary/80">Sign In</Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
