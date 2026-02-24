import SplashScreen from "@/pages/SplashScreen";
import MobileLayout from "@/layout/MobileLayout";
import { useState, useEffect } from 'react';
import Home from "@/pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    
    <MobileLayout>
      {isLoading ? <SplashScreen /> : <Home />}
    </MobileLayout>
    
        
  );
}

export default App;