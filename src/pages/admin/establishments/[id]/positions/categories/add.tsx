import MainLayout from "../../../../../../components/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../../../../../../services/api";
import "./categories.scss";

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const establishmentId = id ?? "";
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("1");
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Enter category name");
      return;
    }
    setIsSaving(true);
    try {
      await api.post("/admin/categories", {
        name: name.trim(),
        priority: Number(priority),
        sortOrder: Number(priority),
        restaurantId: Number(establishmentId),
      });
      navigate(`/admin/establishments/${establishmentId}/positions/categories`);
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="add-category">
        <div className="add-category__inner">
          <div className="add-category__title">Add Category</div>
          <div className="add-category__breadcrumb">
            <span className="add-category__breadcrumb-link" onClick={() => navigate("/admin/home")}>
              Home
            </span>
            <span className="add-category__breadcrumb-sep">/</span>
            <span
              className="add-category__breadcrumb-link"
              onClick={() => navigate("/admin/profile")}
            >
              Users
            </span>
            <span className="add-category__breadcrumb-sep">/</span>
            <span
              className="add-category__breadcrumb-link"
              onClick={() => navigate("/admin/establishments")}
            >
              Establishments
            </span>
            <span className="add-category__breadcrumb-sep">/</span>
            <span
              className="add-category__breadcrumb-link"
              onClick={() => navigate(`/admin/establishments/${establishmentId}/positions`)}
            >
              Positions
            </span>
            <span className="add-category__breadcrumb-sep">/</span>
            <span>Add Category</span>
          </div>

          <div className="add-category__card">
            <div className="add-category__preview">
              <div className="add-category__preview-icon">🖼</div>
              <div className="add-category__preview-bg" />
            </div>
            <div className="add-category__fields">
              <div className="add-category__field">
                <div className="add-category__label">Category Name</div>
                <input
                  className="add-category__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="add-category__field">
                <div className="add-category__label">Priority</div>
                <input
                  className="add-category__input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="add-category__actions">
            <button
              type="button"
              className="add-category__btn add-category__btn--cancel"
              onClick={() => navigate(`/admin/establishments/${establishmentId}/positions`)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="add-category__btn add-category__btn--submit"
              onClick={handleAdd}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
