import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileSidebar from "@/components/restaurateur/MobileSidebar";

export default function AdminMobileLayout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mobile-layout">
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <main className="mobile-content">
        <Outlet context={{ setIsOpen }} />
      </main>
    </div>
  );
}
