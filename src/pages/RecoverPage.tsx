import { useState } from "react";
import Input from "../components/UI/Input";
import "@/App.css";
import BackButton from "@/components/UI/BackButton";
import AuthBtn from "@/components/UI/AuthBtn";
import Tel from "@/assets/icons/Tel.svg";
import { useNavigate} from "react-router-dom";
import { requestPasswordReset } from "@/hooks/auth";
import { getErrorMessage } from "@/services/getErrorMessage";

export default function Recover() {
  const navigate = useNavigate();
   const [phone, setPhone] = useState("");
   const [errors, setErrors] = useState({
  phone: "",
 
});

const handleRecover = async () => {
  if (!validate()) return;

  try {
    await requestPasswordReset(phone);

    // сразу переход
    navigate('/reset-code', {  state: { phone }
});

  } catch (error) {
    const message = getErrorMessage(error);

    setErrors({
      phone: message || "User with this phone not found",
    });
  }
};
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
    <>
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
        icon={Tel}
        error={errors.phone}
  />
  <AuthBtn onClick={handleRecover}>
  Reset password
</AuthBtn>

  </>
  );
}