import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import MobileLayout from "../layout/MobileLayout";

import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recover from "../pages/RecoverPage";
import NewPassword from "../components/UI/NewPassword";
import Home from "../pages/Home";
import Favourites from "../pages/Favourites";
import Profile from "../pages/Profile";
import AdminLogin from "../pages/AdminLogin";

import EstablishmentsPage from "../pages/admin/establishments";
import AddEstablishmentPage from "../pages/admin/establishments/add";
import EditEstablishmentPage from "../pages/admin/establishments/[id]/edit";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/welcome" />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    element: <MobileLayout />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/favourites",
        element: (
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/recover", element: <Recover /> },
      { path: "/new", element: <NewPassword /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/establishments",
    element: (
      <AdminRoute>
        <EstablishmentsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/establishments/add",
    element: (
      <AdminRoute>
        <AddEstablishmentPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/establishments/:id/edit",
    element: (
      <AdminRoute>
        <EditEstablishmentPage />
      </AdminRoute>
    ),
  },
]);