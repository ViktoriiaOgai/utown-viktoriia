import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "@/components/UI/Input";
import AuthBtn from "@/components/UI/AuthBtn";
import BackButton from "@/components/UI/BackButton";
import lock from "@/assets/icons/lock.svg";
import eye from "@/assets/icons/eye.svg";
import { resetPassword } from "@/hooks/auth";
import Modal from "@/components/UI/Modal";

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
const [showModal, setShowModal] = useState(false);
  const phone = location.state?.phone;
const code = location.state?.code;

  useEffect(() => {
  if (!location.state) return;

  if (!phone || !code) {
    navigate("/recover");
  }
}, [location.state]);


  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    repeatPassword: "",
  });

  const validate = () => {
    const newErrors = {
      password: "",
      repeatPassword: "",
    };

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return !newErrors.password && !newErrors.repeatPassword;
  };

  const handleReset = async () => {
    if (!validate()) return;

    try {
      await resetPassword(phone!, code!, password);
      setShowModal(true);
    } catch (err) {
  console.error(err);

  setErrors({
    password: "Password reset failed",
    repeatPassword: "",
  });
}
  };

  return (
    <>
      <BackButton />

      <h2 className="auth-title">New password</h2>

      <label className="label">Password</label>

      <Input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={lock}
        iconRight={eye}
        isPassword
        error={errors.password}
      />

      <Input
        type="password"
        placeholder="Repeat password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        icon={lock}
        iconRight={eye}
        isPassword
        error={errors.repeatPassword}
      />

      <AuthBtn onClick={handleReset}>
        Reset password
      </AuthBtn>
       {showModal && (<Modal
            title="Password successfully reset"
            message="You can now log in with your new password"
            buttonText="Ok"
            onClose={() => navigate('/login')}
/>
)}
    </>
  );
}