import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileSidebar from "@/components/admin-mobile/MobileSidebar";

export default function AdminMobileLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-layout">
      <header style={{ padding: "10px", borderBottom: "1px solid #eee" }}></header>

      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <main className="mobile-content">
        <Outlet context={{ setIsOpen }} />
      </main>
    </div>
  );
}
