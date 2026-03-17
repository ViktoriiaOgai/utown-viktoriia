import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/UI/Input";
import "@/App.css";
import AuthBtn from "@/components/UI/AuthBtn";
import Vector from "@/assets/icons/Vector.svg";
import BackButton from "@/components/UI/BackButton";
import { login } from "@/hooks/auth";
import { getErrorMessage } from "@/services/getErrorMessage";



export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
  phone: "",
  password: "",
});

const handleLogin = async () => {

  const isValid = validate();
  if (!isValid) return;

  try {
       const response = await login(phone, password);

        const { token, refreshToken, user } = response.data;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullName", user.fullName);

navigate("/home");
} catch (error) {
                  const message = getErrorMessage(error);

                  setErrors({
                    phone: "",
                    password: message || "Invalid phone number or password",
  });
}
};
  const validate = () => {
    const newErrors = {
      phone: "",
      password: "",
    };

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Only numbers allowed";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return !newErrors.phone && !newErrors.password;
  };

  return (
    <>
    <BackButton />
   <img src={Vector} alt="Vector" className="Vector" />
   
      <Input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        
        error={errors.phone}
        
      />
    
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isPassword
        error={errors.password}
      />
     
      <AuthBtn onClick={handleLogin}>
  LogIn
</AuthBtn>

      <div className="auth-links">
        <Link to="/recover">Forgot password? Recover</Link>
        <Link to="/register">Don't have an account?</Link>
      </div>
    </>
  );
}