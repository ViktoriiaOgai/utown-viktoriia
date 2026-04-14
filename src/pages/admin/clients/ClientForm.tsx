import { useNavigate } from "react-router-dom";
import "./clients.scss";

type Props = {
  title: string;
  crumbLabel: string;
  name: string;
  phone: string;
  address: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
  error: string;
  errors: { name?: string; phone?: string; address?: string };
  submitLabel: string;
};

export default function ClientForm({
  title,
  crumbLabel,
  name,
  phone,
  address,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onSubmit,
  isSaving,
  error,
  errors,
  submitLabel,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="client-page">
      <h1 className="client-page__title">{title}</h1>
      <div className="client-page__breadcrumbs">
        <button className="client-page__crumb-link" onClick={() => navigate("/admin/home")}>
          Home
        </button>
        <span className="client-page__crumb-sep">/</span>
        <button className="client-page__crumb-link" onClick={() => navigate("/admin/profile")}>
          Users
        </button>
        <span className="client-page__crumb-sep">/</span>
        <button className="client-page__crumb-link" onClick={() => navigate("/admin/clients")}>
          Clients
        </button>
        <span className="client-page__crumb-sep">/</span>
        <span>{crumbLabel}</span>
      </div>

      <div className="client-page__card">
        <div className="client-page__avatar">
          <div className="client-page__avatar-upload">↑</div>
          <div className="client-page__avatar-preview" />
        </div>

        {error && <div className="client-page__error">{error}</div>}

        <div className="client-page__fields">
          <div className="client-page__field">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="First Last Name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="client-page__field-error">{errors.name}</div>}
          </div>

          <div className="client-page__field">
            <label>Phone number</label>
            <input
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="010 1234 56 78"
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <div className="client-page__field-error">{errors.phone}</div>}
          </div>

          <div className="client-page__field">
            <label>Delivery address</label>
            <input
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Enter address"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <div className="client-page__field-error">{errors.address}</div>}
          </div>
        </div>
      </div>

      <div className="client-page__actions">
        <button
          type="button"
          className="client-page__btn-cancel"
          onClick={() => navigate("/admin/clients")}
        >
          Cancel
        </button>
        <button
          type="button"
          className="client-page__btn-submit"
          onClick={onSubmit}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
