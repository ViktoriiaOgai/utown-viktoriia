import React, { useState } from "react";
import "@/App.css";

type Props = {
  value?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  isPassword?: boolean;
  eyeOpenIcon?: string;
  eyeClosedIcon?: string;
};

export default function Input({
  value,
  placeholder,
  type = "text",
  error,
  onChange,
  icon,
  isPassword,
  eyeOpenIcon,
  eyeClosedIcon,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="input-group">
      <div className="input-wrapper">
        {icon && (
          <img src={icon} alt="icon" className="input-icon" />
        )}

        <input
          className={`input ${error ? "input--error" : ""}`}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

        {isPassword && (
          <img
            src={showPassword ? eyeOpenIcon : eyeClosedIcon}
            className="input-eye"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}