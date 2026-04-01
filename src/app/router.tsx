import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import MobileLayout from "../layout/MobileLayout";
import Welcome from "../pages/client/Welcome";
import Login from "../pages/client/Login";
import Register from "../pages/client/Register";
import Recover from "../pages/client/RecoverPage";
import NewPassword from "@/pages/client/NewPassword";
import PasswordResetCode from "@/pages/client/PasswordResetCode";
import Home from "../pages/client/Home";
import Favourites from "../pages/client/Favourites";
import Profile from "../pages/client/Profile";
import AdminLogin from "../pages/AdminLogin";
import AdminHome from "../pages/admin/Home";
import AdminProfile from "../pages/admin/Profile";
import ProfileLayout from "@/layout/ProfileLayout";
import EstablishmentsPage from "../pages/admin/establishments";
import AddEstablishmentPage from "../pages/admin/establishments/add";
import EditEstablishmentPage from "../pages/admin/establishments/[id]/edit";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";
import AccountSettings from "@/pages/client/AccountSettings";
import PersonalInformation from "@/pages/client/PersonalInformation";
import ChangePassword from "@/pages/client/ChangePassword";
import {
  AdminClientsPage,
  AdminRidersPage,
  AdminOrdersPage,
  AdminServicesPage,
  AdminVacanciesPage,
} from "../pages/admin/AdminPlaceholders";
import Information from "@/pages/client/Information";
import ContactSupport from "@/pages/client/ContactSupport";
import Notifications from "@/pages/client/Notifications";

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
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Profile /> },

          {
            path: "account",
            element: <AccountSettings />,
          },
          {
            path: "account/personalInf",
            element: <PersonalInformation />,
          },
          {
            path: "account/password",
            element: <ChangePassword />,
          },
          {
            path: "information",
            element: <Information />,
          },
          {
            path: "contact",
            element: <ContactSupport />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/recover", element: <Recover /> },
      { path: "/reset-password", element: <NewPassword /> },
      { path: "/reset-code", element: <PasswordResetCode /> },
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
      { path: "clients", element: <AdminClientsPage /> },
      { path: "riders", element: <AdminRidersPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "services", element: <AdminServicesPage /> },
      { path: "vacancies", element: <AdminVacanciesPage /> },
      { path: "establishments", element: <EstablishmentsPage /> },
      { path: "establishments/add", element: <AddEstablishmentPage /> },
      { path: "establishments/:id/edit", element: <EditEstablishmentPage /> },
    ],
  },
]);
