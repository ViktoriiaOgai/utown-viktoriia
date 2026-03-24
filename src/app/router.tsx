import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

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

const adminClientsPage = (
  <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Clients</div>
);

const adminRidersPage = (
  <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Riders</div>
);

const adminOrdersPage = (
  <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Orders</div>
);

const adminServicesPage = (
  <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Services</div>
);

const adminVacanciesPage = (
  <div style={{ padding: 32, fontSize: 24, fontWeight: 700 }}>Vacancies</div>
);

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
    path: "/admin",
    element: (
      <AdminRoute>
        <Outlet />
      </AdminRoute>
    ),
    children: [
      { path: "home", element: <AdminHome /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "clients", element: adminClientsPage },
      { path: "riders", element: adminRidersPage },
      { path: "orders", element: adminOrdersPage },
      { path: "services", element: adminServicesPage },
      { path: "vacancies", element: adminVacanciesPage },
      { path: "establishments", element: <EstablishmentsPage /> },
      { path: "establishments/add", element: <AddEstablishmentPage /> },
      { path: "establishments/:id/edit", element: <EditEstablishmentPage /> },
    ],
  },
]);