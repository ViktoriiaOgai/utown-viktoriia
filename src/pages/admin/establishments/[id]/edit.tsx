import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout";
import EstablishmentForm from "../EstablishmentForm";
import { api } from "../../../../services/api";
import type { EstablishmentFormValues } from "../../../../types/establishment";
import { getErrorMessage } from "../../../../utils/establishments";
import { getRole, isAdminRole } from "../../../../hooks/auth";

const initialValues: EstablishmentFormValues = {
  name: "",
  description: "",
  minimumOrder: "",
  phone: "",
  category: "",
  city: "",
  deliveryAreas: "",
  mon: "9:00 — 22:00",
  tue: "Day off",
  wed: "9:00 — 22:00",
  thu: "9:00 — 22:00",
  fri: "9:00 — 22:00",
  sat: "9:00 — 22:00",
  sun: "9:00 — 22:00",
};

export default function EditEstablishmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState<EstablishmentFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = getRole();

    if (!isAdminRole(role)) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleChange = (field: keyof EstablishmentFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError("");

    api
      .get(`/admin/restaurants/${id}`)
      .then((r) => {
        const data = r.data;
        const details = data?.data ?? data;
        const address = details?.address ?? {};

        setValues({
          name: String(details?.title ?? details?.name ?? ""),
          description: String(details?.description ?? ""),
          minimumOrder: String(
            details?.minOrderAmount ?? details?.minOrder ?? details?.minimumOrder ?? ""
          ),
          phone: String(details?.phone ?? ""),
          category: String(details?.category ?? ""),
          city: String(address?.city ?? details?.city ?? ""),
          deliveryAreas: String(address?.details ?? ""),
          mon: String(details?.deliveryTime ?? "9:00 — 22:00"),
          tue: "Day off",
          wed: "9:00 — 22:00",
          thu: "9:00 — 22:00",
          fri: "9:00 — 22:00",
          sat: "9:00 — 22:00",
          sun: "9:00 — 22:00",
        });
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Failed to load establishment"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    setError("");

    const title = values.name.trim();
    const description = values.description.trim();
    const minOrderAmount = Number(values.minimumOrder) || 0;
    const phone = values.phone.trim();
    const category = values.category.trim();
    const city = values.city.trim();
    const deliveryAreas = values.deliveryAreas.trim();

    setIsSaving(true);

    try {
      await api.put(`/admin/restaurants/${id}`, {
        title,
        description,
        category,
        deliveryTime: values.mon || "",
        facilities: "",
        isRecommended: false,
        minOrderAmount,
        phone,
        imageUrl: "",
        address: {
          area: "",
          city,
          details: deliveryAreas,
          fullAddress: city,
          latitude: 0,
          longitude: 0,
          postcode: "",
          state: "",
          street: city,
          typeAddress: 0,
          intercomCode: "",
        },
        ownerId: 0,
      });

      navigate("/admin/establishments");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save establishment"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <EstablishmentForm
        title="Edit establishment"
        breadcrumbLast="Edit"
        values={values}
        isSaving={isSaving}
        isLoading={isLoading}
        error={error}
        submitText="Save"
        onChange={handleChange}
        onSubmit={handleSave}
        onCancel={() => navigate(-1)}
        onNavigateHome={() => navigate("/home")}
        onNavigateProfile={() => navigate("/profile")}
        onNavigateEstablishments={() => navigate("/admin/establishments")}
      />
    </MainLayout>
  );
}
