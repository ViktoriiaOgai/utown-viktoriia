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
import AdminHome from "../pages/admin/Home";
import AdminProfile from "../pages/admin/Profile";

import EstablishmentsPage from "../pages/admin/establishments";
import AddEstablishmentPage from "../pages/admin/establishments/add";
import EditEstablishmentPage from "../pages/admin/establishments/[id]/edit";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";

function AdminClientsPage() {
  return <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Clients</div>;
}

function AdminRidersPage() {
  return <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Riders</div>;
}

function AdminOrdersPage() {
  return <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Orders</div>;
}

function AdminServicesPage() {
  return <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Services</div>;
}

function AdminVacanciesPage() {
  return <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Vacancies</div>;
}

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
    path: "/admin/home",
    element: (
      <AdminRoute>
        <AdminHome />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <AdminRoute>
        <AdminProfile />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/clients",
    element: (
      <AdminRoute>
        <AdminClientsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/riders",
    element: (
      <AdminRoute>
        <AdminRidersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <AdminRoute>
        <AdminOrdersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/services",
    element: (
      <AdminRoute>
        <AdminServicesPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/vacancies",
    element: (
      <AdminRoute>
        <AdminVacanciesPage />
      </AdminRoute>
    ),
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