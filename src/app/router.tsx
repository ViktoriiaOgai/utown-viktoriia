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

import EstablishmentsPage from "../pages/admin/establishments";
import AddEstablishmentPage from "../pages/admin/establishments/add";
import EditEstablishmentPage from "../pages/admin/establishments/[id]/edit";
import ProtectedRoute from "../components/ProtectedRoute";

const isAuth = !!localStorage.getItem("accessToken");

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
        element: isAuth ? <Home /> : <Navigate to="/login" />,
      },
      {
        path: "/favourites",
        element: <Favourites />,
      },
      {
        path: "/profile",
        element: <Profile />,
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
    path: "/admin/establishments",
    element: (
      <ProtectedRoute>
        <EstablishmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/establishments/add",
    element: (
      <ProtectedRoute>
        <AddEstablishmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/establishments/:id/edit",
    element: (
      <ProtectedRoute>
        <EditEstablishmentPage />
      </ProtectedRoute>
    ),
  },
]);