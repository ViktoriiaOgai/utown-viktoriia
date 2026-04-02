import "@/components/UI/AdminHeader.css";

export default function AdminHeader() {
  return (
    <div className="admin-header">
      <div className="admin-header__right">
        <button className="admin-header__btn" type="button">
          <span className="admin-header__avatar">👤</span>
          Admin
        </button>
      </div>
    </div>
  );
}
