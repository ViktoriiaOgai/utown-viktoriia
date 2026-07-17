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

import { AdminRoute, ProtectedRoute, RestaurateurRoute } from "../components/ProtectedRoute";

import AccountSettings from "@/pages/client/AccountSettings";
import PersonalInformation from "@/pages/client/PersonalInformation";
import ChangePassword from "@/pages/client/ChangePassword";

import {
  AdminRidersPage,
  AdminServicesPage,
  AdminVacanciesPage,
} from "../pages/admin/AdminPlaceholders";

import OrdersPage from "../pages/admin/orders";
import EstablishmentPositionsPage from "../pages/admin/establishments/[id]/positions";
import AddPositionPage from "../pages/admin/establishments/[id]/positions/add";
import AddPositionNewPage from "../pages/admin/establishments/[id]/positions/new/add";
import EditPositionPage from "../pages/admin/establishments/[id]/positions/edit";

import ClientsPage from "@/pages/admin/clients";
import AddClientPage from "@/pages/admin/clients/add";
import EditClientPage from "@/pages/admin/clients/[id]/edit";

import Information from "@/pages/client/Information";
import ContactSupport from "@/pages/client/ContactSupport";
import Notifications from "@/pages/client/Notifications";

import EstablishmentCategoriesPage from "../pages/admin/establishments/[id]/positions/categories";
import AddCategoryPage from "../pages/admin/establishments/[id]/positions/categories/add";
import FoodMain from "@/pages/client/FoodMain";
import SearchPage from "@/pages/client/SearchPage";
import FiltersPage from "@/pages/client/FilterPage";
import EstablishPage from "@/pages/client/EstablishPage";
import EstablishmentPage from "@/pages/client/EstablishmentPage";
import DishPage from "@/pages/client/DishPage";
import CartPage from "@/pages/client/CartPage";
import OrderPaymentPage from "@/pages/client/OrderPaymentPage";
import OrderStatusPage from "@/pages/client/OrderStatusPage";
import MyOrdersPage from "@/pages/client/MyOrdersPage";
import RestaurateurOrdersPage from "@/pages/admin/mobile/restPages/RestaurateurOrdersPage";
import AcceptCookingPage from "@/pages/admin/mobile/restPages/AcceptCookingPage";
import OrderDetailsPage from "@/pages/admin/mobile/restPages/OrderDetailsPage";
import RejectOrderPage from "@/pages/admin/mobile/restPages/RejectOrderPage";

import RestaurateurLayout from "@/layout/RestaurateurLayout";
import RestaurateurHome from "@/pages/restaurateur/Home";
import {
  RestaurateurStatisticsPage,
  RestaurateurMenuPage,
  RestaurateurEstablishmentPage,
  RestaurateurNotificationsPage,
} from "@/pages/restaurateur/RestaurateurPlaceholders";
import HoursPage from "@/pages/restaurateur/HoursPage";
import HourEditPage from "@/pages/restaurateur/HourEditPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
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
        element: <Home />,
      },
      {
        path: "/favourites",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <Favourites />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/foodmain",
        element: <FoodMain />,
      },
      {
        path: "/establish",
        element: <EstablishPage />,
      },
      {
        path: "/establishment/:id",
        element: <EstablishmentPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/filters",
        element: <FiltersPage />,
      },
      {
        path: "/dish/:id",
        element: <DishPage />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:id/payment",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <OrderPaymentPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/order/:id/status",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <OrderStatusPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <ProfileLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Profile /> },
          { path: "account", element: <AccountSettings /> },
          { path: "account/personalInf", element: <PersonalInformation /> },
          { path: "account/password", element: <ChangePassword /> },
          { path: "information", element: <Information /> },
          { path: "contact", element: <ContactSupport /> },
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

  // RESTAURATEUR
  {
    path: "/restaurateur",
    element: (
      <RestaurateurRoute>
        <RestaurateurLayout />
      </RestaurateurRoute>
    ),
    children: [
      { path: "home", element: <RestaurateurHome /> },
      { path: "orders", element: <RestaurateurOrdersPage /> },
      { path: "orders/:orderId/details", element: <OrderDetailsPage /> },
      { path: "orders/:orderId/cooking", element: <AcceptCookingPage /> },
      {
        path: "/restaurateur/orders/:orderId/reject",
        element: <RejectOrderPage />,
      },
      { path: "statistics", element: <RestaurateurStatisticsPage /> },
      { path: "menu", element: <RestaurateurMenuPage /> },
      { path: "establishment", element: <RestaurateurEstablishmentPage /> },
      { path: "notifications", element: <RestaurateurNotificationsPage /> },
      { path: "hours", element: <HoursPage /> },
      { path: "hours/:day", element: <HourEditPage /> },
    ],
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

      { path: "clients", element: <ClientsPage /> },
      { path: "clients/add", element: <AddClientPage /> },
      { path: "clients/:id/edit", element: <EditClientPage /> },

      { path: "riders", element: <AdminRidersPage /> },

      { path: "orders", element: <OrdersPage /> },

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
