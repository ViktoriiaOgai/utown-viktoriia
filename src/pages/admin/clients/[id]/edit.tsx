import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout";
import { api } from "../../../../services/api";
import { getErrorMessage } from "../../../../utils/establishments";

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    api
      .get(`/admin/clients/${id}`)
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const details = (d?.data ?? d) as Record<string, unknown>;
        const addr = (details?.address as Record<string, unknown> | undefined) ?? {};
        setName(String(details?.name ?? details?.fullName ?? ""));
        setPhone(String(details?.phone ?? details?.phoneNumber ?? ""));
        setAddress(String(details?.fullAddress ?? addr?.fullAddress ?? addr?.details ?? ""));
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err, "Failed to load client"));
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setError("");
    setIsSaving(true);

    try {
      await api.put(`/admin/clients/${id}`, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      navigate("/admin/clients");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save client"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          padding: "40px 20px 56px",
          minHeight: "100%",
          background: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#000000",
              margin: "0 0 12px",
            }}
          >
            Edit client
          </h1>

          <div
            style={{
              fontSize: 14,
              color: "#8b5cf6",
              marginBottom: 30,
            }}
          >
            <span
              style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/admin/home")}
            >
              Home
            </span>
            <span style={{ margin: "0 6px", color: "#9ca3af" }}>/</span>
            <span
              style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/admin/profile")}
            >
              Users
            </span>
            <span style={{ margin: "0 6px", color: "#9ca3af" }}>/</span>
            <span
              style={{ color: "#8b5cf6", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/admin/clients")}
            >
              Clients
            </span>
            <span style={{ margin: "0 6px", color: "#9ca3af" }}>/</span>
            <span style={{ color: "#6b7280" }}>Edit</span>
          </div>

          {isLoading ? (
            <div
              className="loadingState"
              style={{
                width: 670,
                margin: "0 auto",
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 12,
                fontSize: 16,
                color: "#6b7280",
              }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                width: 670,
                margin: "0 auto",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 12,
                padding: "40px 50px 48px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: 160,
                  marginBottom: 22,
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: 160,
                    background: "#efefef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 38,
                      color: "#111111",
                      lineHeight: 1,
                    }}
                  >
                    ↑
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    background: "#f5f5f5",
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

              <div style={{ display: "grid", gap: 18 }}>
                <div>
                  <label
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3f3f46",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First Last Name"
                    style={{
                      width: 315,
                      height: 32,
                      borderRadius: 2,
                      border: "1px solid #bfc4cc",
                      padding: "0 12px",
                      fontSize: 14,
                      color: "#111827",
                      boxSizing: "border-box",
                      outline: "none",
                      background: "#ffffff",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3f3f46",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Phone number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010 1234 56 78"
                    style={{
                      width: 315,
                      height: 32,
                      borderRadius: 2,
                      border: "1px solid #bfc4cc",
                      padding: "0 12px",
                      fontSize: 14,
                      color: "#111827",
                      boxSizing: "border-box",
                      outline: "none",
                      background: "#ffffff",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#3f3f46",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Delivery address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="12 Mugyo-ro, Jung-gu, Seoul, Jeong-o Building"
                    style={{
                      width: 315,
                      height: 32,
                      borderRadius: 2,
                      border: "1px solid #bfc4cc",
                      padding: "0 12px",
                      fontSize: 14,
                      color: "#111827",
                      boxSizing: "border-box",
                      outline: "none",
                      background: "#ffffff",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 40,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin/clients")}
              style={{
                width: 166,
                height: 58,
                borderRadius: 4,
                border: "none",
                background: "#f3f4f6",
                color: "#4b5563",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                width: 166,
                height: 58,
                borderRadius: 4,
                border: "none",
                background: "#111111",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 500,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
