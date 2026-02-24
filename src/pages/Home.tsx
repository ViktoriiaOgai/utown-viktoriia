import React from 'react';
import "@/App.css";
import Button from '@/components/UI/Button';


// Добавьте слово export перед функцией
export default function Home() {
  
  return (
    <div className="auth-container">
      <img className="splash-img" src="/Splashscreen.svg" alt="Splash" />

      <div className="buttons">
        <Button >Login</Button>
        <Button>Register</Button>
      </div>
    </div>
  );
}