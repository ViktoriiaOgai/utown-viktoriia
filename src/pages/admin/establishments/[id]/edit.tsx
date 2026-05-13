import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout";
import EstablishmentForm from "../EstablishmentForm";
import { api } from "../../../../services/api";
import type { EstablishmentFormValues } from "../../../../types/establishment";
import { getErrorMessage } from "../../../../utils/establishments";

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

export default function EditEstablishmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState<EstablishmentFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [facilities, setFacilities] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const handleChange = (field: keyof EstablishmentFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
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
          mon: String(details?.deliveryTime ?? "9:00 - 22:00"),
          tue: "Day off",
          wed: "9:00 - 22:00",
          thu: "9:00 - 22:00",
          fri: "9:00 - 22:00",
          sat: "9:00 - 22:00",
          sun: "9:00 - 22:00",
        });

        setFacilities(String(details?.facilities ?? ""));
        setIsRecommended(Boolean(details?.isRecommended ?? false));
        setImageUrl(String(details?.imageUrl ?? ""));
        setFullAddress(String(address?.fullAddress ?? ""));
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
    setIsSaving(true);

    try {
      await api.put(`/admin/restaurants/${id}`, {
        title: values.name.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        deliveryTime: values.mon || "",
        facilities,
        isRecommended,
        minOrderAmount: Number(values.minimumOrder) || 0,
        phone: values.phone.trim(),
        imageUrl,
        address: {
          area: "",
          city: values.city.trim(),
          details: values.deliveryAreas.trim(),
          fullAddress: fullAddress || values.city.trim(),
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
        onNavigateHome={() => navigate("/admin/home")}
        onNavigateProfile={() => navigate("/admin/profile")}
        onNavigateEstablishments={() => navigate("/admin/establishments")}
      />
    </MainLayout>
  );
}
