import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div
        style={{
          padding: "32px 20px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 48,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#111111",
              }}
            >
              Admin Home
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                fontSize: 16,
                color: "#8b8b8b",
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: "#8b8b8b", fontWeight: 600 }}>Home</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            onClick={() => navigate("/admin/clients")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Clients
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/riders")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Riders
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/establishments")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Establishments
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/orders")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Orders
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/services")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Services
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>

          <div
            onClick={() => navigate("/admin/vacancies")}
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#8b8b8b",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Vacancies
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
              }}
            >
              Open
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            padding: 24,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#111111",
              marginBottom: 12,
            }}
          >
            Welcome
          </div>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "#6b7280",
            }}
          >
            This page now uses the same MainLayout as Establishments, so the left sidebar will look
            the same. You can use the cards above to move to Clients, Riders, Establishments,
            Orders, Services, and Vacancies.
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
