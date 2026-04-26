import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import AdminPage from "../pages/admin/page";

const PartnershipDashboardPage = lazy(
  () => import("../pages/partnerships/dashboard.page"),
);
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/partnerships/dashboard",
    element: <PartnershipDashboardPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
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
