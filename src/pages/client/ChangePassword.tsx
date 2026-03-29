import { useState} from "react";
import { useNavigate} from "react-router-dom";
import Input from "@/components/UI/Input";
import AuthBtn from "@/components/UI/AuthBtn";
import lock from "@/assets/icons/lock.svg";
import eye from "@/assets/icons/eye.svg";
import { changePassword } from "@/hooks/auth";
import Modal from "@/components/UI/Modal";
import  "@/pages/client/ChangePassword.css";
import MobileHeader from "@/components/UI/Header";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

 const [errors, setErrors] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

 const validate = () => {
  const newErrors = {
    currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  };

  if (!currentPassword) {
    newErrors.currentPassword = "Current password is required";
  }

  if (newPassword.length < 6) {
    newErrors.newPassword = "Password must be at least 6 characters";
  }

  if (newPassword !== confirmPassword) {
    newErrors.newPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  return !newErrors.currentPassword && !newErrors.newPassword;
};

const handleSave = async () => {
  if (!validate()) return;

  try {
    await changePassword({
      oldPassword: currentPassword,
      newPassword,
      confirmPassword,
    });

    setShowModal(true);
  } catch (err) {
    console.error(err);

   setErrors({
  currentPassword: "Password change failed",
  newPassword: "",
  confirmPassword: "",
});
  }
};

  return (
    <>
      
      <div className="password">
        <MobileHeader logoVariant="gradient" showBack/>
      <h2 className="auth-title">Password</h2>

      <label className="label">Current Password</label>
<Input
  type="password"
  placeholder="Enter current password"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
  icon={lock}
  iconRight={eye}
  isPassword
  />

<label className="label">New Password</label>
<Input
  type="password"
  placeholder="Enter new password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  icon={lock}
  iconRight={eye}
  isPassword
  error={errors.newPassword}
/>

<label className="label">Repeat Password</label>
<Input
  type="password"
  placeholder="Repeat password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  icon={lock}
  iconRight={eye}
  isPassword
  error={errors.newPassword}
/>

      <AuthBtn onClick={handleSave}>
        Save
      </AuthBtn>
       {showModal && (<Modal
            title="Password successfully change"
            message="You can now log in with your new password"
            buttonText="Ok"
            onClose={() => navigate('/profile')}
/>
)}
</div>
    </>
  );
}