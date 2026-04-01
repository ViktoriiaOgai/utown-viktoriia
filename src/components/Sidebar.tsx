import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href: string) => {
    const path = (location.pathname || "").split("?")[0];
    return path === href || path.startsWith(`${href}/`);
  };

  const addHref = useMemo(() => {
    const path = (location.pathname || "").split("?")[0];

    if (path.startsWith("/admin/clients")) return "/admin/clients/add";

    if (path.startsWith("/admin/riders")) return "/admin/riders/add";

    if (path.startsWith("/admin/establishments")) {
      return "/admin/establishments/add";
    }

    if (path.startsWith("/admin/orders")) return "/admin/orders/add";

    return null;
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <div className="logoBlock" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        <div className="logoText">UTOWN</div>
      </div>

      <div className="menuBlock">
        <div className="menuTitle">Users</div>
        <div className="menuList">
          <Link
            className={`menuItem ${isActive("/admin/clients") ? "active" : ""}`}
            to="/admin/clients"
          >
            Clients
          </Link>

          <Link
            className={`menuItem ${isActive("/admin/riders") ? "active" : ""}`}
            to="/admin/riders"
          >
            Riders
          </Link>

          <Link
            className={`menuItem ${isActive("/admin/establishments") ? "active" : ""}`}
            to="/admin/establishments"
          >
            Establishments
          </Link>

          <Link
            className={`menuItem ${isActive("/admin/orders") ? "active" : ""}`}
            to="/admin/orders"
          >
            Orders
          </Link>
        </div>
      </div>

      <div className="menuBlock" style={{ paddingTop: 0 }}>
        <div className="menuTitle">App</div>
        <div className="menuList">
          <div className="menuItem">Services</div>
          <div className="menuItem">Vacancies</div>
        </div>
      </div>

      <div className="sidebarBottom">
        <button
          className="addBtn"
          type="button"
          disabled={!addHref}
          onClick={() => {
            if (addHref) navigate(addHref);
          }}
        >
          <span className="addCircle">⊕</span> Add
        </button>

        <div className="gear">⚙</div>
      </div>
    </aside>
  );
}
