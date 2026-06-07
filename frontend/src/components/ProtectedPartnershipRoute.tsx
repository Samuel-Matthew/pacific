import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { checkApplicationStatus } from "../api/partnerships";

interface ProtectedPartnershipRouteProps {
  children: ReactNode;
}

export const ProtectedPartnershipRoute = ({
  children,
}: ProtectedPartnershipRouteProps) => {
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // If not initialized or no user, deny access
      if (!isInitialized) {
        setIsLoading(true);
        return;
      }

      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has application or is partner
        const response = await checkApplicationStatus();

        if (response.success) {
          const { hasApplication, isPartner } = response.data;
          // Allow access if user has application OR is already a partner
          setHasAccess(hasApplication || isPartner);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error checking partnership application status:", error);
        // Default to deny access on error for security
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, isInitialized]);

  // Handle redirect when access is denied - TOP LEVEL EFFECT
  useEffect(() => {
    if (!isLoading && isInitialized && (!user || hasAccess === false)) {
      // Redirect to home and scroll to partnerships section
      navigate("/");
      // Use setTimeout to ensure home page is rendered before scrolling
      const timeoutId = setTimeout(() => {
        const element = document.getElementById("partnerships");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, isInitialized, user, hasAccess, navigate]);

  // Show loading state while checking
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-3 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // No user or no access - show redirect message
  if (!user || !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-3 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User has access - render the component
  return <>{children}</>;
};
