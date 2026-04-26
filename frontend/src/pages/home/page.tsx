import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/features/Navbar";
import Footer from "@/components/features/Footer";
import AuthModals from "@/components/features/AuthModal";
import HeroSection from "./components/HeroSection";
import Statsbar from "./components/Statsbar";
import MarqueeStrip from "./components/MarqueeStrip";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import WhyUsSection from "./components/WhyUsSection";
import FeaturedSection from "./components/FeaturedSection";
import InventorySection from "./components/InventorySection";
import PartnersSection from "./components/PartnersSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ContactSection from "./components/ContactSection";
import DashboardSection from "./components/DashboardSection";
import CompanyChartSection from "./components/CompanyChartSection";
import CTASection from "./components/CTASection";

export default function HomePage() {
  const { user, isInitialized } = useAuth();

  // Wait for auth to initialize
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect admin users to dashboard
  if (user && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AuthModals />
      <main>
        <HeroSection />
        <Statsbar />
        <MarqueeStrip />
        <ServicesSection />
        <WhyUsSection />
        <FeaturedSection />
        <CTASection />
        {user && (
          <>
            <AboutSection />
            <InventorySection />
            <PartnersSection />
            <TestimonialsSection />
            <ContactSection />
            <DashboardSection />
            <CompanyChartSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
