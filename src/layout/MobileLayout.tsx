type Props = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: Props) {
  return <div className="mobile-layout">{children}</div>;
}