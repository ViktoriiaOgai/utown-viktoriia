import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import MobileLayout from "../layout/MobileLayout";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recover from "../pages/RecoverPage";
import NewPassword from "@/pages/NewPassword";
import PasswordResetCode from "@/pages/PasswordResetCode";
import Home from "../pages/Home";
import Favourites from "../pages/Favourites";
import Profile from "../pages/Profile";
import AdminLogin from "../pages/AdminLogin";
import AdminHome from "../pages/admin/Home";
import AdminProfile from "../pages/admin/Profile";
import ProfileLayout from "@/layout/ProfileLayout";
import EstablishmentsPage from "../pages/admin/establishments";
import AddEstablishmentPage from "../pages/admin/establishments/add";
import EditEstablishmentPage from "../pages/admin/establishments/[id]/edit";
import { AdminRoute, ProtectedRoute } from "../components/ProtectedRoute";
import AccountSettings from "@/pages/AccountSettings";
import PersonalInformation from "@/pages/PersonalInformation";
import ChangePassword from "@/pages/ChangePassword";
import {
  AdminClientsPage,
  AdminRidersPage,
  AdminOrdersPage,
  AdminServicesPage,
  AdminVacanciesPage,
} from "../pages/admin/AdminPlaceholders";
import EstablishmentCategoriesPage from "../pages/admin/establishments/[id]/positions/categories";
import AddCategoryPage from "../pages/admin/establishments/[id]/positions/categories/add";
import EstablishmentPositionsPage from "../pages/admin/establishments/[id]/positions.tsx";
import AddPositionPage from "../pages/admin/establishments/[id]/positions/add";
import EditPositionPage from "../pages/admin/establishments/[id]/positions/edit";
import AddPositionNewPage from "../pages/admin/establishments/[id]/positions/new/add";

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
            <ProfileLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Profile /> },
          { path: "account", element: <AccountSettings /> },
          { path: "account/personalInf", element: <PersonalInformation /> },
          { path: "account/password", element: <ChangePassword /> },
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
      { path: "establishments/:id/positions", element: <EstablishmentPositionsPage /> },
      { path: "establishments/:id/positions/add", element: <AddPositionPage /> },
      { path: "establishments/:id/positions/new/add", element: <AddPositionNewPage /> },
      { path: "establishments/:id/positions/:positionId/edit", element: <EditPositionPage /> },
      { path: "establishments/:id/positions/categories", element: <EstablishmentCategoriesPage /> },
      { path: "establishments/:id/positions/categories/add", element: <AddCategoryPage /> },
    ],
  },
]);
