import Pic from "@/assets/images/Pic 5.svg";
import AuthBtn from "@/components/UI/AuthBtn";
import "@/components/UI/Modal.css";

interface ModalProps {
  title: string;
  message: string;

  buttonText?: string;
  onClose?: () => void;

  onAccept?: () => void;
  onCancel?: () => void;
}
export default function Modal({
  title,
  message,
  buttonText,
  onClose,
  onAccept,
  onCancel,
}: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {!onAccept && !onCancel && <img src={Pic} alt="Pic" className="Pic" />}

        <h3>{title}</h3>
        <p>{message}</p>

        {/* если есть Accept/Cancel → показываем 2 кнопки */}
        {onAccept && onCancel ? (
          <>
            <AuthBtn className="modal-cancel" onClick={onCancel}>
              Cancel
            </AuthBtn>

            <AuthBtn className="modal-accept" onClick={onAccept}>
              Accept
            </AuthBtn>
          </>
        ) : (
          /* иначе обычная модалка */
          <AuthBtn onClick={onClose}>{buttonText}</AuthBtn>
        )}
      </div>
    </div>
  );
}
