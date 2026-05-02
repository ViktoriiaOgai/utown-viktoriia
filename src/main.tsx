import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import SplashScreen from "@/pages/client/SplashScreen";
import { CartProvider } from "@/context/CartProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

function Root() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <CartProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

export default Root;
