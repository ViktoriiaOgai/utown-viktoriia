import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import Input from "@/components/UI/Input";
import "@/App.css";
import BackButton from "@/components/UI/BackButton";
import AuthBtn from "@/components/UI/AuthBtn";
import Tel from "@/assets/icons/Tel.svg";
import lock from "@/assets/icons/lock.svg";
import eye from "@/assets/icons/eye.svg";


export default function Register() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    repeatPassword: "",
  });

  const validate = () => {
    const newErrors = {
      phone: "",
      password: "",
      repeatPassword: "",
    };

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Only numbers allowed";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return !newErrors.phone && !newErrors.password && !newErrors.repeatPassword;
  };

  return (
    <AuthLayout>
  <BackButton />
  <h2 className="auth-title">User Registration</h2>
  <p className="auth-subtitle">
    Register to access all the benefits of the app
  </p>
 <label className="label">Phone Number</label>
  <Input
    type="tel"
        placeholder="Enter your phone number without dashes"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={Tel}
        error={errors.phone}
        
  />

   <label className="label">Password</label>

  <Input
    type="password"
    placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={lock}
        iconRight={eye}
        isPassword 
        error={errors.password}
  />

  <Input
    type="password"
    placeholder="Repeat your password"
    value={repeatPassword}
    onChange={(e) => setRepeatPassword(e.target.value)}
    icon={lock}
    iconRight={eye}
    isPassword 
    error={errors.password}
  />

  <AuthBtn onClick={() => {
    if (validate()) {
      console.log("Form is valid");
    }
  }}>Get Code</AuthBtn>

  <div className="auth-links">
    <Link to="/login">Already have an account?</Link>
  </div>

  <p className="auth-terms">
    By registering, you agree to the Terms of Service
    and Privacy Policy, as well as the Cookie Policy.
  </p>
</AuthLayout>
  );
}