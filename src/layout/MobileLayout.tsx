import Footer from "@/components/UI/Footer";
import { Outlet, useLocation } from "react-router-dom";
import "@/layout/MobileLayout.css";

export default function MobileLayout() {
  const location = useLocation();

  const hideFooter =
    location.pathname.startsWith("/foodmain") ||
    location.pathname.startsWith("/establishment") ||
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/orders") ||
    (location.pathname.includes("/order/") &&
      (location.pathname.includes("/payment") || location.pathname.includes("/status")));

  return (
    <div className="mobile-layout">
      <main className="mobile-content">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
