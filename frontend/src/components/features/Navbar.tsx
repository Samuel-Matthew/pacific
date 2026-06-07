import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useToast } from "@/context/ToastContext";

const publicLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
];

const privateLinks = [
  { label: "About", href: "#about" },
  { label: "Inventory", href: "#inventory" },
  { label: "Partners", href: "#partners" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
  { label: "Dashboard", href: "#dashboard" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, openLogin, openSignup, updateAvatar, deleteAccount } =
    useAuth();
  const { addToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      await updateAvatar(file);
      addToast("Profile photo updated successfully!", "success");
      setProfileOpen(false);
    } catch (error: any) {
      console.error("Avatar upload error:", error.message);
      addToast(
        error.message || "Failed to upload image. Please try again.",
        "error",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    setShowDeleteConfirm(false);
    setProfileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="https://public.readdy.ai/ai/img_res/70154d1f-be8f-47cc-a064-4284bd76349f.png"
              alt="Pacific Crowns Logo"
              className="h-20 md:h-20 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    scrolled
                      ? activeSection === link.href.replace("#", "")
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#1a1a1a] hover:bg-[#1a1a1a]/10"
                      : activeSection === link.href.replace("#", "")
                        ? "bg-white/20 text-white backdrop-blur-sm"
                        : "text-white hover:bg-white/15"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-[#1a1a1a] text-xs font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                  <i
                    className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${profileOpen ? "rotate-180" : ""} ${scrolled ? "text-[#1a1a1a]" : "text-white"}`}
                  ></i>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50 animate-[fadeScaleIn_0.15s_ease]">
                    {/* User Info */}
                    <div className="px-5 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-[#1a1a1a] text-sm font-black">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#1a1a1a] font-bold text-sm">
                            {user.name}
                          </p>
                          <p className="text-[#6b6b6b] text-xs truncate max-w-[140px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-2">
                      {/* Upload Photo */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#1a1a1a] hover:bg-gray-50 hover:disabled:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f0f0f0]">
                          {isUploadingAvatar ? (
                            <i className="ri-loader-4-line text-[#1a1a1a] text-sm animate-spin"></i>
                          ) : (
                            <i className="ri-camera-line text-[#1a1a1a] text-sm"></i>
                          )}
                        </div>
                        <span className="font-medium">
                          {isUploadingAvatar
                            ? "Uploading..."
                            : user.avatar
                              ? "Change Profile Photo"
                              : "Upload Profile Photo"}
                        </span>
                      </button>

                      {/* Dashboard */}
                      <button
                        onClick={() => {
                          navigate("/partnerships/dashboard");
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#1a1a1a] hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f0f0f0]">
                          <i className="ri-dashboard-line text-[#1a1a1a] text-sm"></i>
                        </div>
                        <span className="font-medium">Partner Dashboard</span>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          addToast("Signed out successfully!", "success");
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-[#1a1a1a] hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f0f0f0]">
                          <i className="ri-logout-box-r-line text-[#1a1a1a] text-sm"></i>
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>

                      {/* Delete Account */}
                      {/* <div className="mx-3 my-1 border-t border-gray-50"></div>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50">
                          <i className="ri-delete-bin-line text-rose-500 text-sm"></i>
                        </div>
                        <span className="font-medium">Delete Account</span>
                      </button> */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    scrolled
                      ? "text-[#1a1a1a] hover:bg-gray-100"
                      : "text-white hover:bg-white/15"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    scrolled
                      ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
                      : "bg-white text-[#1a1a1a] hover:bg-white/90"
                  }`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              scrolled
                ? "text-[#1a1a1a] hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i
              className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-3-line"}`}
            ></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } bg-white/98 backdrop-blur-md border-t border-gray-100`}
        >
          <ul className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-[#1a1a1a] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-gray-100 mt-1">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-[#1a1a1a] text-xs font-black">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[#1a1a1a] font-semibold text-sm">
                        {user.name}
                      </p>
                      <p className="text-[#6b6b6b] text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-gray-50 hover:disabled:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploadingAvatar ? (
                      <i className="ri-loader-4-line text-sm animate-spin"></i>
                    ) : (
                      <i className="ri-camera-line text-sm"></i>
                    )}
                    {isUploadingAvatar
                      ? "Uploading..."
                      : user.avatar
                        ? "Change Photo"
                        : "Upload Photo"}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/partnerships/dashboard");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 border border-gray-200 text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <i className="ri-dashboard-line text-sm"></i>
                    Partner Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-200 text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-rose-200 text-rose-500 text-sm font-semibold rounded-xl hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Delete Account
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      openLogin();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-200 text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openSignup();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white text-sm font-bold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
        disabled={isUploadingAvatar}
      />

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-8 text-center animate-[fadeScaleIn_0.2s_ease]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-rose-50 border-2 border-rose-200 mx-auto mb-5">
              <i className="ri-delete-bin-line text-rose-500 text-2xl"></i>
            </div>
            <h3 className="text-[#1a1a1a] font-black text-xl mb-2">
              Delete Account?
            </h3>
            <p className="text-[#6b6b6b] text-sm mb-6">
              This action is permanent and cannot be undone. All your data will
              be removed from Pacific Crowns.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors cursor-pointer whitespace-nowrap text-sm"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3 border border-gray-200 text-[#1a1a1a] font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
