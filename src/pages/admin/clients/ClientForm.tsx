import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

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

  const inputStyle: CSSProperties = useMemo(
    () => ({
      width: "100%",
      height: 40,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      padding: "0 12px",
      fontSize: 14,
      outline: "none",
      background: "#fff",
      boxSizing: "border-box",
      color: "#111827",
    }),
    []
  );

  const labelStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 6,
      display: "block",
    }),
    []
  );

  return (
    <div style={{ padding: "26px 8px 12px 8px", minHeight: "100%" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#111827", letterSpacing: -0.4 }}>
          {title}
        </div>

        <div style={{ marginTop: 12, fontSize: 14, color: "#8b8b8b", display: "flex", gap: 8 }}>
          <span
            onClick={() => navigate("/admin/home")}
            style={{ color: "#6c63ff", cursor: "pointer", fontWeight: 600 }}
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/admin/profile")}
            style={{ color: "#6c63ff", cursor: "pointer", fontWeight: 600 }}
          >
            Users
          </span>
          <span>/</span>
          <span
            onClick={() => navigate("/admin/clients")}
            style={{ color: "#6c63ff", cursor: "pointer", fontWeight: 600 }}
          >
            Clients
          </span>
          <span>/</span>
          <span>{crumbLabel}</span>
        </div>

        {error && (
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "min(860px, 100%)",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              background: "#fff",
              padding: 32,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ width: "min(640px, 100%)", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  height: 156,
                  background: "#f9fafb",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  marginBottom: 22,
                }}
              />

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <div style={labelStyle}>Name</div>
                  <input
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Enter name"
                    style={{
                      ...inputStyle,
                      borderColor: errors.name ? "red" : "#d1d5db",
                    }}
                  />
                  {errors.name && <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>}
                </div>

                <div>
                  <div style={labelStyle}>Phone</div>
                  <input
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="Enter phone"
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? "red" : "#d1d5db",
                    }}
                  />
                  {errors.phone && <div style={{ color: "red", fontSize: 12 }}>{errors.phone}</div>}
                </div>

                <div>
                  <div style={labelStyle}>Address</div>
                  <input
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                    placeholder="Enter address"
                    style={{
                      ...inputStyle,
                      borderColor: errors.address ? "red" : "#d1d5db",
                    }}
                  />
                  {errors.address && (
                    <div style={{ color: "red", fontSize: 12 }}>{errors.address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/admin/clients")}
            style={{
              width: 160,
              height: 42,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={isSaving}
            style={{
              width: 160,
              height: 42,
              borderRadius: 8,
              border: "none",
              background: "#1f1f1f",
              color: "#fff",
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
