import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";

export default function AdminProfile() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={{ padding: "32px 20px 40px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#111111",
            marginBottom: 16,
          }}
        >
          Admin Profile
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            color: "#8b8b8b",
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ cursor: "pointer", color: "#7c5cff", fontWeight: 600 }}
            onClick={() => navigate("/admin/home")}
          >
            Home
          </span>
          <span>/</span>
          <span style={{ color: "#8b8b8b", fontWeight: 600 }}>Admin</span>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            padding: 24,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#111111",
              marginBottom: 20,
            }}
          >
            Profile information
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              fontSize: 16,
              color: "#374151",
            }}
          >
            <div>
              <strong>Name:</strong> Admin
            </div>
            <div>
              <strong>Role:</strong> ADMIN
            </div>
            <div>
              <strong>Status:</strong> Active
            </div>
            <div>
              <strong>Email:</strong> admin@utown.com
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}