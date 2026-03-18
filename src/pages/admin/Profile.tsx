import MainLayout from "../../components/MainLayout";

export default function AdminProfile() {
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
            fontSize: 16,
            color: "#6b7280",
            marginBottom: 28,
          }}
        >
          Home / Admin / Profile
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