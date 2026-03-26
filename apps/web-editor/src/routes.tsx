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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <App />, // Hero is inside here
      },
      {
        path: "/editor",
        element: <div className="p-20 text-white">EDITOR_CANVAS_HERE</div>,
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
    ],
  },
]);
