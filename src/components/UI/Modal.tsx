import Pic from "@/assets/images/Pic 5.svg";
import AuthBtn from "@/components/UI/AuthBtn";
import "@/components/UI/Modal.css";

interface ModalProps {
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
}
export default function Modal ({ title, message, buttonText, onClose }: ModalProps) {
    return (
    <div className="modal-overlay">
    <div className="modal">
      <img src={Pic} alt="Pic" className="Pic" />
      <h3>{title}</h3>
        <p>{message}</p>

      <AuthBtn
        onClick={onClose}
      
      >
        {buttonText}
      </AuthBtn>
    </div>
  </div>
  )}
