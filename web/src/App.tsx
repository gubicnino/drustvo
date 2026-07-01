import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Pohodi } from "./pages/Pohodi";
import { PohodDetail } from "./pages/PohodDetail";
import { Galerija } from "./pages/Galerija";
import { ODrustvu } from "./pages/ODrustvu";
import { Kontakt } from "./pages/Kontakt";
import { NotFound } from "./pages/NotFound";
import { Login } from "./admin/Login";
import { AdminLayout } from "./admin/AdminLayout";
import { Dashboard } from "./admin/Dashboard";
import { HikesList } from "./admin/HikesList";
import { HikeForm } from "./admin/HikeForm";
import { GalleryManager } from "./admin/GalleryManager";
import { SocietyForm } from "./admin/SocietyForm";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "pohodi", element: <Pohodi /> },
      { path: "pohodi/:slug", element: <PohodDetail /> },
      { path: "galerija", element: <Galerija /> },
      { path: "o-drustvu", element: <ODrustvu /> },
      { path: "kontakt", element: <Kontakt /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, element: <Login /> },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "pohodi", element: <HikesList /> },
          { path: "pohodi/nov", element: <HikeForm /> },
          { path: "pohodi/uredi/:id", element: <HikeForm /> },
          { path: "galerija", element: <GalleryManager /> },
          { path: "drustvo", element: <SocietyForm /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
