import { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import Input from "../components/UI/Input";
import "@/App.css";
import BackButton from "@/components/UI/BackButton";
import AuthBtn from "@/components/UI/AuthBtn";

export default function Recover() {
   const [phone, setPhone] = useState("");
   const [errors, setErrors] = useState({
  phone: "",
 
});

  const validate = () => {
    const newErrors = {
      phone: "",
     
    };

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Only numbers allowed";
    }

   setErrors(newErrors);

    return !newErrors.phone
  };

  return (
    <AuthLayout>
  <BackButton />

  <h2 className="auth-title">Recover Password</h2>
  <p className="auth-subtitle">
    Enter the phone number you regestered earlier
  </p>
 <label className="label">Phone Number</label>
  <Input
    type="tel"
    placeholder="Enter your phone number without dashes"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  />
{errors.phone && <p className="input-error">{errors.phone}</p>}
  <AuthBtn onClick={() => {
    if (validate()) {
      console.log("Form is valid");
    }
  }}>Reset password</AuthBtn>

  </AuthLayout>
  );
}