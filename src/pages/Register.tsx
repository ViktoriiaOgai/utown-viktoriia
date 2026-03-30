import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/UI/Input";
import "@/App.css";
import BackButton from "@/components/UI/BackButton";
import AuthBtn from "@/components/UI/AuthBtn";
import Tel from "@/assets/icons/Tel.svg";
import lock from "@/assets/icons/lock.svg";
import eye from "@/assets/icons/eye.svg";
import { register } from "@/hooks/auth";
import Modal from "@/components/UI/Modal";
import { getErrorMessage } from "@/services/getErrorMessage";

export default function Register() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    repeatPassword: "",
  });

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      repeatPassword: "",
    };
    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }
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

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register(phone, password, firstName, lastName, "CLIENT");
      setShowModal(true);
    } catch (error) {
      const message = getErrorMessage(error);

      if (message.includes("users.username")) {
        setErrors((prev) => ({
          ...prev,
          phone: "User with this phone already exists",
        }));
      }
    }
  };

  return (
    <>
      <BackButton />

      <h2 className="auth-title">User Registration</h2>
      <p className="auth-subtitle">Register to access all the benefits of the app</p>

      <label className="label">First Name</label>
      <Input
        type="text"
        placeholder="Enter your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={errors.firstName}
      />

      <label className="label">Last Name</label>
      <Input
        type="text"
        placeholder="Enter your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={errors.lastName}
      />

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
        error={errors.repeatPassword}
      />

      <AuthBtn onClick={handleRegister}>Register</AuthBtn>

      <div className="auth-links">
        <Link to="/login">Already have an account?</Link>
      </div>

      <p className="auth-terms">
        By registering, you agree to the Terms of Service and Privacy Policy, as well as the Cookie
        Policy.
      </p>
      {showModal && (
        <Modal
          title="Registration was successful"
          message="You can now fully enjoy all the features"
          buttonText="Close"
          onClose={() => navigate("/login")}
        />
      )}
    </>
  );
}
