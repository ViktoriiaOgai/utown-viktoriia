import { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import AuthBtn from "@/components/UI/AuthBtn";
import BackButton from "@/components/UI/BackButton";

import CodeInput from "@/components/UI/CodeInput";
import "@/pages/client/PasswordResetCode.css";
import { requestPasswordReset } from "@/hooks/auth";


export default function PasswordResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  if (!phone) {
    navigate('/recover');
  }
}, [phone,  navigate]);
  const handleContinue = () => {
  if (code.length !== 6) {
    setError("Enter full code");
    return;
  }

    navigate('/reset-password', {
  state: { phone, code }
})
  };
  const [timeLeft, setTimeLeft] = useState(60);

useEffect(() => {
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft]);
const formatTime = (sec: number) => {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
};
const handleResend = async () => {
  try {
    await requestPasswordReset(phone!);
    setTimeLeft(60); // перезапуск таймера
  } catch {
    setError("Failed to resend code");
  }
};
  return (
    <>
      <BackButton />

      <h2 className="auth-title">Password reset code</h2>

      <p className="auth-subtitle">
        We have sent the password reset code to your phone number
      </p>

     
      <CodeInput onComplete={(value) => setCode(value)} />
        {error && <p className="error-text">{error}</p>}
        <div className="timer">
  {timeLeft > 0 ? (
    <p>{formatTime(timeLeft)}</p>
  ) : (
    <button className="resend-btn" onClick={handleResend}>
      Didn’t receive the code? Try again
    </button>
    
  )}
</div>
    
      <AuthBtn onClick={handleContinue}>
        Confirm
      </AuthBtn>
     
    </>
  );
}