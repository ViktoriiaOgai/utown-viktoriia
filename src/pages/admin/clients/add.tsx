import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/MainLayout";
import { api } from "../../../services/api";
import { getErrorMessage } from "../../../utils/establishments";

export default function AddClientPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    setIsSaving(true);
    try {
      await api.post("/admin/clients", {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      navigate("/admin/clients");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to add client"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
          Add new client
        </h1>
        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
          <span
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={() => navigate("/admin/home")}
          >
            Home
          </span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={() => navigate("/admin/profile")}
          >
            Users
          </span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={() => navigate("/admin/clients")}
          >
            Clients
          </span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>Add</span>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 32,
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 180,
                height: 150,
                background: "#f3f4f6",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 28, color: "#9ca3af" }}>↑</span>
            </div>
            <div
              style={{
                flex: 1,
                background: "#f3f4f6",
                borderRadius: 8,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: "12px 14px",
                borderRadius: 8,
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#111827",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: "0 12px",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#111827",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Phone number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter number"
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: "0 12px",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#111827",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Delivery address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: "0 12px",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            style={{
              height: 48,
              padding: "0 48px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              color: "#111827",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isSaving}
            style={{
              height: 48,
              padding: "0 48px",
              borderRadius: 8,
              border: "none",
              background: "#111111",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
