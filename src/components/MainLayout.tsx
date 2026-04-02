import { ReactNode } from "react";
import AdminHeader from "@/components/UI/AdminHeader";
import Sidebar from "@/components/Sidebar";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="adminLayout">
      <Sidebar />
      <div className="mainRight">
        <AdminHeader />
        <main className="pageContent">{children}</main>
      </div>
    </div>
  );
}
