import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/UI/Input";
import "@/App.css";
import AuthBtn from "@/components/UI/AuthBtn";
import { getErrorMessage } from "@/services/getErrorMessage";
import "@/pages/PersonalInformation.css";
import MobileHeader from "@/components/UI/Header";
import { updateUserProfile } from "@/hooks/auth";

export default function PersonalInformation() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(user.fullName || "");
  const [phone] = useState(user.phone || "");
  const [address, setAddress] = useState(() => localStorage.getItem("address") || "");
  const handleSave = async () => {
    const isValid = validate();
    if (!isValid) return;

    try {
      await updateUserProfile({
        fullName: name,
        username: phone,
        address,
      });

      navigate("/profile/account");
    } catch (error) {
      const message = getErrorMessage(error);

      setErrors((prev) => ({
        ...prev,
        address: message || "Failed to save",
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      phone: "",
      address: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.phone && !newErrors.address;
  };

  return (
    <>
      <div className="edit">
        <MobileHeader logoVariant="gradient" showBack />
        <div className="inp-group">
          <h1 className="Inf">Personal Information</h1>
          <label className="label">Your Name</label>
          <Input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <label className="label">Your Phone Number</label>
          <Input
            type="tel"
            placeholder="Phone number"
            value={phone}
            readOnly
            style={{
              backgroundColor: "#f3f4f6",
              color: "#6b7280",
              cursor: "not-allowed",
            }}
            error={errors.phone}
          />
          <label className="label">Your Address (for delivery)</label>
          <Input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
          />

          <AuthBtn onClick={handleSave}>Save</AuthBtn>
        </div>
      </div>
    </>
  );
}
