import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import App from "./App";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Security from "./pages/legal/Security";
import Compliance from "./pages/legal/Compliance";
import Docs from "./pages/resources/Docs";
import ApiReference from "./pages/resources/Api";
import Whitepaper from "./pages/resources/Whitepaper";
import Dashboard from "./pages/dashboard/Dashboard";
import Blueprints from "./pages/dashboard/Blueprints";
import { ProtectedRoute } from "./components/auth/AuthGuard";
import Home from "./pages/Home";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import BuilderPage from "./pages/builder/BuilderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },

      {
        path: "/enterprise",
        element: <Enterprise />,
      },
      {
        path: "/legal/terms",
        element: <Terms />,
      },
      {
        path: "/legal/privacy",
        element: <Privacy />,
      },
      {
        path: "/legal/security",
        element: <Security />,
      },
      {
        path: "/legal/compliance",
        element: <Compliance />,
      },
      {
        path: "/resources/docs",
        element: <Docs />,
      },
      {
        path: "/resources/whitepaper",
        element: <Whitepaper />,
      },
      {
        path: "/resources/api",
        element: <ApiReference />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />, // The Guard acts as a Parent
        children: [
          {
            // This handles the Dashboard Layout + Sidebar
            element: <DashboardLayout />,
            children: [
              {
                path: "", // /dashboard
                element: <Dashboard />,
              },
              {
                path: "blueprints", // /dashboard/blueprints
                element: <Blueprints />,
              },
            ],
          },
          {
            path: "builder/:projectId", // /dashboard/builder/123
            element: <BuilderPage />,
          },
        ],
      },
    ],
  },
]);
