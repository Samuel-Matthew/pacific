import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/auth";
import { useToast } from "@/context/ToastContext";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
      addToast(
        "Password reset successfully! Redirecting to login...",
        "success",
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.message ||
        "Failed to reset password. Please try again or request a new reset link.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 mx-auto mb-5">
            <i className="ri-check-double-line text-emerald-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">
            Password Reset Complete
          </h2>
          <p className="text-[#6b6b6b] text-sm mb-6">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
          <p className="text-[#6b6b6b] text-xs">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl">
        <div className="mb-7">
          <p className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-1">
            Secure Password Reset
          </p>
          <h1 className="text-2xl font-black text-[#1a1a1a]">
            Create New Password
          </h1>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Enter a strong password to secure your account.
          </p>
        </div>

        {!token && (
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl mb-5">
            <i className="ri-error-warning-line text-rose-500 text-sm flex-shrink-0"></i>
            <p className="text-rose-600 text-sm">{error}</p>
          </div>
        )}

        {token && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
              <i className="ri-information-line text-blue-500 text-lg flex-shrink-0 mt-0.5"></i>
              <div>
                <p className="text-blue-900 text-xs font-semibold">
                  Password Requirements
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  At least 8 characters long
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                        showPw
                          ? "ri-eye-off-line text-lg"
                          : "ri-eye-line text-lg"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={isLoading || !token}
                className="w-full py-3.5 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap text-sm disabled:opacity-60 mt-2"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>

            <p className="text-center text-xs text-[#6b6b6b] mt-6">
              <i className="ri-time-line text-[#d4af37] mr-1"></i>
              Reset link expires in 15 minutes
            </p>
          </>
        )}

        {!token && (
          <div className="text-center">
            <p className="text-[#6b6b6b] text-sm mb-4">
              Would you like to request a new reset link?
            </p>
            <a
              href="/"
              className="text-[#d4af37] font-semibold hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              Go Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
