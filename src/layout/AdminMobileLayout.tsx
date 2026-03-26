import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileSidebar from "@/components/admin-mobile/MobileSidebar";

export default function AdminMobileLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-layout">
      {/* КНОПКА */}
      <header style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
        <button onClick={() => setIsOpen(true)}>☰</button>
      </header>

      {/* SIDEBAR */}
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* СТРАНИЦЫ */}
      <main className="mobile-content">
        <Outlet />
      </main>
    </div>
  );
}