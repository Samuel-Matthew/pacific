import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useToast } from "@/context/ToastContext";
import { forgotPassword } from "@/api/auth";

export default function ForgotPasswordModal() {
  const { closeForgotPassword, openLogin } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
      addToast("Check your email for the password reset link", "success");

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        closeForgotPassword();
      }, 3000);
    } catch (err: any) {
      // Always show generic message for security (don't reveal if email exists)
      setSuccess(true);
      addToast("Check your email for the password reset link", "success");
      setTimeout(() => {
        closeForgotPassword();
      }, 3000);
    } finally {
      setIsLoading(false);
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
            Reset Link Sent
          </h2>
          <p className="text-[#6b6b6b] text-sm mb-4">
            If an account exists with that email address, we've sent a password
            reset link.
          </p>
          <div className="bg-[#f8f8f6] border border-gray-100 rounded-xl px-5 py-4 text-left">
            <div className="flex items-start gap-3">
              <i className="ri-inbox-unarchive-line text-[#d4af37] text-lg flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  Check your email
                </p>
                <p className="text-[#6b6b6b] text-xs mt-0.5">
                  The reset link will expire in 15 minutes. Please check your
                  spam folder if you don't see it.
                </p>
              </div>
            </div>
          </div>
          <p className="text-[#6b6b6b] text-xs mt-4">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeForgotPassword}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md p-8 animate-[fadeScaleIn_0.2s_ease]">
        <button
          onClick={closeForgotPassword}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-base"></i>
        </button>

        <div className="mb-7">
          <p className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-1">
            Reset Password
          </p>
          <h2 className="text-2xl font-black text-[#1a1a1a]">
            Forgot Your Password?
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Enter your email address and we'll send you a link to reset it.
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6b6b6b] mt-5">
          Remember your password?{" "}
          <button
            onClick={() => {
              closeForgotPassword();
              openLogin();
            }}
            className="text-[#1a1a1a] font-semibold hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
