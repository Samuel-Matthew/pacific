import { useState, useEffect } from "react";
import { useAuth } from "@/context/useAuth";
import { useToast } from "@/context/ToastContext";
import ForgotPasswordModal from "./ForgotPasswordModal";

function LoginModal() {
  const { login, openSignup, openForgotPassword, closeModals, isLoading } =
    useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed.");
    } else {
      addToast("Login successful! Welcome back.", "success");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModals}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md p-8 animate-[fadeScaleIn_0.2s_ease]">
        <button
          onClick={closeModals}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-base"></i>
        </button>

        <div className="mb-7">
          <p className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-1">
            Welcome Back
          </p>
          <h2 className="text-2xl font-black text-[#1a1a1a]">
            Sign In to Pacific Crowns
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Access your account and explore our full collection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <i
                  className={
                    showPw ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"
                  }
                ></i>
              </button>
            </div>
            <button
              type="button"
              onClick={openForgotPassword}
              className="text-xs text-[#d4af37] hover:text-[#1a1a1a] transition-colors mt-2 cursor-pointer font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
              <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap text-sm disabled:opacity-60 mt-1"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b6b] mt-5">
          Don&apos;t have an account?{" "}
          <button
            onClick={openSignup}
            className="text-[#1a1a1a] font-semibold hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}

function SignupModal() {
  const { signup, openLogin, closeModals, isLoading } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const result = await signup(name, email, password);
    if (!result.success) {
      setError(result.error || "Signup failed.");
    } else {
      addToast(
        "Account created successfully! Welcome to Pacific Crowns.",
        "success",
      );
      setSuccess(true);
      setTimeout(() => closeModals(), 2500);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative bg-white rounded-2xl w-full max-w-md p-10 text-center animate-[fadeScaleIn_0.2s_ease]">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 mx-auto mb-5">
            <i className="ri-mail-check-line text-emerald-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">
            Welcome, {name.split(" ")[0]}!
          </h2>
          <p className="text-[#6b6b6b] text-sm mb-3">
            Your account has been created successfully.
          </p>
          <div className="bg-[#f8f8f6] border border-gray-100 rounded-xl px-5 py-4 text-left">
            <div className="flex items-start gap-3">
              <i className="ri-mail-send-line text-[#d4af37] text-lg flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  Welcome email sent!
                </p>
                <p className="text-[#6b6b6b] text-xs mt-0.5">
                  A welcome message has been dispatched to{" "}
                  <strong>{email}</strong> with your account details and next
                  steps.
                </p>
              </div>
            </div>
          </div>
          <p className="text-[#6b6b6b] text-xs mt-4">
            Redirecting you to the site...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModals}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md p-8 animate-[fadeScaleIn_0.2s_ease] max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModals}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-base"></i>
        </button>

        <div className="mb-7">
          <p className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-1">
            Join Us
          </p>
          <h2 className="text-2xl font-black text-[#1a1a1a]">
            Create Your Account
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Get full access to our inventory, partners, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <i
                  className={
                    showPw ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"
                  }
                ></i>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
              <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap text-sm disabled:opacity-60 mt-1"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b6b] mt-5">
          Already have an account?{" "}
          <button
            onClick={openLogin}
            className="text-[#1a1a1a] font-semibold hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AuthModals() {
  const { showLogin, showSignup, showForgotPassword } = useAuth();

  useEffect(() => {
    if (showLogin || showSignup || showForgotPassword) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin, showSignup, showForgotPassword]);

  if (showLogin) return <LoginModal />;
  if (showSignup) return <SignupModal />;
  if (showForgotPassword) return <ForgotPasswordModal />;
  return null;
}
