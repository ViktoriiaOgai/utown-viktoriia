import { Link } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to?: string; // если нужно перейти
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function Button({ children, to, type = "button", onClick }: Props) {
  // Если передан 'to', рендерим Link
  if (to) {
    return (
      <Link to={to} className="btn">
        {children}
      </Link>
    );
  }

  // Иначе обычная кнопка
  return (
    <button type={type} onClick={onClick} className="btn">
      {children}
    </button>
  );
}
