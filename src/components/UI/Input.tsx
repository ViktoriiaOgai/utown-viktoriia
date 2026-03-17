import React, { useState } from "react";
import "@/App.css";

type Props = {
  value?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  iconRight?: string;
  isPassword?: boolean;
  
  
};

export default function Input({
  value,
  placeholder,
  type = "text",
  error,
  onChange,
  icon,
  iconRight,
  isPassword,
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
          <img src={icon} alt="icon" className="input-icon left" />
        )}

        <input
          className={`input ${error ? "input--error" : ""}`}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      {iconRight && isPassword && (
          <img
            src={iconRight}
            alt="toggle password"
            className={`input-icon right ${showPassword ? "active" : ""}`}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
        </div>

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}