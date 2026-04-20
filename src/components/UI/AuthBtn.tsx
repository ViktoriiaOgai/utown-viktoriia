import { Link } from "react-router-dom";
import "@/components/UI/AuthBtn.css";

type Props = {
  children: React.ReactNode;
  to?: string; // если нужно перейти
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export default function AuthBtn({ children, to, type = "button", onClick, className = "" }: Props) {
  const classes = `Button ${className}`;
  // Если передан 'to', рендерим Link
  if (to) {
    return (
      <Link to={to} className="Button">
        {children}
      </Link>
    );
  }

  // Иначе обычная кнопка
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
