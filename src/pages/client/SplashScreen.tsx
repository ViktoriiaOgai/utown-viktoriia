import splashImg from "@/assets/images/Splashscreen.svg"; // Переименовали импорт
import "@/App.css";


export default function SplashScreen() {
 
  return (
    <div className="splash">
      <img src={splashImg} alt="Splash Screen" />
    </div>
  );
}