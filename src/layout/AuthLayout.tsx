import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
