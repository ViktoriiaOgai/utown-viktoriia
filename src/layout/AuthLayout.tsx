import { ReactNode } from "react";



type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="auth">
      <div className="auth__card">
      
        {children}
      </div>
    </div>
  );
}