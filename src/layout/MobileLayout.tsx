import Footer from "@/components/UI/Footer";
import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <div className="mobile-layout">
      <main className="mobile-content">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}