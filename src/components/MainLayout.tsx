import { ReactNode } from "react";
import Header from "@/components/UI/Header";
import Sidebar from "@/components/Sidebar";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="adminLayout">
      <Sidebar />
      <div className="mainRight">
        <Header />
        <main className="pageContent">{children}</main>
      </div>
    </div>
  );
}
