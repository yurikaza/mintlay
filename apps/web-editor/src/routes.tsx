import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import App from "./App";

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
    ],
  },
]);
