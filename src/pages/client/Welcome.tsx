import "@/App.css";
import Button from "@/components/UI/Button";
import splash from "@/assets/images/Splashscreen.svg";

// Добавьте слово export перед функцией
export default function Welcome() {
  return (
    <div className="auth-container">
      <img className="splash-img" src={splash} alt="Splash" />

      <div className="buttons">
        <Button to="/login">Login</Button>
        <Button to="/register">Register</Button>
      </div>
    </div>
  );
}
