import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type MainLayoutProps = {
  children: ReactNode;
};

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: "block",
  padding: "9px 12px",
  borderRadius: 0,
  textDecoration: "none",
  color: "#3f3f46",
  background: active ? "#eef2ff" : "transparent",
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 2,
});

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f5f5",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: 272,
          background: "#ffffff",
          borderRight: "1px solid #d4d4d8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              height: 92,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              borderBottom: "1px solid #d4d4d8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 28,
                lineHeight: 1,
              }}
            >
              <span style={{ fontWeight: 900, color: "#111111" }}>UT</span>
              <span
                style={{
                  marginLeft: 6,
                  fontWeight: 400,
                  color: "#111111",
                  letterSpacing: 1,
                }}
              >
                own
              </span>
            </div>
          </div>

          <div style={{ padding: "34px 20px 0 20px" }}>
            <div style={{ marginBottom: 44 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#2f2f2f",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12 }}>▼</span>
                <span>Users</span>
              </div>

              <div style={{ paddingLeft: 28 }}>
                <Link to="/admin/clients" style={linkStyle(false)}>
                  Clients
                </Link>

                <Link to="/admin/riders" style={linkStyle(false)}>
                  Riders
                </Link>

                <Link
                  to="/admin/establishments"
                  style={linkStyle(location.pathname.startsWith("/admin/establishments"))}
                >
                  Establishments
                </Link>

                <Link to="/admin/orders" style={linkStyle(false)}>
                  Orders
                </Link>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #e4e4e7",
                paddingTop: 22,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#2f2f2f",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12 }}>▼</span>
                <span>App</span>
              </div>

              <div style={{ paddingLeft: 28 }}>
                <Link to="/services" style={linkStyle(false)}>
                  Services
                </Link>

                <Link to="/vacancies" style={linkStyle(false)}>
                  Vacancies
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              padding: "20px 36px 26px 36px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin/establishments/add")}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 4,
                border: "none",
                background: "#171717",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>

          <div
            style={{
              borderTop: "1px solid #d4d4d8",
              height: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                color: "#111827",
                fontSize: 24,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ⚙
            </button>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: 92,
            background: "linear-gradient(90deg, #53b4e8 0%, #4478f4 52%, #c663eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 28px",
          }}
        >
          <div
            style={{
              minWidth: 170,
              height: 46,
              background: "#ffffff",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: "#374151",
              fontSize: 14,
              fontWeight: 500,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 18 }}>👤</span>
            <span>Admin</span>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            padding: "24px 20px 18px 20px",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}