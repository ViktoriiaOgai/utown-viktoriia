import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/MainLayout";
import EstablishmentForm from "./EstablishmentForm";
import { api } from "../../../services/api";
import type { EstablishmentFormValues } from "../../../types/establishment";
import { getErrorMessage } from "../../../utils/establishments";

const initialValues: EstablishmentFormValues = {
  name: "",
  description: "",
  minimumOrder: "",
  phone: "",
  category: "",
  city: "",
  deliveryAreas: "",
  mon: "9:00 - 22:00",
  tue: "Day off",
  wed: "9:00 - 22:00",
  thu: "9:00 - 22:00",
  fri: "9:00 - 22:00",
  sat: "9:00 - 22:00",
  sun: "9:00 - 22:00",
};

export default function AddEstablishmentPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<EstablishmentFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof EstablishmentFormValues, value: string) => {
    setValues((prev: EstablishmentFormValues) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    setError("");

    const title = values.name.trim();
    const phone = values.phone.trim();

    if (!title || !phone) {
      setError("Fill in Establishment name and Phone number");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/admin/restaurants", {
        title,
        description: values.description.trim(),
        category: values.category.trim(),
        deliveryTime: values.mon || "",
        facilities: "",
        isRecommended: false,
        minOrderAmount: Number(values.minimumOrder) || 0,
        phone,
        imageUrl: "",
        address: {
          area: "",
          city: values.city.trim(),
          details: values.deliveryAreas.trim(),
          fullAddress: values.city.trim(),
          latitude: 0,
          longitude: 0,
          postcode: "",
          state: "",
          street: values.city.trim(),
          typeAddress: 0,
          intercomCode: "",
        },
      });
      navigate("/admin/establishments");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add establishment"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <EstablishmentForm
        title="Add new establishment"
        breadcrumbLast="Add"
        values={values}
        isSaving={isSaving}
        error={error}
        submitText="Add"
        onChange={handleChange}
        onSubmit={handleAdd}
        onCancel={() => navigate(-1)}
        onNavigateHome={() => navigate("/admin/home")}
        onNavigateProfile={() => navigate("/admin/profile")}
        onNavigateEstablishments={() => navigate("/admin/establishments")}
      />
    </MainLayout>
  );
}
