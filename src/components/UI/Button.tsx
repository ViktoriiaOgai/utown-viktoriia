type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

export default function Button({
  children,
  type = 'button',
  onClick,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="Button"
    >
      {children}
    </button>
  );
}
