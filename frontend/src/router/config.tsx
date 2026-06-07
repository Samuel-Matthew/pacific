import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import { ProtectedPartnershipRoute } from "../components/ProtectedPartnershipRoute";

const PartnershipDashboardPage = lazy(
  () => import("../pages/partnerships/dashboard.page"),
);
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));

// Admin pages
const AdminOverviewPage = lazy(() => import("../pages/admin/AdminOverview"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsers"));
const AdminPartnershipsPage = lazy(
  () => import("../pages/admin/AdminPartnerships"),
);
const AdminPaymentsPage = lazy(() => import("../pages/admin/AdminPayments"));
const AdminContactsPage = lazy(() => import("../pages/admin/AdminContacts"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/partnerships/dashboard",
    element: (
      <ProtectedPartnershipRoute>
        <PartnershipDashboardPage />
      </ProtectedPartnershipRoute>
    ),
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: <AdminOverviewPage />,
      },
      {
        path: "overview",
        element: <AdminOverviewPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "partnerships",
        element: <AdminPartnershipsPage />,
      },
      {
        path: "payments",
        element: <AdminPaymentsPage />,
      },
      {
        path: "contacts",
        element: <AdminContactsPage />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
