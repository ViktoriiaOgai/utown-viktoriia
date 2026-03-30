import Pic from "@/assets/images/Pic 5.svg";
import AuthBtn from "@/components/UI/AuthBtn";
import "@/components/UI/ModalDelAcc.css";
import Input from "./Input";
import lock from "@/assets/icons/lock.svg";
import eye from "@/assets/icons/eye.svg";
import { logout, deleteAccount } from "@/hooks/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

interface ModalProps {
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
}

export default function ModalDelAcc({ title, message, buttonText, onClose }: ModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      await deleteAccount(password);

      logout();
      navigate("/welcome");
    } catch {
      setError("Failed to delete account");
    }
  };

  const handleCancel = () => {
    onClose();
  };
  return createPortal(
    <div className="modalAcc-overlay">
      <div className="modalAcc">
        <img src={Pic} alt="Pic" className="Pic" />

        <h3>{title}</h3>
        <p>{message}</p>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={lock}
          iconRight={eye}
          isPassword
        />

        {error && <div className="input-error">{error}</div>}
        <div className="AccDelBtn">
          <AuthBtn onClick={handleDeleteAccount}>{buttonText}</AuthBtn>
          <AuthBtn onClick={handleCancel}>Cancel</AuthBtn>
        </div>
      </div>
    </div>,
    document.body
  );
}
