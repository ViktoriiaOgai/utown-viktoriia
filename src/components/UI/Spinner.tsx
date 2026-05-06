import "@/components/UI/Spinner.css";
export default function Spinner() {
  return (
    <div className="pay-overlay">
      <div className="gradient-loader" />
      <p className="pay-text">Sending order...</p>
    </div>
  );
}
