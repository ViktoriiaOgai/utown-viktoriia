import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import Input from "@/components/UI/Input";
import "@/App.css";
import AuthBtn from "@/components/UI/AuthBtn";
import Vector from "@/assets/icons/Vector.svg";
import BackButton from "@/components/UI/BackButton";
import Tel from "@/assets/icons/Tel.svg";


export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
  phone: "",
  password: "",
});

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
    <AuthLayout>
    <BackButton />
   <img src={Vector} alt="Vector" className="Vector" />
   
      <Input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={Tel}
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
     
      <AuthBtn 
       onClick={() => {
    if (validate()) {
      console.log("Form is valid");
    }
  }}
      type="submit">LogIn</AuthBtn>

      <div className="auth-links">
        <Link to="/recover">Forgot password? Recover</Link>
        <Link to="/register">Don't have an account?</Link>
      </div>
    </AuthLayout>
  );
}