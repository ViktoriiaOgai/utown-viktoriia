import SplashScreen from "@/pages/SplashScreen";
import MobileLayout from "@/layout/MobileLayout";
import { useState, useEffect } from 'react';
import Welcome from "@/pages/Welcome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Recover from "./pages/RecoverPage";


function App() {
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  );
}

export default App;